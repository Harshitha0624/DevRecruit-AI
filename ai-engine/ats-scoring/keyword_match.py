import re


def normalize_skill(skill: str) -> str:
    if not skill:
        return ""

    skill = skill.strip().lower()

    replacements = {
        "react.js": "react",
        "reactjs": "react",
        "nodejs": "node.js",
        "scikit learn": "scikit-learn",
        "postgres": "postgresql",
    }

    if skill in replacements:
        skill = replacements[skill]

    skill = re.sub(r"\s+", " ", skill)

    return skill


def normalize_skills(skills) -> list[str]:
    if not skills:
        return []

    result = []

    for skill in skills:
        normalized = normalize_skill(str(skill))

        if normalized and normalized not in result:
            result.append(normalized)

    return result


def match_skills(
    candidate_skills,
    required_skills,
    preferred_skills=None
) -> dict:

    candidate = set(
        normalize_skills(candidate_skills)
    )

    required = set(
        normalize_skills(required_skills)
    )

    preferred = set(
        normalize_skills(preferred_skills or [])
    )

    matched_required = sorted(
        candidate.intersection(required)
    )

    missing_required = sorted(
        required.difference(candidate)
    )

    matched_preferred = sorted(
        candidate.intersection(preferred)
    )

    required_score = (
        len(matched_required) / len(required) * 100
        if required
        else 100.0
    )

    preferred_score = (
        len(matched_preferred) / len(preferred) * 100
        if preferred
        else 100.0
    )

    return {
        "matched_required": matched_required,
        "missing_required": missing_required,
        "matched_preferred": matched_preferred,
        "required_score": round(required_score, 2),
        "preferred_score": round(preferred_score, 2),
    }