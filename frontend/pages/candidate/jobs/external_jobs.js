
const API = "http://127.0.0.1:8000/api";

const token =
    sessionStorage.getItem("devrecruit_candidate_token") ||
    localStorage.getItem("access_token");

const container = document.getElementById("externalJobList");
const searchInput = document.getElementById("externalSearch");
const locationInput = document.getElementById("externalLocation");
const searchButton = document.getElementById("externalSearchButton");

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function safeURL(value) {
    try {
        const url = new URL(value);
        return url.protocol === "https:" ? escapeHTML(url.href) : "#";
    } catch {
        return "#";
    }
}

function getCompanyInitials(company) {
    return String(company || "Company")
        .split(/\s+/)
        .slice(0, 2)
        .map(word => word.charAt(0).toUpperCase())
        .join("");
}

function renderJob(job) {
    const title = escapeHTML(job.title || "Untitled Role");
    const company = escapeHTML(job.company || "Company");
    const location = escapeHTML(
        job.location || "Location not specified"
    );
    const source = escapeHTML(job.source || "External source");
    const description = escapeHTML(
        job.description || "View the original listing for complete job details."
            .replace(/<[^>]*>/g, " ")
    );
    const initials = escapeHTML(getCompanyInitials(job.company));
    const applyURL = safeURL(job.apply_url);

    return `
        <article class="external-job-card">

            <div class="company-logo purple">
                ${initials}
            </div>

            <div class="job-main">

                <div class="job-title-row">
                    <div>
                        <span class="job-company">${company}</span>
                        <h4>${title}</h4>
                    </div>
                </div>

                <div class="job-meta">
                    <span class="job-location">
                        <i class="fa-solid fa-location-dot"></i>
                        ${location}
                    </span>
                </div>

                <div class="job-tags">
                    <span class="job-source">${source}</span>
                    <span>External Opportunity</span>
                </div>

                <p class="job-description">${description}</p>

                <div class="job-bottom">
                    <span>Apply directly through company portal</span>

                    <a
                        href="${applyURL}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="apply-job-btn"
                    >
                        View Job & Apply
                        <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    </a>
                </div>

            </div>
        </article>
    `;
}

async function loadExternalJobs() {
    if (!container) return;

    container.innerHTML = `
        <div class="external-message">
            <i class="fa-solid fa-spinner fa-spin"></i>
            <p>Finding external opportunities...</p>
        </div>
    `;

    const params = new URLSearchParams();

    const search = searchInput?.value.trim();
    const location = locationInput?.value.trim();

    if (search) params.set("search", search);
    if (location) params.set("location", location);

    try {
        if (!token) {
            throw new Error("Login token missing. Please log in again.");
        }

        const response = await fetch(
            `${API}/external-jobs?${params.toString()}`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            }
        );

        if (response.status === 401) {
            throw new Error("Your login session expired. Please log in again.");
        }

        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
        }

        const jobs = await response.json();

        if (!Array.isArray(jobs)) {
            throw new Error("Unexpected response from external jobs API.");
        }

        if (jobs.length === 0) {
            container.innerHTML = `
                <div class="external-message">
                    <i class="fa-solid fa-briefcase"></i>
                    <h3>No external jobs found</h3>
                    <p>Try another job title or location.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = jobs.map(renderJob).join("");

    } catch (error) {
        console.error("External Jobs Error:", error);

        container.innerHTML = `
            <div class="external-message">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <h3>Unable to load external jobs</h3>
                <p>${escapeHTML(error.message)}</p>
                <p>Please check your login and backend connection.</p>
            </div>
        `;
    }
}

// Search button
searchButton?.addEventListener("click", loadExternalJobs);

// Enter key search
[searchInput, locationInput].forEach(input => {
    input?.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            loadExternalJobs();
        }
    });
});

// Initial loading
loadExternalJobs();
