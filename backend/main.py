
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.auth.router import router as auth_router

from app.routes.candidate_profile import router as candidate_profile_router
from app.routes.file import router as file_router
from app.routes.company_profile import router as company_profile_router
from app.routes.job import router as job_router
from app.routes.application import router as application_router
from app.routes.pipeline import router as pipeline_router
from app.routes.interview import router as interview_router

from app.routes.assessment import router as assessment_router
from app.routes.assessment_question import router as assessment_question_router
from app.routes.assessment_attempt import router as assessment_attempt_router

from app.routes.coding_test import router as coding_test_router
from app.routes.coding_question import router as coding_question_router
from app.routes.coding_submission import router as coding_submission_router
from app.routes.external_jobs import router as external_jobs_router
from app.routes.coding_question_generator import (
    router as coding_question_generator_router
)

from app.routes.ranking import router as ranking_router
from app.routes.job_recommendation import router as job_recommendation_router
from app.routes.skill_gap import router as skill_gap_router
from app.routes.career_prediction import router as career_prediction_router
from app.routes.learning_recommendation import router as learning_recommendation_router
from app.routes.interview_feedback import router as interview_feedback_router
from app.routes.chatbot import router as chatbot_router
from app.routes.recommendation_engine import router as recommendation_engine_router
from app.routes.evaluation import router as evaluation_router

from app.routes.blockchain_certificate import (
    router as blockchain_certificate_router
)
from app.routes.recruiter_verification import (
    router as recruiter_verification_router
)
from app.routes.skill_badge import router as skill_badge_router
from app.routes.global_benchmark import router as global_benchmark_router
from app.routes.candidate_comparison import router as candidate_comparison_router
from app.routes.skill_graph import router as skill_graph_router
from app.routes.notification import router as notification_router

from app.routes.candidate_dashboard import (
    router as candidate_dashboard_router
)
from app.routes.recruiter_dashboard import (
    router as recruiter_dashboard_router
)
from app.routes.candidate_search import router as candidate_search_router
from app.routes.recruiter_candidate_profile import (
    router as recruiter_candidate_profile_router
)
from app.routes.recruiter_interviews import (
    router as recruiter_interviews_router
)
from app.routes.hiring_analytics import router as hiring_analytics_router
from app.routes.reports import router as reports_router
from app.routes.learning_hub import router as learning_hub_router

# =======================================================
# ADMIN ROUTERS
# =======================================================

from app.routes.admin_dashboard import (
    router as admin_dashboard_router
)
from app.routes.admin_users import (
    router as admin_users_router
)
from app.routes.admin_organizations import (
    router as admin_organizations_router
)
from app.routes.admin_jobs_applications import (
    router as admin_jobs_applications_router
)
from app.routes.admin_resources import (
    router as admin_resources_router
)


# =======================================================
# FASTAPI APPLICATION
# =======================================================

app = FastAPI(
    title="AI Developer Recruitment Platform",
    description="Enterprise AI-powered developer recruitment platform API",
    version="1.0.0"
)


# =======================================================
# CORS
# =======================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "http://127.0.0.1:5501",
        "http://localhost:5501",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =======================================================
# API ROUTERS
# =======================================================

# Authentication
app.include_router(auth_router)

# Candidate and recruitment
app.include_router(candidate_profile_router)
app.include_router(file_router)
app.include_router(company_profile_router)
app.include_router(job_router)
app.include_router(application_router)
app.include_router(pipeline_router)
app.include_router(interview_router)

# Assessments
app.include_router(assessment_router)
app.include_router(assessment_question_router)
app.include_router(assessment_attempt_router)

# Coding platform
app.include_router(coding_test_router)
app.include_router(coding_question_router)
app.include_router(coding_submission_router)
app.include_router(coding_question_generator_router)

# AI engines
app.include_router(ranking_router)
app.include_router(job_recommendation_router)
app.include_router(skill_gap_router)
app.include_router(career_prediction_router)
app.include_router(learning_recommendation_router)
app.include_router(interview_feedback_router)
app.include_router(chatbot_router)
app.include_router(recommendation_engine_router)
app.include_router(evaluation_router)

# Blockchain
app.include_router(blockchain_certificate_router)
app.include_router(recruiter_verification_router)
app.include_router(skill_badge_router)

# Candidate intelligence and notifications
app.include_router(global_benchmark_router)
app.include_router(candidate_comparison_router)
app.include_router(skill_graph_router)
app.include_router(notification_router)

# Dashboards and recruiter tools
app.include_router(candidate_dashboard_router)
app.include_router(recruiter_dashboard_router)
app.include_router(candidate_search_router)
app.include_router(recruiter_candidate_profile_router)
app.include_router(recruiter_interviews_router)
app.include_router(hiring_analytics_router)
app.include_router(reports_router)

# Learning Hub
app.include_router(learning_hub_router)

# Admin modules
app.include_router(admin_dashboard_router)
app.include_router(admin_users_router)
app.include_router(admin_organizations_router)
app.include_router(admin_jobs_applications_router)
app.include_router(admin_resources_router)

app.include_router(external_jobs_router)
# =======================================================
# ROOT ENDPOINT
# =======================================================

@app.get("/")
def root():
    return {
        "status": "success",
        "message": "AI Developer Recruitment Platform API is running"
    }


# =======================================================
# HEALTH CHECK
# =======================================================

@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }
