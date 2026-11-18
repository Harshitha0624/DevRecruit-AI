from score_engine import calculate_overall_score
from evaluation_utils import get_performance_level


def evaluate_candidate(
    resume_score=0,
    coding_score=0,
    assessment_score=0,
    skill_match_score=0,
    interview_score=0
):
    result = calculate_overall_score(
        resume_score=resume_score,
        coding_score=coding_score,
        assessment_score=assessment_score,
        skill_match_score=skill_match_score,
        interview_score=interview_score
    )

    overall_score = result["overall_score"]
    component_scores = result["component_scores"]

    strengths = []
    improvement_areas = []

    for category, score in component_scores.items():
        display_name = (
            category
            .replace("_score", "")
            .replace("_", " ")
            .title()
        )

        if score >= 80:
            strengths.append(display_name)

        elif score < 60:
            improvement_areas.append(display_name)

    return {
        "overall_score": overall_score,
        "performance_level": get_performance_level(
            overall_score
        ),
        "component_scores": component_scores,
        "weights": result["weights"],
        "strengths": strengths,
        "improvement_areas": improvement_areas
    }


if __name__ == "__main__":
    result = evaluate_candidate(
        resume_score=90,
        coding_score=85,
        assessment_score=88,
        skill_match_score=92,
        interview_score=78
    )

    print("\nCANDIDATE EVALUATION ENGINE")
    print("===========================")

    print(
        f"Overall Score: {result['overall_score']}"
    )

    print(
        f"Performance Level: {result['performance_level']}"
    )

    print(
        f"Component Scores: {result['component_scores']}"
    )

    print(
        f"Strengths: {result['strengths']}"
    )

    print(
        f"Improvement Areas: {result['improvement_areas']}"
    )