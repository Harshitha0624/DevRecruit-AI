
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.auth.dependencies import get_current_user
from app.models.interview import Interview
from app.models.application import Application
from app.models.job import Job
from app.models.user import User
from app.services.notification_service import create_notification

router = APIRouter(
    prefix="/api/recruiter/interviews",
    tags=["Recruiter Interview Management"]
)


# REQUEST MODELS

class InterviewCreate(BaseModel):
    application_id: int
    scheduled_at: datetime
    interview_type: str = "technical"
    meeting_link: Optional[str] = None
    interviewer_name: Optional[str] = None
    notes: Optional[str] = None


class InterviewReschedule(BaseModel):
    scheduled_at: datetime


class InterviewUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
    meeting_link: Optional[str] = None
    interviewer_name: Optional[str] = None


# HELPERS

def check_recruiter(current_user):
    if str(current_user.role).lower() != "recruiter":
        raise HTTPException(
            status_code=403,
            detail="Recruiter access required"
        )


def serialize_interview(interview, application=None, candidate=None):
    return {
        "interview_id": interview.id,
        "application_id": interview.application_id,
        "candidate_id": application.candidate_id if application else None,
        "candidate_name": candidate.full_name if candidate else None,
        "scheduled_at": interview.scheduled_at,
        "interview_type": interview.interview_type,
        "meeting_link": interview.meeting_link,
        "interviewer_name": interview.interviewer_name,
        "status": interview.status,
        "notes": interview.notes,
        "created_at": interview.created_at,
        "updated_at": interview.updated_at
    }


def notify_candidate(db, candidate_id, title, message):
    if candidate_id:
        create_notification(
            db=db,
            user_id=candidate_id,
            notification_type="interview",
            title=title,
            message=message
        )


# GET ALL RECRUITER INTERVIEWS

@router.get("")
def get_recruiter_interviews(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    check_recruiter(current_user)

    interviews = (
        db.query(Interview)
        .filter(Interview.recruiter_id == current_user.id)
        .order_by(Interview.scheduled_at.asc(), Interview.id.asc())
        .all()
    )

    results = []

    for interview in interviews:
        application = (
            db.query(Application)
            .filter(Application.id == interview.application_id)
            .first()
        )

        candidate = None

        if application:
            candidate = (
                db.query(User)
                .filter(User.id == application.candidate_id)
                .first()
            )

        results.append(
            serialize_interview(interview, application, candidate)
        )

    return {
        "success": True,
        "total_interviews": len(results),
        "interviews": results
    }


# SCHEDULE INTERVIEW

@router.post("")
def schedule_interview(
    data: InterviewCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    check_recruiter(current_user)

    application = (
        db.query(Application)
        .filter(Application.id == data.application_id)
        .first()
    )

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    job = (
        db.query(Job)
        .filter(
            Job.id == application.job_id,
            Job.recruiter_id == current_user.id
        )
        .first()
    )

    if not job:
        raise HTTPException(
            status_code=403,
            detail="You cannot schedule an interview for this application"
        )

    existing = (
        db.query(Interview)
        .filter(
            Interview.application_id == data.application_id,
            Interview.recruiter_id == current_user.id,
            Interview.status.in_(["scheduled", "rescheduled"])
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="An active interview already exists for this application"
        )

    interview = Interview(
        application_id=application.id,
        recruiter_id=current_user.id,
        scheduled_at=data.scheduled_at,
        interview_type=data.interview_type,
        meeting_link=data.meeting_link,
        interviewer_name=data.interviewer_name,
        status="scheduled",
        notes=data.notes
    )

    db.add(interview)
    application.status = "interview_scheduled"

    db.commit()
    db.refresh(interview)

    candidate = (
        db.query(User)
        .filter(User.id == application.candidate_id)
        .first()
    )

    interview_time = interview.scheduled_at.strftime(
        "%d %b %Y at %I:%M %p"
    )

    notify_candidate(
        db,
        application.candidate_id,
        "Interview Scheduled",
        (
            f"Your {interview.interview_type} interview has been "
            f"scheduled for {interview_time}. "
            f"Interviewer: {interview.interviewer_name or 'Recruitment Team'}. "
            f"Meeting link: {interview.meeting_link or 'Check your interview details.'}"
        )
    )

    return {
        "success": True,
        "message": "Interview scheduled successfully",
        "interview": serialize_interview(
            interview, application, candidate
        )
    }


# RESCHEDULE INTERVIEW

@router.patch("/{interview_id}/reschedule")
def reschedule_interview(
    interview_id: int,
    data: InterviewReschedule,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    check_recruiter(current_user)

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
            status_code=404,
            detail="Interview not found"
        )

    interview.scheduled_at = data.scheduled_at
    interview.status = "rescheduled"

    db.commit()
    db.refresh(interview)

    application = (
        db.query(Application)
        .filter(Application.id == interview.application_id)
        .first()
    )

    candidate = None

    if application:
        candidate = (
            db.query(User)
            .filter(User.id == application.candidate_id)
            .first()
        )

        interview_time = interview.scheduled_at.strftime(
            "%d %b %Y at %I:%M %p"
        )

        notify_candidate(
            db,
            application.candidate_id,
            "Interview Rescheduled",
            f"Your interview has been rescheduled to {interview_time}."
        )

    return {
        "success": True,
        "message": "Interview rescheduled successfully",
        "interview": serialize_interview(
            interview, application, candidate
        )
    }


# UPDATE INTERVIEW

@router.patch("/{interview_id}")
def update_interview(
    interview_id: int,
    data: InterviewUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    check_recruiter(current_user)

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
            status_code=404,
            detail="Interview not found"
        )

    if data.status is not None:
        interview.status = data.status

    if data.notes is not None:
        interview.notes = data.notes

    if data.meeting_link is not None:
        interview.meeting_link = data.meeting_link

    if data.interviewer_name is not None:
        interview.interviewer_name = data.interviewer_name

    db.commit()
    db.refresh(interview)

    return {
        "success": True,
        "message": "Interview updated successfully",
        "interview": serialize_interview(interview)
    }


# INTERVIEW FEEDBACK

@router.patch("/{interview_id}/feedback")
def add_interview_feedback(
    interview_id: int,
    notes: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    check_recruiter(current_user)

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
            status_code=404,
            detail="Interview not found"
        )

    interview.notes = notes

    if interview.status == "scheduled":
        interview.status = "completed"

    db.commit()
    db.refresh(interview)

    return {
        "success": True,
        "message": "Interview feedback saved successfully",
        "interview": serialize_interview(interview)
    }


# GET SINGLE INTERVIEW

@router.get("/{interview_id}")
def get_interview(
    interview_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    check_recruiter(current_user)

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
            status_code=404,
            detail="Interview not found"
        )

    application = (
        db.query(Application)
        .filter(Application.id == interview.application_id)
        .first()
    )

    candidate = None

    if application:
        candidate = (
            db.query(User)
            .filter(User.id == application.candidate_id)
            .first()
        )

    return {
        "success": True,
        "interview": serialize_interview(
            interview, application, candidate
        )
    }
