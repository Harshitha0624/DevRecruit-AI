import re
from difflib import SequenceMatcher


def normalize_code(code: str) -> str:
    if not code:
        return ""

    code = re.sub(
        r"#.*",
        "",
        code
    )

    code = re.sub(
        r"\s+",
        " ",
        code
    )

    return code.strip().lower()


def calculate_similarity(
    code_a: str,
    code_b: str
) -> float:

    normalized_a = normalize_code(code_a)
    normalized_b = normalize_code(code_b)

    if not normalized_a or not normalized_b:
        return 0.0

    similarity = SequenceMatcher(
        None,
        normalized_a,
        normalized_b
    ).ratio()

    return round(
        similarity * 100,
        2
    )


def check_plagiarism(
    submission_code: str,
    previous_submissions: list[str]
) -> dict:

    comparisons = []

    for index, previous_code in enumerate(
        previous_submissions,
        start=1
    ):

        similarity = calculate_similarity(
            submission_code,
            previous_code
        )

        comparisons.append({
            "submission_index": index,
            "similarity_percentage": similarity,
        })

    comparisons.sort(
        key=lambda item:
            item["similarity_percentage"],
        reverse=True
    )

    highest_similarity = (
        comparisons[0]["similarity_percentage"]
        if comparisons
        else 0.0
    )

    if highest_similarity >= 85:
        risk_level = "High"
    elif highest_similarity >= 60:
        risk_level = "Moderate"
    else:
        risk_level = "Low"

    return {
        "highest_similarity_percentage":
            highest_similarity,
        "plagiarism_risk":
            risk_level,
        "comparisons":
            comparisons,
    }