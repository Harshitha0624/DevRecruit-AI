from pathlib import Path

from pypdf import PdfReader
from docx import Document

try:
    from .parser_utils import (
        normalize_text,
        find_email,
        find_phone,
        find_github,
        find_linkedin,
    )
    from .skills_extractor import (
        extract_skills,
        extract_skills_by_category,
    )
    from .education_extractor import extract_education
    from .experience_extractor import extract_experience

except ImportError:
    from parser_utils import (
        normalize_text,
        find_email,
        find_phone,
        find_github,
        find_linkedin,
    )
    from skills_extractor import (
        extract_skills,
        extract_skills_by_category,
    )
    from education_extractor import extract_education
    from experience_extractor import extract_experience


SUPPORTED_EXTENSIONS = {
    ".pdf",
    ".docx",
}


def extract_text_from_pdf(file_path: Path) -> str:
    reader = PdfReader(str(file_path))

    pages = []

    for page in reader.pages:
        text = page.extract_text()

        if text:
            pages.append(text)

    return "\n".join(pages)


def extract_text_from_docx(file_path: Path) -> str:
    document = Document(str(file_path))

    paragraphs = [
        paragraph.text
        for paragraph in document.paragraphs
        if paragraph.text.strip()
    ]

    return "\n".join(paragraphs)


def extract_text(file_path: str) -> str:
    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(
            f"Resume file not found: {file_path}"
        )

    extension = path.suffix.lower()

    if extension == ".pdf":
        return extract_text_from_pdf(path)

    if extension == ".docx":
        return extract_text_from_docx(path)

    raise ValueError(
        "Unsupported resume format. "
        "Supported formats: PDF and DOCX."
    )


def parse_resume(file_path: str) -> dict:
    raw_text = extract_text(file_path)
    text = normalize_text(raw_text)

    if not text:
        raise ValueError(
            "No readable text was found in the resume."
        )

    experience = extract_experience(text)

    return {
        "file_name": Path(file_path).name,
        "contact": {
            "email": find_email(text),
            "phone": find_phone(text),
            "github": find_github(text),
            "linkedin": find_linkedin(text),
        },
        "skills": extract_skills(text),
        "skills_by_category": extract_skills_by_category(text),
        "education": extract_education(text),
        "experience": experience,
        "text": text,
    }


if __name__ == "__main__":
    import json
    import sys

    if len(sys.argv) != 2:
        print(
            "Usage: python resume_parser.py <resume_path>"
        )
        raise SystemExit(1)

    result = parse_resume(sys.argv[1])

    print(
        json.dumps(
            result,
            indent=2,
            ensure_ascii=False
        )
    )