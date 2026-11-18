from similarity import calculate_match_score


def match_candidate_to_job(
    candidate: dict,
    job: dict
) -> dict:
    """
    Calculate how well a candidate matches a job.
    Returns a score from 0 to 100.
    """

    candidate_skills = candidate.get(
        "skills",
        []
    )

    job_required_skills = job.get(
        "required_skills",
        []
    )

    job_preferred_skills = job.get(
        "preferred_skills",
        []
    )

    candidate_text = candidate.get(
        "text",
        ""
    )

    job_text = " ".join([
        str(job.get("title", "")),
        str(job.get("description", "")),
        " ".join(job_required_skills),
        " ".join(job_preferred_skills),
    ])

    result = calculate_match_score(
        candidate_skills=candidate_skills,
        job_required_skills=job_required_skills,
        job_preferred_skills=job_preferred_skills,
        candidate_text=candidate_text,
        job_text=job_text,
    )

    return {
        "candidate_id": candidate.get("candidate_id"),
        "job_id": job.get("job_id"),
        "job_title": job.get("title"),

        "match_score": result[
            "match_score"
        ],

        "required_skill_score": result[
            "required_skill_score"
        ],

        "preferred_skill_score": result[
            "preferred_skill_score"
        ],

        "text_similarity_score": result[
            "text_similarity_score"
        ],
    }


if __name__ == "__main__":

    sample_candidate = {
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

    sample_job = {
        "job_id": 4,
        "title": "Python Backend Engineer",
        "description": (
            "Build scalable backend APIs "
            "and services using Python "
            "and FastAPI."
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
    }

    result = match_candidate_to_job(
        candidate=sample_candidate,
        job=sample_job,
    )

    import json

    print(
        json.dumps(
            result,
            indent=2
        )
    )