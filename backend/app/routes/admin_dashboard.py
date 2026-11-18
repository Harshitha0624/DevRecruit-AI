from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.auth.dependencies import get_current_user


router = APIRouter(
    prefix="/api/admin",
    tags=["Admin"]
)


# =======================================================
# ADMIN ACCESS
# =======================================================

def check_admin(current_user):
    role = str(
        getattr(current_user, "role", "")
    ).lower()

    if role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )


# =======================================================
# ADMIN DASHBOARD
# =======================================================

@router.get("/dashboard")
def admin_dashboard(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    check_admin(current_user)

    # ===================================================
    # USERS
    # ===================================================

    users_total = db.execute(
        text("SELECT COUNT(*) FROM users")
    ).scalar() or 0

    candidates = db.execute(
        text(
            "SELECT COUNT(*) FROM users "
            "WHERE LOWER(role) = 'candidate'"
        )
    ).scalar() or 0

    recruiters = db.execute(
        text(
            "SELECT COUNT(*) FROM users "
            "WHERE LOWER(role) = 'recruiter'"
        )
    ).scalar() or 0

    admins = db.execute(
        text(
            "SELECT COUNT(*) FROM users "
            "WHERE LOWER(role) = 'admin'"
        )
    ).scalar() or 0

    # ===================================================
    # COMPANIES
    # ===================================================

    companies = db.execute(
        text("SELECT COUNT(*) FROM company_profiles")
    ).scalar() or 0

    # ===================================================
    # JOBS
    # ===================================================

    total_jobs = db.execute(
        text("SELECT COUNT(*) FROM jobs")
    ).scalar() or 0

    active_jobs = db.execute(
        text(
            """
            SELECT COUNT(*)
            FROM jobs
            WHERE LOWER(status) IN ('active', 'open')
            """
        )
    ).scalar() or 0

    # ===================================================
    # APPLICATIONS
    # ===================================================

    total_applications = db.execute(
        text("SELECT COUNT(*) FROM applications")
    ).scalar() or 0

    # ===================================================
    # INTERVIEWS
    # ===================================================

    total_interviews = db.execute(
        text("SELECT COUNT(*) FROM interviews")
    ).scalar() or 0

    # ===================================================
    # ASSESSMENTS
    # ===================================================

    total_assessments = db.execute(
        text("SELECT COUNT(*) FROM assessments")
    ).scalar() or 0

    # ===================================================
    # LEARNING RESOURCES
    # ===================================================

    learning_resources = db.execute(
        text(
            """
            SELECT COUNT(*)
            FROM learning_resources
            WHERE is_active = TRUE
            """
        )
    ).scalar() or 0

    # ===================================================
    # NOTIFICATIONS
    # ===================================================

    notifications = db.execute(
        text("SELECT COUNT(*) FROM notifications")
    ).scalar() or 0

    # ===================================================
    # APPLICATION STATUS
    # ===================================================

    status_rows = db.execute(
        text(
            """
            SELECT
                status,
                COUNT(*) AS count
            FROM applications
            GROUP BY status
            ORDER BY count DESC
            """
        )
    ).mappings().all()

    application_status = [
        {
            "status": row["status"],
            "count": row["count"]
        }
        for row in status_rows
    ]

    # ===================================================
    # JOB STATUS
    # ===================================================

    job_status_rows = db.execute(
        text(
            """
            SELECT
                status,
                COUNT(*) AS count
            FROM jobs
            GROUP BY status
            ORDER BY count DESC
            """
        )
    ).mappings().all()

    job_status = [
        {
            "status": row["status"],
            "count": row["count"]
        }
        for row in job_status_rows
    ]

    # ===================================================
    # RESPONSE
    # ===================================================

    return {
        "success": True,

        "admin": {
            "id": current_user.id,
            "name": current_user.full_name,
            "email": current_user.email
        },

        "users": {
            "total": users_total,
            "candidates": candidates,
            "recruiters": recruiters,
            "admins": admins
        },

        "companies": {
            "total": companies
        },

        "jobs": {
            "total": total_jobs,
            "active": active_jobs
        },

        "applications": {
            "total": total_applications,
            "by_status": application_status
        },

        "interviews": {
            "total": total_interviews
        },

        "assessments": {
            "total": total_assessments
        },

        "learning_resources": {
            "total": learning_resources
        },

        "notifications": {
            "total": notifications
        },

        "job_status": job_status
    }