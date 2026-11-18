from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class AssessmentCreate(BaseModel):
    job_id: int
    title: str = Field(min_length=2, max_length=255)
    description: Optional[str] = None
    duration_minutes: int = Field(default=30, ge=1)
    passing_score: int = Field(default=60, ge=0, le=100)


class AssessmentUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=2, max_length=255)
    description: Optional[str] = None
    duration_minutes: Optional[int] = Field(default=None, ge=1)
    passing_score: Optional[int] = Field(default=None, ge=0, le=100)
    is_active: Optional[bool] = None


class AssessmentResponse(BaseModel):
    id: int
    recruiter_id: int
    job_id: int
    title: str
    description: Optional[str] = None
    duration_minutes: int
    passing_score: int
    is_active: bool

    model_config = ConfigDict(from_attributes=True)