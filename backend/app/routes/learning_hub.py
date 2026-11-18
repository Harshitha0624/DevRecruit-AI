from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.auth.dependencies import get_current_user

from app.models.learning_resource import LearningResource
from app.models.learning_progress import LearningProgress
from app.models.candidate_profile import CandidateProfile
from app.models.learning_course import (
    LearningModule,
    LearningLesson,
    LearningLessonCompletion
)

router = APIRouter(
    prefix="/api/learning-hub",
    tags=["Learning Hub"]
)


# =======================================================
# ACCESS CONTROL
# =======================================================

def check_access(current_user):
    role = str(
        getattr(current_user, "role", "")
    ).lower()

    if role not in ["candidate", "admin"]:
        raise HTTPException(
            status_code=403,
            detail="Learning Hub access required"
        )


# =======================================================
# SERIALIZE RESOURCE
# =======================================================

def serialize_resource(resource):
    return {
        "id": resource.id,
        "title": resource.title,
        "description": resource.description,
        "category": resource.category,
        "subcategory": resource.subcategory,
        "skill": resource.skill,
        "company": resource.company,
        "level": resource.level,
        "difficulty": resource.difficulty,
        "resource_type": resource.resource_type,
        "platform": resource.platform,
        "access_type": resource.access_type,
        "url": resource.url,
        "duration": resource.duration,
        "is_active": resource.is_active,
        "created_at": resource.created_at,
        "updated_at": resource.updated_at
    }


# =======================================================
# PROGRESS REQUEST
# =======================================================

class LearningProgressRequest(BaseModel):

    progress_percent: float = Field(
        default=0.0,
        ge=0.0,
        le=100.0
    )

    status: Optional[str] = None


# =======================================================
# GET ALL / FILTER LEARNING RESOURCES
# =======================================================

