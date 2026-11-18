from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class AssessmentAttemptResponse(BaseModel):
    id: int
    assessment_id: int
    candidate_id: int
    score: Optional[float] = None
    max_score: Optional[float] = None
    percentage: Optional[float] = None
    status: str
    started_at: Optional[datetime] = None
    submitted_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class AssessmentAnswerSubmit(BaseModel):
    question_id: int
    answer: str


class AssessmentSubmissionResponse(BaseModel):
    attempt_id: int
    score: float
    max_score: float
    percentage: float
    status: str