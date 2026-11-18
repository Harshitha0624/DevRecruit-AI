from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.auth.dependencies import get_current_user

from app.models.user import User
from app.models.job import Job
from app.models.application import Application
from app.models.interview import Interview


router = APIRouter(
    prefix="/api/recruiter-dashboard",
    tags=["Recruiter Dashboard"]
)


@router.get("")
def recruiter_dashboard(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # ---------------------------------------------------
    # RECRUITER ACCESS CHECK
    # ---------------------------------------------------

    role = str(
        getattr(current_user, "role", "")
    ).lower()

    if role != "recruiter":
        raise HTTPException(
            status_code=403,
            detail="Recruiter access required"
        )

    recruiter_id = current_user.id

    # ---------------------------------------------------
    # JOBS
    # ---------------------------------------------------

    jobs = (
        db.query(Job)
        .filter(
            Job.recruiter_id == recruiter_id
        )
        .order_by(
            Job.created_at.desc(),
            Job.id.desc()
        )
        .all()
    )

    total_jobs = len(jobs)

    active_jobs = sum(
        1
        for job in jobs
        if job.is_active and job.status == "published"
    )

    draft_jobs = sum(
        1
        for job in jobs
        if job.status == "draft"
    )

    closed_jobs = sum(
        1
        for job in jobs
        if job.status == "closed"
    )

    paused_jobs = sum(
        1
        for job in jobs
        if job.status == "paused"
    )

    # ---------------------------------------------------
    # APPLICATIONS
    # ---------------------------------------------------

    job_ids = [
        job.id
        for job in jobs
    ]

    applications = []

    if job_ids:
        applications = (
            db.query(Application)
            .filter(
                Application.job_id.in_(job_ids)
            )
            .order_by(
                Application.applied_at.desc(),
                Application.id.desc()
            )
            .all()
        )

    total_applications = len(applications)

    applied_count = 0
    under_review_count = 0
    assessment_pending_count = 0
    assessment_completed_count = 0
    interview_count = 0
    offer_count = 0
    rejected_count = 0

    for application in applications:

        status = str(
            getattr(
                application,
                "status",
                ""
            )
        ).lower().replace(" ", "_")

        if status == "applied":
            applied_count += 1

        elif status in [
            "under_review",
            "review"
        ]:
            under_review_count += 1

        elif status in [
            "assessment_pending",
            "pending"
        ]:
            assessment_pending_count += 1

        elif status == "assessment_completed":
            assessment_completed_count += 1

        elif status in [
            "interview",
            "interview_scheduled"
        ]:
            interview_count += 1

        elif status in [
            "offer",
            "offered",
            "offer_received"
        ]:
            offer_count += 1

        elif status == "rejected":
            rejected_count += 1

    # ---------------------------------------------------
    # INTERVIEWS
    # ---------------------------------------------------

    interviews = (
        db.query(Interview)
        .filter(
            Interview.recruiter_id == recruiter_id
        )
        .order_by(
            Interview.scheduled_at.asc(),
            Interview.id.asc()
        )
        .all()
    )

    total_interviews = len(interviews)

    scheduled_interviews = sum(
        1
        for interview in interviews
        if interview.status == "scheduled"
    )

    completed_interviews = sum(
        1
        for interview in interviews
        if interview.status == "completed"
    )

    cancelled_interviews = sum(
        1
        for interview in interviews
        if interview.status == "cancelled"
    )

    # ---------------------------------------------------
    # APPLICATIONS PER JOB
    # ---------------------------------------------------

    job_analytics = []

    for job in jobs:

        job_application_count = sum(
            1
            for application in applications
            if application.job_id == job.id
        )

        job_analytics.append({
            "job_id": job.id,
            "title": job.title,
            "status": job.status,
            "is_active": job.is_active,
            "openings": job.openings,
            "applications": job_application_count
        })

    # ---------------------------------------------------
    # HIRING FUNNEL
    # ---------------------------------------------------

    hiring_funnel = {
        "applications": total_applications,
        "under_review": under_review_count,
        "assessment_pending": assessment_pending_count,
        "assessment_completed": assessment_completed_count,
        "interviews": interview_count,
        "offers": offer_count,
        "rejected": rejected_count
    }

    # ---------------------------------------------------
    # RECENT APPLICATIONS
    # ---------------------------------------------------

    recent_applications = []

    for application in applications[:10]:

        candidate = (
            db.query(User)
            .filter(
                User.id == application.candidate_id
            )
            .first()
        )

        job = (
            db.query(Job)
            .filter(
                Job.id == application.job_id
            )
            .first()
        )

        recent_applications.append({
            "application_id": application.id,
            "candidate_id": application.candidate_id,
            "candidate_name": (
                candidate.full_name
                if candidate
                else "Unknown"
            ),
            "job_id": application.job_id,
            "job_title": (
                job.title
                if job
                else "Unknown"
            ),
            "status": application.status,
            "ats_score": application.ats_score,
            "applied_at": application.applied_at
        })

    # ---------------------------------------------------
    # UPCOMING INTERVIEWS
    # ---------------------------------------------------

    upcoming_interviews = []

    for interview in interviews:

        if interview.status != "scheduled":
            continue

        application = (
            db.query(Application)
            .filter(
                Application.id == interview.application_id
            )
            .first()
        )

        candidate = None

        if application:
            candidate = (
                db.query(User)
                .filter(
                    User.id == application.candidate_id
                )
                .first()
            )

        upcoming_interviews.append({
            "interview_id": interview.id,
            "application_id": interview.application_id,
            "candidate_name": (
                candidate.full_name
                if candidate
                else "Unknown"
            ),
            "scheduled_at": interview.scheduled_at,
            "interview_type": interview.interview_type,
            "meeting_link": interview.meeting_link,
            "status": interview.status
        })

    # ---------------------------------------------------
    # DASHBOARD RESPONSE
    # ---------------------------------------------------

    return {
        "success": True,

        "recruiter": {
            "id": recruiter_id,
            "name": current_user.full_name,
            "email": current_user.email
        },

        "summary": {
            "total_jobs": total_jobs,
            "active_jobs": active_jobs,
            "draft_jobs": draft_jobs,
            "paused_jobs": paused_jobs,
            "closed_jobs": closed_jobs,
            "total_applications": total_applications,
            "total_interviews": total_interviews
        },

        "jobs": job_analytics,

        "applications": {
            "total": total_applications,
            "applied": applied_count,
            "under_review": under_review_count,
            "assessment_pending": assessment_pending_count,
            "assessment_completed": assessment_completed_count,
            "interview_scheduled": interview_count,
            "offer_received": offer_count,
            "rejected": rejected_count
        },

        "interviews": {
            "total": total_interviews,
            "scheduled": scheduled_interviews,
            "completed": completed_interviews,
            "cancelled": cancelled_interviews
        },

        "hiring_analytics": {
            "hiring_funnel": hiring_funnel,
            "job_performance": job_analytics
        },

        "recent_applications": recent_applications,

        "upcoming_interviews": upcoming_interviews
    }