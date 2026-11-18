from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.config.database import Base


class AssessmentAttempt(Base):
    __tablename__ = "assessment_attempts"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    assessment_id = Column(
        Integer,
        ForeignKey("assessments.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    candidate_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    score = Column(
        Float,
        nullable=True
    )

    max_score = Column(
        Float,
        nullable=True
    )

    percentage = Column(
        Float,
        nullable=True
    )

    status = Column(
        String(50),
        nullable=False,
        default="in_progress"
    )

    started_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    submitted_at = Column(
        DateTime(timezone=True),
        nullable=True
    )