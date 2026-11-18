from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.auth.dependencies import get_current_user

from app.models.user import User
from app.models.candidate_profile import CandidateProfile
from app.models.file import File
from app.models.application import Application
from app.models.coding_submission import CodingSubmission


router = APIRouter(
    prefix="/api/recruiter/candidates",
    tags=["Recruiter Candidate Profile"]
)


@router.get("/{candidate_id}")
def get_candidate_profile(
    candidate_id: int,
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
    # USER
    # ---------------------------------------------------

    candidate = (
        db.query(User)
        .filter(
            User.id == candidate_id,
            User.role == "candidate"
        )
        .first()
    )

    if not candidate:
        raise HTTPException(
            status_code=404,
            detail="Candidate not found"
        )

    # ---------------------------------------------------
    # CANDIDATE PROFILE
    # ---------------------------------------------------

    profile = (
        db.query(CandidateProfile)
        .filter(
            CandidateProfile.user_id == candidate_id
        )
        .first()
    )

    # ---------------------------------------------------
    # RESUME
    # ---------------------------------------------------

    resume = (
        db.query(File)
        .filter(
            File.user_id == candidate_id,
            File.category == "resume"
        )
        .order_by(
            File.created_at.desc(),
            File.id.desc()
        )
        .first()
    )

    # ---------------------------------------------------
    # APPLICATIONS
    # ---------------------------------------------------

    applications = (
        db.query(Application)
        .filter(
            Application.candidate_id == candidate_id
        )
        .order_by(
            Application.applied_at.desc(),
            Application.id.desc()
        )
        .all()
    )

    # ---------------------------------------------------
    # RESUME / ATS SCORE
    # ---------------------------------------------------

    ats_scores = [
        float(application.ats_score)
        for application in applications
        if application.ats_score is not None
    ]

    resume_score = (
        round(
            sum(ats_scores) / len(ats_scores),
            2
        )
        if ats_scores
        else 0.0
    )

    # ---------------------------------------------------
    # CODING SCORE
    # ---------------------------------------------------

    coding_submissions = (
        db.query(CodingSubmission)
        .filter(
            CodingSubmission.candidate_id == candidate_id
        )
        .order_by(
            CodingSubmission.id.desc()
        )
        .all()
    )

    coding_scores = [
        float(submission.score)
        for submission in coding_submissions
        if submission.score is not None
    ]

    coding_score = (
        round(
            sum(coding_scores) / len(coding_scores),
            2
        )
        if coding_scores
        else 0.0
    )

    # ---------------------------------------------------
    # SKILLS
    # ---------------------------------------------------

    skills = []

    if profile and profile.skills:
        skills = profile.skills

        if isinstance(skills, str):
            skills = [
                skill.strip()
                for skill in skills.split(",")
                if skill.strip()
            ]

    # ---------------------------------------------------
    # APPLICATION DATA
    # ---------------------------------------------------

    application_data = []

    for application in applications:

        application_data.append({
            "application_id": application.id,
            "job_id": application.job_id,
            "status": application.status,
            "ats_score": application.ats_score,
            "applied_at": application.applied_at,
            "updated_at": application.updated_at
        })

    # ---------------------------------------------------
    # RESPONSE
    # ---------------------------------------------------

    return {
        "success": True,

        "candidate": {
            "id": candidate.id,
            "name": candidate.full_name,
            "email": candidate.email
        },

        "profile": {
            "headline": (
                profile.headline
                if profile
                else None
            ),
            "bio": (
                profile.bio
                if profile
                else None
            ),
            "skills": skills,
            "experience_years": (
                profile.experience_years
                if profile
                else 0
            ),
            "education": (
                profile.education
                if profile
                else None
            ),
            "college": (
                profile.college
                if profile
                else None
            ),
            "cgpa": (
                profile.cgpa
                if profile
                else None
            ),
            "location": (
                profile.location
                if profile
                else None
            ),
            "github_url": (
                profile.github_url
                if profile
                else None
            ),
            "linkedin_url": (
                profile.linkedin_url
                if profile
                else None
            )
        },

        "resume": {
            "file_id": resume.id if resume else None,
            "file_path": (
                resume.file_path
                if resume
                else None
            ),
            "uploaded_at": (
                resume.created_at
                if resume
                else None
            )
        },

        "ai_scores": {
            "resume_score": resume_score,
            "coding_score": coding_score
        },

        "applications": {
            "total": len(applications),
            "records": application_data
        },

        "coding": {
            "total_submissions": len(coding_submissions),
            "average_score": coding_score
        }
    }