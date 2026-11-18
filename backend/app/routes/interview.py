from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user, require_role
from app.config.database import get_db
from app.models.application import Application
from app.models.interview import Interview
from app.models.job import Job
from app.models.user import User
from app.schemas.interview import (
    InterviewCreate,
    InterviewUpdate,
    InterviewResponse,
)


router = APIRouter(
    prefix="/api/interviews",
    tags=["Interviews"]
)


ALLOWED_STATUSES = {
    "scheduled",
    "completed",
    "cancelled",
    "rescheduled",
    "no_show",
}


@router.post(
    "",
    response_model=InterviewResponse,
    status_code=status.HTTP_201_CREATED
)
def create_interview(
    interview_data: InterviewCreate,
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db)
):
    application = (
        db.query(Application)
        .join(Job, Application.job_id == Job.id)
        .filter(
            Application.id == interview_data.application_id,
            Job.recruiter_id == current_user.id
        )
        .first()
    )

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found or does not belong to your jobs"
        )

    interview = Interview(
        application_id=application.id,
        recruiter_id=current_user.id,
        scheduled_at=interview_data.scheduled_at,
        interview_type=interview_data.interview_type,
        meeting_link=interview_data.meeting_link,
        interviewer_name=interview_data.interviewer_name,
        notes=interview_data.notes,
        status="scheduled",
    )

    db.add(interview)

    application.status = "interview"

    db.commit()
    db.refresh(interview)

    return interview


@router.get(
    "/my-interviews",
    response_model=list[InterviewResponse]
)
def get_my_interviews(
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db)
):
    interviews = (
        db.query(Interview)
        .filter(Interview.recruiter_id == current_user.id)
        .order_by(Interview.scheduled_at.asc())
        .all()
    )

    return interviews


@router.get(
    "/candidate",
    response_model=list[InterviewResponse]
)
def get_candidate_interviews(
    current_user: User = Depends(require_role("candidate")),
    db: Session = Depends(get_db)
):
    interviews = (
        db.query(Interview)
        .join(Application, Interview.application_id == Application.id)
        .filter(Application.candidate_id == current_user.id)
        .order_by(Interview.scheduled_at.asc())
        .all()
    )

    return interviews


@router.get(
    "/{interview_id}",
    response_model=InterviewResponse
)
def get_interview(
    interview_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    interview = (
        db.query(Interview)
        .filter(Interview.id == interview_id)
        .first()
    )

    if not interview:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview not found"
        )

    if current_user.role == "recruiter":
        if interview.recruiter_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to view this interview"
            )

    elif current_user.role == "candidate":
        application = (
            db.query(Application)
            .filter(Application.id == interview.application_id)
            .first()
        )

        if not application or application.candidate_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to view this interview"
            )

    return interview


@router.put(
    "/{interview_id}",
    response_model=InterviewResponse
)
def update_interview(
    interview_id: int,
    interview_data: InterviewUpdate,
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db)
):
    interview = (
        db.query(Interview)
        .filter(
            Interview.id == interview_id,
            Interview.recruiter_id == current_user.id
        )
        .first()
    )

    if not interview:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview not found or does not belong to this recruiter"
        )

    update_data = interview_data.model_dump(exclude_unset=True)

    if "status" in update_data:
        new_status = update_data["status"].lower()

        if new_status not in ALLOWED_STATUSES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Invalid interview status. Allowed values: "
                    + ", ".join(sorted(ALLOWED_STATUSES))
                )
            )

        update_data["status"] = new_status

    for field, value in update_data.items():
        setattr(interview, field, value)

    db.commit()
    db.refresh(interview)

    return interview


@router.delete(
    "/{interview_id}"
)
def delete_interview(
    interview_id: int,
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db)
):
    interview = (
        db.query(Interview)
        .filter(
            Interview.id == interview_id,
            Interview.recruiter_id == current_user.id
        )
        .first()
    )

    if not interview:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview not found or does not belong to this recruiter"
        )

    db.delete(interview)
    db.commit()

    return {
        "message": "Interview deleted successfully",
        "interview_id": interview_id
    }