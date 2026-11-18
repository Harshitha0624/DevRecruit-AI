from fastapi import APIRouter, Depends, HTTPException

from app.config.database import get_db

from app.services.global_benchmark_service import (
    get_candidate_benchmark,
    get_global_ranking,
    get_global_summary,
)


router = APIRouter(
    prefix="/api/benchmark",
    tags=["Global Candidate Benchmark"],
)


# ============================================================
# GLOBAL RANKING
# ============================================================

@router.get("/global")
def global_candidate_ranking(
    db=Depends(get_db)
):

    return {
        "success": True,
        "total_candidates": len(
            get_global_ranking(db)
        ),
        "candidates": get_global_ranking(db),
    }


# ============================================================
# CANDIDATE BENCHMARK
# ============================================================

@router.get("/global/{candidate_id}")
def candidate_global_benchmark(
    candidate_id: int,
    db=Depends(get_db)
):

    try:

        return {
            "success": True,
            "benchmark": get_candidate_benchmark(
                candidate_id,
                db
            ),
        }

    except ValueError as exc:

        raise HTTPException(
            status_code=404,
            detail=str(exc)
        )


# ============================================================
# SUMMARY
# ============================================================

@router.get("/summary")
def benchmark_summary(
    db=Depends(get_db)
):

    return {
        "success": True,
        **get_global_summary(db),
    }