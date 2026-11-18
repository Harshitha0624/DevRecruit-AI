from pathlib import Path
import sys


PROJECT_ROOT = Path(__file__).resolve().parents[3]

INTERVIEW_FEEDBACK_DIR = (
    PROJECT_ROOT / "ai-engine" / "interview-feedback"
)

if str(INTERVIEW_FEEDBACK_DIR) not in sys.path:
    sys.path.insert(0, str(INTERVIEW_FEEDBACK_DIR))


from feedback import generate_feedback


def generate_interview_feedback(
    technical_score: float,
    communication_score: float,
    problem_solving_score: float,
    behavioral_score: float,
    interviewer_comments: str = ""
):
    return generate_feedback(
        technical_score=technical_score,
        communication_score=communication_score,
        problem_solving_score=problem_solving_score,
        behavioral_score=behavioral_score,
        interviewer_comments=interviewer_comments
    )