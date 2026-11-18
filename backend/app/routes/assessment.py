from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user, require_role
from app.config.database import get_db
from app.models.assessment import Assessment
from app.models.job import Job
from app.models.user import User
from app.schemas.assessment import (
    AssessmentCreate,
    AssessmentUpdate,
    AssessmentResponse,
)


router = APIRouter(
    prefix="/api/assessments",
    tags=["Assessments"]
)


@router.post(
    "",
    response_model=AssessmentResponse,
    status_code=status.HTTP_201_CREATED
)
def create_assessment(
    assessment_data: AssessmentCreate,
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db)
):
    job = (
        db.query(Job)
        .filter(
            Job.id == assessment_data.job_id,
            Job.recruiter_id == current_user.id
        )
        .first()
    )

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found or does not belong to this recruiter"
        )

    assessment = Assessment(
        recruiter_id=current_user.id,
        job_id=assessment_data.job_id,
        title=assessment_data.title,
        description=assessment_data.description,
        duration_minutes=assessment_data.duration_minutes,
        passing_score=assessment_data.passing_score,
        is_active=True,
    )

    db.add(assessment)
    db.commit()
    db.refresh(assessment)

    return assessment


@router.get(
    "/my-assessments",
    response_model=list[AssessmentResponse]
)
def get_my_assessments(
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db)
):
    assessments = (
        db.query(Assessment)
        .filter(Assessment.recruiter_id == current_user.id)
        .order_by(Assessment.created_at.desc())
        .all()
    )

    return assessments


@router.get(
    "/job/{job_id}",
    response_model=list[AssessmentResponse]
)
def get_job_assessments(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job = (
        db.query(Job)
        .filter(Job.id == job_id)
        .first()
    )

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    if current_user.role == "recruiter" and job.recruiter_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to view these assessments"
        )

    assessments = (
        db.query(Assessment)
        .filter(
            Assessment.job_id == job_id,
            Assessment.is_active == True
        )
        .order_by(Assessment.created_at.desc())
        .all()
    )

    return assessments


@router.get(
    "/{assessment_id}",
    response_model=AssessmentResponse
)
def get_assessment(
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

    if (
        current_user.role == "recruiter"
        and assessment.recruiter_id != current_user.id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to view this assessment"
        )

    if (
        current_user.role == "candidate"
        and not assessment.is_active
    ):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found"
        )

    return assessment


@router.put(
    "/{assessment_id}",
    response_model=AssessmentResponse
)
def update_assessment(
    assessment_id: int,
    assessment_data: AssessmentUpdate,
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db)
):
    assessment = (
        db.query(Assessment)
        .filter(
            Assessment.id == assessment_id,
            Assessment.recruiter_id == current_user.id
        )
        .first()
    )

    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found or does not belong to this recruiter"
        )

    update_data = assessment_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(assessment, field, value)

    db.commit()
    db.refresh(assessment)

    return assessment


@router.delete(
    "/{assessment_id}"
)
def delete_assessment(
    assessment_id: int,
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db)
):
    assessment = (
        db.query(Assessment)
        .filter(
            Assessment.id == assessment_id,
            Assessment.recruiter_id == current_user.id
        )
        .first()
    )

    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found or does not belong to this recruiter"
        )

    db.delete(assessment)
    db.commit()

    return {
        "message": "Assessment deleted successfully",
        "assessment_id": assessment_id
    }