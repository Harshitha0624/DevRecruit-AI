from pathlib import Path
import sys

HASH_GENERATION_DIR = (
    Path(__file__).resolve().parents[1]
    / "hash-generation"
)

if str(HASH_GENERATION_DIR) not in sys.path:
    sys.path.insert(0, str(HASH_GENERATION_DIR))

from hash_utils import sha256_file


def create_certificate_hash(
    certificate_path
) -> str:
    return sha256_file(certificate_path)


def create_certificate_record(
    certificate_path,
    certificate_id,
    candidate_id,
    issuer
):
    certificate_hash = create_certificate_hash(
        certificate_path
    )

    return {
        "certificate_id": str(certificate_id),
        "candidate_id": int(candidate_id),
        "issuer": str(issuer),
        "certificate_hash": certificate_hash
    }