from job_match import match_candidate_to_job


def recommend_jobs(
    candidate: dict,
    jobs: list[dict],
    minimum_score: float = 0.0
) -> list[dict]:
    """
    Calculate candidate-job match scores and return
    recommended jobs ordered from highest match to lowest.
    """

    recommendations = []

    for job in jobs:

        result = match_candidate_to_job(
            candidate=candidate,
            job=job
        )

        if result["match_score"] >= minimum_score:
            recommendations.append(result)

    recommendations.sort(
        key=lambda item: item["match_score"],
        reverse=True
    )

    for position, recommendation in enumerate(
        recommendations,
        start=1
    ):
        recommendation["recommendation_rank"] = position

    return recommendations


if __name__ == "__main__":

    candidate = {
        "candidate_id": 2,
        "skills": [
            "Python",
            "SQL",
            "FastAPI",
            "PostgreSQL",
            "Docker",
            "Machine Learning",
        ],
        "text": (
            "Python backend developer with "
            "FastAPI PostgreSQL Docker and "
            "machine learning experience."
        ),
    }

    jobs = [
        {
            "job_id": 4,
            "title": "Python Backend Engineer",
            "description": (
                "Build scalable backend APIs "
                "using Python and FastAPI."
            ),
            "required_skills": [
                "Python",
                "FastAPI",
                "PostgreSQL",
                "REST API",
            ],
            "preferred_skills": [
                "Docker",
                "Git",
                "AWS",
            ],
        },
        {
            "job_id": 5,
            "title": "Data Analyst",
            "description": (
                "Analyze business data and "
                "build analytical dashboards."
            ),
            "required_skills": [
                "Python",
                "SQL",
                "Excel",
            ],
            "preferred_skills": [
                "Power BI",
                "Pandas",
            ],
        },
    ]

    recommendations = recommend_jobs(
        candidate=candidate,
        jobs=jobs
    )

    import json

    print(
        json.dumps(
            recommendations,
            indent=2
        )
    )