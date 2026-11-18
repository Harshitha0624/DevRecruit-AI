
from sqlalchemy import (
    Column, Integer, String, Text, Boolean,
    DateTime, ForeignKey, UniqueConstraint
)
from sqlalchemy.sql import func

from app.config.database import Base


class LearningModule(Base):
    __tablename__ = "learning_modules"

    id = Column(Integer, primary_key=True, index=True)
    resource_id = Column(
        Integer,
        ForeignKey("learning_resources.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    sort_order = Column(Integer, nullable=False, default=1)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class LearningLesson(Base):
    __tablename__ = "learning_lessons"

    id = Column(Integer, primary_key=True, index=True)
    module_id = Column(
        Integer,
        ForeignKey("learning_modules.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    title = Column(String(255), nullable=False)
    content_type = Column(String(30), nullable=False, default="text")
    content = Column(Text, nullable=True)
    resource_url = Column(String(1000), nullable=True)
    duration_minutes = Column(Integer, nullable=True)
    sort_order = Column(Integer, nullable=False, default=1)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class LearningLessonCompletion(Base):
    __tablename__ = "learning_lesson_completions"

    __table_args__ = (
        UniqueConstraint(
            "candidate_id",
            "lesson_id",
            name="uq_candidate_lesson_completion"
        ),
    )

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    lesson_id = Column(
        Integer,
        ForeignKey("learning_lessons.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    completed_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
