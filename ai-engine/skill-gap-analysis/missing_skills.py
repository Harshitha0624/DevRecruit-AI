def normalize_skills(skills) -> set[str]:
    if not skills:
        return set()

    return {
        str(skill).strip().lower()
        for skill in skills
        if str(skill).strip()
    }


def find_missing_skills(
    candidate_skills: list[str],
    required_skills: list[str],
    preferred_skills: list[str] | None = None
) -> dict:

    candidate = normalize_skills(candidate_skills)
    required = normalize_skills(required_skills)
    preferred = normalize_skills(preferred_skills or [])

    missing_required = sorted(
        required - candidate
    )

    missing_preferred = sorted(
        preferred - candidate
    )

    matched_required = sorted(
        candidate & required
    )

    matched_preferred = sorted(
        candidate & preferred
    )

    return {
        "matched_required_skills": matched_required,
        "missing_required_skills": missing_required,
        "matched_preferred_skills": matched_preferred,
        "missing_preferred_skills": missing_preferred,
    }