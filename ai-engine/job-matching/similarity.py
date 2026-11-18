import re


def normalize_text(text: str) -> str:
    if not text:
        return ""

    text = text.lower()
    text = re.sub(r"[^a-z0-9+#.\s-]", " ", text)
    text = re.sub(r"\s+", " ", text)

    return text.strip()


def text_similarity(
    candidate_text: str,
    job_text: str
) -> float:
    """
    Calculate simple keyword-based text similarity.
    Returns a score from 0 to 100.
    """

    candidate = set(
        normalize_text(candidate_text).split()
    )

    job = set(
        normalize_text(job_text).split()
    )

    if not job:
        return 0.0

    matched = candidate.intersection(job)

    return round(
        len(matched) / len(job) * 100,
        2
    )


def skill_similarity(
    candidate_skills: list[str],
    job_skills: list[str]
) -> float:
    """
    Calculate percentage of job skills
    matched by the candidate.
    """

    candidate = {
        normalize_text(skill)
        for skill in candidate_skills
        if skill
    }

    required = {
        normalize_text(skill)
        for skill in job_skills
        if skill
    }

    if not required:
        return 100.0

    matched = candidate.intersection(required)

    return round(
        len(matched) / len(required) * 100,
        2
    )


def calculate_match_score(
    candidate_skills: list[str],
    job_required_skills: list[str],
    job_preferred_skills: list[str] | None = None,
    candidate_text: str = "",
    job_text: str = ""
) -> dict:

    required_score = skill_similarity(
        candidate_skills,
        job_required_skills
    )

    preferred_score = skill_similarity(
        candidate_skills,
        job_preferred_skills or []
    )

    text_score = text_similarity(
        candidate_text,
        job_text
    )

    final_score = (
        required_score * 0.60
        + preferred_score * 0.20
        + text_score * 0.20
    )

    return {
        "required_skill_score": required_score,
        "preferred_skill_score": preferred_score,
        "text_similarity_score": text_score,
        "match_score": round(
            final_score,
            2
        )
    }