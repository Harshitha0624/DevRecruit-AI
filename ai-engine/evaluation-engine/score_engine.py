from evaluation_utils import (
    clamp_score,
    calculate_weighted_score
)


DEFAULT_WEIGHTS = {
    "resume_score": 0.20,
    "coding_score": 0.25,
    "assessment_score": 0.20,
    "skill_match_score": 0.20,
    "interview_score": 0.15
}


def calculate_overall_score(
    resume_score=0,
    coding_score=0,
    assessment_score=0,
    skill_match_score=0,
    interview_score=0,
    weights=None
):
    scores = {
        "resume_score": clamp_score(resume_score),
        "coding_score": clamp_score(coding_score),
        "assessment_score": clamp_score(assessment_score),
        "skill_match_score": clamp_score(skill_match_score),
        "interview_score": clamp_score(interview_score)
    }

    weights = weights or DEFAULT_WEIGHTS

    overall_score = calculate_weighted_score(
        scores,
        weights
    )

    return {
        "component_scores": scores,
        "weights": weights,
        "overall_score": overall_score
    }