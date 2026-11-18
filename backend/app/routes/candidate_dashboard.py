from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.auth.dependencies import get_current_user

from app.models.candidate_profile import CandidateProfile
from app.models.application import Application
from app.models.notification import Notification
from app.models.coding_submission import CodingSubmission
from app.models.assessment_attempt import AssessmentAttempt
from app.models.assessment import Assessment
from app.models.job import Job
from app.models.learning_progress import LearningProgress

from app.services.job_recommendation_service import (
    get_job_recommendations
)

from app.services.learning_recommendation_service import (
    get_learning_recommendations
)

from app.services.learning_progress_service import (
    get_candidate_learning_progress,
    calculate_learning_summary
)


router = APIRouter(
    prefix="/api/candidate-dashboard",
    tags=["Candidate Dashboard"]
)


def safe_number(value, default=0.0):
    try:
        return float(value)
    except (TypeError, ValueError):
        return float(default)


@router.get("")
def candidate_dashboard(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    candidate_id = current_user.id

    # ---------------------------------------------------
    # CANDIDATE PROFILE
    # ---------------------------------------------------

    profile = (
        db.query(CandidateProfile)
        .filter(
            CandidateProfile.user_id == candidate_id
        )
        .first()
    )

    skills = []

    if profile and profile.skills:
        skills = profile.skills

        if isinstance(skills, str):
            skills = [
                skill.strip()
                for skill in skills.split(",")
                if skill.strip()
            ]

    experience_years = safe_number(
        getattr(
            profile,
            "experience_years",
            0
        )
        if profile
        else 0
    )

    # ---------------------------------------------------
    # APPLICATIONS
    # ---------------------------------------------------

    applications = (
        db.query(Application)
        .filter(
            Application.candidate_id == candidate_id
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

    resume_scores = []

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
            "interview_scheduled",
            "interview"
        ]:
            interview_count += 1

        elif status in [
            "offer_received",
            "offered",
            "offer"
        ]:
            offer_count += 1

        elif status == "rejected":
            rejected_count += 1

        ats_value = getattr(
            application,
            "ats_score",
            None
        )

        if ats_value is not None:
            resume_scores.append(
                safe_number(ats_value)
            )

    resume_score = (
        round(
            sum(resume_scores) /
            len(resume_scores),
            2
        )
        if resume_scores
        else 0.0
    )

    # ---------------------------------------------------
    # CODING SCORE
    # ---------------------------------------------------

    coding_submissions = (
        db.query(CodingSubmission)
        .filter(
            CodingSubmission.candidate_id == candidate_id
        )
        .all()
    )

    coding_scores = [
        safe_number(
            getattr(
                submission,
                "score",
                0
            )
        )
        for submission in coding_submissions
        if getattr(
            submission,
            "score",
            None
        ) is not None
    ]

    coding_score = (
        round(
            sum(coding_scores) /
            len(coding_scores),
            2
        )
        if coding_scores
        else 0.0
    )

    # ---------------------------------------------------
    # ASSESSMENT SCORE
    # ---------------------------------------------------

    assessment_attempts = (
        db.query(AssessmentAttempt)
        .filter(
            AssessmentAttempt.candidate_id == candidate_id
        )
        .all()
    )

    assessment_scores = []

    for attempt in assessment_attempts:

        percentage = getattr(
            attempt,
            "percentage",
            None
        )

        if percentage is None:
            percentage = getattr(
                attempt,
                "score",
                None
            )

        if percentage is not None:
            assessment_scores.append(
                safe_number(percentage)
            )

    assessment_score = (
        round(
            sum(assessment_scores) /
            len(assessment_scores),
            2
        )
        if assessment_scores
        else 0.0
    )

    # ---------------------------------------------------
    # SKILL COMPLETION
    # ---------------------------------------------------

    skill_completion = min(
        100.0,
        round(
            len(skills) * 15.0,
            2
        )
    )

    # ---------------------------------------------------
    # AI CAREER SCORE
    # ---------------------------------------------------

    career_score = round(
        (
            resume_score * 0.30
            + coding_score * 0.25
            + assessment_score * 0.25
            + skill_completion * 0.20
        ),
        2
    )

    # ---------------------------------------------------
    # AI RECOMMENDED JOBS
    # ---------------------------------------------------

    recommended_jobs = get_job_recommendations(
        candidate_id,
        db
    )

    # ---------------------------------------------------
    # LEARNING RECOMMENDATIONS
    # ---------------------------------------------------

    latest_job = None

    if applications:

        latest_application = sorted(
            applications,
            key=lambda x: x.id,
            reverse=True
        )[0]

        latest_job = (
            db.query(Job)
            .filter(
                Job.id == latest_application.job_id
            )
            .first()
        )

    learning_data = {
        "status": "no_job",
        "course_recommendations": [],
        "learning_roadmap": []
    }

    if latest_job:

        learning_data = get_learning_recommendations(
            candidate_id,
            latest_job,
            db
        )

    # ---------------------------------------------------
    # UPCOMING / PENDING ASSESSMENTS
    # ---------------------------------------------------

    applied_job_ids = [
        application.job_id
        for application in applications
        if getattr(
            application,
            "job_id",
            None
        ) is not None
    ]

    upcoming_assessments = []

    if applied_job_ids:

        assessments = (
            db.query(Assessment)
            .filter(
                Assessment.job_id.in_(applied_job_ids),
                Assessment.is_active == True
            )
            .order_by(
                Assessment.created_at.desc(),
                Assessment.id.desc()
            )
            .all()
        )

        for assessment in assessments:

            attempt = (
                db.query(AssessmentAttempt)
                .filter(
                    AssessmentAttempt.assessment_id
                    == assessment.id,
                    AssessmentAttempt.candidate_id
                    == candidate_id
                )
                .order_by(
                    AssessmentAttempt.id.desc()
                )
                .first()
            )

            if (
                attempt is None
                or attempt.status != "submitted"
            ):

                upcoming_assessments.append({
                    "assessment_id": assessment.id,
                    "job_id": assessment.job_id,
                    "title": assessment.title,
                    "description": assessment.description,
                    "duration_minutes": assessment.duration_minutes,
                    "passing_score": assessment.passing_score,
                    "status": (
                        attempt.status
                        if attempt
                        else "not_started"
                    ),
                    "created_at": assessment.created_at
                })

    # ---------------------------------------------------
    # ACTUAL LEARNING PROGRESS
    # ---------------------------------------------------

    learning_progress_records = (
        get_candidate_learning_progress(
            db,
            candidate_id
        )
    )

    learning_summary = calculate_learning_summary(
        learning_progress_records
    )

    learning_items = []

    for item in learning_progress_records:

        learning_items.append({
            "id": item.id,
            "title": item.item_title,
            "type": item.item_type,
            "progress_percent": item.progress_percent,
            "status": item.status,
            "updated_at": item.updated_at
        })

    # ---------------------------------------------------
    # NOTIFICATIONS
    # ---------------------------------------------------

    unread_notifications = (
        db.query(Notification)
        .filter(
            Notification.user_id == candidate_id,
            Notification.is_read == False
        )
        .count()
    )

    recent_notifications = (
        db.query(Notification)
        .filter(
            Notification.user_id == candidate_id
        )
        .order_by(
            Notification.created_at.desc(),
            Notification.id.desc()
        )
        .limit(5)
        .all()
    )

    notification_data = []

    for notification in recent_notifications:

        notification_data.append({
            "id": notification.id,
            "type": notification.notification_type,
            "title": notification.title,
            "message": notification.message,
            "is_read": notification.is_read,
            "created_at": notification.created_at
        })

    # ---------------------------------------------------
    # APPLICATION OVERVIEW
    # ---------------------------------------------------

    application_overview = {
        "total": total_applications,
        "applied": applied_count,
        "under_review": under_review_count,
        "assessment_pending": assessment_pending_count,
        "assessment_completed": assessment_completed_count,
        "interview_scheduled": interview_count,
        "offer_received": offer_count,
        "rejected": rejected_count
    }

    # ---------------------------------------------------
    # DASHBOARD RESPONSE
    # ---------------------------------------------------

    return {
        "success": True,

        "candidate": {
            "id": candidate_id,
            "name": current_user.full_name,
            "email": current_user.email
        },

        "career": {
            "ai_career_score": career_score,
            "resume_score": resume_score,
            "coding_score": coding_score,
            "assessment_score": assessment_score,
            "skill_completion_percent": skill_completion
        },

        "profile": {
            "skills": skills,
            "skill_count": len(skills),
            "experience_years": experience_years
        },

        "applications": application_overview,

        "assessments": {
            "completed": len(assessment_attempts),
            "average_score": assessment_score,
            "upcoming": upcoming_assessments,
            "upcoming_count": len(upcoming_assessments)
        },

        "learning_progress": {
            "status": learning_data.get(
                "status",
                "no_job"
            ),
            "completion_percent": learning_summary[
                "completion_percent"
            ],
            "completed_courses": learning_summary[
                "completed_courses"
            ],
            "in_progress_courses": learning_summary[
                "in_progress_courses"
            ],
            "not_started_courses": learning_summary[
                "not_started_courses"
            ],
            "course_recommendations": learning_data.get(
                "course_recommendations",
                []
            ),
            "learning_roadmap": learning_data.get(
                "learning_roadmap",
                []
            ),
            "progress_items": learning_items
        },

        "recommended_jobs": recommended_jobs,

        "notifications": {
            "unread_count": unread_notifications,
            "recent": notification_data
        }
    }