from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class CodingTestCreate(BaseModel):
    job_id: int
    title: str = Field(min_length=2, max_length=255)
    description: Optional[str] = None
    duration_minutes: int = Field(default=60, ge=1)
    programming_language: str = Field(
        default="Python",
        min_length=1,
        max_length=50
    )
    total_marks: int = Field(default=100, ge=1)


class CodingTestUpdate(BaseModel):
    title: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=255
    )
    description: Optional[str] = None
    duration_minutes: Optional[int] = Field(
        default=None,
        ge=1
    )
    programming_language: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=50
    )
    total_marks: Optional[int] = Field(
        default=None,
        ge=1
    )
    is_active: Optional[bool] = None


class CodingTestResponse(BaseModel):
    id: int
    recruiter_id: int
    job_id: int
    title: str
    description: Optional[str] = None
    duration_minutes: int
    programming_language: str
    total_marks: int
    is_active: bool

    model_config = ConfigDict(from_attributes=True)