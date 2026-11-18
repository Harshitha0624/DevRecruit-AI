from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.config.database import Base


class LearningProgress(Base):
    __tablename__ = "learning_progress"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    candidate_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    item_title = Column(
        String(255),
        nullable=False
    )

    item_type = Column(
        String(50),
        nullable=False,
        default="course"
    )

    progress_percent = Column(
        Float,
        nullable=False,
        default=0.0
    )

    status = Column(
        String(50),
        nullable=False,
        default="not_started"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )