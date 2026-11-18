from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile


UPLOAD_DIR = Path("uploads/resumes")

ALLOWED_EXTENSIONS = {
    ".pdf",
    ".doc",
    ".docx",
}

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB


async def save_resume(upload_file: UploadFile):
    original_filename = upload_file.filename or "resume"

    extension = Path(original_filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise ValueError(
            "Only PDF, DOC, and DOCX files are allowed"
        )

    file_content = await upload_file.read()

    if len(file_content) > MAX_FILE_SIZE:
        raise ValueError(
            "Resume file size must not exceed 5 MB"
        )

    UPLOAD_DIR.mkdir(
        parents=True,
        exist_ok=True
    )

    stored_filename = (
        f"{uuid4().hex}{extension}"
    )

    file_path = (
        UPLOAD_DIR / stored_filename
    )

    file_path.write_bytes(file_content)

    return {
        "original_filename": original_filename,
        "stored_filename": stored_filename,
        "file_path": str(file_path),
        "file_type": upload_file.content_type
        or "application/octet-stream",
        "file_size": len(file_content),
    }