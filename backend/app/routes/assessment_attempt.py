from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import require_role
from app.config.database import get_db
from app.models.assessment import Assessment
from app.models.assessment_attempt import AssessmentAttempt
from app.models.assessment_question import AssessmentQuestion
from app.models.user import User
from app.schemas.assessment_attempt import (
    AssessmentAnswerSubmit,
    AssessmentAttemptResponse,
    AssessmentSubmissionResponse,
)


router = APIRouter(
    prefix="/api/assessment-attempts",
    tags=["Assessment Attempts"]
)


@router.post(
    "/{assessment_id}/start",
    response_model=AssessmentAttemptResponse,
    status_code=status.HTTP_201_CREATED
)
def start_assessment(
    assessment_id: int,
    current_user: User = Depends(require_role("candidate")),
    db: Session = Depends(get_db)
):
    assessment = (
        db.query(Assessment)
        .filter(
            Assessment.id == assessment_id,
            Assessment.is_active == True
        )
        .first()
    )

    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found"
        )

    existing_attempt = (
        db.query(AssessmentAttempt)
        .filter(
            AssessmentAttempt.assessment_id == assessment_id,
            AssessmentAttempt.candidate_id == current_user.id,
            AssessmentAttempt.status == "in_progress"
        )
        .first()
    )

    if existing_attempt:
        return existing_attempt

    attempt = AssessmentAttempt(
        assessment_id=assessment_id,
        candidate_id=current_user.id,
        status="in_progress",
    )

    db.add(attempt)
    db.commit()
    db.refresh(attempt)

    return attempt


@router.post(
    "/{attempt_id}/submit",
    response_model=AssessmentSubmissionResponse
)
def submit_assessment(
    attempt_id: int,
    answers: list[AssessmentAnswerSubmit],
    current_user: User = Depends(require_role("candidate")),
    db: Session = Depends(get_db)
):
    attempt = (
        db.query(AssessmentAttempt)
        .filter(
            AssessmentAttempt.id == attempt_id,
            AssessmentAttempt.candidate_id == current_user.id
        )
        .first()
    )

    if not attempt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment attempt not found"
        )

    if attempt.status != "in_progress":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This assessment attempt has already been submitted"
        )

    assessment = (
        db.query(Assessment)
        .filter(Assessment.id == attempt.assessment_id)
        .first()
    )

    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found"
        )

    questions = (
        db.query(AssessmentQuestion)
        .filter(
            AssessmentQuestion.assessment_id == assessment.id,
            AssessmentQuestion.is_active == True
        )
        .all()
    )

    question_map = {
        question.id: question
        for question in questions
    }

    score = 0.0
    max_score = 0.0

    submitted_question_ids = set()

    for answer_item in answers:
        if answer_item.question_id in submitted_question_ids:
            continue

        question = question_map.get(answer_item.question_id)

        if not question:
            continue

        submitted_question_ids.add(answer_item.question_id)

        max_score += question.marks

        if question.correct_answer is not None:
            if (
                answer_item.answer.strip().lower()
                == question.correct_answer.strip().lower()
            ):
                score += question.marks

    percentage = (
        (score / max_score) * 100
        if max_score > 0
        else 0.0
    )

    attempt.score = score
    attempt.max_score = max_score
    attempt.percentage = round(percentage, 2)
    attempt.status = (
        "passed"
        if percentage >= assessment.passing_score
        else "failed"
    )
    attempt.submitted_at = datetime.now(timezone.utc)

    db.commit()

    return AssessmentSubmissionResponse(
        attempt_id=attempt.id,
        score=score,
        max_score=max_score,
        percentage=round(percentage, 2),
        status=attempt.status,
    )


@router.get(
    "/my-attempts",
    response_model=list[AssessmentAttemptResponse]
)
def get_my_attempts(
    current_user: User = Depends(require_role("candidate")),
    db: Session = Depends(get_db)
):
    attempts = (
        db.query(AssessmentAttempt)
        .filter(
            AssessmentAttempt.candidate_id == current_user.id
        )
        .order_by(AssessmentAttempt.started_at.desc())
        .all()
    )

    return attempts