VALID_DIFFICULTIES = {
    "easy": "Easy",
    "medium": "Medium",
    "hard": "Hard"
}


def normalize_difficulty(difficulty):
    if not isinstance(difficulty, str):
        return "Medium"

    value = difficulty.strip().lower()

    return VALID_DIFFICULTIES.get(value, "Medium")


def get_difficulty_description(difficulty):
    difficulty = normalize_difficulty(difficulty)

    descriptions = {
        "Easy": (
            "Tests basic programming concepts, simple logic, "
            "loops, conditions, strings, or arrays."
        ),
        "Medium": (
            "Tests intermediate data structures, algorithms, "
            "hashing, sorting, recursion, or problem solving."
        ),
        "Hard": (
            "Tests advanced algorithms, optimization, complex "
            "data structures, graphs, dynamic programming, or system-level reasoning."
        )
    }

    return descriptions[difficulty]


def get_default_marks(difficulty):
    difficulty = normalize_difficulty(difficulty)

    marks = {
        "Easy": 5,
        "Medium": 10,
        "Hard": 15
    }

    return marks[difficulty]