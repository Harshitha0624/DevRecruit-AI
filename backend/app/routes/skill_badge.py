from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.services.skill_badge_service import (
    issue_badge,
    verify_badge,
    get_badge,
)


router = APIRouter(
    prefix="/api/blockchain/badges",
    tags=["Blockchain Skill Badges"],
)


class BadgeIssueRequest(BaseModel):
    badge_id: int = Field(ge=1)
    candidate_id: int = Field(ge=1)
    skill: str = Field(min_length=1, max_length=100)
    score: float = Field(ge=0, le=100)


class BadgeVerifyRequest(BaseModel):
    badge_id: int = Field(ge=1)
    candidate_id: int = Field(ge=1)
    skill: str = Field(min_length=1, max_length=100)
    score: float = Field(ge=0, le=100)


@router.post("/issue")
def issue_skill_badge(
    data: BadgeIssueRequest,
):
    return issue_badge(
        badge_id=data.badge_id,
        candidate_id=data.candidate_id,
        skill=data.skill,
        score=data.score,
    )


@router.post("/verify")
def verify_skill_badge(
    data: BadgeVerifyRequest,
):
    return verify_badge(
        badge_id=data.badge_id,
        candidate_id=data.candidate_id,
        skill=data.skill,
        score=data.score,
    )


@router.get("/{badge_id}")
def get_skill_badge(
    badge_id: int,
):
    return get_badge(badge_id)