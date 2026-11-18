
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.auth.dependencies import get_current_user


router = APIRouter(
    prefix="/api/admin",
    tags=["Admin Organizations"]
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
# SAFE TABLE COLUMNS
# =========================================================

def get_table_columns(db: Session, table_name: str):
    rows = db.execute(
        text("""
            SELECT column_name
            FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name = :table_name
            ORDER BY ordinal_position
        """),
        {"table_name": table_name}
    ).mappings().all()

    return [row["column_name"] for row in rows]


# =========================================================
# ADMIN RECRUITERS
# =========================================================

@router.get("/recruiters")
def get_admin_recruiters(
    search: Optional[str] = Query(default=None),
    is_active: Optional[bool] = Query(default=None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    check_admin(current_user)

    recruiters = db.execute(
        text("""
            SELECT
                id,
                email,
                full_name,
                role,
                is_active,
                created_at
            FROM users
            WHERE LOWER(role) = 'recruiter'
            ORDER BY id DESC
        """)
    ).mappings().all()

    result = []

    for recruiter in recruiters:

        if search:
            search_text = search.lower()

            if (
                search_text not in str(recruiter["email"] or "").lower()
                and search_text not in str(recruiter["full_name"] or "").lower()
            ):
                continue

        if (
            is_active is not None
            and recruiter["is_active"] != is_active
        ):
            continue

        result.append(dict(recruiter))

    return {
        "success": True,
        "total": len(result),
        "recruiters": result
    }


# =========================================================
# ADMIN RECRUITER DETAILS
# =========================================================

@router.get("/recruiters/{recruiter_id}")
def get_admin_recruiter(
    recruiter_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    check_admin(current_user)

    recruiter = db.execute(
        text("""
            SELECT
                id,
                email,
                full_name,
                role,
                is_active,
                created_at
            FROM users
            WHERE id = :recruiter_id
              AND LOWER(role) = 'recruiter'
        """),
        {"recruiter_id": recruiter_id}
    ).mappings().first()

    if not recruiter:
        raise HTTPException(
            status_code=404,
            detail="Recruiter not found"
        )

    return {
        "success": True,
        "recruiter": dict(recruiter)
    }


# =========================================================
# ADMIN COMPANIES / ORGANIZATIONS
# Actual database table: company_profiles
# =========================================================

@router.get("/companies")
def get_admin_companies(
    search: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    check_admin(current_user)

    table_name = "company_profiles"
    columns = get_table_columns(db, table_name)

    if not columns:
        raise HTTPException(
            status_code=404,
            detail="Company profiles table not found"
        )

    preferred_columns = [
        "id",
        "recruiter_id",
        "company_name",
        "company_description",
        "industry",
        "company_size",
        "website",
        "location",
        "logo_url",
        "created_at",
        "updated_at"
    ]

    selected = [
        column
        for column in preferred_columns
        if column in columns
    ]

    if "id" not in selected:
        raise HTTPException(
            status_code=500,
            detail="Company profiles table does not contain id"
        )

    column_sql = ", ".join(
        f'"{column}"'
        for column in selected
    )

    query = f"""
        SELECT {column_sql}
        FROM company_profiles
    """

    params = {}

    search_columns = [
        column
        for column in [
            "company_name",
            "industry",
            "location",
            "website"
        ]
        if column in columns
    ]

    if search and search_columns:

        conditions = []

        for index, column in enumerate(search_columns):
            parameter = f"search_{index}"

            conditions.append(
                f'LOWER(CAST("{column}" AS TEXT)) '
                f'LIKE LOWER(:{parameter})'
            )

            params[parameter] = f"%{search}%"

        query += " WHERE " + " OR ".join(conditions)

    query += ' ORDER BY "id" DESC'

    rows = db.execute(
        text(query),
        params
    ).mappings().all()

    return {
        "success": True,
        "total": len(rows),
        "companies": [
            dict(row)
            for row in rows
        ]
    }


# =========================================================
# ADMIN COMPANY DETAILS
# Actual database table: company_profiles
# =========================================================

@router.get("/companies/{company_id}")
def get_admin_company(
    company_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    check_admin(current_user)

    table_name = "company_profiles"
    columns = get_table_columns(db, table_name)

    if not columns:
        raise HTTPException(
            status_code=404,
            detail="Company profiles table not found"
        )

    preferred_columns = [
        "id",
        "recruiter_id",
        "company_name",
        "company_description",
        "industry",
        "company_size",
        "website",
        "location",
        "logo_url",
        "created_at",
        "updated_at"
    ]

    selected = [
        column
        for column in preferred_columns
        if column in columns
    ]

    if "id" not in selected:
        raise HTTPException(
            status_code=500,
            detail="Company profiles table does not contain id"
        )

    column_sql = ", ".join(
        f'"{column}"'
        for column in selected
    )

    row = db.execute(
        text(f"""
            SELECT {column_sql}
            FROM company_profiles
            WHERE id = :company_id
        """),
        {"company_id": company_id}
    ).mappings().first()

    if not row:
        raise HTTPException(
            status_code=404,
            detail="Company not found"
        )

    return {
        "success": True,
        "company": dict(row)
    }
