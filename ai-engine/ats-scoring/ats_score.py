from keyword_match import match_skills
from resume_analysis import calculate_keyword_coverage
from score_calculator import (
    calculate_ats_score,
    calculate_education_score,
    calculate_experience_score,
)


def score_resume_against_job(
    resume_analysis: dict,
    job: dict,
) -> dict:
    """
    Calculate an ATS score by comparing a parsed resume
    against a job's requirements.
    """

    candidate_skills = resume_analysis.get(
        "skills",
        []
    )

    required_skills = job.get(
        "required_skills",
        []
    )

    preferred_skills = job.get(
        "preferred_skills",
        []
    )

    experience_data = resume_analysis.get(
        "experience",
        {}
    )

    candidate_years = experience_data.get(
        "experience_years",
        0.0
    )

    minimum_years = job.get(
        "experience_min",
        0
    )

    candidate_education = resume_analysis.get(
        "education",
        []
    )

    required_education = job.get(
        "education"
    )

    # ---------------------------------------------------
    # Skill matching
    # ---------------------------------------------------

    skill_match = match_skills(
        candidate_skills=candidate_skills,
        required_skills=required_skills,
        preferred_skills=preferred_skills,
    )

    required_score = skill_match[
        "required_score"
    ]

    preferred_score = skill_match[
        "preferred_score"
    ]

    # ---------------------------------------------------
    # Experience score
    # ---------------------------------------------------

    experience_score = calculate_experience_score(
        candidate_years=candidate_years,
        minimum_years=minimum_years,
    )

    # ---------------------------------------------------
    # Education score
    # ---------------------------------------------------

    education_score = calculate_education_score(
        candidate_education=candidate_education,
        required_education=required_education,
    )

    # ---------------------------------------------------
    # Final ATS score
    # ---------------------------------------------------

    ats_score = calculate_ats_score(
        required_score=required_score,
        preferred_score=preferred_score,
        experience_score=experience_score,
        education_score=education_score,
    )

    # ---------------------------------------------------
    # Keyword coverage
    # ---------------------------------------------------

    keyword_coverage = calculate_keyword_coverage(
        candidate_skills=candidate_skills,
        required_skills=required_skills,
    )

    return {
        "ats_score": ats_score,
        "keyword_coverage": keyword_coverage,

        "required_skill_score": required_score,
        "preferred_skill_score": preferred_score,

        "experience_score": experience_score,
        "education_score": education_score,

        "matched_required_skills":
            skill_match["matched_required"],

        "missing_required_skills":
            skill_match["missing_required"],

        "matched_preferred_skills":
            skill_match["matched_preferred"],

        "candidate_experience_years":
            candidate_years,

        "required_experience_years":
            minimum_years,
    }


if __name__ == "__main__":

    # Example test data
    sample_resume = {
        "skills": [
            "Python",
            "SQL",
            "JavaScript",
            "FastAPI",
            "PostgreSQL",
            "Machine Learning",
        ],
        "education": [
            "Bachelor of Engineering in Computer Science"
        ],
        "experience": {
            "experience_years": 0.9
        },
    }

    sample_job = {
        "required_skills": [
            "Python",
            "SQL",
            "FastAPI",
            "PostgreSQL",
        ],
        "preferred_skills": [
            "Docker",
            "Machine Learning",
        ],
        "experience_min": 0,
        "education": "Computer Science",
    }

    result = score_resume_against_job(
        sample_resume,
        sample_job
    )

    import json

    print(
        json.dumps(
            result,
            indent=2
        )
    )