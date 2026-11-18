from app.models.learning_progress import LearningProgress


def get_candidate_learning_progress(db, candidate_id):
    return (
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


def calculate_learning_summary(progress_records):
    total = len(progress_records)

    if total == 0:
        return {
            "completion_percent": 0.0,
            "completed_courses": 0,
            "in_progress_courses": 0,
            "not_started_courses": 0
        }

    completed = sum(
        1
        for item in progress_records
        if item.status == "completed"
    )

    in_progress = sum(
        1
        for item in progress_records
        if item.status == "in_progress"
    )

    not_started = sum(
        1
        for item in progress_records
        if item.status == "not_started"
    )

    average_progress = round(
        sum(
            item.progress_percent
            for item in progress_records
        ) / total,
        2
    )

    return {
        "completion_percent": average_progress,
        "completed_courses": completed,
        "in_progress_courses": in_progress,
        "not_started_courses": not_started
    }