def calculate_candidate_score(
    ats_score=0,
    coding_score=0,
    assessment_score=0,
    skill_match_score=0,
    experience_score=0
):
    scores = {
        "ats_score": float(ats_score),
        "coding_score": float(coding_score),
        "assessment_score": float(assessment_score),
        "skill_match_score": float(skill_match_score),
        "experience_score": float(experience_score)
    }

    weights = {
        "ats_score": 0.25,
        "coding_score": 0.25,
        "assessment_score": 0.20,
        "skill_match_score": 0.20,
        "experience_score": 0.10
    }

    overall_score = sum(
        scores[key] * weights[key]
        for key in scores
    )

    return round(overall_score, 2)


def recommend_candidates(candidates, top_n=5):
    recommendations = []

    for candidate in candidates:
        score = calculate_candidate_score(
            ats_score=candidate.get("ats_score", 0),
            coding_score=candidate.get("coding_score", 0),
            assessment_score=candidate.get("assessment_score", 0),
            skill_match_score=candidate.get("skill_match_score", 0),
            experience_score=candidate.get("experience_score", 0)
        )

        recommendations.append({
            **candidate,
            "overall_recommendation_score": score
        })

    recommendations.sort(
        key=lambda item: item["overall_recommendation_score"],
        reverse=True
    )

    for index, candidate in enumerate(
        recommendations[:top_n],
        start=1
    ):
        candidate["recommendation_rank"] = index

    return recommendations[:top_n]