from typing import Dict, List


# ============================================================
# SCORE WEIGHTS
# ============================================================

WEIGHTS = {
    "resume": 0.20,
    "coding": 0.25,
    "assessment": 0.20,
    "skills": 0.20,
    "experience": 0.10,
    "certifications": 0.05,
}


# ============================================================
# NORMALIZE SCORE
# ============================================================

def normalize_score(value) -> float:
    try:
        value = float(value)
    except (TypeError, ValueError):
        return 0.0

    return max(0.0, min(100.0, value))


# ============================================================
# CALCULATE GLOBAL SCORE
# ============================================================

def calculate_global_score(
    candidate: Dict
) -> float:

    resume = normalize_score(
        candidate.get("resume_score")
    )

    coding = normalize_score(
        candidate.get("coding_score")
    )

    assessment = normalize_score(
        candidate.get("assessment_score")
    )

    skills = normalize_score(
        candidate.get("skill_score")
    )

    experience = normalize_score(
        candidate.get("experience_score")
    )

    certifications = normalize_score(
        candidate.get("certification_score")
    )

    score = (
        resume * WEIGHTS["resume"]
        + coding * WEIGHTS["coding"]
        + assessment * WEIGHTS["assessment"]
        + skills * WEIGHTS["skills"]
        + experience * WEIGHTS["experience"]
        + certifications * WEIGHTS["certifications"]
    )

    return round(score, 2)


# ============================================================
# IDENTIFY STRENGTHS
# ============================================================

def identify_strengths(
    candidate: Dict
) -> List[str]:

    scores = {
        "Resume": normalize_score(
            candidate.get("resume_score")
        ),
        "Coding": normalize_score(
            candidate.get("coding_score")
        ),
        "Assessment": normalize_score(
            candidate.get("assessment_score")
        ),
        "Skills": normalize_score(
            candidate.get("skill_score")
        ),
        "Experience": normalize_score(
            candidate.get("experience_score")
        ),
        "Certifications": normalize_score(
            candidate.get("certification_score")
        ),
    }

    return [
        name
        for name, score in scores.items()
        if score >= 80
    ]


# ============================================================
# IDENTIFY WEAK AREAS
# ============================================================

def identify_weak_areas(
    candidate: Dict
) -> List[str]:

    scores = {
        "Resume": normalize_score(
            candidate.get("resume_score")
        ),
        "Coding": normalize_score(
            candidate.get("coding_score")
        ),
        "Assessment": normalize_score(
            candidate.get("assessment_score")
        ),
        "Skills": normalize_score(
            candidate.get("skill_score")
        ),
        "Experience": normalize_score(
            candidate.get("experience_score")
        ),
        "Certifications": normalize_score(
            candidate.get("certification_score")
        ),
    }

    return [
        name
        for name, score in scores.items()
        if score < 60
    ]


# ============================================================
# RANK CANDIDATES
# ============================================================

def rank_candidates(
    candidates: List[Dict]
) -> List[Dict]:

    ranked = []

    for candidate in candidates:

        score = calculate_global_score(
            candidate
        )

        result = {
            **candidate,
            "global_score": score,
            "strengths": identify_strengths(
                candidate
            ),
            "weak_areas": identify_weak_areas(
                candidate
            ),
        }

        ranked.append(result)

    ranked.sort(
        key=lambda item: item["global_score"],
        reverse=True,
    )

    for index, candidate in enumerate(
        ranked,
        start=1
    ):
        candidate["global_rank"] = index

    return ranked


# ============================================================
# PERCENTILE
# ============================================================

def calculate_percentile(
    rank: int,
    total_candidates: int
) -> float:

    if total_candidates <= 1:
        return 100.0

    percentile = (
        (total_candidates - rank)
        / (total_candidates - 1)
    ) * 100

    return round(
        max(0.0, min(100.0, percentile)),
        2
    )


# ============================================================
# CANDIDATE BENCHMARK
# ============================================================

def benchmark_candidate(
    candidate_id: int,
    candidates: List[Dict]
) -> Dict:

    ranked = rank_candidates(
        candidates
    )

    total = len(ranked)

    for candidate in ranked:

        if int(candidate.get("id", 0)) == int(
            candidate_id
        ):

            rank = candidate["global_rank"]

            return {
                "candidate_id": candidate_id,
                "global_rank": rank,
                "total_candidates": total,
                "percentile": calculate_percentile(
                    rank,
                    total
                ),
                "global_score": candidate[
                    "global_score"
                ],
                "strengths": candidate[
                    "strengths"
                ],
                "weak_areas": candidate[
                    "weak_areas"
                ],
            }

    raise ValueError(
        f"Candidate {candidate_id} not found"
    )


# ============================================================
# DEMO
# ============================================================

if __name__ == "__main__":

    candidates = [
        {
            "id": 1,
            "resume_score": 90,
            "coding_score": 85,
            "assessment_score": 88,
            "skill_score": 92,
            "experience_score": 80,
            "certification_score": 75,
        },
        {
            "id": 2,
            "resume_score": 82,
            "coding_score": 90,
            "assessment_score": 84,
            "skill_score": 86,
            "experience_score": 70,
            "certification_score": 80,
        },
        {
            "id": 3,
            "resume_score": 70,
            "coding_score": 65,
            "assessment_score": 72,
            "skill_score": 68,
            "experience_score": 60,
            "certification_score": 55,
        },
    ]

    ranked = rank_candidates(
        candidates
    )

    print("\nGLOBAL CANDIDATE BENCHMARK")
    print("==========================")

    for candidate in ranked:

        print(
            f"Candidate {candidate['id']} | "
            f"Score: {candidate['global_score']} | "
            f"Rank: {candidate['global_rank']}"
        )

    result = benchmark_candidate(
        candidate_id=2,
        candidates=candidates
    )

    print("\nCandidate 2 Benchmark:")
    print(result)