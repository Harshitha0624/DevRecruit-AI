from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class PipelineStageUpdate(BaseModel):
    stage: str = Field(min_length=2, max_length=50)
    notes: Optional[str] = None


class PipelineStageResponse(BaseModel):
    id: int
    application_id: int
    stage: str
    changed_by: Optional[int] = None
    notes: Optional[str] = None
    changed_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)