import re


DEGREE_PATTERNS = [
    r"\bB\.?\s?Tech\b",
    r"\bB\.?\s?E\.?\b",
    r"\bM\.?\s?Tech\b",
    r"\bM\.?\s?E\.?\b",
    r"\bM\.?\s?C\.?\s?A\.?\b",
    r"\bB\.?\s?C\.?\s?A\.?\b",
    r"\bM\.?\s?S\.?\b",
    r"\bB\.?\s?S\.?\b",
    r"\bM\.?\s?B\.?\s?A\.?\b",
    r"\bPh\.?\s?D\.?\b",
]


def extract_education(text: str) -> list[str]:
    if not text:
        return []

    results = []

    lines = [
        line.strip()
        for line in text.splitlines()
        if line.strip()
    ]

    for line in lines:
        degree_found = any(
            re.search(pattern, line, re.IGNORECASE)
            for pattern in DEGREE_PATTERNS
        )

        education_keyword = re.search(
            r"\b(education|university|college|institute|degree)\b",
            line,
            re.IGNORECASE
        )

        if degree_found or education_keyword:
            if line not in results:
                results.append(line)

    return results[:20]