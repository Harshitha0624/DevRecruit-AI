from pathlib import Path
import sys


PROJECT_ROOT = Path(__file__).resolve().parents[3]

JOB_MATCHING_DIR = (
    PROJECT_ROOT
    / "ai-engine"
    / "job-matching"
)

if str(JOB_MATCHING_DIR) not in sys.path:
    sys.path.insert(0, str(JOB_MATCHING_DIR))


from recommend_jobs import recommend_jobs

from app.models.file import File
from app.models.job import Job
from app.services.resume_analysis_service import analyze_resume


def get_job_recommendations(
    candidate_id: int,
    db,
) -> list[dict]:
    """
    Generate job recommendations for a candidate
    using the latest uploaded resume.
    """

    # ---------------------------------------------------
    # Get latest resume
    # ---------------------------------------------------

    resume = (
        db.query(File)
        .filter(
            File.user_id == candidate_id,
            File.category == "resume"
        )
        .order_by(File.created_at.desc())
        .first()
    )

    if not resume:
        return []


    # ---------------------------------------------------
    # Parse resume
    # ---------------------------------------------------

    resume_analysis = analyze_resume(
        resume.file_path
    )


    # ---------------------------------------------------
    # Get active published jobs
    # ---------------------------------------------------

    jobs = (
        db.query(Job)
        .filter(
            Job.is_active == True,
            Job.status == "published"
        )
        .order_by(Job.created_at.desc())
        .all()
    )


    # ---------------------------------------------------
    # Convert DB jobs to AI-engine format
    # ---------------------------------------------------

    job_data = []

    for job in jobs:

        job_data.append({
            "job_id": job.id,
            "title": job.title,
            "description": job.description or "",
            "required_skills": (
                job.required_skills or []
            ),
            "preferred_skills": (
                job.preferred_skills or []
            ),
        })


    # ---------------------------------------------------
    # Generate recommendations
    # ---------------------------------------------------

    recommendations = recommend_jobs(
        candidate={
            "candidate_id": candidate_id,
            "skills": resume_analysis.get(
                "skills",
                []
            ),
            "text": resume_analysis.get(
                "text",
                ""
            ),
        },
        jobs=job_data,
    )


    return recommendations