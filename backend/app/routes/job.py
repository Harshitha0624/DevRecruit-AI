
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user, require_role
from app.config.database import get_db
from app.models.company_profile import CompanyProfile
from app.models.job import Job
from app.models.user import User
from app.schemas.job import JobCreate, JobUpdate, JobResponse


router = APIRouter(
    prefix="/api/jobs",
    tags=["Jobs"]
)


@router.post(
    "",
    response_model=JobResponse,
    status_code=status.HTTP_201_CREATED
)
def create_job(
    job_data: JobCreate,
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db)
):
    company = (
        db.query(CompanyProfile)
        .filter(
            CompanyProfile.id == job_data.company_id,
            CompanyProfile.recruiter_id == current_user.id
        )
        .first()
    )

    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company profile not found or does not belong to this recruiter"
        )

    if (
        job_data.experience_min is not None
        and job_data.experience_max is not None
        and job_data.experience_min > job_data.experience_max
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Minimum experience cannot be greater than maximum experience"
        )

    if (
        job_data.salary_min is not None
        and job_data.salary_max is not None
        and job_data.salary_min > job_data.salary_max
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Minimum salary cannot be greater than maximum salary"
        )

    job = Job(
        recruiter_id=current_user.id,
        company_id=job_data.company_id,
        title=job_data.title,
        description=job_data.description,
        required_skills=job_data.required_skills,
        preferred_skills=job_data.preferred_skills,
        experience_min=job_data.experience_min,
        experience_max=job_data.experience_max,
        education=job_data.education,
        location=job_data.location,
        employment_type=job_data.employment_type,
        salary_min=job_data.salary_min,
        salary_max=job_data.salary_max,
        openings=job_data.openings,
        status=job_data.status,
        is_active=job_data.is_active,
    )

    db.add(job)
    db.commit()
    db.refresh(job)

    return job


@router.get(
    "/my-jobs",
    response_model=list[JobResponse]
)
def get_my_jobs(
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db)
):
    jobs = (
        db.query(Job)
        .filter(Job.recruiter_id == current_user.id)
        .order_by(Job.created_at.desc())
        .all()
    )

    return jobs


# NEW: List all active, published jobs for the candidate jobs page
@router.get(
    "",
    response_model=list[JobResponse]
)
def get_published_jobs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    jobs = (
        db.query(Job)
        .filter(
            Job.is_active.is_(True),
            Job.status == "published"
        )
        .order_by(Job.created_at.desc())
        .all()
    )

    return jobs


@router.get(
    "/{job_id}",
    response_model=JobResponse
)
def get_job(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job = (
        db.query(Job)
        .filter(
            Job.id == job_id,
            Job.is_active.is_(True),
            Job.status == "published"
        )
        .first()
    )

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    return job


@router.put(
    "/{job_id}",
    response_model=JobResponse
)
def update_job(
    job_id: int,
    job_data: JobUpdate,
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db)
):
    job = (
        db.query(Job)
        .filter(
            Job.id == job_id,
            Job.recruiter_id == current_user.id
        )
        .first()
    )

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found or does not belong to this recruiter"
        )

    update_data = job_data.model_dump(exclude_unset=True)

    new_experience_min = update_data.get(
        "experience_min", job.experience_min
    )
    new_experience_max = update_data.get(
        "experience_max", job.experience_max
    )

    if (
        new_experience_min is not None
        and new_experience_max is not None
        and new_experience_min > new_experience_max
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Minimum experience cannot be greater than maximum experience"
        )

    new_salary_min = update_data.get(
        "salary_min", job.salary_min
    )
    new_salary_max = update_data.get(
        "salary_max", job.salary_max
    )

    if (
        new_salary_min is not None
        and new_salary_max is not None
        and new_salary_min > new_salary_max
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Minimum salary cannot be greater than maximum salary"
        )

    if "company_id" in update_data:
        company = (
            db.query(CompanyProfile)
            .filter(
                CompanyProfile.id == update_data["company_id"],
                CompanyProfile.recruiter_id == current_user.id
            )
            .first()
        )

        if not company:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Company profile not found or does not belong to this recruiter"
            )

    for field, value in update_data.items():
        setattr(job, field, value)

    db.commit()
    db.refresh(job)

    return job


@router.delete("/{job_id}")
def delete_job(
    job_id: int,
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db)
):
    job = (
        db.query(Job)
        .filter(
            Job.id == job_id,
            Job.recruiter_id == current_user.id
        )
        .first()
    )

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found or does not belong to this recruiter"
        )

    db.delete(job)
    db.commit()

    return {
        "message": "Job deleted successfully",
        "job_id": job_id
    }
