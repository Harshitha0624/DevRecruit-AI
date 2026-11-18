from pathlib import Path
import sys


PROJECT_ROOT = Path(__file__).resolve().parents[3]

RANKING_DIR = (
    PROJECT_ROOT
    / "ai-engine"
    / "candidate-ranking"
)

if str(RANKING_DIR) not in sys.path:
    sys.path.insert(0, str(RANKING_DIR))

from rank_candidates import rank_candidates

from app.models.application import Application
from app.models.assessment import Assessment
from app.models.assessment_attempt import AssessmentAttempt
from app.models.job import Job
from app.models.user import User
from app.services.ats_service import calculate_ats_score
from app.services.resume_analysis_service import analyze_resume


def get_candidate_ranking(
    job: Job,
    db
) -> list[dict]:
    applications = (
        db.query(Application)
        .filter(
            Application.job_id == job.id
        )
        .all()
    )

    candidates = []

    for application in applications:

        user = (
            db.query(User)
            .filter(
                User.id == application.candidate_id
            )
            .first()
        )

        ats_score = application.ats_score or 0.0
        skill_match_score = 0.0
        experience_score = 0.0

        # ---------------------------------------------
        # Recalculate ATS details from stored resume
        # ---------------------------------------------

        if application.resume_file_id:

            resume = (
                db.query(
                    __import__(
                        "app.models.file",
                        fromlist=["File"]
                    ).File
                )
                .filter(
                    __import__(
                        "app.models.file",
                        fromlist=["File"]
                    ).File.id
                    == application.resume_file_id
                )
                .first()
            )

            if resume:

                try:

                    resume_analysis = analyze_resume(
                        resume.file_path
                    )

                    ats_result = calculate_ats_score(
                        resume_analysis=resume_analysis,
                        job=job
                    )

                    ats_score = ats_result.get(
                        "ats_score",
                        ats_score
                    )

                    skill_match_score = ats_result.get(
                        "required_skill_score",
                        0.0
                    )

                    experience_score = ats_result.get(
                        "experience_score",
                        0.0
                    )

                except Exception as exc:

                    print(
                        f"Ranking resume analysis failed "
                        f"for application {application.id}: {exc}"
                    )


        # ---------------------------------------------
        # Latest assessment score for this job
        # ---------------------------------------------

        assessment_attempt = (
            db.query(AssessmentAttempt)
            .join(
                Assessment,
                AssessmentAttempt.assessment_id
                == Assessment.id
            )
            .filter(
                Assessment.job_id == job.id,
                AssessmentAttempt.candidate_id
                == application.candidate_id
            )
            .order_by(
                AssessmentAttempt.id.desc()
            )
            .first()
        )

        assessment_score = 0.0

        if assessment_attempt:

            assessment_score = (
                assessment_attempt.percentage or 0.0
            )


        candidates.append({
            "candidate_id": application.candidate_id,
            "application_id": application.id,
            "name": (
                user.full_name
                if user
                else f"Candidate {application.candidate_id}"
            ),
            "ats_score": ats_score,
            "assessment_score": assessment_score,
            "skill_match_score": skill_match_score,
            "experience_score": experience_score,
            "application_status": application.status,
        })


    return rank_candidates(candidates)