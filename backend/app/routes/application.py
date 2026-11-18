from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user, require_role
from app.config.database import get_db

from app.models.application import Application
from app.models.file import File
from app.models.job import Job
from app.models.user import User

from app.schemas.application import (
    ApplicationCreate,
    ApplicationResponse,
    ApplicationStatusUpdate,
    RecruiterApplicationUpdate,
)

from app.services.resume_analysis_service import analyze_resume
from app.services.ats_service import calculate_ats_score


router = APIRouter(
    prefix="/api/applications",
    tags=["Applications / ATS"]
)


# ============================================================
# CANDIDATE: APPLY FOR A JOB
# ============================================================

@router.post(
    "",
    response_model=ApplicationResponse,
    status_code=status.HTTP_201_CREATED
)
def apply_for_job(
    application_data: ApplicationCreate,
    current_user: User = Depends(require_role("candidate")),
    db: Session = Depends(get_db)
):
    # --------------------------------------------------------
    # Validate job
    # --------------------------------------------------------

    job = (
        db.query(Job)
        .filter(
            Job.id == application_data.job_id,
            Job.is_active == True,
            Job.status == "published"
        )
        .first()
    )

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                "Job not found or is not currently "
                "accepting applications"
            )
        )


    # --------------------------------------------------------
    # Prevent duplicate application
    # --------------------------------------------------------

    existing_application = (
        db.query(Application)
        .filter(
            Application.candidate_id == current_user.id,
            Application.job_id == application_data.job_id
        )
        .first()
    )

    if existing_application:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You have already applied for this job"
        )


    # --------------------------------------------------------
    # Validate resume ownership
    # --------------------------------------------------------

    resume = None

    if application_data.resume_file_id is not None:

        resume = (
            db.query(File)
            .filter(
                File.id == application_data.resume_file_id,
                File.user_id == current_user.id,
                File.category == "resume"
            )
            .first()
        )

        if not resume:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=(
                    "Resume file not found or does not "
                    "belong to you"
                )
            )


    # --------------------------------------------------------
    # ATS ANALYSIS
    # --------------------------------------------------------

    ats_score = None

    if resume:

        try:
            # Parse the candidate's resume
            resume_analysis = analyze_resume(
                resume.file_path
            )

            # Compare parsed resume with this job
            ats_result = calculate_ats_score(
                resume_analysis=resume_analysis,
                job=job
            )

            ats_score = ats_result.get(
                "ats_score"
            )

            print(
                f"ATS score calculated successfully: "
                f"candidate={current_user.id}, "
                f"job={job.id}, "
                f"score={ats_score}"
            )

        except Exception as exc:

            print(
                f"ATS scoring failed for candidate "
                f"{current_user.id}, job {job.id}: {exc}"
            )

            # Application is still allowed even when
            # ATS analysis fails.
            ats_score = None


    # --------------------------------------------------------
    # Create application
    # --------------------------------------------------------

    application = Application(
        candidate_id=current_user.id,
        job_id=application_data.job_id,
        resume_file_id=application_data.resume_file_id,
        cover_letter=application_data.cover_letter,
        status="applied",
        ats_score=ats_score,
    )

    db.add(application)
    db.commit()
    db.refresh(application)

    return application


# ============================================================
# CANDIDATE: VIEW MY APPLICATIONS
# ============================================================

@router.get(
    "/my-applications",
    response_model=list[ApplicationResponse]
)
def get_my_applications(
    current_user: User = Depends(require_role("candidate")),
    db: Session = Depends(get_db)
):
    applications = (
        db.query(Application)
        .filter(
            Application.candidate_id == current_user.id
        )
        .order_by(
            Application.applied_at.desc()
        )
        .all()
    )

    return applications


# ============================================================
# CANDIDATE / RECRUITER: VIEW SINGLE APPLICATION
# ============================================================

@router.get(
    "/{application_id}",
    response_model=ApplicationResponse
)
def get_application(
    application_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    application = (
        db.query(Application)
        .filter(
            Application.id == application_id
        )
        .first()
    )

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )


    # --------------------------------------------------------
    # Candidate ownership
    # --------------------------------------------------------

    if (
        current_user.role == "candidate"
        and application.candidate_id != current_user.id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "You do not have permission to "
                "view this application"
            )
        )


    # --------------------------------------------------------
    # Recruiter ownership through job
    # --------------------------------------------------------

    if current_user.role == "recruiter":

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
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    "You do not have permission to "
                    "view this application"
                )
            )

    return application


# ============================================================
# RECRUITER: VIEW APPLICATIONS FOR THEIR JOBS
# ============================================================

@router.get(
    "/recruiter/all",
    response_model=list[ApplicationResponse]
)
def get_recruiter_applications(
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db)
):
    applications = (
        db.query(Application)
        .join(
            Job,
            Application.job_id == Job.id
        )
        .filter(
            Job.recruiter_id == current_user.id
        )
        .order_by(
            Application.applied_at.desc()
        )
        .all()
    )

    return applications


# ============================================================
# CANDIDATE: UPDATE APPLICATION STATUS
# ============================================================

@router.put(
    "/{application_id}/candidate-status",
    response_model=ApplicationResponse
)
def update_candidate_application_status(
    application_id: int,
    status_data: ApplicationStatusUpdate,
    current_user: User = Depends(require_role("candidate")),
    db: Session = Depends(get_db)
):
    application = (
        db.query(Application)
        .filter(
            Application.id == application_id,
            Application.candidate_id == current_user.id
        )
        .first()
    )

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )


    allowed_statuses = {
        "applied",
        "withdrawn"
    }

    new_status = status_data.status.lower()

    if new_status not in allowed_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Candidate can only change application "
                "status to 'applied' or 'withdrawn'"
            )
        )

    application.status = new_status

    db.commit()
    db.refresh(application)

    return application


# ============================================================
# RECRUITER: UPDATE APPLICATION
# ============================================================

@router.put(
    "/{application_id}/recruiter-update",
    response_model=ApplicationResponse
)
def update_recruiter_application(
    application_id: int,
    update_data: RecruiterApplicationUpdate,
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db)
):
    application = (
        db.query(Application)
        .join(
            Job,
            Application.job_id == Job.id
        )
        .filter(
            Application.id == application_id,
            Job.recruiter_id == current_user.id
        )
        .first()
    )

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                "Application not found or does not "
                "belong to your jobs"
            )
        )


    allowed_statuses = {
        "applied",
        "under_review",
        "shortlisted",
        "interview",
        "assessment",
        "selected",
        "rejected",
        "withdrawn"
    }


    # --------------------------------------------------------
    # Update status
    # --------------------------------------------------------

    if update_data.status is not None:

        new_status = update_data.status.lower()

        if new_status not in allowed_statuses:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Invalid application status. Allowed "
                    "values: "
                    + ", ".join(
                        sorted(allowed_statuses)
                    )
                )
            )

        application.status = new_status


    # --------------------------------------------------------
    # Update recruiter notes
    # --------------------------------------------------------

    if update_data.recruiter_notes is not None:

        application.recruiter_notes = (
            update_data.recruiter_notes
        )


    db.commit()
    db.refresh(application)

    return application