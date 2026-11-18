from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import require_role
from app.config.database import get_db
from app.models.job import Job
from app.models.user import User
from app.services.ranking_service import get_candidate_ranking


router = APIRouter(
    prefix="/api/rankings",
    tags=["Candidate Ranking"]
)


@router.get(
    "/job/{job_id}"
)
def rank_job_candidates(
    job_id: int,
    current_user: User = Depends(
        require_role("recruiter")
    ),
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
            detail=(
                "Job not found or does not belong "
                "to this recruiter"
            )
        )

    ranked_candidates = get_candidate_ranking(
        job=job,
        db=db
    )

    return {
        "job_id": job.id,
        "job_title": job.title,
        "total_candidates": len(
            ranked_candidates
        ),
        "candidates": ranked_candidates,
    }