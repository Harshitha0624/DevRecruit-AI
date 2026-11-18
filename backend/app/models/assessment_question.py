from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON, Boolean

from app.config.database import Base


class AssessmentQuestion(Base):
    __tablename__ = "assessment_questions"

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

    question_text = Column(
        Text,
        nullable=False
    )

    question_type = Column(
        String(50),
        nullable=False,
        default="mcq"
    )

    options = Column(
        JSON,
        nullable=True
    )

    correct_answer = Column(
        String(500),
        nullable=True
    )

    marks = Column(
        Integer,
        nullable=False,
        default=1
    )

    order_number = Column(
        Integer,
        nullable=False,
        default=1
    )

    is_active = Column(
        Boolean,
        nullable=False,
        default=True
    )