def generate_improvement_tips(
    technical_score,
    communication_score,
    problem_solving_score,
    behavioral_score
):
    tips = []

    if float(technical_score) < 60:
        tips.append(
            "Strengthen core technical concepts and practice "
            "role-specific technical questions."
        )
    elif float(technical_score) < 80:
        tips.append(
            "Improve technical depth by solving more practical "
            "and scenario-based problems."
        )

    if float(communication_score) < 60:
        tips.append(
            "Practice explaining technical ideas clearly and "
            "structure answers before responding."
        )
    elif float(communication_score) < 80:
        tips.append(
            "Work on concise explanations and confident delivery "
            "during technical discussions."
        )

    if float(problem_solving_score) < 60:
        tips.append(
            "Practice data structures, algorithms, debugging, "
            "and step-by-step problem solving."
        )
    elif float(problem_solving_score) < 80:
        tips.append(
            "Explain your reasoning more systematically when "
            "solving unfamiliar problems."
        )

    if float(behavioral_score) < 60:
        tips.append(
            "Practice behavioral questions using the STAR "
            "(Situation, Task, Action, Result) approach."
        )
    elif float(behavioral_score) < 80:
        tips.append(
            "Use specific examples from projects and experience "
            "to make behavioral answers stronger."
        )

    if not tips:
        tips.append(
            "Maintain the current performance and continue "
            "practicing realistic interview scenarios."
        )

    return tips