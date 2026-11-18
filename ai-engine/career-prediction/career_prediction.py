from career_model import (
    CAREER_PROFILES,
    normalize_skills,
)


def predict_career(
    skills: list[str],
    experience_years: float = 0.0,
) -> dict:
    candidate_skills = normalize_skills(skills)

    predictions = []

    for career_key, profile in CAREER_PROFILES.items():

        career_skills = profile["skills"]

        matched_skills = sorted(
            candidate_skills.intersection(
                career_skills
            )
        )

        skill_score = (
            len(matched_skills)
            / len(career_skills)
            * 100
            if career_skills
            else 0.0
        )

        predictions.append({
            "career": profile["title"],
            "career_key": career_key,
            "match_score": round(
                skill_score,
                2
            ),
            "matched_skills": matched_skills,
            "experience_years": experience_years,
        })

    predictions.sort(
        key=lambda item: item["match_score"],
        reverse=True
    )

    for rank, item in enumerate(
        predictions,
        start=1
    ):
        item["rank"] = rank

    top_prediction = (
        predictions[0]
        if predictions
        else None
    )

    return {
        "predicted_career": (
            top_prediction["career"]
            if top_prediction
            else None
        ),
        "predicted_career_score": (
            top_prediction["match_score"]
            if top_prediction
            else 0.0
        ),
        "experience_years": experience_years,
        "career_predictions": predictions,
    }


if __name__ == "__main__":

    sample_skills = [
        "Python",
        "SQL",
        "Pandas",
        "NumPy",
        "Power BI",
        "Machine Learning",
    ]

    result = predict_career(
        skills=sample_skills,
        experience_years=0.9,
    )

    import json

    print(
        json.dumps(
            result,
            indent=2
        )
    )