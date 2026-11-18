from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List

from app.auth.dependencies import get_current_user, require_role
from app.config.database import get_db
from app.models.coding_test import CodingTest
from app.models.coding_question import CodingQuestion
from app.models.user import User


router = APIRouter(
    prefix="/api/coding-questions",
    tags=["Coding Questions"]
)


# =========================
# SCHEMAS
# =========================

class CodingQuestionCreate(BaseModel):
    coding_test_id: int
    title: str = Field(min_length=2, max_length=255)
    description: str = Field(min_length=10)

    difficulty: str = Field(
        default="medium",
        min_length=2,
        max_length=50
    )

    input_format: Optional[str] = None
    output_format: Optional[str] = None
    constraints: Optional[str] = None

    sample_input: Optional[str] = None
    sample_output: Optional[str] = None

    test_cases: Optional[List[dict]] = None

    marks: int = Field(default=10, ge=1)
    order_number: int = Field(default=1, ge=1)


class CodingQuestionUpdate(BaseModel):
    title: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=255
    )

    description: Optional[str] = Field(
        default=None,
        min_length=10
    )

    difficulty: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=50
    )

    input_format: Optional[str] = None
    output_format: Optional[str] = None
    constraints: Optional[str] = None

    sample_input: Optional[str] = None
    sample_output: Optional[str] = None

    test_cases: Optional[List[dict]] = None

    marks: Optional[int] = Field(
        default=None,
        ge=1
    )

    order_number: Optional[int] = Field(
        default=None,
        ge=1
    )

    is_active: Optional[bool] = None


class CodingQuestionResponse(BaseModel):
    id: int
    coding_test_id: int
    title: str
    description: str
    difficulty: str
    input_format: Optional[str] = None
    output_format: Optional[str] = None
    constraints: Optional[str] = None
    sample_input: Optional[str] = None
    sample_output: Optional[str] = None
    test_cases: Optional[List[dict]] = None
    marks: int
    order_number: int
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


# =========================
# CREATE CODING QUESTION
# =========================

@router.post(
    "",
    response_model=CodingQuestionResponse,
    status_code=status.HTTP_201_CREATED
)
def create_coding_question(
    question_data: CodingQuestionCreate,
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db)
):
    coding_test = (
        db.query(CodingTest)
        .filter(
            CodingTest.id == question_data.coding_test_id,
            CodingTest.recruiter_id == current_user.id
        )
        .first()
    )

    if not coding_test:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Coding test not found or does not belong to this recruiter"
        )

    question = CodingQuestion(
        coding_test_id=question_data.coding_test_id,
        title=question_data.title,
        description=question_data.description,
        difficulty=question_data.difficulty.lower(),
        input_format=question_data.input_format,
        output_format=question_data.output_format,
        constraints=question_data.constraints,
        sample_input=question_data.sample_input,
        sample_output=question_data.sample_output,
        test_cases=question_data.test_cases,
        marks=question_data.marks,
        order_number=question_data.order_number,
        is_active=True,
    )

    db.add(question)
    db.commit()
    db.refresh(question)

    return question


# =========================
# GET QUESTIONS FOR TEST
# =========================

@router.get(
    "/test/{coding_test_id}",
    response_model=list[CodingQuestionResponse]
)
def get_coding_test_questions(
    coding_test_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    coding_test = (
        db.query(CodingTest)
        .filter(CodingTest.id == coding_test_id)
        .first()
    )

    if not coding_test:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Coding test not found"
        )

    if current_user.role == "recruiter":
        if coding_test.recruiter_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to view these questions"
            )

    questions = (
        db.query(CodingQuestion)
        .filter(
            CodingQuestion.coding_test_id == coding_test_id,
            CodingQuestion.is_active == True
        )
        .order_by(CodingQuestion.order_number.asc())
        .all()
    )

    return questions


# =========================
# GET SINGLE QUESTION
# =========================

@router.get(
    "/{question_id}",
    response_model=CodingQuestionResponse
)
def get_coding_question(
    question_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    question = (
        db.query(CodingQuestion)
        .filter(CodingQuestion.id == question_id)
        .first()
    )

    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Coding question not found"
        )

    coding_test = (
        db.query(CodingTest)
        .filter(CodingTest.id == question.coding_test_id)
        .first()
    )

    if not coding_test:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Coding test not found"
        )

    if current_user.role == "recruiter":
        if coding_test.recruiter_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to view this question"
            )

    if current_user.role == "candidate":
        if not coding_test.is_active or not question.is_active:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Coding question not found"
            )

    return question


# =========================
# UPDATE QUESTION
# =========================

@router.put(
    "/{question_id}",
    response_model=CodingQuestionResponse
)
def update_coding_question(
    question_id: int,
    question_data: CodingQuestionUpdate,
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db)
):
    question = (
        db.query(CodingQuestion)
        .filter(CodingQuestion.id == question_id)
        .first()
    )

    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Coding question not found"
        )

    coding_test = (
        db.query(CodingTest)
        .filter(
            CodingTest.id == question.coding_test_id,
            CodingTest.recruiter_id == current_user.id
        )
        .first()
    )

    if not coding_test:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to update this question"
        )

    update_data = question_data.model_dump(exclude_unset=True)

    if "difficulty" in update_data:
        update_data["difficulty"] = update_data["difficulty"].lower()

    for field, value in update_data.items():
        setattr(question, field, value)

    db.commit()
    db.refresh(question)

    return question


# =========================
# DELETE QUESTION
# =========================

@router.delete(
    "/{question_id}"
)
def delete_coding_question(
    question_id: int,
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db)
):
    question = (
        db.query(CodingQuestion)
        .filter(CodingQuestion.id == question_id)
        .first()
    )

    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Coding question not found"
        )

    coding_test = (
        db.query(CodingTest)
        .filter(
            CodingTest.id == question.coding_test_id,
            CodingTest.recruiter_id == current_user.id
        )
        .first()
    )

    if not coding_test:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to delete this question"
        )

    question.is_active = False

    db.commit()

    return {
        "message": "Coding question deleted successfully",
        "question_id": question_id
    }