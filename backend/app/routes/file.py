from pathlib import Path

from fastapi import (
    APIRouter,
    Depends,
    File as FastAPIFile,
    HTTPException,
    UploadFile,
    status,
)

from fastapi.responses import FileResponse as FastAPIFileResponse
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.config.database import get_db
from app.models.file import File
from app.models.user import User
from app.schemas.file import FileResponse
from app.services.file_service import save_resume
from app.services.resume_analysis_service import analyze_resume


router = APIRouter(
    prefix="/api/files",
    tags=["Files"]
)


# =======================================================
# UPLOAD RESUME
# =======================================================

@router.post(
    "/resume",
    status_code=status.HTTP_201_CREATED
)
async def upload_resume(
    resume: UploadFile = FastAPIFile(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Only candidates can upload resumes
    if current_user.role != "candidate":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only candidates can upload resumes"
        )

    # ---------------------------------------------------
    # Save uploaded resume
    # ---------------------------------------------------

    try:
        file_data = await save_resume(resume)

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc)
        )

    # ---------------------------------------------------
    # Save file record in database
    # ---------------------------------------------------

    new_file = File(
        user_id=current_user.id,
        original_filename=file_data["original_filename"],
        stored_filename=file_data["stored_filename"],
        file_path=file_data["file_path"],
        file_type=file_data["file_type"],
        category="resume",
        file_size=file_data["file_size"],
    )

    db.add(new_file)
    db.commit()
    db.refresh(new_file)

    # ---------------------------------------------------
    # AI RESUME ANALYSIS
    # ---------------------------------------------------

    resume_analysis = None

    try:
        extension = Path(
            new_file.original_filename
        ).suffix.lower()

        # Current AI parser supports PDF and DOCX
        if extension in {".pdf", ".docx"}:

            resume_analysis = analyze_resume(
                new_file.file_path
            )

        else:

            resume_analysis = {
                "status": "not_supported",
                "message": (
                    "AI analysis currently supports "
                    "PDF and DOCX resumes."
                )
            }

    except Exception as exc:

        print(
            f"Resume AI analysis failed: {exc}"
        )

        # Upload should still succeed even if
        # AI analysis fails
        resume_analysis = {
            "status": "analysis_failed",
            "message": (
                "Resume uploaded successfully, "
                "but AI analysis could not be completed."
            )
        }

    # ---------------------------------------------------
    # Response
    # ---------------------------------------------------

    return {
        "id": new_file.id,
        "user_id": new_file.user_id,
        "original_filename": new_file.original_filename,
        "stored_filename": new_file.stored_filename,
        "file_path": new_file.file_path,
        "file_type": new_file.file_type,
        "category": new_file.category,
        "file_size": new_file.file_size,
        "resume_analysis": resume_analysis,
    }


# =======================================================
# GET MY RESUMES
# =======================================================

@router.get(
    "/my-resumes",
    response_model=list[FileResponse]
)
def get_my_resumes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    files = (
        db.query(File)
        .filter(
            File.user_id == current_user.id,
            File.category == "resume"
        )
        .order_by(File.created_at.desc())
        .all()
    )

    return files


# =======================================================
# DOWNLOAD RESUME
# =======================================================

@router.get(
    "/{file_id}/download"
)
def download_file(
    file_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    file_record = (
        db.query(File)
        .filter(
            File.id == file_id,
            File.user_id == current_user.id
        )
        .first()
    )

    if not file_record:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found"
        )

    file_path = Path(file_record.file_path)

    if not file_path.exists():

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Stored file not found"
        )

    return FastAPIFileResponse(
        path=file_path,
        media_type=file_record.file_type,
        filename=file_record.original_filename
    )


# =======================================================
# DELETE RESUME
# =======================================================

@router.delete(
    "/{file_id}"
)
def delete_file(
    file_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    file_record = (
        db.query(File)
        .filter(
            File.id == file_id,
            File.user_id == current_user.id
        )
        .first()
    )

    if not file_record:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found"
        )

    file_path = Path(file_record.file_path)

    if file_path.exists():
        file_path.unlink()

    db.delete(file_record)
    db.commit()

    return {
        "message": "File deleted successfully",
        "file_id": file_id
    }