@router.get("")
def get_learning_resources(
    category: Optional[str] = Query(default=None),
    subcategory: Optional[str] = Query(default=None),
    skill: Optional[str] = Query(default=None),
    company: Optional[str] = Query(default=None),
    level: Optional[str] = Query(default=None),
    difficulty: Optional[str] = Query(default=None),
    resource_type: Optional[str] = Query(default=None),
    access_type: Optional[str] = Query(default=None),
    platform: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    check_access(current_user)

    query = (
        db.query(LearningResource)
        .filter(
            LearningResource.is_active == True
        )
    )

    if category:
        query = query.filter(
            LearningResource.category.ilike(
                f"%{category}%"
            )
        )

    if subcategory:
        query = query.filter(
            LearningResource.subcategory.ilike(
                f"%{subcategory}%"
            )
        )

    if skill:
        query = query.filter(
            LearningResource.skill.ilike(
                f"%{skill}%"
            )
        )

    if company:
        query = query.filter(
            LearningResource.company.ilike(
                f"%{company}%"
            )
        )

    if level:
        query = query.filter(
            LearningResource.level.ilike(
                f"%{level}%"
            )
        )

    if difficulty:
        query = query.filter(
            LearningResource.difficulty.ilike(
                f"%{difficulty}%"
            )
        )

    if resource_type:
        query = query.filter(
            LearningResource.resource_type.ilike(
                f"%{resource_type}%"
            )
        )

    if access_type:
        query = query.filter(
            LearningResource.access_type.ilike(
                f"%{access_type}%"
            )
        )

    if platform:
        query = query.filter(
            LearningResource.platform.ilike(
                f"%{platform}%"
            )
        )

    resources = (
        query
        .order_by(
            LearningResource.created_at.desc(),
            LearningResource.id.desc()
        )
        .all()
    )

    return {
        "success": True,
        "total": len(resources),
        "resources": [
            serialize_resource(resource)
            for resource in resources
        ]
    }


# =======================================================
# CATEGORIES / FILTER OPTIONS
# =======================================================

@router.get("/categories/list")
def learning_categories(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    check_access(current_user)

    resources = (
        db.query(LearningResource)
        .filter(
            LearningResource.is_active == True
        )
        .all()
    )

    return {
        "success": True,

        "categories": sorted(
            list(
                {
                    resource.category
                    for resource in resources
                    if resource.category
                }
            )
        ),

        "skills": sorted(
            list(
                {
                    resource.skill
                    for resource in resources
                    if resource.skill
                }
            )
        ),

        "companies": sorted(
            list(
                {
                    resource.company
                    for resource in resources
                    if resource.company
                }
            )
        ),

        "levels": sorted(
            list(
                {
                    resource.level
                    for resource in resources
                    if resource.level
                }
            )
        ),

        "platforms": sorted(
            list(
                {
                    resource.platform
                    for resource in resources
                    if resource.platform
                }
            )
        ),

        "resource_types": sorted(
            list(
                {
                    resource.resource_type
                    for resource in resources
                    if resource.resource_type
                }
            )
        ),

        "access_types": sorted(
            list(
                {
                    resource.access_type
                    for resource in resources
                    if resource.access_type
                }
            )
        )
    }


# =======================================================
# MY LEARNING
# =======================================================

@router.get("/my-learning")
def get_my_learning(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    check_access(current_user)

    candidate_id = current_user.id

    progress_records = (
        db.query(LearningProgress)
        .filter(
            LearningProgress.candidate_id == candidate_id
        )
        .order_by(
            LearningProgress.updated_at.desc(),
            LearningProgress.id.desc()
        )
        .all()
    )

    total_tracked = len(progress_records)

    # ---------------------------------------------------
    # OVERALL PROGRESS
    # ---------------------------------------------------

    if total_tracked > 0:

        overall_progress = round(
            sum(
                float(record.progress_percent or 0)
                for record in progress_records
            ) / total_tracked,
            2
        )

    else:
        overall_progress = 0.0

    # ---------------------------------------------------
    # COUNTS
    # ---------------------------------------------------

    completed = 0
    in_progress = 0
    not_started = 0

    for record in progress_records:

        progress = float(
            record.progress_percent or 0
        )

        status = str(
            record.status or ""
        ).lower()

        if status == "completed" or progress >= 100:
            completed += 1

        elif (
            status == "in_progress"
            or 0 < progress < 100
        ):
            in_progress += 1

        else:
            not_started += 1

    # ---------------------------------------------------
    # CURRENT LEVEL
    # ---------------------------------------------------

    if overall_progress < 30:
        current_level = "Beginner"

    elif overall_progress < 70:
        current_level = "Intermediate"

    else:
        current_level = "Advanced"

    # ---------------------------------------------------
    # CANDIDATE PROFILE
    # ---------------------------------------------------

    profile = (
        db.query(CandidateProfile)
        .filter(
            CandidateProfile.user_id == candidate_id
        )
        .first()
    )

    skills = []

    if profile and profile.skills:

        skills = profile.skills

        if isinstance(skills, str):

            skills = [
                skill.strip()
                for skill in skills.split(",")
                if skill.strip()
            ]

    # ---------------------------------------------------
    # COMPLETED TITLES
    # ---------------------------------------------------

    completed_titles = {
        str(record.item_title)
        .strip()
        .lower()

        for record in progress_records

        if (
            record.status == "completed"
            or float(record.progress_percent or 0) >= 100
        )
    }

    # ---------------------------------------------------
    # RECOMMENDED NEXT
    # ---------------------------------------------------

    resources = (
        db.query(LearningResource)
        .filter(
            LearningResource.is_active == True
        )
        .all()
    )

    recommended = []

    for resource in resources:

        title_key = (
            str(resource.title)
            .strip()
            .lower()
        )

        if title_key in completed_titles:
            continue

        match_score = 0

        # Skill match
        if resource.skill:

            resource_skill = (
                str(resource.skill)
                .strip()
                .lower()
            )

            for candidate_skill in skills:

                candidate_skill_text = (
                    str(candidate_skill)
                    .strip()
                    .lower()
                )

                if (
                    candidate_skill_text in resource_skill
                    or resource_skill in candidate_skill_text
                ):
                    match_score += 10
                    break

        # Level match
        if (
            resource.level
            and str(resource.level).lower()
            == current_level.lower()
        ):
            match_score += 5

        # Beginner recommendation for fresh users
        if (
            total_tracked == 0
            and resource.level
            and str(resource.level).lower()
            == "beginner"
        ):
            match_score += 5

        if match_score > 0:

            recommended.append(
                {
                    "id": resource.id,
                    "title": resource.title,
                    "description": resource.description,
                    "category": resource.category,
                    "subcategory": resource.subcategory,
                    "skill": resource.skill,
                    "company": resource.company,
                    "level": resource.level,
                    "difficulty": resource.difficulty,
                    "resource_type": resource.resource_type,
                    "platform": resource.platform,
                    "access_type": resource.access_type,
                    "duration": resource.duration,
                    "url": resource.url,
                    "match_score": match_score
                }
            )

    recommended.sort(
        key=lambda item: (
            item["match_score"],
            item["id"]
        ),
        reverse=True
    )

    # ---------------------------------------------------
    # RECENT ACTIVITY
    # ---------------------------------------------------

    recent_activity = []

    for record in progress_records[:10]:

        recent_activity.append(
            {
                "id": record.id,
                "item_title": record.item_title,
                "item_type": record.item_type,
                "progress_percent": float(
                    record.progress_percent or 0
                ),
                "status": record.status,
                "created_at": record.created_at,
                "updated_at": record.updated_at
            }
        )

    return {
        "success": True,

        "candidate": {
            "id": candidate_id,
            "name": current_user.full_name,
            "email": current_user.email
        },

        "overall_progress_percent": overall_progress,

        "current_level": current_level,

        "completed": completed,

        "in_progress": in_progress,

        "not_started": not_started,

        "total_learning_items": total_tracked,

        "skills": skills,

        "recent_activity": recent_activity,

        "recommended_next": recommended[:5]
    }


# =======================================================
# CAREER ROADMAPS
# =======================================================

@router.get("/roadmaps")
def get_career_roadmaps(
    level: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    check_access(current_user)

    query = (
        db.query(LearningResource)
        .filter(
            LearningResource.is_active == True,
            LearningResource.category.ilike(
                "%Roadmaps%"
            )
        )
    )

    if level:

        query = query.filter(
            LearningResource.level.ilike(
                f"%{level}%"
            )
        )

    resources = (
        query
        .order_by(
            LearningResource.id.asc()
        )
        .all()
    )

    return {
        "success": True,
        "total": len(resources),
        "roadmaps": [
            serialize_resource(resource)
            for resource in resources
        ]
    }


# =======================================================
# LEARN BY SKILL
# =======================================================

@router.get("/skills")
def get_learning_by_skill(
    skill: Optional[str] = Query(default=None),
    level: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    check_access(current_user)

    query = (
        db.query(LearningResource)
        .filter(
            LearningResource.is_active == True,
            LearningResource.skill.isnot(None)
        )
    )

    if skill:

        query = query.filter(
            LearningResource.skill.ilike(
                f"%{skill}%"
            )
        )

    if level:

        query = query.filter(
            LearningResource.level.ilike(
                f"%{level}%"
            )
        )

    resources = (
        query
        .order_by(
            LearningResource.skill.asc(),
            LearningResource.id.asc()
        )
        .all()
    )

    skills = sorted(
        list(
            {
                resource.skill
                for resource in resources
                if resource.skill
            }
        )
    )

    return {
        "success": True,
        "skills": skills,
        "total_resources": len(resources),
        "resources": [
            serialize_resource(resource)
            for resource in resources
        ]
    }


# =======================================================
# COMPANY PREPARATION
# =======================================================

@router.get("/company-preparation")
def get_company_preparation(
    company: Optional[str] = Query(default=None),
    level: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    check_access(current_user)

    query = (
        db.query(LearningResource)
        .filter(
            LearningResource.is_active == True,
            LearningResource.category.ilike(
                "%Company Preparation%"
            )
        )
    )

    if company:

        query = query.filter(
            LearningResource.company.ilike(
                f"%{company}%"
            )
        )

    if level:

        query = query.filter(
            LearningResource.level.ilike(
                f"%{level}%"
            )
        )

    resources = (
        query
        .order_by(
            LearningResource.company.asc(),
            LearningResource.id.asc()
        )
        .all()
    )

    companies = sorted(
        list(
            {
                resource.company
                for resource in resources
                if resource.company
            }
        )
    )

    return {
        "success": True,
        "companies": companies,
        "total_resources": len(resources),
        "resources": [
            serialize_resource(resource)
            for resource in resources
        ]
    }


# =======================================================
# UPDATE LEARNING PROGRESS
# =======================================================

@router.put("/progress/{resource_id}")
def update_learning_progress(
    resource_id: int,
    progress_data: LearningProgressRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    check_access(current_user)

    candidate_id = current_user.id

    resource = (
        db.query(LearningResource)
        .filter(
            LearningResource.id == resource_id,
            LearningResource.is_active == True
        )
        .first()
    )

    if not resource:

        raise HTTPException(
            status_code=404,
            detail="Learning resource not found"
        )

    progress_percent = float(
        progress_data.progress_percent
    )

    # ---------------------------------------------------
    # AUTOMATIC STATUS
    # ---------------------------------------------------

    if progress_percent >= 100:

        progress_percent = 100.0
        status = "completed"

    elif progress_percent > 0:

        status = "in_progress"

    else:

        status = "not_started"

    # ---------------------------------------------------
    # OPTIONAL STATUS VALIDATION
    # ---------------------------------------------------

    if progress_data.status:

        requested_status = (
            progress_data.status
            .strip()
            .lower()
        )

        valid_statuses = {
            "not_started",
            "in_progress",
            "completed"
        }

        if requested_status not in valid_statuses:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Invalid status. Use "
                    "not_started, in_progress, "
                    "or completed."
                )
            )

        status = requested_status

    # ---------------------------------------------------
    # FIND EXISTING
    # ---------------------------------------------------

    progress_record = (
        db.query(LearningProgress)
        .filter(
            LearningProgress.candidate_id
            == candidate_id,
            LearningProgress.item_title
            == resource.title
        )
        .first()
    )

    # ---------------------------------------------------
    # CREATE
    # ---------------------------------------------------

    if not progress_record:

        progress_record = LearningProgress(
            candidate_id=candidate_id,
            item_title=resource.title,
            item_type=(
                resource.resource_type
                or "course"
            ),
            progress_percent=progress_percent,
            status=status
        )

        db.add(progress_record)

        action = "created"

    # ---------------------------------------------------
    # UPDATE
    # ---------------------------------------------------

    else:

        progress_record.progress_percent = (
            progress_percent
        )

        progress_record.status = status

        progress_record.item_type = (
            resource.resource_type
            or "course"
        )

        action = "updated"

    db.commit()
    db.refresh(progress_record)

    return {
        "success": True,
        "message": "Learning progress updated successfully",
        "action": action,

        "progress": {
            "id": progress_record.id,
            "candidate_id": progress_record.candidate_id,
            "resource_id": resource.id,
            "item_title": progress_record.item_title,
            "item_type": progress_record.item_type,
            "progress_percent": float(
                progress_record.progress_percent or 0
            ),
            "status": progress_record.status,
            "created_at": progress_record.created_at,
            "updated_at": progress_record.updated_at
        }
    }


# =======================================================
# GET PROGRESS FOR ONE RESOURCE
# =======================================================

@router.get("/progress/{resource_id}")
def get_resource_progress(
    resource_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    check_access(current_user)

    candidate_id = current_user.id

    resource = (
        db.query(LearningResource)
        .filter(
            LearningResource.id == resource_id,
            LearningResource.is_active == True
        )
        .first()
    )

    if not resource:

        raise HTTPException(
            status_code=404,
            detail="Learning resource not found"
        )

    progress_record = (
        db.query(LearningProgress)
        .filter(
            LearningProgress.candidate_id
            == candidate_id,
            LearningProgress.item_title
            == resource.title
        )
        .first()
    )

    if not progress_record:

        return {
            "success": True,
            "resource_id": resource.id,
            "title": resource.title,
            "progress_percent": 0.0,
            "status": "not_started"
        }

    return {
        "success": True,
        "resource_id": resource.id,
        "title": resource.title,
        "progress_percent": float(
            progress_record.progress_percent or 0
        ),
        "status": progress_record.status,
        "updated_at": progress_record.updated_at
    }

# =======================================================
# CAREER ROADMAPS
# =======================================================

@router.get("/roadmaps")
def get_career_roadmaps(
    level: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    check_access(current_user)

    query = (
        db.query(LearningResource)
        .filter(
            LearningResource.is_active == True,
            LearningResource.category.ilike("%Roadmaps%")
        )
    )

    if level:
        query = query.filter(
            LearningResource.level.ilike(f"%{level}%")
        )

    resources = query.order_by(
        LearningResource.id.asc()
    ).all()

    return {
        "success": True,
        "total": len(resources),
        "roadmaps": [
            serialize_resource(resource)
            for resource in resources
        ]
    }


# =======================================================
# LEARN BY SKILL
# =======================================================

@router.get("/skills")
def get_learning_by_skill(
    skill: Optional[str] = Query(default=None),
    level: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    check_access(current_user)

    query = (
        db.query(LearningResource)
        .filter(
            LearningResource.is_active == True,
            LearningResource.skill.isnot(None)
        )
    )

    if skill:
        query = query.filter(
            LearningResource.skill.ilike(f"%{skill}%")
        )

    if level:
        query = query.filter(
            LearningResource.level.ilike(f"%{level}%")
        )

    resources = query.order_by(
        LearningResource.skill.asc(),
        LearningResource.id.asc()
    ).all()

    skills = sorted({
        resource.skill
        for resource in resources
        if resource.skill
    })

    return {
        "success": True,
        "skills": skills,
        "total_resources": len(resources),
        "resources": [
            serialize_resource(resource)
            for resource in resources
        ]
    }


# =======================================================
# COMPANY PREPARATION
# =======================================================

@router.get("/company-preparation")
def get_company_preparation(
    company: Optional[str] = Query(default=None),
    level: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    check_access(current_user)

    query = (
        db.query(LearningResource)
        .filter(
            LearningResource.is_active == True,
            LearningResource.category.ilike(
                "%Company Preparation%"
            )
        )
    )

    if company:
        query = query.filter(
            LearningResource.company.ilike(
                f"%{company}%"
            )
        )

    if level:
        query = query.filter(
            LearningResource.level.ilike(
                f"%{level}%"
            )
        )

    resources = query.order_by(
        LearningResource.company.asc(),
        LearningResource.id.asc()
    ).all()

    companies = sorted({
        resource.company
        for resource in resources
        if resource.company
    })

    return {
        "success": True,
        "companies": companies,
        "total_resources": len(resources),
        "resources": [
            serialize_resource(resource)
            for resource in resources
        ]
    }
# =======================================================
# AI RECOMMENDATIONS
# =======================================================

@router.get("/ai-recommendations")
def get_ai_recommendations(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    check_access(current_user)

    candidate_id = current_user.id

    # ---------------------------------------------------
    # CANDIDATE PROFILE
    # ---------------------------------------------------

    profile = (
        db.query(CandidateProfile)
        .filter(
            CandidateProfile.user_id == candidate_id
        )
        .first()
    )

    skills = []

    if profile and profile.skills:
        skills = profile.skills

        if isinstance(skills, str):
            skills = [
                skill.strip()
                for skill in skills.split(",")
                if skill.strip()
            ]

    candidate_skills = {
        skill.lower()
        for skill in skills
    }

    # ---------------------------------------------------
    # LEARNING PROGRESS
    # ---------------------------------------------------

    progress_records = (
        db.query(LearningProgress)
        .filter(
            LearningProgress.candidate_id == candidate_id
        )
        .all()
    )

    total_progress_items = len(progress_records)

    overall_progress = (
        sum(
            float(record.progress_percent or 0)
            for record in progress_records
        ) / total_progress_items
        if total_progress_items
        else 0
    )

    if overall_progress < 30:
        current_level = "Beginner"
    elif overall_progress < 70:
        current_level = "Intermediate"
    else:
        current_level = "Advanced"

    completed_titles = {
        str(record.item_title).strip().lower()
        for record in progress_records
        if (
            record.status == "completed"
            or float(record.progress_percent or 0) >= 100
        )
    }

    # ---------------------------------------------------
    # ALL ACTIVE RESOURCES
    # ---------------------------------------------------

    resources = (
        db.query(LearningResource)
        .filter(
            LearningResource.is_active == True
        )
        .all()
    )

    # ---------------------------------------------------
    # SKILLS TO LEARN
    # ---------------------------------------------------

    available_skills = set()

    for resource in resources:
        if resource.skill:
            available_skills.add(
                str(resource.skill).strip()
            )

    skills_to_learn = []

    for skill in available_skills:

        skill_lower = skill.lower()

        if skill_lower in candidate_skills:
            continue

        matching_resources = [
            resource
            for resource in resources
            if resource.skill
            and str(resource.skill).strip().lower()
            == skill_lower
        ]

        score = 0

        for resource in matching_resources:

            if (
                resource.level
                and str(resource.level).lower()
                == current_level.lower()
            ):
                score += 5

            if resource.resource_type:
                if str(
                    resource.resource_type
                ).lower() in [
                    "course",
                    "video"
                ]:
                    score += 2

        skills_to_learn.append(
            {
                "skill": skill,
                "priority_score": score
            }
        )

    skills_to_learn.sort(
        key=lambda item: (
            item["priority_score"],
            item["skill"]
        ),
        reverse=True
    )

    # ---------------------------------------------------
    # COURSE RECOMMENDATIONS
    # ---------------------------------------------------

    courses = []

    for resource in resources:

        if (
            str(resource.resource_type or "")
            .lower()
            not in ["course", "video"]
        ):
            continue

        if (
            str(resource.title).strip().lower()
            in completed_titles
        ):
            continue

        score = 0
        reason = []

        # Current level
        if (
            resource.level
            and str(resource.level).lower()
            == current_level.lower()
        ):
            score += 10
            reason.append("Matches your current level")

        # Skill match
        if resource.skill:

            resource_skill = (
                str(resource.skill)
                .strip()
                .lower()
            )

            if resource_skill in candidate_skills:
                score += 8
                reason.append("Related to your skills")

        # Unfamiliar skill = growth opportunity
        if (
            resource.skill
            and str(resource.skill).strip().lower()
            not in candidate_skills
        ):
            score += 5
            reason.append("Helps build a new skill")

        if score > 0:

            courses.append(
                {
                    "id": resource.id,
                    "title": resource.title,
                    "skill": resource.skill,
                    "level": resource.level,
                    "platform": resource.platform,
                    "access_type": resource.access_type,
                    "resource_type": resource.resource_type,
                    "duration": resource.duration,
                    "url": resource.url,
                    "recommendation_score": score,
                    "reason": reason
                }
            )

    courses.sort(
        key=lambda item: (
            item["recommendation_score"],
            item["id"]
        ),
        reverse=True
    )

    # ---------------------------------------------------
    # PRACTICE QUESTIONS
    # ---------------------------------------------------

    practice_questions = []

    for resource in resources:

        if str(
            resource.category or ""
        ).lower() not in [
            "coding practice",
            "aptitude",
            "interview preparation"
        ]:
            continue

        if (
            str(resource.title).strip().lower()
            in completed_titles
        ):
            continue

        score = 0

        if (
            resource.level
            and str(resource.level).lower()
            == current_level.lower()
        ):
            score += 10

        if resource.skill:
            if (
                str(resource.skill).strip().lower()
                in candidate_skills
            ):
                score += 5

        practice_questions.append(
            {
                "id": resource.id,
                "title": resource.title,
                "category": resource.category,
                "skill": resource.skill,
                "level": resource.level,
                "difficulty": resource.difficulty,
                "platform": resource.platform,
                "access_type": resource.access_type,
                "url": resource.url,
                "recommendation_score": score
            }
        )

    practice_questions.sort(
        key=lambda item: (
            item["recommendation_score"],
            item["id"]
        ),
        reverse=True
    )

    # ---------------------------------------------------
    # NEXT ROADMAP STEP
    # ---------------------------------------------------

    roadmap_resources = [
        resource
        for resource in resources
        if (
            str(resource.category or "").lower()
            == "roadmaps"
        )
    ]

    next_roadmap_step = None

    roadmap_score = -1

    for resource in roadmap_resources:

        score = 0

        if (
            resource.level
            and str(resource.level).lower()
            == current_level.lower()
        ):
            score += 10

        if resource.skill:

            if (
                str(resource.skill).strip().lower()
                in candidate_skills
            ):
                score += 5

        if score > roadmap_score:

            roadmap_score = score

            next_roadmap_step = {
                "id": resource.id,
                "title": resource.title,
                "level": resource.level,
                "skill": resource.skill,
                "platform": resource.platform,
                "access_type": resource.access_type,
                "url": resource.url,
                "recommendation_score": score
            }

    # ---------------------------------------------------
    # FINAL RESPONSE
    # ---------------------------------------------------

    return {
        "success": True,

        "candidate_id": candidate_id,

        "learning_profile": {
            "current_level": current_level,
            "overall_progress_percent": round(
                overall_progress,
                2
            ),
            "skills": skills
        },

        "skills_to_learn": skills_to_learn[:5],

        "courses": courses[:5],

        "practice_questions": practice_questions[:5],

        "next_roadmap_step": next_roadmap_step
    }
# ============================================================
# STRUCTURED LEARNING COURSE APIs
# ============================================================

def calculate_course_progress(db, resource_id, candidate_id):

    modules = (
        db.query(LearningModule)
        .filter(
            LearningModule.resource_id == resource_id,
            LearningModule.is_active == True
        )
        .order_by(LearningModule.sort_order)
        .all()
    )

    module_ids = [module.id for module in modules]

    lessons = []

    if module_ids:
        lessons = (
            db.query(LearningLesson)
            .filter(
                LearningLesson.module_id.in_(module_ids),
                LearningLesson.is_active == True
            )
            .order_by(LearningLesson.sort_order)
            .all()
        )

    lesson_ids = [lesson.id for lesson in lessons]

    completed_ids = set()

    if lesson_ids:
        completions = (
            db.query(LearningLessonCompletion.lesson_id)
            .filter(
                LearningLessonCompletion.candidate_id == candidate_id,
                LearningLessonCompletion.lesson_id.in_(lesson_ids)
            )
            .all()
        )

        completed_ids = {row[0] for row in completions}

    total_lessons = len(lessons)
    completed_count = len(completed_ids)

    progress = (
        round((completed_count / total_lessons) * 100, 2)
        if total_lessons else 0
    )

    resume_lesson_id = next(
        (
            lesson.id
            for lesson in lessons
            if lesson.id not in completed_ids
        ),
        None
    )

    return {
        "total_lessons": total_lessons,
        "completed_lessons": completed_count,
        "progress_percent": progress,
        "resume_lesson_id": resume_lesson_id,
        "completed_ids": completed_ids
    }


# ------------------------------------------------------------
# GET COMPLETE COURSE WITH MODULES AND LESSONS
# ------------------------------------------------------------

@router.get("/{resource_id}/course")
def get_learning_course(
    resource_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    check_access(current_user)

    candidate_id = current_user.id

    resource = (
        db.query(LearningResource)
        .filter(
            LearningResource.id == resource_id,
            LearningResource.is_active == True
        )
        .first()
    )

    if not resource:
        raise HTTPException(
            status_code=404,
            detail="Learning course not found."
        )

    progress = calculate_course_progress(
        db,
        resource_id,
        candidate_id
    )

    modules = (
        db.query(LearningModule)
        .filter(
            LearningModule.resource_id == resource_id,
            LearningModule.is_active == True
        )
        .order_by(LearningModule.sort_order)
        .all()
    )

    module_data = []

    for module in modules:

        lessons = (
            db.query(LearningLesson)
            .filter(
                LearningLesson.module_id == module.id,
                LearningLesson.is_active == True
            )
            .order_by(LearningLesson.sort_order)
            .all()
        )

        lesson_data = []

        for lesson in lessons:

            lesson_data.append({
                "id": lesson.id,
                "title": lesson.title,
                "content_type": lesson.content_type,
                "content": lesson.content,
                "resource_url": lesson.resource_url,
                "duration_minutes": lesson.duration_minutes,
                "is_completed": (
                    lesson.id in progress["completed_ids"]
                )
            })

        module_data.append({
            "id": module.id,
            "title": module.title,
            "description": module.description,
            "lessons": lesson_data
        })

    return {
        "success": True,
                "course": {
            "id": resource.id,
            "title": resource.title,
            "description": resource.description,
            "category": resource.category,
            "level": resource.level,
            "platform": resource.platform,
            "duration": resource.duration,
            "url": resource.url,
            "access_type": resource.access_type
        },
        "modules": module_data,
        "progress": {
            "total_lessons": progress["total_lessons"],
            "completed_lessons": progress["completed_lessons"],
            "progress_percent": progress["progress_percent"],
            "resume_lesson_id": progress["resume_lesson_id"]
        }
    }


# ------------------------------------------------------------
# MARK LESSON COMPLETE
# ------------------------------------------------------------

@router.post("/lessons/{lesson_id}/complete")
def complete_learning_lesson(
    lesson_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    check_access(current_user)

    candidate_id = current_user.id

    lesson = (
        db.query(LearningLesson)
        .filter(
            LearningLesson.id == lesson_id,
            LearningLesson.is_active == True
        )
        .first()
    )

    if not lesson:
        raise HTTPException(
            status_code=404,
            detail="Learning lesson not found."
        )

    module = (
        db.query(LearningModule)
        .filter(
            LearningModule.id == lesson.module_id,
            LearningModule.is_active == True
        )
        .first()
    )

    if not module:
        raise HTTPException(
            status_code=404,
            detail="Learning module not found."
        )

    resource = (
        db.query(LearningResource)
        .filter(
            LearningResource.id == module.resource_id,
            LearningResource.is_active == True
        )
        .first()
    )

    if not resource:
        raise HTTPException(
            status_code=404,
            detail="Learning course not found."
        )

    try:

        existing_completion = (
            db.query(LearningLessonCompletion)
            .filter(
                LearningLessonCompletion.candidate_id == candidate_id,
                LearningLessonCompletion.lesson_id == lesson_id
            )
            .first()
        )

        if not existing_completion:

            completion = LearningLessonCompletion(
                candidate_id=candidate_id,
                lesson_id=lesson_id
            )

            db.add(completion)
            db.flush()

        progress = calculate_course_progress(
            db,
            resource.id,
            candidate_id
        )

        learning_record = (
            db.query(LearningProgress)
            .filter(
                LearningProgress.candidate_id == candidate_id,
                LearningProgress.item_title == resource.title
            )
            .first()
        )

        if not learning_record:

            learning_record = LearningProgress(
                candidate_id=candidate_id,
                item_title=resource.title,
                item_type="course",
                progress_percent=progress["progress_percent"],
                status=(
                    "completed"
                    if progress["progress_percent"] == 100
                    else "in_progress"
                )
            )

            db.add(learning_record)

        else:

            learning_record.progress_percent = (
                progress["progress_percent"]
            )

            learning_record.status = (
                "completed"
                if progress["progress_percent"] == 100
                else "in_progress"
            )

        db.commit()

        return {
            "success": True,
            "message": "Lesson marked as completed.",
            "course_id": resource.id,
            "lesson_id": lesson_id,
            "progress": {
                "total_lessons": progress["total_lessons"],
                "completed_lessons": progress["completed_lessons"],
                "progress_percent": progress["progress_percent"],
                "resume_lesson_id": progress["resume_lesson_id"]
            }
        }

    except Exception:
        db.rollback()
        raise
# =======================================================
# GET SINGLE RESOURCE
# MUST REMAIN LAST
# =======================================================

@router.get("/{resource_id}")
def get_learning_resource(
    resource_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    check_access(current_user)

    resource = (
        db.query(LearningResource)
        .filter(
            LearningResource.id == resource_id,
            LearningResource.is_active == True
        )
        .first()
    )

    if not resource:

        raise HTTPException(
            status_code=404,
            detail="Learning resource not found"
        )

    return {
        "success": True,
        "resource": serialize_resource(resource)
    }