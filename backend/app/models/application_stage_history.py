from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.config.database import Base


class ApplicationStageHistory(Base):
    __tablename__ = "application_stage_history"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    application_id = Column(
        Integer,
        ForeignKey("applications.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    stage = Column(
        String(50),
        nullable=False
    )

    changed_by = Column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )

    notes = Column(
        Text,
        nullable=True
    )

    changed_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )