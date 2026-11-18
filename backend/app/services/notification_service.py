from app.models.notification import Notification


def create_notification(
    db,
    user_id,
    notification_type,
    title,
    message
):
    notification = Notification(
        user_id=user_id,
        notification_type=notification_type,
        title=title,
        message=message,
        is_read=False
    )

    db.add(notification)
    db.commit()
    db.refresh(notification)

    return notification


def get_user_notifications(db, user_id):
    return (
        db.query(Notification)
        .filter(Notification.user_id == user_id)
        .order_by(
            Notification.created_at.desc(),
            Notification.id.desc()
        )
        .all()
    )


def get_unread_count(db, user_id):
    return (
        db.query(Notification)
        .filter(
            Notification.user_id == user_id,
            Notification.is_read == False
        )
        .count()
    )


def mark_as_read(db, notification_id, user_id):
    notification = (
        db.query(Notification)
        .filter(
            Notification.id == notification_id,
            Notification.user_id == user_id
        )
        .first()
    )

    if not notification:
        return None

    notification.is_read = True

    db.commit()
    db.refresh(notification)

    return notification


def delete_notification(db, notification_id, user_id):
    notification = (
        db.query(Notification)
        .filter(
            Notification.id == notification_id,
            Notification.user_id == user_id
        )
        .first()
    )

    if not notification:
        return False

    db.delete(notification)
    db.commit()

    return True