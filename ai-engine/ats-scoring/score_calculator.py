def calculate_ats_score(
    required_score: float,
    preferred_score: float,
    experience_score: float = 0.0,
    education_score: float = 0.0,
) -> float:
    """
    Calculate the overall ATS score.

    Weighting:
    - Required skills: 60%
    - Preferred skills: 20%
    - Experience: 10%
    - Education: 10%
    """

    required_score = max(
        0.0,
        min(100.0, float(required_score))
    )

    preferred_score = max(
        0.0,
        min(100.0, float(preferred_score))
    )

    experience_score = max(
        0.0,
        min(100.0, float(experience_score))
    )

    education_score = max(
        0.0,
        min(100.0, float(education_score))
    )

    final_score = (
        required_score * 0.60
        + preferred_score * 0.20
        + experience_score * 0.10
        + education_score * 0.10
    )

    return round(
        max(0.0, min(100.0, final_score)),
        2
    )


def calculate_experience_score(
    candidate_years: float,
    minimum_years: int | float
) -> float:
    """
    Convert candidate experience into a 0-100 score.
    """

    candidate_years = max(
        0.0,
        float(candidate_years)
    )

    minimum_years = max(
        0.0,
        float(minimum_years)
    )

    if minimum_years == 0:
        return 100.0

    score = (
        candidate_years /
        minimum_years
    ) * 100.0

    return round(
        min(100.0, score),
        2
    )


def calculate_education_score(
    candidate_education: list[str],
    required_education: str | None
) -> float:
    """
    Basic education relevance score.

    Returns 100 when no specific education
    requirement is given.
    """

    if not required_education:
        return 100.0

    if not candidate_education:
        return 0.0

    required = required_education.lower().strip()

    combined = " ".join(
        candidate_education
    ).lower()

    if required in combined:
        return 100.0

    required_terms = [
        term
        for term in required.split()
        if len(term) > 2
    ]

    if not required_terms:
        return 0.0

    matched = sum(
        1
        for term in required_terms
        if term in combined
    )

    score = (
        matched /
        len(required_terms)
    ) * 100.0

    return round(
        score,
        2
    )