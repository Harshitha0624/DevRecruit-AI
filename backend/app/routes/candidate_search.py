from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.auth.dependencies import get_current_user

from app.models.user import User
from app.models.candidate_profile import CandidateProfile
from app.models.application import Application
from app.models.coding_submission import CodingSubmission
from app.models.assessment_attempt import AssessmentAttempt


router = APIRouter(
    prefix="/api/candidate-search",
    tags=["Candidate Search"]
)


def safe_number(value, default=0.0):
    try:
        return float(value)
    except (TypeError, ValueError):
        return float(default)


def calculate_candidate_metrics(
    candidate_id: int,
    profile,
    db
):
    # ---------------------------------------------------
    # SKILLS
    # ---------------------------------------------------

    skills = profile.skills or []

    if isinstance(skills, str):
        skills = [
            skill.strip()
            for skill in skills.split(",")
            if skill.strip()
        ]

    # ---------------------------------------------------
    # RESUME / ATS SCORE
    # ---------------------------------------------------

    applications = (
        db.query(Application)
        .filter(
            Application.candidate_id == candidate_id
        )
        .all()
    )

    resume_scores = [
        safe_number(application.ats_score)
        for application in applications
        if application.ats_score is not None
    ]

    resume_score = (
        sum(resume_scores) / len(resume_scores)
        if resume_scores
        else 0.0
    )

    # ---------------------------------------------------
    # CODING SCORE
    # ---------------------------------------------------

    submissions = (
        db.query(CodingSubmission)
        .filter(
            CodingSubmission.candidate_id == candidate_id
        )
        .all()
    )

    coding_scores = [
        safe_number(submission.score)
        for submission in submissions
        if submission.score is not None
    ]

    coding_score = (
        sum(coding_scores) / len(coding_scores)
        if coding_scores
        else 0.0
    )

    # ---------------------------------------------------
    # ASSESSMENT SCORE
    # ---------------------------------------------------

    attempts = (
        db.query(AssessmentAttempt)
        .filter(
            AssessmentAttempt.candidate_id == candidate_id
        )
        .all()
    )

    assessment_scores = []

    for attempt in attempts:

        score = (
            attempt.percentage
            if attempt.percentage is not None
            else attempt.score
        )

        if score is not None:
            assessment_scores.append(
                safe_number(score)
            )

    assessment_score = (
        sum(assessment_scores) /
        len(assessment_scores)
        if assessment_scores
        else 0.0
    )

    # ---------------------------------------------------
    # SKILL SCORE
    # ---------------------------------------------------

    skill_score = min(
        100.0,
        len(skills) * 10.0
    )

    # ---------------------------------------------------
    # EXPERIENCE SCORE
    # ---------------------------------------------------

    experience_years = safe_number(
        profile.experience_years
    )

    experience_score = min(
        100.0,
        experience_years * 20.0
    )

    # ---------------------------------------------------
    # AI SCORE
    # ---------------------------------------------------
    #
    # Resume      = 20%
    # Coding      = 25%
    # Assessment  = 20%
    # Skills      = 20%
    # Experience  = 10%
    #
    # Certification data is not present in the current
    # database, so it is not included here.
    #

    ai_score = round(
        (
            resume_score * 0.20
            + coding_score * 0.25
            + assessment_score * 0.20
            + skill_score * 0.20
            + experience_score * 0.10
        ),
        2
    )

    return {
        "resume_score": round(resume_score, 2),
        "coding_score": round(coding_score, 2),
        "assessment_score": round(assessment_score, 2),
        "skill_score": round(skill_score, 2),
        "experience_score": round(experience_score, 2),
        "ai_score": ai_score
    }


