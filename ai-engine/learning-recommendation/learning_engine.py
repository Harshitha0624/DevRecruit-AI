from course_recommender import recommend_courses
from roadmap_generator import generate_learning_roadmap


def generate_learning_plan(
    missing_required_skills: list[str],
    missing_preferred_skills: list[str] | None = None
) -> dict:

    preferred_skills = (
        missing_preferred_skills or []
    )

    all_missing_skills = []

    for skill in (
        missing_required_skills
        + preferred_skills
    ):

        normalized = (
            str(skill)
            .strip()
            .lower()
        )

        if (
            normalized
            and normalized
            not in {
                item.lower()
                for item in all_missing_skills
            }
        ):
            all_missing_skills.append(skill)

    # Required skills first
    required_courses = recommend_courses(
        missing_required_skills
    )

    preferred_courses = recommend_courses(
        preferred_skills
    )

    all_courses = (
        required_courses
        + preferred_courses
    )

    roadmap = generate_learning_roadmap(
        missing_skills=all_missing_skills,
        recommendations=all_courses
    )

    return {
        "missing_required_skills":
            missing_required_skills,

        "missing_preferred_skills":
            preferred_skills,

        "total_missing_skills":
            len(all_missing_skills),

        "course_recommendations":
            all_courses,

        "learning_roadmap":
            roadmap,
    }


if __name__ == "__main__":

    result = generate_learning_plan(
        missing_required_skills=[
            "FastAPI",
            "PostgreSQL",
            "REST API",
        ],
        missing_preferred_skills=[
            "Docker",
            "AWS",
        ],
    )

    import json

    print(
        json.dumps(
            result,
            indent=2
        )
    )       