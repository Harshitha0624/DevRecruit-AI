from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from app.auth.dependencies import require_role

from app.services.recruiter_verification_service import (
    register_recruiter,
    verify_recruiter,
    get_recruiter,
)


router = APIRouter(
    prefix="/api/blockchain/recruiters",
    tags=["Blockchain Recruiter Verification"],
)


# ============================================================
# REQUEST MODELS
# ============================================================

class RecruiterRegisterRequest(BaseModel):
    recruiter_id: int = Field(ge=1)
    company_name: str = Field(min_length=1, max_length=255)
    registration_id: str = Field(min_length=1, max_length=100)
    email: str = Field(min_length=3, max_length=255)


class RecruiterVerifyRequest(BaseModel):
    recruiter_id: int = Field(ge=1)
    company_name: str = Field(min_length=1, max_length=255)
    registration_id: str = Field(min_length=1, max_length=100)
    email: str = Field(min_length=3, max_length=255)


# ============================================================
# REGISTER RECRUITER
# ============================================================

@router.post("/register")
def register_recruiter_blockchain(
    data: RecruiterRegisterRequest,
    current_user=Depends(require_role("recruiter")),
):
    return register_recruiter(
        recruiter_id=data.recruiter_id,
        company_name=data.company_name,
        registration_id=data.registration_id,
        email=data.email,
    )


# ============================================================
# VERIFY RECRUITER
# ============================================================

@router.post("/verify")
def verify_recruiter_blockchain(
    data: RecruiterVerifyRequest,
):
    return verify_recruiter(
        recruiter_id=data.recruiter_id,
        company_name=data.company_name,
        registration_id=data.registration_id,
        email=data.email,
    )


# ============================================================
# GET RECRUITER
# ============================================================

@router.get("/{recruiter_id}")
def get_recruiter_blockchain(
    recruiter_id: int,
):
    return get_recruiter(recruiter_id)