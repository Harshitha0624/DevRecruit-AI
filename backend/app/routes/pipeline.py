from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import require_role
from app.config.database import get_db
from app.models.application import Application
from app.models.application_stage_history import ApplicationStageHistory
from app.models.job import Job
from app.models.user import User
from app.schemas.pipeline import (
    PipelineStageUpdate,
    PipelineStageResponse,
)


router = APIRouter(
    prefix="/api/pipeline",
    tags=["Recruitment Pipeline"]
)


ALLOWED_STAGES = {
    "applied",
    "under_review",
    "shortlisted",
    "interview",
    "assessment",
    "selected",
    "rejected",
    "withdrawn",
}


@router.get(
    "/application/{application_id}/history",
    response_model=list[PipelineStageResponse]
)
def get_application_stage_history(
    application_id: int,
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db)
):
    application = (
        db.query(Application)
        .join(Job, Application.job_id == Job.id)
        .filter(
            Application.id == application_id,
            Job.recruiter_id == current_user.id
        )
        .first()
    )

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found or does not belong to your jobs"
        )

    history = (
        db.query(ApplicationStageHistory)
        .filter(
            ApplicationStageHistory.application_id == application_id
        )
        .order_by(ApplicationStageHistory.changed_at.asc())
        .all()
    )

    return history


@router.post(
    "/application/{application_id}/stage",
    response_model=PipelineStageResponse,
    status_code=status.HTTP_201_CREATED
)
def update_application_stage(
    application_id: int,
    stage_data: PipelineStageUpdate,
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db)
):
    application = (
        db.query(Application)
        .join(Job, Application.job_id == Job.id)
        .filter(
            Application.id == application_id,
            Job.recruiter_id == current_user.id
        )
        .first()
    )

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found or does not belong to your jobs"
        )

    new_stage = stage_data.stage.lower()

    if new_stage not in ALLOWED_STAGES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Invalid stage. Allowed values: "
                + ", ".join(sorted(ALLOWED_STAGES))
            )
        )

    application.status = new_stage

    history_entry = ApplicationStageHistory(
        application_id=application.id,
        stage=new_stage,
        changed_by=current_user.id,
        notes=stage_data.notes,
    )

    db.add(history_entry)
    db.commit()
    db.refresh(history_entry)

    return history_entry