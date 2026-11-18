from pathlib import Path
import sys

HASH_GENERATION_DIR = (
    Path(__file__).resolve().parents[1]
    / "hash-generation"
)

if str(HASH_GENERATION_DIR) not in sys.path:
    sys.path.insert(0, str(HASH_GENERATION_DIR))

from hash_utils import (
    normalize_hash,
    is_valid_sha256,
    sha256_file
)


def validate_certificate_hash(
    certificate_path,
    expected_hash
):
    expected_hash = normalize_hash(expected_hash)

    if not is_valid_sha256(expected_hash):
        return {
            "valid_format": False,
            "verified": False,
            "expected_hash": expected_hash,
            "actual_hash": None,
            "message": "Invalid SHA-256 hash format."
        }

    actual_hash = sha256_file(certificate_path)

    verified = actual_hash == expected_hash

    return {
        "valid_format": True,
        "verified": verified,
        "expected_hash": expected_hash,
        "actual_hash": actual_hash,
        "message": (
            "Certificate hash verified successfully."
            if verified
            else "Certificate hash verification failed."
        )
    }