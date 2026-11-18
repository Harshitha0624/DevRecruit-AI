from pathlib import Path
import sys


CURRENT_DIR = Path(__file__).resolve().parent

if str(CURRENT_DIR) not in sys.path:
    sys.path.insert(0, str(CURRENT_DIR))


from company_verification import (
    generate_company_hash
)


def verify_recruiter_details(
    company_name,
    registration_id,
    email,
    expected_hash
):
    actual_hash = generate_company_hash(
        company_name,
        registration_id,
        email
    )

    verified = actual_hash == expected_hash

    return {
        "verified": verified,
        "actual_hash": actual_hash,
        "expected_hash": expected_hash,
        "message": (
            "Recruiter/company details verified successfully."
            if verified
            else "Recruiter/company verification failed."
        )
    }


if __name__ == "__main__":
    company_name = "DevRecruit Technologies"
    registration_id = "DR-001"
    email = "hr@devrecruit.com"

    expected_hash = generate_company_hash(
        company_name,
        registration_id,
        email
    )

    result = verify_recruiter_details(
        company_name,
        registration_id,
        email,
        expected_hash
    )

    print("\nRECRUITER VERIFICATION TEST")
    print("===========================")
    print(f"Verified: {result['verified']}")
    print(f"Message: {result['message']}")