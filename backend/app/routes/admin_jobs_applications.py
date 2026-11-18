from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.auth.dependencies import get_current_user


router = APIRouter(
    prefix="/api/admin",
    tags=["Admin Jobs & Applications"]
)


# =========================================================
# ADMIN ACCESS
# =========================================================

def check_admin(current_user):
    role = str(
        getattr(current_user, "role", "")
    ).lower()

    if role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )


# =========================================================
# TABLE COLUMNS
# =========================================================

def get_table_columns(db: Session, table_name: str):
    rows = db.execute(
        text(
            """
            SELECT column_name
            FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name = :table_name
            ORDER BY ordinal_position
            """
        ),
        {"table_name": table_name}
    ).mappings().all()

    return [row["column_name"] for row in rows]


# =========================================================
# SAFE SELECT
# =========================================================

def available_columns(
    actual_columns,
    preferred_columns
):
    return [
        column
        for column in preferred_columns
        if column in actual_columns
    ]


# =========================================================
# ADMIN JOBS
# =========================================================

@router.get("/jobs")
def get_admin_jobs(
    search: Optional[str] = Query(default=None),
    status: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    check_admin(current_user)

    columns = get_table_columns(
        db,
        "jobs"
    )

    if not columns:
        raise HTTPException(
            status_code=404,
            detail="Jobs table not found"
        )

    preferred = [
        "id",
        "title",
        "description",
        "company_id",
        "recruiter_id",
        "location",
        "job_type",
        "employment_type",
        "experience_required",
        "experience",
        "skills_required",
        "skills",
        "salary_min",
        "salary_max",
        "salary",
        "status",
        "created_at",
        "updated_at",
        "deadline"
    ]

    selected = available_columns(
        columns,
        preferred
    )

    if "id" not in selected:
        raise HTTPException(
            status_code=500,
            detail="Jobs table does not contain id"
        )

    column_sql = ", ".join(
        f'"{column}"'
        for column in selected
    )

    query = f"""
        SELECT {column_sql}
        FROM jobs
    """

    conditions = []
    params = {}

    # -----------------------------------------------------
    # STATUS FILTER
    # -----------------------------------------------------

    if status and "status" in columns:
        conditions.append(
            'LOWER(CAST("status" AS TEXT)) '
            '= LOWER(:status)'
        )
        params["status"] = status

    # -----------------------------------------------------
    # SEARCH
    # -----------------------------------------------------

    if search:

        searchable = [
            column
            for column in [
                "title",
                "description",
                "location",
                "job_type",
                "employment_type",
                "experience_required",
                "experience",
                "skills_required",
                "skills",
                "salary"
            ]
            if column in columns
        ]

        if searchable:

            search_conditions = []

            for index, column in enumerate(
                searchable
            ):
                parameter = f"search_{index}"

                search_conditions.append(
                    f'LOWER(CAST("{column}" AS TEXT)) '
                    f'LIKE LOWER(:{parameter})'
                )

                params[parameter] = (
                    f"%{search}%"
                )

            conditions.append(
                "(" +
                " OR ".join(search_conditions) +
                ")"
            )

    if conditions:
        query += " WHERE " + " AND ".join(
            conditions
        )

    query += ' ORDER BY "id" DESC'

    rows = db.execute(
        text(query),
        params
    ).mappings().all()

    return {
        "success": True,
        "total": len(rows),
        "jobs": [
            dict(row)
            for row in rows
        ]
    }


# =========================================================
# ADMIN JOB DETAILS
# =========================================================

@router.get("/jobs/{job_id}")
def get_admin_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    check_admin(current_user)

    columns = get_table_columns(
        db,
        "jobs"
    )

    if not columns:
        raise HTTPException(
            status_code=404,
            detail="Jobs table not found"
        )

    preferred = [
        "id",
        "title",
        "description",
        "company_id",
        "recruiter_id",
        "location",
        "job_type",
        "employment_type",
        "experience_required",
        "experience",
        "skills_required",
        "skills",
        "salary_min",
        "salary_max",
        "salary",
        "status",
        "created_at",
        "updated_at",
        "deadline"
    ]

    selected = available_columns(
        columns,
        preferred
    )

    column_sql = ", ".join(
        f'"{column}"'
        for column in selected
    )

    row = db.execute(
        text(
            f"""
            SELECT {column_sql}
            FROM jobs
            WHERE id = :job_id
            """
        ),
        {"job_id": job_id}
    ).mappings().first()

    if not row:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    return {
        "success": True,
        "job": dict(row)
    }


# =========================================================
# ADMIN APPLICATIONS
# =========================================================

@router.get("/applications")
def get_admin_applications(
    status: Optional[str] = Query(default=None),
    candidate_id: Optional[int] = Query(default=None),
    job_id: Optional[int] = Query(default=None),
    search: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    check_admin(current_user)

    columns = get_table_columns(
        db,
        "applications"
    )

    if not columns:
        raise HTTPException(
            status_code=404,
            detail="Applications table not found"
        )

    preferred = [
        "id",
        "candidate_id",
        "job_id",
        "status",
        "ats_score",
        "resume_score",
        "skill_score",
        "coding_score",
        "ai_score",
        "applied_at",
        "created_at",
        "updated_at",
        "cover_letter",
        "notes"
    ]

    selected = available_columns(
        columns,
        preferred
    )

    if "id" not in selected:
        raise HTTPException(
            status_code=500,
            detail="Applications table does not contain id"
        )

    column_sql = ", ".join(
        f'"{column}"'
        for column in selected
    )

    query = f"""
        SELECT {column_sql}
        FROM applications
    """

    conditions = []
    params = {}

    # -----------------------------------------------------
    # STATUS
    # -----------------------------------------------------

    if status and "status" in columns:

        conditions.append(
            'LOWER(CAST("status" AS TEXT)) '
            '= LOWER(:status)'
        )

        params["status"] = status

    # -----------------------------------------------------
    # CANDIDATE
    # -----------------------------------------------------

    if (
        candidate_id is not None
        and "candidate_id" in columns
    ):

        conditions.append(
            '"candidate_id" = :candidate_id'
        )

        params["candidate_id"] = candidate_id

    # -----------------------------------------------------
    # JOB
    # -----------------------------------------------------

    if (
        job_id is not None
        and "job_id" in columns
    ):

        conditions.append(
            '"job_id" = :job_id'
        )

        params["job_id"] = job_id

    # -----------------------------------------------------
    # SEARCH
    # -----------------------------------------------------

    if search:

        searchable = [
            column
            for column in [
                "status",
                "cover_letter",
                "notes"
            ]
            if column in columns
        ]

        search_conditions = []

        for index, column in enumerate(
            searchable
        ):

            parameter = f"search_{index}"

            search_conditions.append(
                f'LOWER(CAST("{column}" AS TEXT)) '
                f'LIKE LOWER(:{parameter})'
            )

            params[parameter] = (
                f"%{search}%"
            )

        # Search by candidate/job IDs
        if "candidate_id" in columns:
            search_conditions.append(
                'CAST("candidate_id" AS TEXT) '
                'LIKE :id_search'
            )

        if "job_id" in columns:
            search_conditions.append(
                'CAST("job_id" AS TEXT) '
                'LIKE :id_search'
            )

        params["id_search"] = f"%{search}%"

        if search_conditions:

            conditions.append(
                "(" +
                " OR ".join(search_conditions) +
                ")"
            )

    if conditions:
        query += " WHERE " + " AND ".join(
            conditions
        )

    query += ' ORDER BY "id" DESC'

    rows = db.execute(
        text(query),
        params
    ).mappings().all()

    return {
        "success": True,
        "total": len(rows),
        "applications": [
            dict(row)
            for row in rows
        ]
    }


# =========================================================
# ADMIN APPLICATION DETAILS
# =========================================================

@router.get("/applications/{application_id}")
def get_admin_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    check_admin(current_user)

    columns = get_table_columns(
        db,
        "applications"
    )

    if not columns:
        raise HTTPException(
            status_code=404,
            detail="Applications table not found"
        )

    preferred = [
        "id",
        "candidate_id",
        "job_id",
        "status",
        "ats_score",
        "resume_score",
        "skill_score",
        "coding_score",
        "ai_score",
        "applied_at",
        "created_at",
        "updated_at",
        "cover_letter",
        "notes"
    ]

    selected = available_columns(
        columns,
        preferred
    )

    column_sql = ", ".join(
        f'"{column}"'
        for column in selected
    )

    row = db.execute(
        text(
            f"""
            SELECT {column_sql}
            FROM applications
            WHERE id = :application_id
            """
        ),
        {
            "application_id": application_id
        }
    ).mappings().first()

    if not row:
        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    return {
        "success": True,
        "application": dict(row)
    }