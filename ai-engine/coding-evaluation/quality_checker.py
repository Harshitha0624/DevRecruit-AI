import ast


def check_code_quality(code: str) -> dict:
    """
    Perform static code-quality checks.
    """

    if not code or not code.strip():
        return {
            "quality_score": 0,
            "issues": ["Code is empty."],
            "lines_of_code": 0,
        }

    issues = []
    score = 100

    lines = code.splitlines()
    non_empty_lines = [
        line for line in lines
        if line.strip()
    ]

    if len(code) > 5000:
        issues.append("Code is unnecessarily large.")
        score -= 10

    long_lines = [
        index + 1
        for index, line in enumerate(lines)
        if len(line) > 100
    ]

    if long_lines:
        issues.append(
            f"Long lines detected at lines: {long_lines[:10]}"
        )
        score -= 5

    try:
        tree = ast.parse(code)

        function_count = sum(
            isinstance(node, ast.FunctionDef)
            for node in ast.walk(tree)
        )

        class_count = sum(
            isinstance(node, ast.ClassDef)
            for node in ast.walk(tree)
        )

        if function_count == 0 and len(non_empty_lines) > 30:
            issues.append(
                "Consider breaking the code into functions."
            )
            score -= 5

        bare_except_count = sum(
            isinstance(node, ast.ExceptHandler)
            and node.type is None
            for node in ast.walk(tree)
        )

        if bare_except_count:
            issues.append(
                "Bare exception handler detected."
            )
            score -= 10

        if class_count > 20:
            issues.append(
                "Large number of classes detected."
            )
            score -= 5

    except SyntaxError:
        issues.append("Code contains syntax errors.")
        score -= 40

    comment_lines = [
        line for line in lines
        if line.strip().startswith("#")
    ]

    if (
        len(non_empty_lines) > 15
        and len(comment_lines) == 0
    ):
        issues.append(
            "Consider adding comments or documentation."
        )
        score -= 5

    score = max(0, min(100, score))

    if score >= 80:
        quality_level = "Good"
    elif score >= 60:
        quality_level = "Moderate"
    else:
        quality_level = "Needs Improvement"

    return {
        "quality_score": score,
        "quality_level": quality_level,
        "issues": issues,
        "lines_of_code": len(non_empty_lines),
    }