from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class CompanyProfileCreate(BaseModel):
    company_name: str = Field(min_length=2, max_length=255)
    company_description: Optional[str] = None
    industry: Optional[str] = Field(default=None, max_length=150)
    company_size: Optional[str] = Field(default=None, max_length=100)
    website: Optional[str] = Field(default=None, max_length=500)
    location: Optional[str] = Field(default=None, max_length=255)
    logo_url: Optional[str] = Field(default=None, max_length=500)


class CompanyProfileUpdate(BaseModel):
    company_name: Optional[str] = Field(default=None, min_length=2, max_length=255)
    company_description: Optional[str] = None
    industry: Optional[str] = Field(default=None, max_length=150)
    company_size: Optional[str] = Field(default=None, max_length=100)
    website: Optional[str] = Field(default=None, max_length=500)
    location: Optional[str] = Field(default=None, max_length=255)
    logo_url: Optional[str] = Field(default=None, max_length=500)


class CompanyProfileResponse(BaseModel):
    id: int
    recruiter_id: int
    company_name: str
    company_description: Optional[str] = None
    industry: Optional[str] = None
    company_size: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None
    logo_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)