import sys
from pathlib import Path

CURRENT_DIR = Path(__file__).resolve().parent

if str(CURRENT_DIR) not in sys.path:
    sys.path.insert(0, str(CURRENT_DIR))

from certificate_verifier import verify_certificate


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(
            "Usage: python verify_certificate.py "
            "<certificate_file> <stored_hash>"
        )
        sys.exit(1)

    certificate_file = sys.argv[1]
    stored_hash = sys.argv[2]

    result = verify_certificate(
        certificate_file,
        stored_hash
    )

    print("\nCERTIFICATE VERIFICATION")
    print("========================")
    print(f"Verified: {result['verified']}")
    print(f"Expected: {result['expected_hash']}")
    print(f"Actual:   {result['actual_hash']}")
    print(f"Message:  {result['message']}")