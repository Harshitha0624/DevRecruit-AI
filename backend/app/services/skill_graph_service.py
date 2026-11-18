from pathlib import Path
import sys

from app.models.candidate_profile import CandidateProfile
from app.models.coding_submission import CodingSubmission
from app.models.assessment_attempt import AssessmentAttempt


# ============================================================
# LOAD AI ENGINE
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[3]

SKILL_GRAPH_DIR = (
    PROJECT_ROOT
    / "ai-engine"
    / "skill-graph"
)

if str(SKILL_GRAPH_DIR) not in sys.path:
    sys.path.insert(0, str(SKILL_GRAPH_DIR))

from skill_graph import (
    build_skill_graph,
    build_progress,
)


# ============================================================
# GET SKILL GRAPH
# ============================================================

def get_skill_graph(
    candidate_id: int,
    db
) -> dict:

    profile = (
        db.query(CandidateProfile)
        .filter(
            CandidateProfile.user_id
            == candidate_id
        )
        .first()
    )

    if not profile:
        raise ValueError(
            f"Candidate {candidate_id} not found"
        )

    coding_submissions = (
        db.query(CodingSubmission)
        .filter(
            CodingSubmission.candidate_id
            == candidate_id
        )
        .filter(
            CodingSubmission.score.isnot(None)
        )
        .order_by(
            CodingSubmission.id.asc()
        )
        .all()
    )

    assessment_attempts = (
        db.query(AssessmentAttempt)
        .filter(
            AssessmentAttempt.candidate_id
            == candidate_id
        )
        .filter(
            AssessmentAttempt.percentage.isnot(None)
        )
        .order_by(
            AssessmentAttempt.id.asc()
        )
        .all()
    )

    coding_scores = [
        float(
            submission.score or 0
        )
        for submission in coding_submissions
    ]

    assessment_scores = [
        float(
            attempt.percentage or 0
        )
        for attempt in assessment_attempts
    ]

    latest_coding = (
        coding_scores[-1]
        if coding_scores
        else 0.0
    )

    latest_assessment = (
        assessment_scores[-1]
        if assessment_scores
        else 0.0
    )

    graph = build_skill_graph(
        skills=profile.skills or [],
        coding_score=latest_coding,
        assessment_score=latest_assessment,
        experience_years=profile.experience_years or 0
    )

    progress = build_progress(
        coding_scores=coding_scores,
        assessment_scores=assessment_scores
    )

    return {
        "success": True,
        "candidate_id": candidate_id,
        "skill_graph": graph,
        "progress": progress
    }