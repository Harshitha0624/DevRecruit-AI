def clamp_score(score):
    try:
        score = float(score)
    except (TypeError, ValueError):
        score = 0.0

    return round(max(0.0, min(100.0, score)), 2)


def get_performance_level(score):
    score = clamp_score(score)

    if score >= 85:
        return "Excellent"
    elif score >= 70:
        return "Strong"
    elif score >= 55:
        return "Average"
    elif score >= 40:
        return "Needs Improvement"
    else:
        return "Weak"


def calculate_weighted_score(scores, weights):
    total = 0.0
    total_weight = 0.0

    for key, weight in weights.items():
        score = clamp_score(scores.get(key, 0))
        total += score * weight
        total_weight += weight

    if total_weight == 0:
        return 0.0

    return round(total / total_weight, 2)