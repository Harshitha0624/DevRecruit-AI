from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func

from app.config.database import Base


class CandidateProfile(Base):
    __tablename__ = "candidate_profiles"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True
    )

    headline = Column(String(255), nullable=True)

    bio = Column(Text, nullable=True)

    skills = Column(JSON, nullable=True)

    experience_years = Column(Integer, nullable=True)

    education = Column(Text, nullable=True)

    github_url = Column(String(500), nullable=True)

    linkedin_url = Column(String(500), nullable=True)

    resume_url = Column(String(500), nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )