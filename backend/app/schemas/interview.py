from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class InterviewCreate(BaseModel):
    application_id: int

    scheduled_at: datetime

    interview_type: str = Field(
        default="technical",
        min_length=2,
        max_length=50
    )

    meeting_link: Optional[str] = Field(
        default=None,
        max_length=500
    )

    interviewer_name: Optional[str] = Field(
        default=None,
        max_length=255
    )

    notes: Optional[str] = None


class InterviewUpdate(BaseModel):
    scheduled_at: Optional[datetime] = None

    interview_type: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=50
    )

    meeting_link: Optional[str] = Field(
        default=None,
        max_length=500
    )

    interviewer_name: Optional[str] = Field(
        default=None,
        max_length=255
    )

    status: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=50
    )

    notes: Optional[str] = None


class InterviewResponse(BaseModel):
    id: int
    application_id: int
    recruiter_id: int
    scheduled_at: datetime
    interview_type: str
    meeting_link: Optional[str] = None
    interviewer_name: Optional[str] = None
    status: str
    notes: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)