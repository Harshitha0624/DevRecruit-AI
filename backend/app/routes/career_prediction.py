from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import require_role
from app.config.database import get_db
from app.models.user import User
from app.services.career_prediction_service import (
    get_career_prediction
)


router = APIRouter(
    prefix="/api/career",
    tags=["Career Prediction"]
)


@router.get("/prediction")
def career_prediction(
    current_user: User = Depends(
        require_role("candidate")
    ),
    db: Session = Depends(get_db)
):
    return get_career_prediction(
        candidate_id=current_user.id,
        db=db
    )