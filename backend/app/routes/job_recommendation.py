from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import require_role
from app.config.database import get_db
from app.models.user import User
from app.services.job_recommendation_service import (
    get_job_recommendations,
)


router = APIRouter(
    prefix="/api/recommendations",
    tags=["Job Recommendations"]
)


@router.get("/jobs")
def recommend_jobs_for_candidate(
    current_user: User = Depends(
        require_role("candidate")
    ),
    db: Session = Depends(get_db),
):
    recommendations = get_job_recommendations(
        candidate_id=current_user.id,
        db=db,
    )

    return {
        "candidate_id": current_user.id,
        "total_recommendations": len(
            recommendations
        ),
        "recommendations": recommendations,
    }