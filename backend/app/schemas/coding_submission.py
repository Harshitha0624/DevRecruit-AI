from datetime import datetime
from typing import Optional, List, Dict, Any

from pydantic import BaseModel, ConfigDict, Field


class CodingSubmissionCreate(BaseModel):
    coding_test_id: int
    question_id: int
    source_code: str = Field(min_length=1)
    language: str = Field(default="Python", min_length=1, max_length=50)


class CodingSubmissionResponse(BaseModel):
    id: int
    coding_test_id: int
    question_id: int
    candidate_id: int
    source_code: str
    language: str
    score: Optional[float] = None
    max_score: Optional[float] = None
    test_results: Optional[List[Dict[str, Any]]] = None
    status: str
    submitted_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)