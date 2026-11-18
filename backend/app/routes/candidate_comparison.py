from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.config.database import get_db

from app.services.candidate_comparison_service import (
    compare_candidates,
)


router = APIRouter(
    prefix="/api/candidates",
    tags=["Candidate Comparison"],
)


class CandidateComparisonRequest(BaseModel):
    candidate_ids: list[int] = Field(
        min_length=2,
        max_length=10
    )


@router.post("/compare")
def compare_candidate_profiles(
    data: CandidateComparisonRequest,
    db=Depends(get_db),
):
    try:
        return compare_candidates(
            candidate_ids=data.candidate_ids,
            db=db,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc)
        )