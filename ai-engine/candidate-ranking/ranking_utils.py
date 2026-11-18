def normalize_score(value) -> float:
    try:
        score = float(value)
    except (TypeError, ValueError):
        return 0.0

    return max(0.0, min(100.0, score))


def get_ats_score(candidate: dict) -> float:
    return normalize_score(
        candidate.get("ats_score", 0)
    )


def get_assessment_score(candidate: dict) -> float:
    return normalize_score(
        candidate.get("assessment_score", 0)
    )


def get_experience_score(candidate: dict) -> float:
    return normalize_score(
        candidate.get("experience_score", 0)
    )


def get_skill_match_score(candidate: dict) -> float:
    return normalize_score(
        candidate.get("skill_match_score", 0)
    )


def calculate_ranking_features(candidate: dict) -> dict:
    return {
        "ats_score": get_ats_score(candidate),
        "assessment_score": get_assessment_score(candidate),
        "experience_score": get_experience_score(candidate),
        "skill_match_score": get_skill_match_score(candidate),
    }