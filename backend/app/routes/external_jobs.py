
import logging
from typing import Optional
from urllib.parse import urlparse

import requests
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, HttpUrl

from app.auth.dependencies import get_current_user, require_role


router = APIRouter(
    prefix="/api/external-jobs",
    tags=["External Jobs"]
)

logger = logging.getLogger(__name__)

# =======================================================
# REAL COMPANY JOB SOURCES
# =======================================================

SOURCES = [
    {
        "type": "greenhouse",
        "board": "stripe",
        "company": "Stripe"
    },
    {
        "type": "greenhouse",
        "board": "figma",
        "company": "Figma"
    },
    {
        "type": "greenhouse",
        "board": "airbnb",
        "company": "Airbnb"
    },
    {
        "type": "lever",
        "board": "spotify",
        "company": "Spotify"
    }
]

REQUEST_HEADERS = {
    "User-Agent": "DevRecruitAI/1.0",
    "Accept": "application/json"
}

# =======================================================
# JOB RESPONSE FORMAT
# =======================================================

def make_job(
    external_id,
    title,
    company,
    location,
    description,
    apply_url,
    source
):
    if not title or not apply_url:
        return None

    parsed = urlparse(apply_url)

    if parsed.scheme != "https" or not parsed.hostname:
        return None

    return {
        "external_id": str(external_id),
        "title": title,
        "company": company,
        "location": location or "Location not specified",
        "description": description or "",
        "apply_url": apply_url,
        "source": source
    }


# =======================================================
# GREENHOUSE JOB FETCHER
# =======================================================

def fetch_greenhouse(source):

    board = source["board"]
    company = source["company"]

    url = (
        f"https://boards-api.greenhouse.io/v1/boards/"
        f"{board}/jobs?content=true"
    )

    response = requests.get(
        url,
        headers=REQUEST_HEADERS,
        timeout=20
    )

    response.raise_for_status()

    data = response.json()
    jobs = []

    for item in data.get("jobs", []):

        location_data = item.get("location") or {}

        job = make_job(
            external_id=f"greenhouse_{item.get('id')}",
            title=item.get("title"),
            company=company,
            location=location_data.get("name", ""),
            description=item.get("content", ""),
            apply_url=item.get("absolute_url"),
            source="Greenhouse"
        )

        if job:
            jobs.append(job)

    logger.info(
        "Fetched %s jobs from %s",
        len(jobs),
        company
    )

    return jobs


# =======================================================
# LEVER JOB FETCHER
# =======================================================

def fetch_lever(source):

    site = source["board"]
    company = source["company"]

    url = (
        f"https://api.lever.co/v0/postings/"
        f"{site}?mode=json"
    )

    response = requests.get(
        url,
        headers=REQUEST_HEADERS,
        timeout=20
    )

    response.raise_for_status()

    data = response.json()
    jobs = []

    for item in data:

        categories = item.get("categories") or {}

        job = make_job(
            external_id=f"lever_{item.get('id')}",
            title=item.get("text"),
            company=company,
            location=categories.get("location", ""),
            description=item.get("descriptionPlain", ""),
            apply_url=item.get("hostedUrl"),
            source="Lever"
        )

        if job:
            jobs.append(job)

    logger.info(
        "Fetched %s jobs from %s",
        len(jobs),
        company
    )

    return jobs


# =======================================================
# GET EXTERNAL JOBS
# =======================================================

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
                fetched = fetch_greenhouse(source)

            elif source["type"] == "lever":
                fetched = fetch_lever(source)

            else:
                logger.warning(
                    "Unsupported source: %s",
                    source["type"]
                )
                continue

            results.extend(fetched)

        except requests.RequestException as error:

            logger.error(
                "Failed to fetch jobs from %s: %s",
                source["company"],
                error
            )

        except (ValueError, KeyError, TypeError) as error:

            logger.error(
                "Invalid job data from %s: %s",
                source["company"],
                error
            )

    # Search by title, company and description
    if search:

        search_text = search.strip().lower()

        results = [
            job for job in results
            if search_text in job["title"].lower()
            or search_text in job["company"].lower()
            or search_text in job["description"].lower()
        ]

    # Filter by location
    if location:

        location_text = location.strip().lower()

        results = [
            job for job in results
            if location_text in job["location"].lower()
        ]

    logger.info(
        "Returning %s external jobs",
        len(results)
    )

    return results


# =======================================================
# ADMIN: ADD / VALIDATE EXTERNAL JOB BOARD URL
# =======================================================

class ExternalJobURL(BaseModel):
    url: HttpUrl


@router.post("/add-url")
def add_external_job_url(
    data: ExternalJobURL,
    current_user=Depends(require_role("admin"))
):

    url = str(data.url)
    parsed = urlparse(url)

    hostname = (parsed.hostname or "").lower()

    allowed_domains = {
        "boards.greenhouse.io": "greenhouse",
        "jobs.lever.co": "lever",
        "jobs.ashbyhq.com": "ashby",
        "careers.smartrecruiters.com": "smartrecruiters"
    }

    source_type = allowed_domains.get(hostname)

    if not source_type:
        raise HTTPException(
            status_code=400,
            detail="Unsupported job-board URL."
        )

    path_parts = [
        part for part in parsed.path.split("/")
        if part
    ]

    if not path_parts:
        raise HTTPException(
            status_code=400,
            detail="Company board identifier is missing."
        )

    board_id = path_parts[0]

    return {
        "message": "Job board URL validated successfully.",
        "board": board_id,
        "type": source_type,
        "apply_url": url,
        "saved": False
    }
