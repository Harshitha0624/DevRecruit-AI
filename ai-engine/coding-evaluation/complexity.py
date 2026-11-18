import ast


def calculate_python_complexity(code: str) -> dict:
    """
    Static complexity analysis for Python code.
    """

    try:
        tree = ast.parse(code)
    except SyntaxError as exc:
        return {
            "status": "invalid",
            "cyclomatic_complexity": 0,
            "max_nesting_depth": 0,
            "error": str(exc),
        }

    complexity = 1
    max_depth = 0

    branching_nodes = (
        ast.If,
        ast.For,
        ast.While,
        ast.Try,
        ast.IfExp,
        ast.BoolOp,
        ast.comprehension,
    )

    def visit(node, depth=0):
        nonlocal complexity, max_depth

        max_depth = max(max_depth, depth)

        if isinstance(node, branching_nodes):
            complexity += 1

        child_depth = (
            depth + 1
            if isinstance(
                node,
                (ast.If, ast.For, ast.While, ast.FunctionDef)
            )
            else depth
        )

        for child in ast.iter_child_nodes(node):
            visit(child, child_depth)

    visit(tree)

    if complexity <= 5:
        level = "Low"
    elif complexity <= 10:
        level = "Moderate"
    else:
        level = "High"

    return {
        "status": "valid",
        "cyclomatic_complexity": complexity,
        "max_nesting_depth": max_depth,
        "complexity_level": level,
    }