from typing import List

from app.services.global_benchmark_service import (
    get_global_ranking,
)


# ============================================================
# CANDIDATE COMPARISON
# ============================================================

def compare_candidates(
    candidate_ids: List[int],
    db
) -> dict:

    if len(candidate_ids) < 2:
        raise ValueError(
            "At least 2 candidates are required for comparison."
        )

    if len(candidate_ids) > 10:
        raise ValueError(
            "A maximum of 10 candidates can be compared at once."
        )

    ranking = get_global_ranking(db)

    selected = [
        candidate
        for candidate in ranking
        if int(candidate["id"]) in candidate_ids
    ]

    found_ids = {
        int(candidate["id"])
        for candidate in selected
    }

    missing_ids = [
        candidate_id
        for candidate_id in candidate_ids
        if candidate_id not in found_ids
    ]

    if missing_ids:
        raise ValueError(
            f"Candidates not found: {missing_ids}"
        )

    # Preserve the order requested by the user
    selected.sort(
        key=lambda item: candidate_ids.index(
            int(item["id"])
        )
    )

    comparison = []

    for candidate in selected:

        comparison.append(
            {
                "candidate_id": candidate["id"],
                "name": candidate["name"],
                "global_score": candidate[
                    "global_score"
                ],
                "global_rank": candidate[
                    "global_rank"
                ],
                "percentile": candidate[
                    "percentile"
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
                "experience_years": candidate[
                    "experience_years"
                ],
                "skills": candidate[
                    "skills"
                ],
                "strengths": candidate[
                    "strengths"
                ],
                "weak_areas": candidate[
                    "weak_areas"
                ],
            }
        )

    # ========================================================
    # AVERAGES
    # ========================================================

    numeric_fields = [
        "global_score",
        "resume_score",
        "coding_score",
        "assessment_score",
        "skill_score",
        "experience_score",
    ]

    averages = {}

    for field in numeric_fields:

        values = [
            float(candidate[field])
            for candidate in comparison
        ]

        averages[field] = round(
            sum(values) / len(values),
            2
        )

    # ========================================================
    # BEST SCORE PER CATEGORY
    # ========================================================

    best_by_category = {}

    for field in numeric_fields:

        best = max(
            comparison,
            key=lambda candidate: candidate[field]
        )

        best_by_category[field] = {
            "candidate_id": best["candidate_id"],
            "name": best["name"],
            "score": best[field],
        }

    return {
        "success": True,
        "candidate_count": len(comparison),
        "candidates": comparison,
        "averages": averages,
        "best_by_category": best_by_category,
    }