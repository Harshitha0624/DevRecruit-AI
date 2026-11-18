from missing_skills import find_missing_skills
from recommend_learning import recommend_learning_resources


def analyze_skill_gap(
    candidate_skills: list[str],
    required_skills: list[str],
    preferred_skills: list[str] | None = None
) -> dict:

    skill_result = find_missing_skills(
        candidate_skills=candidate_skills,
        required_skills=required_skills,
        preferred_skills=preferred_skills,
    )

    learning_recommendations = (
        recommend_learning_resources(
            skill_result["missing_required_skills"]
            + skill_result["missing_preferred_skills"]
        )
    )

    required_total = len(
        set(
            skill.strip().lower()
            for skill in required_skills
            if skill
        )
    )

    matched_required = len(
        skill_result["matched_required_skills"]
    )

    gap_percentage = (
        round(
            (
                (required_total - matched_required)
                / required_total
            ) * 100,
            2
        )
        if required_total
        else 0.0
    )

    readiness_score = round(
        100.0 - gap_percentage,
        2
    )

    return {
        "matched_required_skills":
            skill_result["matched_required_skills"],

        "missing_required_skills":
            skill_result["missing_required_skills"],

        "matched_preferred_skills":
            skill_result["matched_preferred_skills"],

        "missing_preferred_skills":
            skill_result["missing_preferred_skills"],

        "skill_gap_percentage":
            gap_percentage,

        "skill_readiness_score":
            readiness_score,

        "learning_recommendations":
            learning_recommendations,
    }


if __name__ == "__main__":

    candidate_skills = [
        "Python",
        "SQL",
        "JavaScript",
        "React",
        "Machine Learning",
    ]

    required_skills = [
        "Python",
        "FastAPI",
        "PostgreSQL",
        "REST API",
    ]

    preferred_skills = [
        "Docker",
        "AWS",
    ]

    result = analyze_skill_gap(
        candidate_skills=candidate_skills,
        required_skills=required_skills,
        preferred_skills=preferred_skills,
    )

    import json

    print(
        json.dumps(
            result,
            indent=2
        )
    )