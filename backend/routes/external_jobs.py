
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, HttpUrl
from typing import Optional
from urllib.parse import urlparse
import requests

from app.auth.dependencies import get_current_user

router = APIRouter(
    prefix="/api/external-jobs",
    tags=["External Jobs"]
)

# Public job board sources
SOURCES = [
    {"type": "greenhouse", "board": "stripe"},
    {"type": "greenhouse", "board": "figma"},
    {"type": "lever", "board": "netflix"},
]


class ExternalJobURL(BaseModel):
    url: HttpUrl


def fetch_greenhouse(board):
    api_url = (
        f"https://boards-api.greenhouse.io/v1/boards/"
        f"{board}/jobs?content=true"
    )

    response = requests.get(api_url, timeout=15)
    response.raise_for_status()

    jobs = []

    for job in response.json().get("jobs", []):
        jobs.append({
            "external_id": f"greenhouse_{job.get('id')}",
            "title": job.get("title") or "Untitled Role",
            "company": board,
            "location": (job.get("location") or {}).get("name", ""),
            "description": job.get("content") or "",
            "apply_url": job.get("absolute_url"),
            "source": "Greenhouse"
        })

    return jobs


def fetch_lever(board):
    api_url = f"https://api.lever.co/v0/postings/{board}?mode=json"

    response = requests.get(api_url, timeout=15)
    response.raise_for_status()

    jobs = []

    for job in response.json():
        categories = job.get("categories") or {}

        jobs.append({
            "external_id": f"lever_{job.get('id')}",
            "title": job.get("text") or "Untitled Role",
            "company": board,
            "location": categories.get("location", ""),
            "description": job.get("descriptionPlain") or "",
            "apply_url": job.get("hostedUrl"),
            "source": "Lever"
        })

    return jobs


@router.get("")
def get_external_jobs(
    search: Optional[str] = None,
    location: Optional[str] = None,
    current_user=Depends(get_current_user)
):
    results = []

    for source in SOURCES:
        try:
            if source["type"] == "greenhouse":
                results.extend(fetch_greenhouse(source["board"]))

            elif source["type"] == "lever":
                results.extend(fetch_lever(source["board"]))

        except requests.RequestException as error:
            print(
                f"External job source "
                f"{source['board']} unavailable: {error}"
            )

        except (ValueError, TypeError) as error:
            print(
                f"Invalid response from "
                f"{source['board']}: {error}"
            )

    if search:
        search_text = search.strip().lower()

        results = [
            job for job in results
            if search_text in " ".join([
                str(job.get("title") or ""),
                str(job.get("company") or ""),
                str(job.get("description") or "")
            ]).lower()
        ]

    if location:
        location_text = location.strip().lower()

        results = [
            job for job in results
            if location_text in str(job.get("location") or "").lower()
        ]

    return results


@router.post("/add-url")
def add_external_job_url(
    data: ExternalJobURL,
    current_user=Depends(get_current_user)
):
    url = str(data.url)
    parsed = urlparse(url)
    hostname = (parsed.hostname or "").lower()

    allowed_domains = (
        "boards.greenhouse.io",
        "jobs.lever.co",
        "jobs.ashbyhq.com",
        "careers.smartrecruiters.com"
    )

    if not any(
        hostname == domain or hostname.endswith("." + domain)
        for domain in allowed_domains
    ):
        raise HTTPException(
            status_code=400,
            detail="Unsupported job board URL."
        )

    return {
        "message": "Job board URL validated successfully.",
        "apply_url": url,
        "source": hostname
    }
