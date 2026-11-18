
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/api/admin", tags=["Admin Resources"])


def check_admin(user):
    if str(getattr(user, "role", "")).lower() != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")


def get_table_columns(db: Session, table_name: str):
    rows = db.execute(
        text("""
            SELECT column_name FROM information_schema.columns
            WHERE table_schema = 'public' AND table_name = :table
            ORDER BY ordinal_position
        """),
        {"table": table_name},
    ).mappings().all()
    return [row["column_name"] for row in rows]


def read_table(db, table_name, preferred, search=None):
    columns = get_table_columns(db, table_name)
    if not columns:
        raise HTTPException(404, detail=f"Table '{table_name}' not found")

    selected = [c for c in preferred if c in columns]
    if "id" not in selected:
        raise HTTPException(500, detail=f"Table '{table_name}' has no id column")

    query = "SELECT " + ", ".join(f'"{c}"' for c in selected)
    query += f' FROM "{table_name}"'
    params = {}

    searchable = [
        c for c in (
            "title", "name", "company", "category", "subcategory",
            "description", "resource_type", "platform", "email", "status"
        ) if c in columns
    ]
    if search and searchable:
        conditions = []
        for i, col in enumerate(searchable):
            key = f"s{i}"
            conditions.append(f'CAST("{col}" AS TEXT) ILIKE :{key}')
            params[key] = f"%{search}%"
        query += " WHERE (" + " OR ".join(conditions) + ")"

    query += ' ORDER BY "id" DESC'
    rows = db.execute(text(query), params).mappings().all()
    return [dict(row) for row in rows]


