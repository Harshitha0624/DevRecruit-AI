from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class ApplicationCreate(BaseModel):
    job_id: int
    resume_file_id: Optional[int] = None
    cover_letter: Optional[str] = None


class ApplicationStatusUpdate(BaseModel):
    status: str = Field(min_length=2, max_length=50)


class RecruiterApplicationUpdate(BaseModel):
    status: Optional[str] = Field(default=None, min_length=2, max_length=50)
    recruiter_notes: Optional[str] = None


class ApplicationResponse(BaseModel):
    id: int
    candidate_id: int
    job_id: int
    resume_file_id: Optional[int] = None
    cover_letter: Optional[str] = None
    status: str
    ats_score: Optional[float] = None
    recruiter_notes: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)