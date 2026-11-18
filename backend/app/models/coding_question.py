from sqlalchemy import Column, Integer, String, Text, ForeignKey, Boolean, JSON

from app.config.database import Base


class CodingQuestion(Base):
    __tablename__ = "coding_questions"

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

    title = Column(
        String(255),
        nullable=False
    )

    description = Column(
        Text,
        nullable=False
    )

    difficulty = Column(
        String(50),
        nullable=False,
        default="medium"
    )

    input_format = Column(
        Text,
        nullable=True
    )

    output_format = Column(
        Text,
        nullable=True
    )

    constraints = Column(
        Text,
        nullable=True
    )

    sample_input = Column(
        Text,
        nullable=True
    )

    sample_output = Column(
        Text,
        nullable=True
    )

    test_cases = Column(
        JSON,
        nullable=True
    )

    marks = Column(
        Integer,
        nullable=False,
        default=10
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