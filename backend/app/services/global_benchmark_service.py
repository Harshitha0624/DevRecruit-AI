from pathlib import Path
import sys
from typing import Any

from sqlalchemy import func

from app.models.application import Application
from app.models.assessment_attempt import AssessmentAttempt
from app.models.candidate_profile import CandidateProfile
from app.models.coding_submission import CodingSubmission
from app.models.user import User


# ============================================================
# LOAD AI BENCHMARK ENGINE
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[3]

BENCHMARK_DIR = (
    PROJECT_ROOT
    / "ai-engine"
    / "global-benchmarking"
)

if str(BENCHMARK_DIR) not in sys.path:
    sys.path.insert(0, str(BENCHMARK_DIR))

from benchmark_engine import (
    calculate_global_score,
    calculate_percentile,
    identify_strengths,
    identify_weak_areas,
)


# ============================================================
# SAFE SCORE HELPERS
# ============================================================

def safe_percentage(
    score: float | None,
    max_score: float | None
) -> float:

    if score is None:
        return 0.0

    if max_score is None or max_score <= 0:
        return max(
            0.0,
            min(100.0, float(score))
        )

    return max(
        0.0,
        min(
            100.0,
            (float(score) / float(max_score)) * 100
        )
    )


def experience_to_score(
    experience_years: int | None
) -> float:

    years = float(
        experience_years or 0
    )

    # 5 years or more = 100
    return round(
        min(100.0, (years / 5.0) * 100.0),
        2
    )


def skills_to_score(
    skills: Any
) -> float:

    if not skills:
        return 0.0

    if isinstance(skills, list):
        count = len(skills)

    elif isinstance(skills, dict):
        count = len(skills)

    elif isinstance(skills, str):
        count = len(
            [
                item
                for item in skills.split(",")
                if item.strip()
            ]
        )

    else:
        count = 0

    # 10+ skills = 100
    return round(
        min(100.0, (count / 10.0) * 100.0),
        2
    )


# ============================================================
# GET LATEST ATS SCORE
# ============================================================

def get_latest_ats_score(
    candidate_id: int,
    db
) -> float:

    application = (
        db.query(Application)
        .filter(
            Application.candidate_id
            == candidate_id
        )
        .filter(
            Application.ats_score.isnot(None)
        )
        .order_by(
            Application.updated_at.desc(),
            Application.id.desc()
        )
        .first()
    )

    if not application:
        return 0.0

    return float(
        application.ats_score or 0.0
    )


# ============================================================
# GET LATEST CODING SCORE
# ============================================================

def get_latest_coding_score(
    candidate_id: int,
    db
) -> float:

    submission = (
        db.query(CodingSubmission)
        .filter(
            CodingSubmission.candidate_id
            == candidate_id
        )
        .filter(
            CodingSubmission.score.isnot(None)
        )
        .order_by(
            CodingSubmission.submitted_at.desc(),
            CodingSubmission.id.desc()
        )
        .first()
    )

    if not submission:
        return 0.0

    return safe_percentage(
        submission.score,
        submission.max_score
    )


# ============================================================
# GET LATEST ASSESSMENT SCORE
# ============================================================

def get_latest_assessment_score(
    candidate_id: int,
    db
) -> float:

    attempt = (
        db.query(AssessmentAttempt)
        .filter(
            AssessmentAttempt.candidate_id
            == candidate_id
        )
        .filter(
            AssessmentAttempt.percentage.isnot(None)
        )
        .order_by(
            AssessmentAttempt.submitted_at.desc(),
            AssessmentAttempt.id.desc()
        )
        .first()
    )

    if not attempt:
        return 0.0

    return max(
        0.0,
        min(
            100.0,
            float(
                attempt.percentage or 0.0
            )
        )
    )


# ============================================================
# BUILD ONE CANDIDATE RECORD
# ============================================================

