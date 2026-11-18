from ranking_utils import calculate_ranking_features


def calculate_candidate_ranking_score(
    candidate: dict
) -> float:
    """
    Calculate the current rule-based candidate ranking score.

    Weights:
    ATS score          50%
    Assessment score   25%
    Skill match        15%
    Experience         10%
    """

    features = calculate_ranking_features(
        candidate
    )

    final_score = (
        features["ats_score"] * 0.50
        + features["assessment_score"] * 0.25
        + features["skill_match_score"] * 0.15
        + features["experience_score"] * 0.10
    )

    return round(
        max(0.0, min(100.0, final_score)),
        2
    )