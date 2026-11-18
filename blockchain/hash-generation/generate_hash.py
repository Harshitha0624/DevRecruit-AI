from pathlib import Path
import sys

CURRENT_DIR = Path(__file__).resolve().parent

if str(CURRENT_DIR) not in sys.path:
    sys.path.insert(0, str(CURRENT_DIR))

from hash_utils import sha256_file


def generate_certificate_hash(file_path) -> str:
    return sha256_file(file_path)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(
            "Usage: python generate_hash.py <certificate_file>"
        )
        sys.exit(1)

    certificate_path = sys.argv[1]

    try:
        certificate_hash = generate_certificate_hash(
            certificate_path
        )

        print("\nCERTIFICATE HASH")
        print("================")
        print(f"File: {certificate_path}")
        print(f"SHA-256: {certificate_hash}")

    except Exception as error:
        print(f"Error: {error}")
        sys.exit(1)