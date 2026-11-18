from collections import Counter
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.auth.dependencies import get_current_user

from app.models.user import User
from app.models.job import Job
from app.models.application import Application
from app.models.interview import Interview
from app.models.candidate_profile import CandidateProfile


router = APIRouter(
    prefix="/api/hiring-analytics",
    tags=["Hiring Analytics"]
)


def check_recruiter(current_user):
    if str(current_user.role).lower() != "recruiter":
        raise HTTPException(
            status_code=403,
            detail="Recruiter access required"
        )


@router.get("")
def hiring_analytics(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    check_recruiter(current_user)

    recruiter_id = current_user.id

    # ---------------------------------------------------
    # RECRUITER JOBS
    # ---------------------------------------------------

    jobs = (
        db.query(Job)
        .filter(Job.recruiter_id == recruiter_id)
        .all()
    )

    job_ids = [job.id for job in jobs]

    # ---------------------------------------------------
    # APPLICATIONS
    # ---------------------------------------------------

    applications = []

    if job_ids:
        applications = (
            db.query(Application)
            .filter(Application.job_id.in_(job_ids))
            .order_by(Application.applied_at.desc())
            .all()
        )

    # ---------------------------------------------------
    # INTERVIEWS
    # ---------------------------------------------------

    interviews = (
        db.query(Interview)
        .filter(
            Interview.recruiter_id == recruiter_id
        )
        .all()
    )

    # ---------------------------------------------------
    # RECRUITMENT FUNNEL
    # ---------------------------------------------------

    funnel = {
        "applications": len(applications),
        "under_review": 0,
        "assessment_pending": 0,
        "assessment_completed": 0,
        "interviews": 0,
        "offers": 0,
        "rejected": 0
    }

    for application in applications:

        status = str(
            application.status or ""
        ).lower().replace(" ", "_")

        if status == "under_review":
            funnel["under_review"] += 1

        elif status in [
            "assessment_pending",
            "pending"
        ]:
            funnel["assessment_pending"] += 1

        elif status == "assessment_completed":
            funnel["assessment_completed"] += 1

        elif status in [
            "interview",
            "interview_scheduled"
        ]:
            funnel["interviews"] += 1

        elif status in [
            "offer",
            "offered",
            "offer_received"
        ]:
            funnel["offers"] += 1

        elif status == "rejected":
            funnel["rejected"] += 1

    # ---------------------------------------------------
    # SKILL DISTRIBUTION
    # ---------------------------------------------------

    skill_counter = Counter()

    candidate_ids = list(
        {
            application.candidate_id
            for application in applications
        }
    )

    profiles = []

    if candidate_ids:
        profiles = (
            db.query(CandidateProfile)
            .filter(
                CandidateProfile.user_id.in_(candidate_ids)
            )
            .all()
        )

    for profile in profiles:

        skills = profile.skills or []

        if isinstance(skills, str):
            skills = [
                skill.strip()
                for skill in skills.split(",")
                if skill.strip()
            ]

        for skill in skills:
            skill_counter[str(skill)] += 1

    skill_distribution = [
        {
            "skill": skill,
            "candidate_count": count
        }
        for skill, count in skill_counter.most_common()
    ]

    # ---------------------------------------------------
    # TOP CANDIDATES
    # ---------------------------------------------------

    top_candidates = []

    sorted_applications = sorted(
        applications,
        key=lambda application: (
            application.ats_score
            if application.ats_score is not None
            else 0
        ),
        reverse=True
    )

    for application in sorted_applications[:10]:

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

        top_candidates.append({
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
            "resume_score": application.ats_score or 0.0,
            "application_status": application.status
        })

    # ---------------------------------------------------
    # JOB PERFORMANCE
    # ---------------------------------------------------

    job_performance = []

    for job in jobs:

        job_applications = [
            application
            for application in applications
            if application.job_id == job.id
        ]

        job_interviews = [
            interview
            for interview in interviews
            if any(
                application.id == interview.application_id
                for application in job_applications
            )
        ]

        job_performance.append({
            "job_id": job.id,
            "title": job.title,
            "status": job.status,
            "openings": job.openings,
            "applications": len(job_applications),
            "interviews": len(job_interviews),
            "offers": sum(
                1
                for application in job_applications
                if str(
                    application.status or ""
                ).lower() in [
                    "offer",
                    "offered",
                    "offer_received"
                ]
            )
        })

    # ---------------------------------------------------
    # INTERVIEW ANALYTICS
    # ---------------------------------------------------

    interview_stats = {
        "total": len(interviews),
        "scheduled": sum(
            1
            for interview in interviews
            if interview.status == "scheduled"
        ),
        "completed": sum(
            1
            for interview in interviews
            if interview.status == "completed"
        ),
        "cancelled": sum(
            1
            for interview in interviews
            if interview.status == "cancelled"
        )
    }

    # ---------------------------------------------------
    # AVERAGE APPLICATION TO INTERVIEW TIME
    # ---------------------------------------------------

    durations = []

    for interview in interviews:

        application = (
            db.query(Application)
            .filter(
                Application.id == interview.application_id
            )
            .first()
        )

        if not application or not application.applied_at:
            continue

        if not interview.scheduled_at:
            continue

        applied_at = application.applied_at
        scheduled_at = interview.scheduled_at

        if applied_at.tzinfo is None:
            applied_at = applied_at.replace(
                tzinfo=timezone.utc
            )

        if scheduled_at.tzinfo is None:
            scheduled_at = scheduled_at.replace(
                tzinfo=timezone.utc
            )

        days = (
            scheduled_at - applied_at
        ).total_seconds() / 86400

        if days >= 0:
            durations.append(days)

    average_application_to_interview_days = (
        round(
            sum(durations) / len(durations),
            2
        )
        if durations
        else 0.0
    )

    # ---------------------------------------------------
    # SUMMARY
    # ---------------------------------------------------

    return {
        "success": True,

        "summary": {
            "total_jobs": len(jobs),
            "active_jobs": sum(
                1
                for job in jobs
                if job.is_active
                and job.status == "published"
            ),
            "total_applications": len(applications),
            "total_interviews": len(interviews),
            "total_candidates": len(candidate_ids)
        },

        "skill_distribution": skill_distribution,

        "top_candidates": top_candidates,

        "recruitment_funnel": funnel,

        "interview_analytics": interview_stats,

        "hiring_time": {
            "average_application_to_interview_days":
                average_application_to_interview_days
        },

        "job_performance": job_performance
    }