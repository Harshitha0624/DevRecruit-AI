import hashlib


def generate_badge_hash(
    candidate_id,
    skill,
    score
):
    data = (
        f"{int(candidate_id)}|"
        f"{skill.strip().lower()}|"
        f"{float(score):.2f}"
    )

    return hashlib.sha256(
        data.encode("utf-8")
    ).hexdigest()


def create_badge_record(
    badge_id,
    candidate_id,
    skill,
    score
):
    badge_hash = generate_badge_hash(
        candidate_id,
        skill,
        score
    )

    return {
        "badge_id": int(badge_id),
        "candidate_id": int(candidate_id),
        "skill": skill,
        "score": float(score),
        "badge_hash": badge_hash,
        "verified": False
    }


if __name__ == "__main__":

    record = create_badge_record(
        badge_id=1,
        candidate_id=2,
        skill="Python",
        score=92
    )

    print("\nSKILL BADGE")
    print("===========")

    for key, value in record.items():
        print(f"{key}: {value}")