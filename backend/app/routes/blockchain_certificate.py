import hashlib
import json
import uuid
from datetime import datetime, timezone
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from app.auth.dependencies import require_role
from app.models.user import User
from app.services.blockchain_service import (
    register_certificate,
    verify_certificate,
    get_certificate
)

router = APIRouter(
    prefix="/api/blockchain/certificates",
    tags=["Blockchain Certificates"]
)

BACKEND_ROOT = Path(__file__).resolve().parents[2]
UPLOAD_DIR = BACKEND_ROOT / "uploads" / "certificates"

MAX_FILE_SIZE = 10 * 1024 * 1024
ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg"}


def get_candidate_folder(candidate_id: int) -> Path:
    folder = UPLOAD_DIR / str(candidate_id)
    folder.mkdir(parents=True, exist_ok=True)
    return folder


def read_metadata(candidate_id: int, certificate_id: str):
    folder = get_candidate_folder(candidate_id)
    metadata_path = folder / f"{certificate_id}.json"

    if not metadata_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Certificate not found"
        )

    try:
        return metadata_path, json.loads(
            metadata_path.read_text(encoding="utf-8")
        )
    except (OSError, json.JSONDecodeError):
        raise HTTPException(
            status_code=500,
            detail="Certificate metadata could not be read"
        )


@router.post("/upload")
async def upload_certificate(
    file: UploadFile = File(...),
    current_user: User = Depends(require_role("candidate"))
):
    original_name = Path(file.filename or "").name
    extension = Path(original_name).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Only PDF, PNG and JPG certificates are allowed"
        )

    content = await file.read(MAX_FILE_SIZE + 1)

    if not content:
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is empty"
        )

    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="Certificate must be 10 MB or smaller"
        )

    certificate_hash = hashlib.sha256(content).hexdigest()
    certificate_id = f"DRC-{uuid.uuid4().hex[:16].upper()}"

    folder = get_candidate_folder(current_user.id)
    stored_name = f"{uuid.uuid4().hex}{extension}"
    stored_path = folder / stored_name

    # The contract stores a reference string. This local reference
    # is NOT an IPFS CID or decentralized storage URL.
    storage_reference = (
        stored_path.relative_to(BACKEND_ROOT).as_posix()
    )
    contract_reference = f"local-file:{storage_reference}"

    try:
        stored_path.write_bytes(content)

        chain_result = register_certificate(
            certificate_id=certificate_id,
            candidate_id=current_user.id,
            certificate_hash=certificate_hash,
            ipfs_cid=contract_reference,
            issuer="DevRecruit AI"
        )

        metadata = {
            "certificate_id": certificate_id,
            "candidate_id": current_user.id,
            "filename": original_name,
            "stored_path": storage_reference,
            "certificate_hash": certificate_hash,
            "transaction_hash": chain_result["transaction_hash"],
            "block_number": chain_result["block_number"],
            "contract_address": chain_result["contract_address"],
            "storage_reference": contract_reference,
            "blockchain_verified": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        }

        metadata_path = folder / f"{certificate_id}.json"
        metadata_path.write_text(
            json.dumps(metadata, indent=2),
            encoding="utf-8"
        )

        return {
            "message": "Certificate uploaded and registered",
            **metadata
        }

    except Exception as exc:
        if stored_path.exists():
            stored_path.unlink()

        raise HTTPException(
            status_code=502,
            detail=f"Certificate registration failed: {str(exc)}"
        )

    finally:
        await file.close()


@router.get("/my-certificates")
def get_my_certificates(
    current_user: User = Depends(require_role("candidate"))
):
    folder = get_candidate_folder(current_user.id)
    certificates = []

    for metadata_path in folder.glob("DRC-*.json"):
        try:
            metadata = json.loads(
                metadata_path.read_text(encoding="utf-8")
            )
            certificates.append(metadata)
        except (OSError, json.JSONDecodeError):
            continue

    certificates.sort(
        key=lambda item: item.get("created_at", ""),
        reverse=True
    )

    return certificates


@router.post("/{certificate_id}/verify")
def verify_uploaded_certificate(
    certificate_id: str,
    current_user: User = Depends(require_role("candidate"))
):
    metadata_path, metadata = read_metadata(
        current_user.id,
        certificate_id
    )

    stored_path = (
        BACKEND_ROOT / metadata["stored_path"]
    ).resolve()

    candidate_folder = get_candidate_folder(
        current_user.id
    ).resolve()

    if not stored_path.is_relative_to(candidate_folder):
        raise HTTPException(
            status_code=403,
            detail="Invalid certificate file reference"
        )

    if not stored_path.is_file():
        raise HTTPException(
            status_code=404,
            detail="Stored certificate file is missing"
        )

    actual_hash = hashlib.sha256(
        stored_path.read_bytes()
    ).hexdigest()

    chain_result = verify_certificate(
        certificate_id=certificate_id,
        certificate_hash=actual_hash
    )

    verified = bool(chain_result["verified"])

    metadata["blockchain_verified"] = verified
    metadata["last_verified_at"] = (
        datetime.now(timezone.utc).isoformat()
    )

    metadata_path.write_text(
        json.dumps(metadata, indent=2),
        encoding="utf-8"
    )

    return {
        "certificate_id": certificate_id,
        "blockchain_verified": verified,
        "verified": verified,
        "issuer": chain_result["issuer"],
        "issued_at": chain_result["issued_at"],
        "ipfs_cid": chain_result["ipfs_cid"]
    }


@router.get("/{certificate_id}")
def get_my_certificate(
    certificate_id: str,
    current_user: User = Depends(require_role("candidate"))
):
    _, metadata = read_metadata(
        current_user.id,
        certificate_id
    )

    try:
        chain_record = get_certificate(certificate_id)
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Could not read blockchain record: {str(exc)}"
        )

    return {
        **metadata,
        "blockchain_record": chain_record
    }