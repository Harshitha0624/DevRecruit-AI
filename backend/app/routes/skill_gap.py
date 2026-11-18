from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import require_role
from app.config.database import get_db
from app.models.job import Job
from app.models.user import User
from app.services.skill_gap_service import get_skill_gap


router = APIRouter(
    prefix="/api/skill-gap",
    tags=["Skill Gap Analysis"]
)


@router.get("/job/{job_id}")
def analyze_candidate_skill_gap(
    job_id: int,
    current_user: User = Depends(
        require_role("candidate")
    ),
    db: Session = Depends(get_db)
):
    job = (
        db.query(Job)
        .filter(
            Job.id == job_id,
            Job.is_active == True,
            Job.status == "published"
        )
        .first()
    )

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found or is not currently available"
        )

    return get_skill_gap(
        candidate_id=current_user.id,
        job=job,
        db=db
    )