@router.get("")
def search_candidates(
    skills: Optional[str] = Query(
        default=None,
        description="Comma-separated skills, e.g. Python,FastAPI"
    ),
    min_experience: Optional[float] = Query(
        default=None
    ),
    max_experience: Optional[float] = Query(
        default=None
    ),
    min_resume_score: Optional[float] = Query(
        default=None
    ),
    min_ai_score: Optional[float] = Query(
        default=None
    ),
    min_coding_score: Optional[float] = Query(
        default=None
    ),
    college: Optional[str] = Query(
        default=None
    ),
    min_cgpa: Optional[float] = Query(
        default=None
    ),
    max_cgpa: Optional[float] = Query(
        default=None
    ),
    location: Optional[str] = Query(
        default=None
    ),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # ---------------------------------------------------
    # RECRUITER ACCESS
    # ---------------------------------------------------

    if str(current_user.role).lower() != "recruiter":
        raise HTTPException(
            status_code=403,
            detail="Recruiter access required"
        )

    # ---------------------------------------------------
    # GET CANDIDATES
    # ---------------------------------------------------

    profiles = (
        db.query(CandidateProfile)
        .join(
            User,
            User.id == CandidateProfile.user_id
        )
        .filter(
            User.role == "candidate"
        )
        .all()
    )

    # ---------------------------------------------------
    # NORMALIZE SKILL FILTER
    # ---------------------------------------------------

    requested_skills = []

    if skills:
        requested_skills = [
            skill.strip().lower()
            for skill in skills.split(",")
            if skill.strip()
        ]

    results = []

    for profile in profiles:

        user = (
            db.query(User)
            .filter(
                User.id == profile.user_id
            )
            .first()
        )

        if not user:
            continue

        candidate_skills = profile.skills or []

        if isinstance(candidate_skills, str):
            candidate_skills = [
                skill.strip()
                for skill in candidate_skills.split(",")
                if skill.strip()
            ]

        normalized_candidate_skills = [
            str(skill).strip().lower()
            for skill in candidate_skills
        ]

        # ------------------------------------------------
        # SKILL FILTER
        # ------------------------------------------------

        if requested_skills:

            has_required_skills = all(
                skill in normalized_candidate_skills
                for skill in requested_skills
            )

            if not has_required_skills:
                continue

        # ------------------------------------------------
        # EXPERIENCE FILTER
        # ------------------------------------------------

        experience = safe_number(
            profile.experience_years
        )

        if (
            min_experience is not None
            and experience < min_experience
        ):
            continue

        if (
            max_experience is not None
            and experience > max_experience
        ):
            continue

        # ------------------------------------------------
        # COLLEGE FILTER
        # ------------------------------------------------

        candidate_college = (
            profile.college or ""
        )

        if (
            college
            and college.lower()
            not in candidate_college.lower()
        ):
            continue

        # ------------------------------------------------
        # CGPA FILTER
        # ------------------------------------------------

        cgpa = (
            safe_number(profile.cgpa)
            if profile.cgpa is not None
            else None
        )

        if (
            min_cgpa is not None
            and (cgpa is None or cgpa < min_cgpa)
        ):
            continue

        if (
            max_cgpa is not None
            and (cgpa is None or cgpa > max_cgpa)
        ):
            continue

        # ------------------------------------------------
        # LOCATION FILTER
        # ------------------------------------------------

        candidate_location = (
            profile.location or ""
        )

        if (
            location
            and location.lower()
            not in candidate_location.lower()
        ):
            continue

        # ------------------------------------------------
        # CALCULATE AI METRICS
        # ------------------------------------------------

        metrics = calculate_candidate_metrics(
            profile.user_id,
            profile,
            db
        )

        # ------------------------------------------------
        # SCORE FILTERS
        # ------------------------------------------------

        if (
            min_resume_score is not None
            and metrics["resume_score"] < min_resume_score
        ):
            continue

        if (
            min_ai_score is not None
            and metrics["ai_score"] < min_ai_score
        ):
            continue

        if (
            min_coding_score is not None
            and metrics["coding_score"] < min_coding_score
        ):
            continue

        # ------------------------------------------------
        # RESULT
        # ------------------------------------------------

        results.append({
            "candidate_id": profile.user_id,
            "name": user.full_name,
            "email": user.email,
            "headline": profile.headline,
            "skills": candidate_skills,
            "experience_years": experience,
            "education": profile.education,
            "college": profile.college,
            "cgpa": cgpa,
            "location": profile.location,
            "github_url": profile.github_url,
            "linkedin_url": profile.linkedin_url,
            **metrics
        })

    # ---------------------------------------------------
    # SORT BY AI SCORE
    # ---------------------------------------------------

    results.sort(
        key=lambda candidate: candidate["ai_score"],
        reverse=True
    )

    return {
        "success": True,
        "total_candidates": len(results),
        "filters": {
            "skills": requested_skills,
            "min_experience": min_experience,
            "max_experience": max_experience,
            "min_resume_score": min_resume_score,
            "min_ai_score": min_ai_score,
            "min_coding_score": min_coding_score,
            "college": college,
            "min_cgpa": min_cgpa,
            "max_cgpa": max_cgpa,
            "location": location
        },
        "candidates": results
    }