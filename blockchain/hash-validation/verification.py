from pathlib import Path
import sys

CURRENT_DIR = Path(__file__).resolve().parent

if str(CURRENT_DIR) not in sys.path:
    sys.path.insert(0, str(CURRENT_DIR))

from validate_hash import validate_certificate_hash


def verify_certificate_file(
    certificate_path,
    stored_hash
):
    return validate_certificate_hash(
        certificate_path,
        stored_hash
    )


if __name__ == "__main__":
    print(
        "Use verify_certificate_file("
        "certificate_path, stored_hash)"
    )