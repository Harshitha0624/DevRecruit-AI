from candidate_recommendation import recommend_candidates
from job_recommendation import recommend_jobs


def generate_recommendations(
    candidates=None,
    jobs=None,
    top_candidates=5,
    top_jobs=5
):
    result = {
        "candidate_recommendations": [],
        "job_recommendations": []
    }

    if candidates:
        result["candidate_recommendations"] = (
            recommend_candidates(
                candidates,
                top_n=top_candidates
            )
        )

    if jobs:
        result["job_recommendations"] = (
            recommend_jobs(
                jobs,
                top_n=top_jobs
            )
        )

    return result


if __name__ == "__main__":
    candidates = [
        {
            "candidate_id": 1,
            "name": "Candidate A",
            "ats_score": 90,
            "coding_score": 85,
            "assessment_score": 88,
            "skill_match_score": 92,
            "experience_score": 80
        },
        {
            "candidate_id": 2,
            "name": "Candidate B",
            "ats_score": 82,
            "coding_score": 90,
            "assessment_score": 84,
            "skill_match_score": 86,
            "experience_score": 75
        }
    ]

    jobs = [
        {
            "job_id": 1,
            "title": "Python Backend Engineer",
            "skill_match_score": 92,
            "ats_score": 88,
            "experience_score": 80,
            "career_match_score": 95,
            "learning_alignment_score": 90
        },
        {
            "job_id": 2,
            "title": "Machine Learning Engineer",
            "skill_match_score": 78,
            "ats_score": 80,
            "experience_score": 70,
            "career_match_score": 88,
            "learning_alignment_score": 85
        }
    ]

    result = generate_recommendations(
        candidates=candidates,
        jobs=jobs
    )

    print("\nRECOMMENDATION ENGINE")
    print("=====================")

    print("\nCandidate Recommendations:")
    for candidate in result["candidate_recommendations"]:
        print(
            candidate["recommendation_rank"],
            candidate["name"],
            candidate["overall_recommendation_score"]
        )

    print("\nJob Recommendations:")
    for job in result["job_recommendations"]:
        print(
            job["recommendation_rank"],
            job["title"],
            job["overall_recommendation_score"]
        )