from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user, require_role
from app.config.database import get_db
from app.models.assessment import Assessment
from app.models.assessment_question import AssessmentQuestion
from app.models.user import User
from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List


router = APIRouter(
    prefix="/api/assessment-questions",
    tags=["Assessment Questions"]
)


# ============================================================
# SCHEMAS
# ============================================================

class AssessmentQuestionCreate(BaseModel):
    assessment_id: int
    question_text: str = Field(min_length=3)
    question_type: str = Field(default="mcq", min_length=2, max_length=50)
    options: Optional[List[str]] = None
    correct_answer: Optional[str] = None
    marks: int = Field(default=1, ge=1)
    order_number: int = Field(default=1, ge=1)


class AssessmentQuestionUpdate(BaseModel):
    question_text: Optional[str] = Field(default=None, min_length=3)
    question_type: Optional[str] = Field(default=None, min_length=2, max_length=50)
    options: Optional[List[str]] = None
    correct_answer: Optional[str] = None
    marks: Optional[int] = Field(default=None, ge=1)
    order_number: Optional[int] = Field(default=None, ge=1)
    is_active: Optional[bool] = None


class AssessmentQuestionResponse(BaseModel):
    id: int
    assessment_id: int
    question_text: str
    question_type: str
    options: Optional[List[str]] = None
    correct_answer: Optional[str] = None
    marks: int
    order_number: int
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


# ============================================================
# CREATE QUESTION
# ============================================================

@router.post(
    "",
    response_model=AssessmentQuestionResponse,
    status_code=status.HTTP_201_CREATED
)
def create_question(
    question_data: AssessmentQuestionCreate,
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db)
):
    assessment = (
        db.query(Assessment)
        .filter(
            Assessment.id == question_data.assessment_id,
            Assessment.recruiter_id == current_user.id
        )
        .first()
    )

    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found or does not belong to this recruiter"
        )

    if question_data.question_type.lower() == "mcq":
        if not question_data.options:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="MCQ questions must contain options"
            )

        if not question_data.correct_answer:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="MCQ questions must contain a correct answer"
            )

        if question_data.correct_answer not in question_data.options:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Correct answer must be one of the provided options"
            )

    question = AssessmentQuestion(
        assessment_id=question_data.assessment_id,
        question_text=question_data.question_text,
        question_type=question_data.question_type.lower(),
        options=question_data.options,
        correct_answer=question_data.correct_answer,
        marks=question_data.marks,
        order_number=question_data.order_number,
        is_active=True,
    )

    db.add(question)
    db.commit()
    db.refresh(question)

    return question


# ============================================================
# GET QUESTIONS FOR AN ASSESSMENT
# ============================================================

@router.get(
    "/assessment/{assessment_id}",
    response_model=list[AssessmentQuestionResponse]
)
def get_assessment_questions(
    assessment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    assessment = (
        db.query(Assessment)
        .filter(Assessment.id == assessment_id)
        .first()
    )

    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found"
        )

    if current_user.role == "recruiter":
        if assessment.recruiter_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to view these questions"
            )

    questions = (
        db.query(AssessmentQuestion)
        .filter(
            AssessmentQuestion.assessment_id == assessment_id,
            AssessmentQuestion.is_active == True
        )
        .order_by(AssessmentQuestion.order_number.asc())
        .all()
    )

    return questions


# ============================================================
# GET SINGLE QUESTION
# ============================================================

@router.get(
    "/{question_id}",
    response_model=AssessmentQuestionResponse
)
def get_question(
    question_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    question = (
        db.query(AssessmentQuestion)
        .filter(AssessmentQuestion.id == question_id)
        .first()
    )

    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment question not found"
        )

    assessment = (
        db.query(Assessment)
        .filter(Assessment.id == question.assessment_id)
        .first()
    )

    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found"
        )

    if current_user.role == "recruiter":
        if assessment.recruiter_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to view this question"
            )

    if current_user.role == "candidate":
        if not assessment.is_active or not question.is_active:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Assessment question not found"
            )

    return question


# ============================================================
# UPDATE QUESTION
# ============================================================

@router.put(
    "/{question_id}",
    response_model=AssessmentQuestionResponse
)
def update_question(
    question_id: int,
    question_data: AssessmentQuestionUpdate,
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db)
):
    question = (
        db.query(AssessmentQuestion)
        .filter(AssessmentQuestion.id == question_id)
        .first()
    )

    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment question not found"
        )

    assessment = (
        db.query(Assessment)
        .filter(
            Assessment.id == question.assessment_id,
            Assessment.recruiter_id == current_user.id
        )
        .first()
    )

    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to update this question"
        )

    update_data = question_data.model_dump(exclude_unset=True)

    new_type = update_data.get(
        "question_type",
        question.question_type
    ).lower()

    new_options = update_data.get(
        "options",
        question.options
    )

    new_correct_answer = update_data.get(
        "correct_answer",
        question.correct_answer
    )

    if new_type == "mcq":
        if not new_options:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="MCQ questions must contain options"
            )

        if not new_correct_answer:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="MCQ questions must contain a correct answer"
            )

        if new_correct_answer not in new_options:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Correct answer must be one of the provided options"
            )

    if "question_type" in update_data:
        update_data["question_type"] = new_type

    for field, value in update_data.items():
        setattr(question, field, value)

    db.commit()
    db.refresh(question)

    return question


# ============================================================
# DELETE QUESTION
# ============================================================

@router.delete(
    "/{question_id}"
)
def delete_question(
    question_id: int,
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db)
):
    question = (
        db.query(AssessmentQuestion)
        .filter(AssessmentQuestion.id == question_id)
        .first()
    )

    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment question not found"
        )

    assessment = (
        db.query(Assessment)
        .filter(
            Assessment.id == question.assessment_id,
            Assessment.recruiter_id == current_user.id
        )
        .first()
    )

    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to delete this question"
        )

    question.is_active = False

    db.commit()

    return {
        "message": "Assessment question deleted successfully",
        "question_id": question_id
    }