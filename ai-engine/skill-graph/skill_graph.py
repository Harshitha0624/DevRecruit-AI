from typing import Any


# ============================================================
# SCORE NORMALIZATION
# ============================================================

def normalize_score(value: Any) -> float:
    try:
        value = float(value)
    except (TypeError, ValueError):
        return 0.0

    return round(
        max(0.0, min(100.0, value)),
        2
    )


# ============================================================
# SKILL SCORE
# ============================================================

def calculate_skill_score(
    coding_score: float,
    assessment_score: float,
    skill_count: int
) -> float:

    coding_score = normalize_score(coding_score)
    assessment_score = normalize_score(assessment_score)

    breadth_score = min(
        100.0,
        (max(0, skill_count) / 10.0) * 100.0
    )

    score = (
        coding_score * 0.45
        + assessment_score * 0.35
        + breadth_score * 0.20
    )

    return round(score, 2)


# ============================================================
# BUILD SKILL GRAPH
# ============================================================

def build_skill_graph(
    skills: list,
    coding_score: float,
    assessment_score: float,
    experience_years: float = 0
) -> dict:

    cleaned_skills = []

    for skill in skills or []:
        skill_name = str(skill).strip()

        if skill_name and skill_name.lower() not in [
            item.lower() for item in cleaned_skills
        ]:
            cleaned_skills.append(skill_name)

    overall_skill_score = calculate_skill_score(
        coding_score,
        assessment_score,
        len(cleaned_skills)
    )

    nodes = []

    for skill in cleaned_skills:
        nodes.append({
            "skill": skill,
            "score": overall_skill_score,
            "level": (
                "Advanced"
                if overall_skill_score >= 80
                else "Intermediate"
                if overall_skill_score >= 60
                else "Beginner"
            )
        })

    strengths = [
        node["skill"]
        for node in nodes
        if node["score"] >= 80
    ]

    weak_areas = [
        node["skill"]
        for node in nodes
        if node["score"] < 60
    ]

    strength_index = round(
        (
            overall_skill_score
            + normalize_score(coding_score)
            + normalize_score(assessment_score)
        ) / 3,
        2
    )

    return {
        "skills": nodes,
        "skill_count": len(nodes),
        "strength_index": strength_index,
        "strengths": strengths,
        "weak_areas": weak_areas,
        "coding_score": normalize_score(coding_score),
        "assessment_score": normalize_score(assessment_score),
        "experience_years": float(
            experience_years or 0
        )
    }


# ============================================================
# PROGRESS
# ============================================================

def build_progress(
    coding_scores: list[float],
    assessment_scores: list[float]
) -> dict:

    coding_scores = [
        normalize_score(score)
        for score in coding_scores
    ]

    assessment_scores = [
        normalize_score(score)
        for score in assessment_scores
    ]

    coding_current = (
        coding_scores[-1]
        if coding_scores
        else 0.0
    )

    coding_previous = (
        coding_scores[-2]
        if len(coding_scores) >= 2
        else coding_current
    )

    assessment_current = (
        assessment_scores[-1]
        if assessment_scores
        else 0.0
    )

    assessment_previous = (
        assessment_scores[-2]
        if len(assessment_scores) >= 2
        else assessment_current
    )

    coding_improvement = round(
        coding_current - coding_previous,
        2
    )

    assessment_improvement = round(
        assessment_current - assessment_previous,
        2
    )

    return {
        "coding_improvement": coding_improvement,
        "assessment_improvement": assessment_improvement,
        "weekly_progress": round(
            max(
                0.0,
                coding_improvement
                + assessment_improvement
            ),
            2
        ),
        "monthly_progress": round(
            sum(
                coding_scores[-4:]
            ) / len(coding_scores[-4:])
            if coding_scores[-4:]
            else 0.0,
            2
        )
    }