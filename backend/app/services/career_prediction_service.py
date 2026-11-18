from pathlib import Path
import sys


PROJECT_ROOT = Path(__file__).resolve().parents[3]

CAREER_DIR = (
    PROJECT_ROOT
    / "ai-engine"
    / "career-prediction"
)

if str(CAREER_DIR) not in sys.path:
    sys.path.insert(0, str(CAREER_DIR))


from career_prediction import predict_career

from app.models.file import File
from app.services.resume_analysis_service import analyze_resume


def get_career_prediction(
    candidate_id: int,
    db
) -> dict:
    """
    Predict suitable career paths using the
    candidate's latest uploaded resume.
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

    experience = resume_analysis.get(
        "experience",
        {}
    )

    result = predict_career(
        skills=resume_analysis.get(
            "skills",
            []
        ),
        experience_years=experience.get(
            "experience_years",
            0.0
        )
    )

    return {
        "status": "success",
        "candidate_id": candidate_id,
        "resume_file_id": resume.id,
        **result,
    }