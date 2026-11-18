from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from app.auth.dependencies import require_role
from app.models.user import User

from app.services.interview_feedback_service import (
    generate_interview_feedback
)


router = APIRouter(
    prefix="/api/interview-feedback",
    tags=["Interview Feedback"]
)


class InterviewFeedbackRequest(BaseModel):
    technical_score: float = Field(ge=0, le=100)
    communication_score: float = Field(ge=0, le=100)
    problem_solving_score: float = Field(ge=0, le=100)
    behavioral_score: float = Field(ge=0, le=100)
    interviewer_comments: str = ""


@router.post("")
def create_interview_feedback(
    data: InterviewFeedbackRequest,
    current_user: User = Depends(require_role("recruiter"))
):
    return generate_interview_feedback(
        technical_score=data.technical_score,
        communication_score=data.communication_score,
        problem_solving_score=data.problem_solving_score,
        behavioral_score=data.behavioral_score,
        interviewer_comments=data.interviewer_comments
    )