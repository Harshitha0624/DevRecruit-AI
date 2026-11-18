from pathlib import Path
import hashlib
import json


def generate_company_hash(
    company_name,
    registration_id,
    email
):
    data = (
        f"{company_name.strip().lower()}|"
        f"{registration_id.strip().lower()}|"
        f"{email.strip().lower()}"
    )

    return hashlib.sha256(
        data.encode("utf-8")
    ).hexdigest()


def create_company_verification_record(
    company_name,
    registration_id,
    email,
    recruiter_id
):
    company_hash = generate_company_hash(
        company_name,
        registration_id,
        email
    )

    return {
        "recruiter_id": int(recruiter_id),
        "company_name": company_name,
        "registration_id": registration_id,
        "email": email,
        "company_hash": company_hash,
        "verified": False
    }


if __name__ == "__main__":
    record = create_company_verification_record(
        company_name="DevRecruit Technologies",
        registration_id="DR-001",
        email="hr@devrecruit.com",
        recruiter_id=1
    )

    print("\nRECRUITER VERIFICATION")
    print("======================")
    print(json.dumps(record, indent=2))