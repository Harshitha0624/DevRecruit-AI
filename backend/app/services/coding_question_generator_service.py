from pathlib import Path
import sys


PROJECT_ROOT = Path(__file__).resolve().parents[3]

GENERATOR_DIR = (
    PROJECT_ROOT
    / "ai-engine"
    / "coding-question-generator"
)

if str(GENERATOR_DIR) not in sys.path:
    sys.path.insert(0, str(GENERATOR_DIR))


from question_generator import generate_questions


def generate_coding_questions(
    skill="Python",
    difficulty="Medium",
    question_count=1,
    programming_language="Python",
    company=None
):
    return generate_questions(
        skill=skill,
        difficulty=difficulty,
        question_count=question_count,
        programming_language=programming_language,
        company=company
    )