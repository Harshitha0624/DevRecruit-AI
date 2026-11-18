from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.auth.dependencies import get_current_user

from app.services.notification_service import (
    create_notification,
    get_user_notifications,
    get_unread_count,
    mark_as_read,
    delete_notification,
)


router = APIRouter(
    prefix="/api/notifications",
    tags=["Notifications"]
)


class NotificationCreate(BaseModel):
    user_id: int
    notification_type: str
    title: str
    message: str


def serialize_notification(notification):
    return {
        "id": notification.id,
        "user_id": notification.user_id,
        "notification_type": notification.notification_type,
        "title": notification.title,
        "message": notification.message,
        "is_read": notification.is_read,
        "created_at": notification.created_at,
    }


@router.get("")
def list_notifications(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    notifications = get_user_notifications(
        db,
        current_user.id
    )

    return {
        "success": True,
        "count": len(notifications),
        "notifications": [
            serialize_notification(notification)
            for notification in notifications
        ]
    }


@router.get("/unread-count")
def unread_notification_count(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    count = get_unread_count(
        db,
        current_user.id
    )

    return {
        "success": True,
        "unread_count": count
    }


@router.post("")
def add_notification(
    data: NotificationCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    notification = create_notification(
        db=db,
        user_id=data.user_id,
        notification_type=data.notification_type,
        title=data.title,
        message=data.message
    )

    return {
        "success": True,
        "message": "Notification created successfully",
        "notification": serialize_notification(notification)
    }


@router.patch("/{notification_id}/read")
def read_notification(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    notification = mark_as_read(
        db,
        notification_id,
        current_user.id
    )

    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Notification not found"
        )

    return {
        "success": True,
        "message": "Notification marked as read",
        "notification": serialize_notification(notification)
    }


@router.delete("/{notification_id}")
def remove_notification(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    deleted = delete_notification(
        db,
        notification_id,
        current_user.id
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Notification not found"
        )

    return {
        "success": True,
        "message": "Notification deleted successfully"
    }