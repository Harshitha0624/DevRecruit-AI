from pathlib import Path
import sys

HASH_VALIDATION_DIR = (
    Path(__file__).resolve().parents[1]
    / "hash-validation"
)

if str(HASH_VALIDATION_DIR) not in sys.path:
    sys.path.insert(0, str(HASH_VALIDATION_DIR))

from verification import verify_certificate_file


def verify_certificate(
    certificate_path,
    stored_hash,
    certificate_id=None
):
    result = verify_certificate_file(
        certificate_path,
        stored_hash
    )

    result["certificate_id"] = certificate_id

    return result