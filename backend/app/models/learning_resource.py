from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    Boolean
)
from sqlalchemy.sql import func

from app.config.database import Base


class LearningResource(Base):
    __tablename__ = "learning_resources"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    title = Column(
        String(255),
        nullable=False
    )

    description = Column(
        Text,
        nullable=True
    )

    category = Column(
        String(100),
        nullable=False
    )

    subcategory = Column(
        String(100),
        nullable=True
    )

    skill = Column(
        String(100),
        nullable=True
    )

    company = Column(
        String(100),
        nullable=True
    )

    level = Column(
        String(50),
        nullable=False,
        default="Beginner"
    )

    difficulty = Column(
        String(50),
        nullable=True
    )

    resource_type = Column(
        String(50),
        nullable=False,
        default="course"
    )

    platform = Column(
        String(100),
        nullable=True
    )

    access_type = Column(
        String(50),
        nullable=True
    )

    url = Column(
        String(1000),
        nullable=True
    )

    duration = Column(
        String(100),
        nullable=True
    )

    is_active = Column(
        Boolean,
        nullable=False,
        default=True
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