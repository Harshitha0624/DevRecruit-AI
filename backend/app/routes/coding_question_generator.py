from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from app.auth.dependencies import require_role
from app.models.user import User

from app.services.coding_question_generator_service import (
    generate_coding_questions
)


router = APIRouter(
    prefix="/api/coding-question-generator",
    tags=["Coding Question Generator"]
)


class CodingQuestionGeneratorRequest(BaseModel):
    skill: str = Field(default="Python", min_length=1, max_length=100)
    difficulty: str = Field(default="Medium", min_length=1, max_length=20)
    question_count: int = Field(default=1, ge=1, le=20)
    programming_language: str = Field(
        default="Python",
        min_length=1,
        max_length=50
    )
    company: str | None = Field(
        default=None,
        max_length=100
    )


@router.post("")
def generate_coding_question_set(
    data: CodingQuestionGeneratorRequest,
    current_user: User = Depends(require_role("recruiter"))
):
    return generate_coding_questions(
        skill=data.skill,
        difficulty=data.difficulty,
        question_count=data.question_count,
        programming_language=data.programming_language,
        company=data.company
    )