from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from app.auth.dependencies import require_role
from app.models.user import User

from app.services.evaluation_service import (
    evaluate_platform_candidate
)


router = APIRouter(
    prefix="/api/evaluation",
    tags=["Evaluation Engine"]
)


class EvaluationRequest(BaseModel):
    resume_score: float = Field(default=0, ge=0, le=100)
    coding_score: float = Field(default=0, ge=0, le=100)
    assessment_score: float = Field(default=0, ge=0, le=100)
    skill_match_score: float = Field(default=0, ge=0, le=100)
    interview_score: float = Field(default=0, ge=0, le=100)


@router.post("")
def evaluate_candidate_endpoint(
    data: EvaluationRequest,
    current_user: User = Depends(
        require_role("recruiter")
    )
):
    return evaluate_platform_candidate(
        resume_score=data.resume_score,
        coding_score=data.coding_score,
        assessment_score=data.assessment_score,
        skill_match_score=data.skill_match_score,
        interview_score=data.interview_score
    )