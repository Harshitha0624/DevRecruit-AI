def calculate_job_score(
    skill_match_score=0,
    ats_score=0,
    experience_score=0,
    career_match_score=0,
    learning_alignment_score=0
):
    scores = {
        "skill_match_score": float(skill_match_score),
        "ats_score": float(ats_score),
        "experience_score": float(experience_score),
        "career_match_score": float(career_match_score),
        "learning_alignment_score": float(
            learning_alignment_score
        )
    }

    weights = {
        "skill_match_score": 0.35,
        "ats_score": 0.20,
        "experience_score": 0.15,
        "career_match_score": 0.20,
        "learning_alignment_score": 0.10
    }

    overall_score = sum(
        scores[key] * weights[key]
        for key in scores
    )

    return round(overall_score, 2)


def recommend_jobs(jobs, top_n=5):
    recommendations = []

    for job in jobs:
        score = calculate_job_score(
            skill_match_score=job.get(
                "skill_match_score", 0
            ),
            ats_score=job.get(
                "ats_score", 0
            ),
            experience_score=job.get(
                "experience_score", 0
            ),
            career_match_score=job.get(
                "career_match_score", 0
            ),
            learning_alignment_score=job.get(
                "learning_alignment_score", 0
            )
        )

        recommendations.append({
            **job,
            "overall_recommendation_score": score
        })

    recommendations.sort(
        key=lambda item: item["overall_recommendation_score"],
        reverse=True
    )

    for index, job in enumerate(
        recommendations[:top_n],
        start=1
    ):
        job["recommendation_rank"] = index

    return recommendations[:top_n]