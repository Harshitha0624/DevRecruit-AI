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


def verify_badge_hash(
    candidate_id,
    skill,
    score,
    stored_hash
):
    generated_hash = generate_badge_hash(
        candidate_id,
        skill,
        score
    )

    return generated_hash == stored_hash


if __name__ == "__main__":

    candidate_id = 2
    skill = "Python"
    score = 92
    stored_hash = (
        "c2768a0cd7f4947f4b823c1cab0076a90c0aa8d32b39342a539e336e4bc96c70"
    )

    result = verify_badge_hash(
        candidate_id,
        skill,
        score,
        stored_hash
    )

    print("\nSKILL BADGE VERIFICATION")
    print("========================")
    print("Candidate ID:", candidate_id)
    print("Skill:", skill)
    print("Score:", score)
    print("Hash valid:", result)