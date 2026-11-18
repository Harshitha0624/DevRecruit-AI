from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.auth.dependencies import get_current_user


router = APIRouter(
    prefix="/api/admin/users",
    tags=["Admin Users"]
)


# =======================================================
# ADMIN ACCESS
# =======================================================

def check_admin(current_user):
    role = str(
        getattr(current_user, "role", "")
    ).lower()

    if role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )


# =======================================================
# GET USERS
# =======================================================

@router.get("")
def get_users(
    role: Optional[str] = Query(default=None),
    search: Optional[str] = Query(default=None),
    is_active: Optional[bool] = Query(default=None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    check_admin(current_user)

    query = """
        SELECT
            id,
            email,
            full_name,
            role,
            is_active,
            created_at
        FROM users
        WHERE 1=1
    """

    params = {}

    if role:
        query += " AND LOWER(role) = LOWER(:role)"
        params["role"] = role

    if search:
        query += """
            AND (
                LOWER(full_name) LIKE LOWER(:search)
                OR LOWER(email) LIKE LOWER(:search)
            )
        """
        params["search"] = f"%{search}%"

    if is_active is not None:
        query += " AND is_active = :is_active"
        params["is_active"] = is_active

    query += " ORDER BY id DESC"

    rows = db.execute(
        text(query),
        params
    ).mappings().all()

    return {
        "success": True,
        "total": len(rows),
        "users": [
            {
                "id": row["id"],
                "email": row["email"],
                "full_name": row["full_name"],
                "role": row["role"],
                "is_active": row["is_active"],
                "created_at": row["created_at"]
            }
            for row in rows
        ]
    }


# =======================================================
# GET SINGLE USER
# =======================================================

@router.get("/{user_id}")
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    check_admin(current_user)

    row = db.execute(
        text(
            """
            SELECT
                id,
                email,
                full_name,
                role,
                is_active,
                created_at
            FROM users
            WHERE id = :user_id
            """
        ),
        {
            "user_id": user_id
        }
    ).mappings().first()

    if not row:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {
        "success": True,
        "user": {
            "id": row["id"],
            "email": row["email"],
            "full_name": row["full_name"],
            "role": row["role"],
            "is_active": row["is_active"],
            "created_at": row["created_at"]
        }
    }


# =======================================================
# ACTIVATE / DEACTIVATE USER
# =======================================================

@router.patch("/{user_id}/status")
def update_user_status(
    user_id: int,
    is_active: bool,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    check_admin(current_user)

    if user_id == current_user.id and not is_active:
        raise HTTPException(
            status_code=400,
            detail="Admin cannot deactivate their own account"
        )

    result = db.execute(
        text(
            """
            UPDATE users
            SET is_active = :is_active
            WHERE id = :user_id
            """
        ),
        {
            "is_active": is_active,
            "user_id": user_id
        }
    )

    if result.rowcount == 0:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    db.commit()

    return {
        "success": True,
        "message": "User status updated",
        "user_id": user_id,
        "is_active": is_active
    }