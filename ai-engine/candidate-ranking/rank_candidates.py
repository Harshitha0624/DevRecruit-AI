from ranking_model import calculate_candidate_ranking_score


def rank_candidates(
    candidates: list[dict]
) -> list[dict]:
    """
    Calculate ranking scores and return candidates
    ordered from highest score to lowest score.
    """

    ranked_candidates = []

    for candidate in candidates:

        candidate_copy = candidate.copy()

        candidate_copy["ranking_score"] = (
            calculate_candidate_ranking_score(
                candidate_copy
            )
        )

        ranked_candidates.append(
            candidate_copy
        )

    ranked_candidates.sort(
        key=lambda candidate:
            candidate["ranking_score"],
        reverse=True
    )

    for position, candidate in enumerate(
        ranked_candidates,
        start=1
    ):
        candidate["rank"] = position

    return ranked_candidates


if __name__ == "__main__":

    sample_candidates = [
        {
            "candidate_id": 1,
            "name": "Candidate A",
            "ats_score": 90,
            "assessment_score": 80,
            "skill_match_score": 85,
            "experience_score": 60,
        },
        {
            "candidate_id": 2,
            "name": "Candidate B",
            "ats_score": 75,
            "assessment_score": 95,
            "skill_match_score": 90,
            "experience_score": 80,
        },
        {
            "candidate_id": 3,
            "name": "Candidate C",
            "ats_score": 60,
            "assessment_score": 70,
            "skill_match_score": 65,
            "experience_score": 50,
        },
    ]

    import json

    result = rank_candidates(
        sample_candidates
    )

    print(
        json.dumps(
            result,
            indent=2
        )
    )