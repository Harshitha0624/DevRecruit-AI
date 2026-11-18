from pathlib import Path
import sys


PROJECT_ROOT = Path(__file__).resolve().parents[3]

SKILL_GAP_DIR = (
    PROJECT_ROOT
    / "ai-engine"
    / "skill-gap-analysis"
)

if str(SKILL_GAP_DIR) not in sys.path:
    sys.path.insert(0, str(SKILL_GAP_DIR))


from skill_gap import analyze_skill_gap

from app.models.file import File
from app.models.job import Job
from app.services.resume_analysis_service import analyze_resume


def get_skill_gap(
    candidate_id: int,
    job: Job,
    db
) -> dict:
    """
    Analyze the skill gap between a candidate's
    latest resume and a specific job.
    """

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
        return {
            "status": "no_resume",
            "message": "Candidate has not uploaded a resume."
        }

    resume_analysis = analyze_resume(
        resume.file_path
    )

    result = analyze_skill_gap(
        candidate_skills=resume_analysis.get(
            "skills",
            []
        ),
        required_skills=job.required_skills or [],
        preferred_skills=job.preferred_skills or [],
    )

    return {
        "status": "success",
        "candidate_id": candidate_id,
        "job_id": job.id,
        "job_title": job.title,
        "resume_file_id": resume.id,
        **result,
    }