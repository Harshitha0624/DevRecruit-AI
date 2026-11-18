from performance_analysis import analyze_performance
from improvement_tips import generate_improvement_tips


def generate_feedback(
    technical_score,
    communication_score,
    problem_solving_score,
    behavioral_score,
    interviewer_comments=""
):
    analysis = analyze_performance(
        technical_score,
        communication_score,
        problem_solving_score,
        behavioral_score
    )

    tips = generate_improvement_tips(
        technical_score,
        communication_score,
        problem_solving_score,
        behavioral_score
    )

    overall_score = analysis["overall_score"]

    if overall_score >= 80:
        summary = (
            "The candidate demonstrated strong interview performance "
            "across the evaluated areas."
        )
    elif overall_score >= 60:
        summary = (
            "The candidate demonstrated satisfactory performance "
            "with several areas that can be improved."
        )
    else:
        summary = (
            "The candidate should strengthen several key areas "
            "before the next interview."
        )

    return {
        "overall_score": overall_score,
        "performance_level": analysis["performance_level"],
        "scores": analysis["scores"],
        "strengths": analysis["strengths"],
        "improvement_areas": analysis["improvement_areas"],
        "improvement_tips": tips,
        "summary": summary,
        "interviewer_comments": interviewer_comments
    }


if __name__ == "__main__":
    result = generate_feedback(
        technical_score=85,
        communication_score=72,
        problem_solving_score=90,
        behavioral_score=78,
        interviewer_comments="Good project knowledge and problem solving."
    )

    print("\nINTERVIEW FEEDBACK")
    print("------------------")

    for key, value in result.items():
        print(f"{key}: {value}")