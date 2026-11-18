import subprocess
import sys
import tempfile
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import require_role
from app.config.database import get_db

from app.models.coding_submission import CodingSubmission
from app.models.coding_question import CodingQuestion
from app.models.coding_test import CodingTest
from app.models.user import User

from app.schemas.coding_submission import (
    CodingSubmissionCreate,
    CodingSubmissionResponse,
)

from app.models.coding_submission import CodingSubmission


# ============================================================
# AI CODING EVALUATION ENGINE
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[3]

CODING_EVALUATION_DIR = (
    PROJECT_ROOT
    / "ai-engine"
    / "coding-evaluation"
)

if str(CODING_EVALUATION_DIR) not in sys.path:
    sys.path.insert(
        0,
        str(CODING_EVALUATION_DIR)
    )

from code_evaluator import evaluate_code


# ============================================================
# ROUTER
# ============================================================

router = APIRouter(
    prefix="/api/coding-submissions",
    tags=["Coding Submissions"]
)


# ============================================================
# SUBMIT CODING SOLUTION
# ============================================================

@router.post(
    "",
    response_model=CodingSubmissionResponse,
    status_code=status.HTTP_201_CREATED
)
def submit_coding_solution(
    submission_data: CodingSubmissionCreate,
    current_user: User = Depends(
        require_role("candidate")
    ),
    db: Session = Depends(get_db)
):

    # ========================================================
    # VALIDATE CODING TEST
    # ========================================================

    coding_test = (
        db.query(CodingTest)
        .filter(
            CodingTest.id
            == submission_data.coding_test_id,
            CodingTest.is_active == True
        )
        .first()
    )

    if not coding_test:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Coding test not found"
        )


    # ========================================================
    # VALIDATE QUESTION
    # ========================================================

    question = (
        db.query(CodingQuestion)
        .filter(
            CodingQuestion.id
            == submission_data.question_id,
            CodingQuestion.coding_test_id
            == submission_data.coding_test_id,
            CodingQuestion.is_active == True
        )
        .first()
    )

    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                "Coding question not found "
                "for this coding test"
            )
        )


    # ========================================================
    # VALIDATE LANGUAGE
    # ========================================================

    if submission_data.language.lower() != "python":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Currently only Python submissions "
                "are supported"
            )
        )


    # ========================================================
    # TEST CASES
    # ========================================================

    test_cases = question.test_cases or []

    if not test_cases:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "No test cases are configured "
                "for this question"
            )
        )


    # ========================================================
    # RUN FUNCTIONAL TEST CASES
    # ========================================================

    results = []
    passed_count = 0

    for index, test_case in enumerate(
        test_cases,
        start=1
    ):

        test_input = str(
            test_case.get("input", "")
        )

        expected_output = str(
            test_case.get(
                "expected_output",
                ""
            )
        ).strip()

        test_result = {
            "test_case": index,
            "passed": False,
            "expected_output": expected_output,
            "actual_output": "",
            "error": None,
        }

        try:

            with tempfile.TemporaryDirectory() as temp_dir:

                file_path = (
                    Path(temp_dir)
                    / "solution.py"
                )

                file_path.write_text(
                    submission_data.source_code,
                    encoding="utf-8"
                )

                process = subprocess.run(
                    [
                        sys.executable,
                        str(file_path)
                    ],
                    input=test_input,
                    text=True,
                    capture_output=True,
                    timeout=5
                )

            actual_output = (
                process.stdout.strip()
            )

            test_result[
                "actual_output"
            ] = actual_output

            if process.returncode != 0:

                test_result["error"] = (
                    process.stderr.strip()
                )

            elif (
                actual_output
                == expected_output
            ):

                test_result["passed"] = True
                passed_count += 1

        except subprocess.TimeoutExpired:

            test_result["error"] = (
                "Execution timed out"
            )

        except Exception as exc:

            test_result["error"] = str(exc)

        results.append(test_result)


    # ========================================================
    # FUNCTIONAL SCORE
    # ========================================================

    total_tests = len(test_cases)

    max_score = float(
        question.marks
    )

    score = (
        (
            passed_count
            / total_tests
        )
        * max_score
        if total_tests > 0
        else 0.0
    )


    # ========================================================
    # PREVIOUS SUBMISSIONS
    # FOR PLAGIARISM CHECK
    # ========================================================

    previous_records = (
        db.query(CodingSubmission.source_code)
        .filter(
            CodingSubmission.coding_test_id
            == submission_data.coding_test_id,

            CodingSubmission.question_id
            == submission_data.question_id
        )
        .all()
    )

    previous_submissions = [
        record[0]
        for record in previous_records
        if record[0]
    ]


    # ========================================================
    # AI CODING EVALUATION
    # ========================================================

    ai_evaluation = None

    try:

        ai_evaluation = evaluate_code(
            code=submission_data.source_code,
            previous_submissions=(
                previous_submissions
            )
        )

    except Exception as exc:

        print(
            "AI coding evaluation failed: "
            f"{exc}"
        )

        ai_evaluation = {
            "status": "evaluation_failed",
            "error": str(exc)
        }


    # ========================================================
    # ATTACH AI EVALUATION TO TEST RESULTS
    # ========================================================

    results.append({
        "ai_evaluation": ai_evaluation
    })


    # ========================================================
    # CREATE SUBMISSION
    # ========================================================

    submission = CodingSubmission(
        coding_test_id=(
            submission_data.coding_test_id
        ),

        question_id=(
            submission_data.question_id
        ),

        candidate_id=current_user.id,

        source_code=(
            submission_data.source_code
        ),

        language=(
            submission_data.language
        ),

        score=round(
            score,
            2
        ),

        max_score=max_score,

        test_results=results,

        status="evaluated",
    )


    db.add(submission)

    db.commit()

    db.refresh(submission)

    return submission


# ============================================================
# CANDIDATE: VIEW MY SUBMISSIONS
# ============================================================

@router.get(
    "/my-submissions",
    response_model=list[CodingSubmissionResponse]
)
def get_my_submissions(
    current_user: User = Depends(
        require_role("candidate")
    ),
    db: Session = Depends(get_db)
):

    submissions = (
        db.query(CodingSubmission)
        .filter(
            CodingSubmission.candidate_id
            == current_user.id
        )
        .order_by(
            CodingSubmission.submitted_at.desc()
        )
        .all()
    )

    return submissions