def build_candidate_record(
    candidate_profile: CandidateProfile,
    db
) -> dict:

    candidate_id = candidate_profile.user_id

    ats_score = get_latest_ats_score(
        candidate_id,
        db
    )

    coding_score = get_latest_coding_score(
        candidate_id,
        db
    )

    assessment_score = get_latest_assessment_score(
        candidate_id,
        db
    )

    skill_score = skills_to_score(
        candidate_profile.skills
    )

    experience_score = experience_to_score(
        candidate_profile.experience_years
    )

    # Global benchmark currently doesn't require
    # certification data from a separate table.
    certification_score = 0.0

    candidate = {
        "id": candidate_id,
        "resume_score": ats_score,
        "coding_score": coding_score,
        "assessment_score": assessment_score,
        "skill_score": skill_score,
        "experience_score": experience_score,
        "certification_score": certification_score,
    }

    user = (
        db.query(User)
        .filter(User.id == candidate_id)
        .first()
    )

    candidate["name"] = (
        user.full_name
        if user
        else f"Candidate {candidate_id}"
    )

    candidate["skills"] = (
        candidate_profile.skills or []
    )

    candidate["experience_years"] = (
        candidate_profile.experience_years or 0
    )

    candidate["global_score"] = (
        calculate_global_score(candidate)
    )

    candidate["strengths"] = (
        identify_strengths(candidate)
    )

    candidate["weak_areas"] = (
        identify_weak_areas(candidate)
    )

    return candidate


# ============================================================
# GET ALL CANDIDATES
# ============================================================

def get_all_candidate_records(
    db
) -> list[dict]:

    profiles = (
        db.query(CandidateProfile)
        .order_by(
            CandidateProfile.user_id.asc()
        )
        .all()
    )

    candidates = []

    for profile in profiles:

        try:
            candidates.append(
                build_candidate_record(
                    profile,
                    db
                )
            )

        except Exception as exc:

            print(
                f"Global benchmark failed for "
                f"candidate {profile.user_id}: {exc}"
            )

    return candidates


# ============================================================
# GLOBAL RANKING
# ============================================================

def get_global_ranking(
    db
) -> list[dict]:

    candidates = get_all_candidate_records(
        db
    )

    candidates.sort(
        key=lambda item: item["global_score"],
        reverse=True
    )

    total = len(candidates)

    for index, candidate in enumerate(
        candidates,
        start=1
    ):
        candidate["global_rank"] = index

        candidate["percentile"] = (
            calculate_percentile(
                index,
                total
            )
        )

    return candidates


# ============================================================
# SELECTED CANDIDATE BENCHMARK
# ============================================================

def get_candidate_benchmark(
    candidate_id: int,
    db
) -> dict:

    ranking = get_global_ranking(db)

    for candidate in ranking:

        if int(candidate["id"]) == int(
            candidate_id
        ):

            return {
                "candidate_id": candidate_id,
                "candidate_name": candidate[
                    "name"
                ],
                "global_rank": candidate[
                    "global_rank"
                ],
                "total_candidates": len(
                    ranking
                ),
                "percentile": candidate[
                    "percentile"
                ],
                "global_score": candidate[
                    "global_score"
                ],
                "resume_score": candidate[
                    "resume_score"
                ],
                "coding_score": candidate[
                    "coding_score"
                ],
                "assessment_score": candidate[
                    "assessment_score"
                ],
                "skill_score": candidate[
                    "skill_score"
                ],
                "experience_score": candidate[
                    "experience_score"
                ],
                "strengths": candidate[
                    "strengths"
                ],
                "weak_areas": candidate[
                    "weak_areas"
                ],
            }

    raise ValueError(
        f"Candidate {candidate_id} not found"
    )


# ============================================================
# GLOBAL POOL SUMMARY
# ============================================================

def get_global_summary(
    db
) -> dict:

    ranking = get_global_ranking(db)

    if not ranking:
        return {
            "total_candidates": 0,
            "average_score": 0.0,
            "top_score": 0.0,
        }

    scores = [
        item["global_score"]
        for item in ranking
    ]

    return {
        "total_candidates": len(ranking),
        "average_score": round(
            sum(scores) / len(scores),
            2
        ),
        "top_score": max(scores),
        "top_candidate": {
            "candidate_id": ranking[0]["id"],
            "name": ranking[0]["name"],
            "global_score": ranking[0][
                "global_score"
            ],
        },
    }