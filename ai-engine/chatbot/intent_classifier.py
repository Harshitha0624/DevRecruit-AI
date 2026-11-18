INTENT_KEYWORDS = {
    "greeting": [
        "hello",
        "hi",
        "hey",
        "good morning",
        "good afternoon",
        "good evening"
    ],
    "jobs": [
        "job",
        "jobs",
        "vacancy",
        "vacancies",
        "opening",
        "openings",
        "hiring",
        "position"
    ],
    "resume": [
        "resume",
        "cv",
        "ats",
        "resume score",
        "resume analysis"
    ],
    "assessment": [
        "assessment",
        "test",
        "coding test",
        "coding assessment",
        "coding",
        "exam"
    ],
    "interview": [
        "interview",
        "feedback",
        "interview feedback",
        "interview schedule",
        "interview preparation"
    ],
    "learning": [
        "learn",
        "learning",
        "course",
        "courses",
        "study",
        "roadmap",
        "skill development"
    ],
    "application": [
        "application",
        "applications",
        "applied",
        "application status",
        "track application"
    ],
    "career": [
        "career",
        "career path",
        "career prediction",
        "role",
        "developer path"
    ],
    "blockchain": [
        "blockchain",
        "certificate",
        "credential",
        "verification",
        "verify certificate"
    ]
}


def classify_intent(message):
    text = message.lower().strip()

    best_intent = "unknown"
    best_score = 0

    for intent, keywords in INTENT_KEYWORDS.items():
        score = 0

        for keyword in keywords:
            if keyword in text:
                score += 1

        if score > best_score:
            best_score = score
            best_intent = intent

    return best_intent