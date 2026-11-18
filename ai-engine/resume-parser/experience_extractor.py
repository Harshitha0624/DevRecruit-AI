import re
from datetime import datetime


ROLE_KEYWORDS = [
    "software engineer",
    "software developer",
    "backend developer",
    "frontend developer",
    "full stack developer",
    "full-stack developer",
    "web developer",
    "python developer",
    "java developer",
    "data scientist",
    "data analyst",
    "machine learning engineer",
    "ai engineer",
    "devops engineer",
    "cloud engineer",
    "intern",
    "developer",
    "engineer",
]


MONTHS = {
    "jan": 1,
    "january": 1,
    "feb": 2,
    "february": 2,
    "mar": 3,
    "march": 3,
    "apr": 4,
    "april": 4,
    "may": 5,
    "jun": 6,
    "june": 6,
    "jul": 7,
    "july": 7,
    "aug": 8,
    "august": 8,
    "sep": 9,
    "sept": 9,
    "september": 9,
    "oct": 10,
    "october": 10,
    "nov": 11,
    "november": 11,
    "dec": 12,
    "december": 12,
}


def extract_explicit_experience_years(text: str) -> float:
    if not text:
        return 0.0

    pattern = r"(\d+(?:\.\d+)?)\+?\s*(?:years?|yrs?)"

    values = [
        float(value)
        for value in re.findall(
            pattern,
            text,
            re.IGNORECASE
        )
    ]

    return max(values) if values else 0.0


def parse_month_year(value: str):
    value = value.lower().strip()

    match = re.search(
        r"(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|"
        r"may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|"
        r"oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)"
        r"\s+(\d{4})",
        value,
        re.IGNORECASE
    )

    if not match:
        return None

    month_name = match.group(1).lower()
    year = int(match.group(2))

    month = MONTHS.get(month_name)

    if month is None:
        return None

    return datetime(year, month, 1)


def extract_date_ranges(text: str) -> list[dict]:
    if not text:
        return []

    pattern = (
        r"((?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|"
        r"May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|"
        r"Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)"
        r"\s+\d{4})"
        r"\s*[–—-]\s*"
        r"((?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|"
        r"May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|"
        r"Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)"
        r"\s+\d{4}|Present|Current)"
    )

    ranges = []

    for match in re.finditer(
        pattern,
        text,
        re.IGNORECASE
    ):
        start = parse_month_year(match.group(1))

        end_text = match.group(2)

        if end_text.lower() in {"present", "current"}:
            end = datetime.now().replace(day=1)
        else:
            end = parse_month_year(end_text)

        if start and end and end >= start:
            ranges.append({
                "start": start.strftime("%Y-%m"),
                "end": end.strftime("%Y-%m"),
            })

    return ranges


def calculate_total_experience_years(text: str) -> float:
    explicit_years = extract_explicit_experience_years(text)

    date_ranges = extract_date_ranges(text)

    if not date_ranges:
        return explicit_years

    total_months = 0

    for item in date_ranges:
        start_year, start_month = map(
            int,
            item["start"].split("-")
        )

        end_year, end_month = map(
            int,
            item["end"].split("-")
        )

        months = (
            (end_year - start_year) * 12
            + (end_month - start_month)
            + 1
        )

        total_months += max(months, 0)

    calculated_years = round(
        total_months / 12,
        1
    )

    return max(
        explicit_years,
        calculated_years
    )


def extract_roles(text: str) -> list[str]:
    if not text:
        return []

    found = []
    lower_text = text.lower()

    for role in ROLE_KEYWORDS:
        if role in lower_text:
            found.append(role.title())

    return sorted(set(found))


def extract_experience(text: str) -> dict:
    return {
        "experience_years": calculate_total_experience_years(text),
        "roles": extract_roles(text),
        "date_ranges": extract_date_ranges(text),
    }