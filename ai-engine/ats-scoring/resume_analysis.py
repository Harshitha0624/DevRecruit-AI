import re


def clean_resume_text(text: str) -> str:
    if not text:
        return ""

    text = text.replace("\x00", " ")

    text = re.sub(
        r"[ \t]+",
        " ",
        text
    )

    text = re.sub(
        r"\n{3,}",
        "\n\n",
        text
    )

    return text.strip()


def count_resume_keywords(
    text: str,
    keywords: list[str]
) -> dict:

    text = clean_resume_text(text).lower()

    results = {}

    for keyword in keywords:

        keyword_clean = keyword.strip().lower()

        if not keyword_clean:
            continue

        pattern = (
            rf"(?<!\w)"
            rf"{re.escape(keyword_clean)}"
            rf"(?!\w)"
        )

        matches = re.findall(
            pattern,
            text
        )

        results[keyword] = len(matches)

    return results


def extract_resume_sections(text: str) -> dict:

    text = clean_resume_text(text)

    section_names = [
        "summary",
        "professional summary",
        "objective",
        "education",
        "technical skills",
        "skills",
        "experience",
        "internship experience",
        "work experience",
        "projects",
        "certifications",
        "achievements",
    ]

    lines = [
        line.strip()
        for line in text.splitlines()
        if line.strip()
    ]

    sections = {}

    current_section = "general"
    sections[current_section] = []

    for line in lines:

        normalized = line.lower().strip(
            " :-"
        )

        matched_section = None

        for section in section_names:

            if normalized == section:
                matched_section = section
                break

        if matched_section:

            current_section = matched_section

            if current_section not in sections:
                sections[current_section] = []

            continue

        sections[current_section].append(line)

    return {
        section: "\n".join(content).strip()
        for section, content in sections.items()
        if content
    }


def calculate_keyword_coverage(
    candidate_skills: list[str],
    required_skills: list[str]
) -> float:

    if not required_skills:
        return 100.0

    candidate_set = {
        skill.strip().lower()
        for skill in candidate_skills
        if skill.strip()
    }

    required_set = {
        skill.strip().lower()
        for skill in required_skills
        if skill.strip()
    }

    if not required_set:
        return 100.0

    matched = candidate_set.intersection(
        required_set
    )

    return round(
        len(matched) /
        len(required_set) *
        100,
        2
    )