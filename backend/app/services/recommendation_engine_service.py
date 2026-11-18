from pathlib import Path
import sys


PROJECT_ROOT = Path(__file__).resolve().parents[3]

RECOMMENDATION_DIR = (
    PROJECT_ROOT
    / "ai-engine"
    / "recommendation-engine"
)

if str(RECOMMENDATION_DIR) not in sys.path:
    sys.path.insert(0, str(RECOMMENDATION_DIR))


from recommendation_engine import generate_recommendations


def generate_platform_recommendations(
    candidates=None,
    jobs=None,
    top_candidates=5,
    top_jobs=5
):
    return generate_recommendations(
        candidates=candidates,
        jobs=jobs,
        top_candidates=top_candidates,
        top_jobs=top_jobs
    )