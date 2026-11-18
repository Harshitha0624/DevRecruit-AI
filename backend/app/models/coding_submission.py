from sqlalchemy import Column, Integer, Text, Float, String, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func

from app.config.database import Base


class CodingSubmission(Base):
    __tablename__ = "coding_submissions"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    coding_test_id = Column(
        Integer,
        ForeignKey("coding_tests.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    question_id = Column(
        Integer,
        ForeignKey("coding_questions.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    candidate_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    source_code = Column(
        Text,
        nullable=False
    )

    language = Column(
        String(50),
        nullable=False,
        default="Python"
    )

    score = Column(
        Float,
        nullable=True
    )

    max_score = Column(
        Float,
        nullable=True
    )

    test_results = Column(
        JSON,
        nullable=True
    )

    status = Column(
        String(50),
        nullable=False,
        default="submitted"
    )

    submitted_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )