from pathlib import Path
import sys


PROJECT_ROOT = Path(__file__).resolve().parents[3]

ATS_DIR = (
    PROJECT_ROOT
    / "ai-engine"
    / "ats-scoring"
)

if str(ATS_DIR) not in sys.path:
    sys.path.insert(0, str(ATS_DIR))


from ats_score import score_resume_against_job


def calculate_ats_score(
    resume_analysis: dict,
    job
) -> dict:
    """
    Calculate ATS score by comparing the parsed
    resume against the selected job.
    """

    job_data = {
        "required_skills": job.required_skills or [],
        "preferred_skills": job.preferred_skills or [],
        "experience_min": job.experience_min or 0,
        "education": job.education,
    }

    return score_resume_against_job(
        resume_analysis=resume_analysis,
        job=job_data,
    )