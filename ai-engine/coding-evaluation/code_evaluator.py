import ast

from complexity import calculate_python_complexity
from plagiarism_checker import check_plagiarism
from quality_checker import check_code_quality


def validate_python_syntax(code: str) -> dict:

    try:
        ast.parse(code)

        return {
            "valid": True,
            "error": None,
        }

    except SyntaxError as exc:

        return {
            "valid": False,
            "error": str(exc),
        }


def evaluate_code(
    code: str,
    previous_submissions: list[str] | None = None
) -> dict:
    """
    Perform static coding evaluation.

    This version evaluates:
    - Syntax
    - Code quality
    - Complexity
    - Similarity with previous submissions

    It does not execute arbitrary submitted code.
    """

    syntax = validate_python_syntax(code)

    quality = check_code_quality(code)

    complexity = calculate_python_complexity(code)

    plagiarism = check_plagiarism(
        submission_code=code,
        previous_submissions=(
            previous_submissions or []
        ),
    )

    if not syntax["valid"]:
        correctness_score = 0
    else:
        correctness_score = 100

    final_score = (
        correctness_score * 0.40
        + quality["quality_score"] * 0.20
        + (
            max(
                0,
                100
                - complexity.get(
                    "cyclomatic_complexity",
                    0
                ) * 5
            )
        ) * 0.20
        + (
            max(
                0,
                100
                - plagiarism[
                    "highest_similarity_percentage"
                ]
            )
        ) * 0.20
    )

    final_score = round(
        max(0, min(100, final_score)),
        2
    )

    return {
        "final_score": final_score,
        "syntax": syntax,
        "quality": quality,
        "complexity": complexity,
        "plagiarism": plagiarism,
    }


if __name__ == "__main__":

    sample_code = """
def add_numbers(a, b):
    return a + b


result = add_numbers(10, 20)
print(result)
"""

    previous_code = [
        """
def add_numbers(a, b):
    return a + b
"""
    ]

    result = evaluate_code(
        code=sample_code,
        previous_submissions=previous_code,
    )

    import json

    print(
        json.dumps(
            result,
            indent=2
        )
    )