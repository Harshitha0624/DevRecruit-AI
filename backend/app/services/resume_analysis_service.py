from pathlib import Path
import sys


PROJECT_ROOT = Path(__file__).resolve().parents[3]

RESUME_PARSER_DIR = (
    PROJECT_ROOT
    / "ai-engine"
    / "resume-parser"
)


if str(RESUME_PARSER_DIR) not in sys.path:
    sys.path.insert(0, str(RESUME_PARSER_DIR))


from resume_parser import parse_resume


def analyze_resume(file_path: str) -> dict:
    """
    Run the AI resume parser on a stored resume file.
    """

    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(
            f"Resume file not found: {file_path}"
        )

    return parse_resume(str(path))