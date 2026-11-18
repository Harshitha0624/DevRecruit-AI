from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.config.database import get_db
from app.models.candidate_profile import CandidateProfile
from app.models.user import User
from app.schemas.candidate_profile import (
    CandidateProfileCreate,
    CandidateProfileResponse,
)


router = APIRouter(
    prefix="/api/candidate/profile",
    tags=["Candidate Profile"]
)


@router.post(
    "",
    response_model=CandidateProfileResponse,
    status_code=status.HTTP_201_CREATED
)
def create_profile(
    profile_data: CandidateProfileCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "candidate":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only candidates can create a candidate profile"
        )

    existing_profile = (
        db.query(CandidateProfile)
        .filter(CandidateProfile.user_id == current_user.id)
        .first()
    )

    if existing_profile:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Candidate profile already exists"
        )

    new_profile = CandidateProfile(
        user_id=current_user.id,
        headline=profile_data.headline,
        bio=profile_data.bio,
        skills=profile_data.skills,
        experience_years=profile_data.experience_years,
        education=profile_data.education,
        github_url=profile_data.github_url,
        linkedin_url=profile_data.linkedin_url,
        resume_url=profile_data.resume_url,
    )

    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)

    return new_profile


@router.get(
    "",
    response_model=CandidateProfileResponse
)
def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = (
        db.query(CandidateProfile)
        .filter(CandidateProfile.user_id == current_user.id)
        .first()
    )

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate profile not found"
        )

    return profile


@router.put(
    "",
    response_model=CandidateProfileResponse
)
def update_profile(
    profile_data: CandidateProfileCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "candidate":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only candidates can update a candidate profile"
        )

    profile = (
        db.query(CandidateProfile)
        .filter(CandidateProfile.user_id == current_user.id)
        .first()
    )

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate profile not found"
        )

    profile.headline = profile_data.headline
    profile.bio = profile_data.bio
    profile.skills = profile_data.skills
    profile.experience_years = profile_data.experience_years
    profile.education = profile_data.education
    profile.github_url = profile_data.github_url
    profile.linkedin_url = profile_data.linkedin_url
    profile.resume_url = profile_data.resume_url

    db.commit()
    db.refresh(profile)

    return profile