from fastapi import APIRouter, Depends, HTTPException

from app.config.database import get_db

from app.services.skill_graph_service import (
    get_skill_graph,
)


router = APIRouter(
    prefix="/api/skill-graph",
    tags=["AI Skill Graph"],
)


@router.get("/{candidate_id}")
def candidate_skill_graph(
    candidate_id: int,
    db=Depends(get_db)
):

    try:
        return get_skill_graph(
            candidate_id,
            db
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc)
        )