import csv
import io

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.auth.dependencies import get_current_user

from app.models.job import Job
from app.models.application import Application
from app.models.interview import Interview
from app.models.user import User


router = APIRouter(
    prefix="/api/reports",
    tags=["Reports"]
)


def check_recruiter(current_user):
    if str(current_user.role).lower() != "recruiter":
        raise HTTPException(
            status_code=403,
            detail="Recruiter access required"
        )


def get_report_data(db, recruiter_id):
    jobs = (
        db.query(Job)
        .filter(Job.recruiter_id == recruiter_id)
        .all()
    )

    job_ids = [job.id for job in jobs]

    applications = []

    if job_ids:
        applications = (
            db.query(Application)
            .filter(Application.job_id.in_(job_ids))
            .all()
        )

    rows = []

    for application in applications:

        candidate = (
            db.query(User)
            .filter(User.id == application.candidate_id)
            .first()
        )

        job = (
            db.query(Job)
            .filter(Job.id == application.job_id)
            .first()
        )

        interview = (
            db.query(Interview)
            .filter(
                Interview.application_id == application.id,
                Interview.recruiter_id == recruiter_id
            )
            .order_by(Interview.id.desc())
            .first()
        )

        rows.append({
            "application_id": application.id,
            "candidate_id": application.candidate_id,
            "candidate_name": (
                candidate.full_name
                if candidate else "Unknown"
            ),
            "candidate_email": (
                candidate.email
                if candidate else ""
            ),
            "job_id": application.job_id,
            "job_title": (
                job.title
                if job else "Unknown"
            ),
            "status": application.status,
            "resume_score": (
                application.ats_score
                if application.ats_score is not None
                else 0
            ),
            "applied_at": (
                str(application.applied_at)
                if application.applied_at
                else ""
            ),
            "interview_status": (
                interview.status
                if interview
                else "Not Scheduled"
            ),
            "interview_date": (
                str(interview.scheduled_at)
                if interview
                else ""
            )
        })

    return rows


# =======================================================
# CSV REPORT
# =======================================================

@router.get("/csv")
def export_csv(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    check_recruiter(current_user)

    rows = get_report_data(
        db,
        current_user.id
    )

    output = io.StringIO()

    fieldnames = [
        "application_id",
        "candidate_id",
        "candidate_name",
        "candidate_email",
        "job_id",
        "job_title",
        "status",
        "resume_score",
        "applied_at",
        "interview_status",
        "interview_date"
    ]

    writer = csv.DictWriter(
        output,
        fieldnames=fieldnames
    )

    writer.writeheader()
    writer.writerows(rows)

    output.seek(0)

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={
            "Content-Disposition":
                "attachment; filename=hiring_report.csv"
        }
    )


# =======================================================
# EXCEL REPORT
# =======================================================

@router.get("/excel")
def export_excel(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    check_recruiter(current_user)

    from openpyxl import Workbook

    rows = get_report_data(
        db,
        current_user.id
    )

    workbook = Workbook()
    sheet = workbook.active
    sheet.title = "Hiring Report"

    headers = [
        "Application ID",
        "Candidate ID",
        "Candidate Name",
        "Candidate Email",
        "Job ID",
        "Job Title",
        "Status",
        "Resume Score",
        "Applied At",
        "Interview Status",
        "Interview Date"
    ]

    sheet.append(headers)

    for row in rows:
        sheet.append([
            row["application_id"],
            row["candidate_id"],
            row["candidate_name"],
            row["candidate_email"],
            row["job_id"],
            row["job_title"],
            row["status"],
            row["resume_score"],
            row["applied_at"],
            row["interview_status"],
            row["interview_date"]
        ])

    # Auto-size columns
    for column in sheet.columns:
        max_length = 0
        column_letter = column[0].column_letter

        for cell in column:
            value = str(cell.value or "")
            max_length = max(
                max_length,
                len(value)
            )

        sheet.column_dimensions[
            column_letter
        ].width = min(
            max_length + 2,
            40
        )

    output = io.BytesIO()

    workbook.save(output)
    output.seek(0)

    return StreamingResponse(
        output,
        media_type=(
            "application/vnd.openxmlformats-officedocument."
            "spreadsheetml.sheet"
        ),
        headers={
            "Content-Disposition":
                "attachment; filename=hiring_report.xlsx"
        }
    )


# =======================================================
# PDF REPORT
# =======================================================

@router.get("/pdf")
def export_pdf(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    check_recruiter(current_user)

    from reportlab.lib import colors
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import getSampleStyleSheet
    from reportlab.platypus import (
        SimpleDocTemplate,
        Paragraph,
        Spacer,
        Table,
        TableStyle
    )

    rows = get_report_data(
        db,
        current_user.id
    )

    output = io.BytesIO()

    document = SimpleDocTemplate(
        output,
        pagesize=A4,
        rightMargin=30,
        leftMargin=30,
        topMargin=30,
        bottomMargin=30
    )

    styles = getSampleStyleSheet()

    elements = []

    elements.append(
        Paragraph(
            "AI Developer Recruitment Platform",
            styles["Title"]
        )
    )

    elements.append(
        Paragraph(
            "Recruiter Hiring Report",
            styles["Heading2"]
        )
    )

    elements.append(Spacer(1, 15))

    summary_data = [
        ["Metric", "Value"],
        ["Total Jobs", str(
            db.query(Job)
            .filter(Job.recruiter_id == current_user.id)
            .count()
        )],
        ["Total Applications", str(len(rows))],
        ["Total Interviews", str(
            db.query(Interview)
            .filter(
                Interview.recruiter_id == current_user.id
            )
            .count()
        )]
    ]

    summary_table = Table(summary_data)

    summary_table.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.grey),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("GRID", (0, 0), (-1, -1), 1, colors.black),
            ("PADDING", (0, 0), (-1, -1), 6),
        ])
    )

    elements.append(summary_table)
    elements.append(Spacer(1, 20))

    table_data = [[
        "Candidate",
        "Job",
        "Status",
        "Resume Score"
    ]]

    for row in rows:
        table_data.append([
            row["candidate_name"],
            row["job_title"],
            row["status"],
            str(row["resume_score"])
        ])

    if len(table_data) == 1:
        table_data.append([
            "No applications",
            "-",
            "-",
            "0"
        ])

    report_table = Table(
        table_data,
        repeatRows=1
    )

    report_table.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.grey),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.black),
            ("PADDING", (0, 0), (-1, -1), 5),
        ])
    )

    elements.append(report_table)

    document.build(elements)

    output.seek(0)

    return StreamingResponse(
        output,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
                "attachment; filename=hiring_report.pdf"
        }
    )