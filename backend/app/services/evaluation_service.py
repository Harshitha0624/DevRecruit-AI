from pathlib import Path
import sys


PROJECT_ROOT = Path(__file__).resolve().parents[3]

EVALUATION_DIR = (
    PROJECT_ROOT
    / "ai-engine"
    / "evaluation-engine"
)

if str(EVALUATION_DIR) not in sys.path:
    sys.path.insert(0, str(EVALUATION_DIR))


from evaluator import evaluate_candidate


def evaluate_platform_candidate(
    resume_score=0,
    coding_score=0,
    assessment_score=0,
    skill_match_score=0,
    interview_score=0
):
    return evaluate_candidate(
        resume_score=resume_score,
        coding_score=coding_score,
        assessment_score=assessment_score,
        skill_match_score=skill_match_score,
        interview_score=interview_score
    )