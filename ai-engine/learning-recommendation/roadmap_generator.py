def generate_learning_roadmap(
    missing_skills: list[str],
    recommendations: list[dict]
) -> list[dict]:

    roadmap = []

    for index, skill in enumerate(
        missing_skills,
        start=1
    ):

        recommendation = None

        for item in recommendations:

            if (
                item["skill"].strip().lower()
                == str(skill).strip().lower()
            ):
                recommendation = item
                break

        roadmap.append({
            "step": index,
            "skill": skill,
            "priority": (
                "High"
                if index <= 2
                else "Medium"
            ),
            "course": (
                recommendation["course_title"]
                if recommendation
                else f"Learn {skill}"
            ),
            "level": (
                recommendation["level"]
                if recommendation
                else "To be assessed"
            ),
            "resources": (
                recommendation["resources"]
                if recommendation
                else []
            ),
        })

    return roadmap


def calculate_roadmap_progress(
    completed_skills: list[str],
    total_skills: list[str]
) -> float:

    completed = {
        str(skill).strip().lower()
        for skill in completed_skills
        if str(skill).strip()
    }

    total = {
        str(skill).strip().lower()
        for skill in total_skills
        if str(skill).strip()
    }

    if not total:
        return 100.0

    progress = (
        len(completed.intersection(total))
        / len(total)
    ) * 100

    return round(progress, 2)