import re


def normalize_text(text: str) -> str:
    if not text:
        return ""

    text = text.replace("\x00", " ")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)

    return text.strip()


def clean_lines(text: str) -> list[str]:
    if not text:
        return []

    return [
        re.sub(r"\s+", " ", line).strip()
        for line in text.splitlines()
        if line.strip()
    ]


def find_email(text: str) -> str | None:
    match = re.search(
        r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b",
        text,
        re.IGNORECASE
    )

    return match.group(0) if match else None


def find_phone(text: str) -> str | None:
    patterns = [
        r"\+91[\s-]*\d{5}[\s-]*\d{5}",
        r"\+91[\s-]*\d{10}",
        r"\b[6-9]\d{4}[\s-]?\d{5}\b",
        r"\b[6-9]\d{9}\b",
    ]

    for pattern in patterns:
        match = re.search(
            pattern,
            text
        )

        if match:
            return re.sub(
                r"\s+",
                " ",
                match.group(0)
            ).strip()

    return None


def find_link(text: str, domain: str) -> str | None:
    pattern = (
        rf"(?:https?://)?"
        rf"(?:www\.)?"
        rf"{re.escape(domain)}"
        rf"/[A-Za-z0-9._~:/?#@!$&'()*+,;=%-]+"
    )

    match = re.search(
        pattern,
        text,
        re.IGNORECASE
    )

    if not match:
        return None

    return match.group(0).rstrip(".,;)")


def find_github(text: str) -> str | None:
    return find_link(text, "github.com")


def find_linkedin(text: str) -> str | None:
    return find_link(text, "linkedin.com")