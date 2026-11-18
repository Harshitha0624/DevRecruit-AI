from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class JobCreate(BaseModel):
    company_id: int
    title: str = Field(min_length=2, max_length=255)
    description: str = Field(min_length=10)

    required_skills: Optional[List[str]] = None
    preferred_skills: Optional[List[str]] = None

    experience_min: Optional[int] = Field(default=None, ge=0)
    experience_max: Optional[int] = Field(default=None, ge=0)

    education: Optional[str] = Field(default=None, max_length=255)
    location: Optional[str] = Field(default=None, max_length=255)
    employment_type: Optional[str] = Field(default=None, max_length=100)

    salary_min: Optional[int] = Field(default=None, ge=0)
    salary_max: Optional[int] = Field(default=None, ge=0)

    openings: int = Field(default=1, ge=1)

    status: str = Field(default="draft", max_length=50)
    is_active: bool = True


class JobUpdate(BaseModel):
    company_id: Optional[int] = None
    title: Optional[str] = Field(default=None, min_length=2, max_length=255)
    description: Optional[str] = Field(default=None, min_length=10)

    required_skills: Optional[List[str]] = None
    preferred_skills: Optional[List[str]] = None

    experience_min: Optional[int] = Field(default=None, ge=0)
    experience_max: Optional[int] = Field(default=None, ge=0)

    education: Optional[str] = Field(default=None, max_length=255)
    location: Optional[str] = Field(default=None, max_length=255)
    employment_type: Optional[str] = Field(default=None, max_length=100)

    salary_min: Optional[int] = Field(default=None, ge=0)
    salary_max: Optional[int] = Field(default=None, ge=0)

    openings: Optional[int] = Field(default=None, ge=1)

    status: Optional[str] = Field(default=None, max_length=50)
    is_active: Optional[bool] = None


class JobResponse(BaseModel):
    id: int
    recruiter_id: int
    company_id: int

    title: str
    description: str

    required_skills: Optional[List[str]] = None
    preferred_skills: Optional[List[str]] = None

    experience_min: Optional[int] = None
    experience_max: Optional[int] = None

    education: Optional[str] = None
    location: Optional[str] = None
    employment_type: Optional[str] = None

    salary_min: Optional[int] = None
    salary_max: Optional[int] = None

    openings: int
    status: str
    is_active: bool

    model_config = ConfigDict(from_attributes=True)