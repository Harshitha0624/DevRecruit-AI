from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class CandidateProfileCreate(BaseModel):
    headline: Optional[str] = Field(
        default=None,
        max_length=255
    )

    bio: Optional[str] = None

    skills: Optional[List[str]] = None

    experience_years: Optional[int] = Field(
        default=None,
        ge=0
    )

    education: Optional[str] = None

    github_url: Optional[str] = Field(
        default=None,
        max_length=500
    )

    linkedin_url: Optional[str] = Field(
        default=None,
        max_length=500
    )

    resume_url: Optional[str] = Field(
        default=None,
        max_length=500
    )


class CandidateProfileResponse(CandidateProfileCreate):
    id: int
    user_id: int

    model_config = ConfigDict(
        from_attributes=True
    )