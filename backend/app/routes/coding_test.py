from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user, require_role
from app.config.database import get_db
from app.models.coding_test import CodingTest
from app.models.job import Job
from app.models.user import User
from app.schemas.coding_test import (
    CodingTestCreate,
    CodingTestUpdate,
    CodingTestResponse,
)


router = APIRouter(
    prefix="/api/coding-tests",
    tags=["Coding Tests"]
)


@router.post(
    "",
    response_model=CodingTestResponse,
    status_code=status.HTTP_201_CREATED
)
def create_coding_test(
    test_data: CodingTestCreate,
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db)
):
    job = (
        db.query(Job)
        .filter(
            Job.id == test_data.job_id,
            Job.recruiter_id == current_user.id
        )
        .first()
    )

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found or does not belong to this recruiter"
        )

    coding_test = CodingTest(
        recruiter_id=current_user.id,
        job_id=test_data.job_id,
        title=test_data.title,
        description=test_data.description,
        duration_minutes=test_data.duration_minutes,
        programming_language=test_data.programming_language,
        total_marks=test_data.total_marks,
        is_active=True,
    )

    db.add(coding_test)
    db.commit()
    db.refresh(coding_test)

    return coding_test


@router.get(
    "/my-tests",
    response_model=list[CodingTestResponse]
)
def get_my_coding_tests(
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db)
):
    tests = (
        db.query(CodingTest)
        .filter(CodingTest.recruiter_id == current_user.id)
        .order_by(CodingTest.created_at.desc())
        .all()
    )

    return tests


@router.get(
    "/job/{job_id}",
    response_model=list[CodingTestResponse]
)
def get_job_coding_tests(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job = (
        db.query(Job)
        .filter(Job.id == job_id)
        .first()
    )

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    if (
        current_user.role == "recruiter"
        and job.recruiter_id != current_user.id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to view these coding tests"
        )

    tests = (
        db.query(CodingTest)
        .filter(
            CodingTest.job_id == job_id,
            CodingTest.is_active == True
        )
        .order_by(CodingTest.created_at.desc())
        .all()
    )

    return tests


@router.get(
    "/{test_id}",
    response_model=CodingTestResponse
)
def get_coding_test(
    test_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    coding_test = (
        db.query(CodingTest)
        .filter(CodingTest.id == test_id)
        .first()
    )

    if not coding_test:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Coding test not found"
        )

    if (
        current_user.role == "recruiter"
        and coding_test.recruiter_id != current_user.id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to view this coding test"
        )

    if (
        current_user.role == "candidate"
        and not coding_test.is_active
    ):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Coding test not found"
        )

    return coding_test


@router.put(
    "/{test_id}",
    response_model=CodingTestResponse
)
def update_coding_test(
    test_id: int,
    test_data: CodingTestUpdate,
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db)
):
    coding_test = (
        db.query(CodingTest)
        .filter(
            CodingTest.id == test_id,
            CodingTest.recruiter_id == current_user.id
        )
        .first()
    )

    if not coding_test:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Coding test not found or does not belong to this recruiter"
        )

    update_data = test_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(coding_test, field, value)

    db.commit()
    db.refresh(coding_test)

    return coding_test


@router.delete(
    "/{test_id}"
)
def delete_coding_test(
    test_id: int,
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db)
):
    coding_test = (
        db.query(CodingTest)
        .filter(
            CodingTest.id == test_id,
            CodingTest.recruiter_id == current_user.id
        )
        .first()
    )

    if not coding_test:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Coding test not found or does not belong to this recruiter"
        )

    coding_test.is_active = False

    db.commit()

    return {
        "message": "Coding test deleted successfully",
        "test_id": test_id
    }