class LearningMaterialInput(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = None
    category: str = Field(min_length=1, max_length=100)
    subcategory: Optional[str] = None
    skill: Optional[str] = None
    company: Optional[str] = None
    level: str = "Beginner"
    difficulty: Optional[str] = None
    resource_type: str = "course"
    platform: Optional[str] = None
    access_type: str = "Free"
    url: Optional[str] = None
    duration: Optional[str] = None
    is_active: bool = True


def payload_values(payload):
    values = payload.model_dump() if hasattr(payload, "model_dump") else payload.dict()
    values["title"] = values["title"].strip()
    values["category"] = values["category"].strip()
    if not values["title"] or not values["category"]:
        raise HTTPException(422, detail="Title and category are required")
    if values.get("url"):
        values["url"] = values["url"].strip()
        if not values["url"].startswith(("https://", "http://")):
            raise HTTPException(422, detail="URL must start with http:// or https://")
    return values


# ---------------- REPORTS ----------------

@router.get("/reports")
def get_admin_reports(
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    check_admin(current_user)
    summary = {}
    for key, table in (
        ("total_users", "users"),
        ("total_jobs", "jobs"),
        ("total_applications", "applications"),
        ("total_companies", "companies"),
        ("total_interviews", "interviews"),
    ):
        summary[key] = (
            db.execute(text(f'SELECT COUNT(*) FROM "{table}"')).scalar() or 0
            if get_table_columns(db, table) else 0
        )
    return {
        "success": True,
        "report_type": "platform_summary",
        "filters": {"search": search},
        "summary": summary,
    }


# ---------------- LEARNING MATERIALS: LIST + FILTER ----------------

@router.get("/learning-materials")
def get_admin_learning_materials(
    search: Optional[str] = None,
    category: Optional[str] = None,
    company: Optional[str] = None,
    resource_type: Optional[str] = None,
    access_type: Optional[str] = None,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    check_admin(current_user)
    columns = get_table_columns(db, "learning_resources")
    if not columns:
        raise HTTPException(404, detail="Learning resources table not found")

    preferred = [
        "id", "title", "description", "category", "subcategory", "skill",
        "company", "level", "difficulty", "resource_type", "platform",
        "access_type", "url", "duration", "is_active", "created_at", "updated_at",
    ]
    items = read_table(db, "learning_resources", preferred, search)

    for field, value in (
        ("category", category),
        ("company", company),
        ("resource_type", resource_type),
        ("access_type", access_type),
    ):
        if value:
            items = [
                item for item in items
                if str(item.get(field) or "").casefold() == value.casefold()
            ]

    if is_active is not None:
        items = [item for item in items if item.get("is_active") == is_active]

    return {
        "success": True,
        "total": len(items),
        "learning_materials": items,
    }


# ---------------- CREATE ----------------

@router.post("/learning-materials", status_code=201)
def create_learning_material(
    payload: LearningMaterialInput,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    check_admin(current_user)
    columns = get_table_columns(db, "learning_resources")
    if not columns:
        raise HTTPException(404, detail="Learning resources table not found")

    values = payload_values(payload)
    values = {k: v for k, v in values.items() if k in columns}
    names = list(values)

    sql = (
        "INSERT INTO learning_resources ("
        + ", ".join(f'"{k}"' for k in names)
        + ") VALUES ("
        + ", ".join(f":{k}" for k in names)
        + ') RETURNING id'
    )

    try:
        new_id = db.execute(text(sql), values).scalar()
        db.commit()
        return {"success": True, "message": "Material created", "id": new_id}
    except Exception:
        db.rollback()
        raise HTTPException(500, detail="Could not create material; check backend logs")


# ---------------- EDIT ----------------

@router.put("/learning-materials/{material_id}")
def update_learning_material(
    material_id: int,
    payload: LearningMaterialInput,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    check_admin(current_user)
    columns = get_table_columns(db, "learning_resources")
    if not columns:
        raise HTTPException(404, detail="Learning resources table not found")

    values = payload_values(payload)
    values = {k: v for k, v in values.items() if k in columns}
    values["material_id"] = material_id
    assignments = ", ".join(
        f'"{k}" = :{k}' for k in values if k != "material_id"
    )

    try:
        result = db.execute(
            text(
                f"UPDATE learning_resources SET {assignments} "
                "WHERE id = :material_id"
            ),
            values,
        )
        if result.rowcount == 0:
            db.rollback()
            raise HTTPException(404, detail="Material not found")
        db.commit()
        return {"success": True, "message": "Material updated", "id": material_id}
    except HTTPException:
        raise
    except Exception:
        db.rollback()
        raise HTTPException(500, detail="Could not update material; check backend logs")


# ---------------- PUBLISH / UNPUBLISH ----------------

@router.patch("/learning-materials/{material_id}/publish")
def publish_learning_material(
    material_id: int,
    is_active: bool = Query(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    check_admin(current_user)
    columns = get_table_columns(db, "learning_resources")
    if not columns or "is_active" not in columns:
        raise HTTPException(404, detail="Learning resources table or is_active column not found")

    result = db.execute(
        text("UPDATE learning_resources SET is_active = :active WHERE id = :id"),
        {"active": is_active, "id": material_id},
    )
    if result.rowcount == 0:
        db.rollback()
        raise HTTPException(404, detail="Material not found")
    db.commit()
    return {
        "success": True,
        "id": material_id,
        "is_active": is_active,
        "message": "Published" if is_active else "Unpublished",
    }


# ---------------- DELETE ----------------

@router.delete("/learning-materials/{material_id}")
def delete_learning_material(
    material_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    check_admin(current_user)
    if not get_table_columns(db, "learning_resources"):
        raise HTTPException(404, detail="Learning resources table not found")

    result = db.execute(
        text("DELETE FROM learning_resources WHERE id = :id"),
        {"id": material_id},
    )
    if result.rowcount == 0:
        db.rollback()
        raise HTTPException(404, detail="Material not found")
    db.commit()
    return {"success": True, "message": "Material deleted", "id": material_id}


# ---------------- ASSESSMENT LIBRARY ----------------

@router.get("/assessment-library")
def get_admin_assessment_library(
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    check_admin(current_user)
    preferred = [
        "id", "title", "name", "description", "category", "type", "duration",
        "total_questions", "passing_score", "difficulty", "status", "is_active",
        "created_at",
    ]
    items = read_table(db, "assessments", preferred, search)
    return {"success": True, "total": len(items), "assessments": items}
