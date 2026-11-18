
const API = "http://127.0.0.1:8000/api/hiring-analytics";

const $ = id => document.getElementById(id);

const number = value =>
    Number(value ?? 0).toLocaleString("en-IN");

function cell(value) {
    const td = document.createElement("td");
    td.textContent = value ?? "—";
    return td;
}

function setRows(target, rows, columns, emptyMessage) {
    const body = $(target);
    body.replaceChildren();

    if (!rows || rows.length === 0) {
        const tr = document.createElement("tr");
        const td = cell(emptyMessage);
        td.colSpan = columns;
        td.className = "empty";
        tr.appendChild(td);
        body.appendChild(tr);
        return;
    }

    rows.forEach(row => {
        const tr = document.createElement("tr");
        row.forEach(value => tr.appendChild(cell(value)));
        body.appendChild(tr);
    });
}

function renderBars(target, items, labelKey, valueKey) {
    const container = $(target);
    container.replaceChildren();
    container.className = target === "funnel" ? "funnel" : "";

    if (!Array.isArray(items) || items.length === 0) {
        container.textContent = "No data available yet.";
        container.className = "empty";
        return;
    }

    const max = Math.max(
        1,
        ...items.map(item => Number(item[valueKey] ?? 0))
    );

    items.forEach(item => {
        const count = Number(item[valueKey] ?? 0);

        const row = document.createElement("div");
        row.className =
            target === "funnel" ? "funnel-row" : "skill-row";

        const label = document.createElement("div");
        label.className =
            target === "funnel" ? "funnel-label" : "skill-label";

        const name = document.createElement("span");
        name.textContent = item[labelKey] ?? "Unknown";

        const value = document.createElement("strong");
        value.textContent = number(count);

        label.append(name, value);

        const track = document.createElement("div");
        track.className = "track";

        const fill = document.createElement("div");
        fill.className = "fill";
        fill.style.width = `${Math.max(0, Math.min(100, count / max * 100))}%`;

        track.appendChild(fill);
        row.append(label, track);
        container.appendChild(row);
    });
}

function renderInterviewStats(stats = {}) {
    const container = $("interviewStats");
    container.replaceChildren();

    const values = [
        ["Total", stats.total],
        ["Scheduled", stats.scheduled],
        ["Completed", stats.completed],
        ["Cancelled", stats.cancelled]
    ];

    values.forEach(([label, value]) => {
        const item = document.createElement("div");
        item.className = "interview-item";

        const title = document.createElement("span");
        title.textContent = label;

        const strong = document.createElement("strong");
        strong.textContent = number(value);

        item.append(title, strong);
        container.appendChild(item);
    });
}

async function loadAnalytics() {
    const message = $("message");
    const refreshButton = $("refreshButton");
    const token = localStorage.getItem("access_token");

    if (!token) {
        message.textContent =
            "Recruiter login required. Please log in again.";
        return;
    }

    refreshButton.disabled = true;
    refreshButton.textContent = "Loading...";
    message.textContent = "Loading analytics from the database...";

    try {
        const response = await fetch(API, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json"
            }
        });

        const data = await response.json().catch(() => ({}));
console.log("HIRING ANALYTICS RESPONSE:", JSON.stringify(data, null, 2));
        if (!response.ok) {
            throw new Error(
                data.detail || `API error ${response.status}`
            );
        }

        if (data.success !== true) {
            throw new Error("The analytics API did not return success.");
        }

        // 1. SUMMARY CARDS
        const summary = data.summary || {};

        $("totalJobs").textContent = number(summary.total_jobs);
        $("activeJobs").textContent = number(summary.active_jobs);
        $("totalApplications").textContent =
            number(summary.total_applications);
        $("totalCandidates").textContent =
            number(summary.total_candidates);
        $("totalInterviews").textContent =
            number(summary.total_interviews);

        const hiringDays =
            data.hiring_time?.average_application_to_interview_days;

        $("hiringTime").textContent =
            hiringDays == null ? "—" : Number(hiringDays).toFixed(1);

        // 2. RECRUITMENT FUNNEL
        const funnel = data.recruitment_funnel || {};

        const funnelItems = [
            { label: "Applications", count: funnel.applications },
            { label: "Under Review", count: funnel.under_review },
            { label: "Assessment Pending", count: funnel.assessment_pending },
            { label: "Assessment Completed", count: funnel.assessment_completed },
            { label: "Interviews", count: funnel.interviews },
            { label: "Offers", count: funnel.offers },
            { label: "Rejected", count: funnel.rejected }
        ];

        renderBars("funnel", funnelItems, "label", "count");

        // 3. INTERVIEW ANALYTICS
        renderInterviewStats(data.interview_analytics || {});

        // 4. CANDIDATE SKILLS
        renderBars(
            "skills",
            data.skill_distribution || [],
            "skill",
            "candidate_count"
        );

        // 5. TOP CANDIDATES
        const candidates = Array.isArray(data.top_candidates)
            ? data.top_candidates.map(candidate => [
                candidate.candidate_name,
                candidate.job_title,
                `${Number(candidate.resume_score ?? 0).toFixed(1)}%`,
                candidate.application_status
            ])
            : [];

        setRows(
            "candidateRows",
            candidates,
            4,
            "No candidate applications found."
        );

        // 6. JOB PERFORMANCE
        const jobs = Array.isArray(data.job_performance)
            ? data.job_performance.map(job => [
                job.title,
                job.status,
                number(job.openings),
                number(job.applications),
                number(job.interviews),
                number(job.offers)
            ])
            : [];

        setRows(
            "jobRows",
            jobs,
            6,
            "No jobs found for this recruiter."
        );

        message.textContent =
            "Analytics successfully loaded from live backend data.";

    } catch (error) {
        console.error("Hiring Analytics Error:", error);
        message.textContent =
            `Could not load analytics: ${error.message}`;
    } finally {
        refreshButton.disabled = false;
        refreshButton.innerHTML =
            '<i class="fa-solid fa-rotate"></i> Refresh';
    }
}

$("refreshButton").addEventListener("click", loadAnalytics);

loadAnalytics();
