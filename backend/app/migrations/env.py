
from logging.config import fileConfig
import os

from sqlalchemy import engine_from_config, pool
from alembic import context
from dotenv import load_dotenv

from app.config.database import Base

# Existing application models
from app.models.user import User
from app.models.candidate_profile import CandidateProfile
from app.models.file import File
from app.models.company_profile import CompanyProfile
from app.models.job import Job
from app.models.application import Application
from app.models.pipeline import RecruitmentPipeline
from app.models.application_stage_history import ApplicationStageHistory
from app.models.interview import Interview
from app.models.assessment import Assessment
from app.models.assessment_question import AssessmentQuestion
from app.models.assessment_attempt import AssessmentAttempt
from app.models.coding_test import CodingTest
from app.models.coding_question import CodingQuestion
from app.models.coding_submission import CodingSubmission
from app.models.notification import Notification

# Existing Learning Hub models
from app.models.learning_progress import LearningProgress
from app.models.learning_resource import LearningResource

# New Learning Hub course and lesson models
from app.models.learning_course import (
    LearningModule,
    LearningLesson,
    LearningLessonCompletion
)

load_dotenv()

config = context.config

database_url = os.getenv("DATABASE_URL")

if database_url:
    config.set_main_option(
        "sqlalchemy.url",
        database_url.replace("%", "%%")
    )

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")

    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
