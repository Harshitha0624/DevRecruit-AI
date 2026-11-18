from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import require_role
from app.config.database import get_db
from app.models.company_profile import CompanyProfile
from app.models.user import User
from app.schemas.company_profile import (
    CompanyProfileCreate,
    CompanyProfileUpdate,
    CompanyProfileResponse,
)

router = APIRouter(
    prefix="/api/recruiter/company",
    tags=["Company Profile"]
)


@router.post(
    "",
    response_model=CompanyProfileResponse,
    status_code=status.HTTP_201_CREATED
)
def create_company_profile(
    profile_data: CompanyProfileCreate,
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db)
):
    existing_profile = (
        db.query(CompanyProfile)
        .filter(CompanyProfile.recruiter_id == current_user.id)
        .first()
    )

    if existing_profile:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Company profile already exists"
        )

    profile = CompanyProfile(
        recruiter_id=current_user.id,
        company_name=profile_data.company_name,
        company_description=profile_data.company_description,
        industry=profile_data.industry,
        company_size=profile_data.company_size,
        website=profile_data.website,
        location=profile_data.location,
        logo_url=profile_data.logo_url,
    )

    db.add(profile)
    db.commit()
    db.refresh(profile)

    return profile


@router.get(
    "",
    response_model=CompanyProfileResponse
)
def get_company_profile(
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db)
):
    profile = (
        db.query(CompanyProfile)
        .filter(CompanyProfile.recruiter_id == current_user.id)
        .first()
    )

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company profile not found"
        )

    return profile


@router.put(
    "",
    response_model=CompanyProfileResponse
)
def update_company_profile(
    profile_data: CompanyProfileUpdate,
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db)
):
    profile = (
        db.query(CompanyProfile)
        .filter(CompanyProfile.recruiter_id == current_user.id)
        .first()
    )

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company profile not found"
        )

    update_data = profile_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)

    return profile