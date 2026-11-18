def calculate_overall_score(
    technical_score,
    communication_score,
    problem_solving_score,
    behavioral_score
):
    scores = [
        float(technical_score),
        float(communication_score),
        float(problem_solving_score),
        float(behavioral_score)
    ]

    return round(sum(scores) / len(scores), 2)


def get_performance_level(score):
    score = float(score)

    if score >= 85:
        return "Excellent"
    elif score >= 70:
        return "Strong"
    elif score >= 55:
        return "Average"
    elif score >= 40:
        return "Needs Improvement"
    else:
        return "Weak"


def analyze_performance(
    technical_score,
    communication_score,
    problem_solving_score,
    behavioral_score
):
    categories = {
        "technical": float(technical_score),
        "communication": float(communication_score),
        "problem_solving": float(problem_solving_score),
        "behavioral": float(behavioral_score)
    }

    strengths = []
    improvement_areas = []

    for category, score in categories.items():
        display_name = category.replace("_", " ").title()

        if score >= 80:
            strengths.append(display_name)
        elif score < 60:
            improvement_areas.append(display_name)

    overall_score = calculate_overall_score(
        technical_score,
        communication_score,
        problem_solving_score,
        behavioral_score
    )

    return {
        "scores": categories,
        "overall_score": overall_score,
        "performance_level": get_performance_level(overall_score),
        "strengths": strengths,
        "improvement_areas": improvement_areas
    }