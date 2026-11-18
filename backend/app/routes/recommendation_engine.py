from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from app.auth.dependencies import require_role
from app.models.user import User

from app.services.recommendation_engine_service import (
    generate_platform_recommendations
)


router = APIRouter(
    prefix="/api/recommendation-engine",
    tags=["Recommendation Engine"]
)


class RecommendationRequest(BaseModel):
    candidates: list[dict] | None = None
    jobs: list[dict] | None = None
    top_candidates: int = Field(default=5, ge=1, le=20)
    top_jobs: int = Field(default=5, ge=1, le=20)


@router.post("")
def generate_recommendation_results(
    data: RecommendationRequest,
    current_user: User = Depends(
        require_role("recruiter")
    )
):
    return generate_platform_recommendations(
        candidates=data.candidates,
        jobs=data.jobs,
        top_candidates=data.top_candidates,
        top_jobs=data.top_jobs
    )