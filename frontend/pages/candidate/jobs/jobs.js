
document.addEventListener("DOMContentLoaded", () => {
    const API = "http://127.0.0.1:8000/api";
    const $ = selector => document.querySelector(selector);

    const jobList = $("#jobList");
    const searchInput = $("#jobSearchInput");
    const locationInput = $("#locationInput");
    const searchButton = $("#searchButton");
    const sortSelect = $("#sortJobs");
    const jobCount = $("#jobCount");
    const jobResultTitle = $("#jobResultTitle");
    const noResults = $("#noResults");
    const savedCount = $("#savedCount");
    const savedPreview = $("#savedPreview");

    let jobs = [];
    let savedJobs = [];
    let currentFilter = "all";
    let currentSearch = "";
    let currentLocation = "";
    let currentSort = "match";

    const token =
        sessionStorage.getItem("devrecruit_candidate_token") ||
        sessionStorage.getItem("access_token") ||
        localStorage.getItem("devrecruit_candidate_token") ||
        localStorage.getItem("access_token");

    // SIDEBAR
    const sidebar = $("#candidateSidebar");
    const overlay = $("#sidebarOverlay");

    function openSidebar() {
        sidebar?.classList.add("open");
        overlay?.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function closeSidebar() {
        sidebar?.classList.remove("open");
        overlay?.classList.remove("active");
        document.body.style.overflow = "";
    }

    $("#mobileMenuButton")?.addEventListener("click", openSidebar);
    $("#sidebarClose")?.addEventListener("click", closeSidebar);
    overlay?.addEventListener("click", closeSidebar);

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeSidebar();
            $(".job-details-modal")?.remove();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 900) closeSidebar();
    });

    $("#logoutButton")?.addEventListener("click", () => {
        if (!confirm("Are you sure you want to sign out?")) return;

        [
            "devrecruit_candidate_token",
            "access_token"
        ].forEach(key => {
            sessionStorage.removeItem(key);
            localStorage.removeItem(key);
        });

        window.location.href = "../../auth/role-selection/index.html";
    });

    // HELPERS
    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);
    }

    function normalize(value) {
        return String(value ?? "").toLowerCase().trim();
    }

    function validJobId(job) {
        return Number.isInteger(Number(job?.id)) &&
            Number(job.id) > 0;
    }

    function getSavedJobs() {
        try {
            const data = JSON.parse(
                localStorage.getItem("devrecruit_saved_jobs") || "[]"
            );
            return Array.isArray(data) ? data.map(String) : [];
        } catch {
            return [];
        }
    }

    savedJobs = getSavedJobs();

    function saveSavedJobs() {
        localStorage.setItem(
            "devrecruit_saved_jobs",
            JSON.stringify(savedJobs)
        );
    }

    function getCategory(job) {
        const type = normalize(job.employment_type);
        const location = normalize(job.location);

        if (type.includes("intern")) return "internship";
        if (type.includes("remote") || location.includes("remote")) return "remote";
        if (type.includes("hybrid") || location.includes("hybrid")) return "hybrid";

        return "onsite";
    }

    function getSkills(job) {
        const skills = job.required_skills || [];

        if (Array.isArray(skills)) return skills;

        if (typeof skills === "string") {
            try {
                const parsed = JSON.parse(skills);
                return Array.isArray(parsed)
                    ? parsed
                    : [skills];
            } catch {
                return skills.split(",").map(s => s.trim()).filter(Boolean);
            }
        }

        return [];
    }

    function formatSalary(job) {
        const min = job.salary_min;
        const max = job.salary_max;

        if (min == null && max == null) return "Salary not specified";

        const format = value =>
            "₹" + Number(value).toLocaleString("en-IN");

        if (min != null && max != null) {
            return `${format(min)} – ${format(max)}`;
        }

        return min != null
            ? `From ${format(min)}`
            : `Up to ${format(max)}`;
    }

    function formatExperience(job) {
        const min = job.experience_min;
        const max = job.experience_max;

        if (min == null && max == null) return "Not specified";
        if (min != null && max != null) return `${min}–${max} years`;

        return min != null ? `${min}+ years` : `Up to ${max} years`;
    }

    function formatDate(value) {
        if (!value) return "Recently posted";

        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "Recently posted";

        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    }

    function getInitials(name) {
        return String(name || "Company")
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map(word => word[0].toUpperCase())
            .join("");
    }

    function getCompany(job) {
        return job.company_name || `Company #${job.company_id ?? "Unknown"}`;
    }

    // SAVED JOBS
    function updateSavedPreview() {
        if (savedCount) savedCount.textContent = savedJobs.length;
        if (!savedPreview) return;

        const saved = jobs.filter(job =>
            savedJobs.includes(String(job.id))
        );

        if (!saved.length) {
            savedPreview.innerHTML = `
                <i class="fa-regular fa-bookmark"></i>
                <span>Save jobs to see them here.</span>
            `;
            return;
        }

        savedPreview.innerHTML = saved.slice(0, 3).map(job => `
            <div class="saved-job-preview-item">
                <strong>${escapeHTML(job.title)}</strong>
                <span>${escapeHTML(getCompany(job))}</span>
            </div>
        `).join("");
    }

    // JOB CARD
    function createJobCard(job) {
        const skills = getSkills(job);
        const category = getCategory(job);
        const company = getCompany(job);
        const isSaved = savedJobs.includes(String(job.id));

        const card = document.createElement("article");
        card.className = "job-card";
        card.dataset.jobId = job.id;
        card.dataset.type = category;
        card.dataset.title = job.title || "";
        card.dataset.skills = skills.join(" ");
        card.dataset.location = job.location || "";

        card.innerHTML = `
            <div class="company-logo purple">
                ${escapeHTML(getInitials(company))}
            </div>

            <div class="job-main">
                <div class="job-title-row">
                    <div>
                        <span class="job-company">${escapeHTML(company)}</span>
                        <h4>${escapeHTML(job.title)}</h4>
                    </div>
                </div>

                <div class="job-meta">
                    <span><i class="fa-solid fa-location-dot"></i>
                        ${escapeHTML(job.location || "Location not specified")}
                    </span>
                    <span><i class="fa-solid fa-briefcase"></i>
                        ${escapeHTML(job.employment_type || "Not specified")}
                    </span>
                    <span><i class="fa-solid fa-clock"></i>
                        ${escapeHTML(formatDate(job.created_at))}
                    </span>
                </div>

                <div class="job-tags">
                    ${
                        skills.length
                            ? skills.slice(0, 5).map(skill =>
                                `<span>${escapeHTML(skill)}</span>`
                              ).join("")
                            : "<span>Skills not specified</span>"
                    }
                </div>

                <div class="job-bottom">
                    <strong>${escapeHTML(formatSalary(job))}</strong>
                    <span>Experience: ${escapeHTML(formatExperience(job))}</span>
                </div>
            </div>

            <button class="save-job ${isSaved ? "saved" : ""}"
                type="button"
                aria-label="${isSaved ? "Remove saved job" : "Save job"}">
                <i class="fa-${isSaved ? "solid" : "regular"} fa-bookmark"></i>
            </button>
        `;

        card.querySelector(".save-job").addEventListener("click", event => {
            event.stopPropagation();

            const id = String(job.id);

            savedJobs = savedJobs.includes(id)
                ? savedJobs.filter(item => item !== id)
                : [...savedJobs, id];

            saveSavedJobs();

            const button = card.querySelector(".save-job");
            const saved = savedJobs.includes(id);

            button.classList.toggle("saved", saved);
            button.innerHTML =
                `<i class="fa-${saved ? "solid" : "regular"} fa-bookmark"></i>`;

            updateSavedPreview();
        });

        card.addEventListener("click", () => showJobDetails(job));

        card.setAttribute("tabindex", "0");
        card.addEventListener("keydown", event => {
            if (event.target !== card) return;

            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                showJobDetails(job);
            }
        });

        return card;
    }

    // SEARCH AND FILTERS
    function matchesJob(job) {
        const searchText = normalize([
            job.title,
            getCompany(job),
            job.description,
            ...getSkills(job)
        ].join(" "));

        const location = normalize(job.location);
        const category = getCategory(job);

        return (
            (!currentSearch || searchText.includes(currentSearch)) &&
            (!currentLocation || location.includes(currentLocation)) &&
            (currentFilter === "all" || category === currentFilter)
        );
    }

    function renderJobs() {
        if (!jobList) return;

        let visibleJobs = jobs.filter(matchesJob);

        if (currentSort === "salary") {
            visibleJobs.sort((a, b) =>
                Number(b.salary_max || b.salary_min || 0) -
                Number(a.salary_max || a.salary_min || 0)
            );
        } else if (currentSort === "recent") {
            visibleJobs.sort((a, b) =>
                new Date(b.created_at || 0) -
                new Date(a.created_at || 0)
            );
        }

        jobList.innerHTML = "";

        visibleJobs.forEach(job => {
            jobList.appendChild(createJobCard(job));
        });

        if (jobCount) {
            jobCount.textContent =
                `${visibleJobs.length} ${visibleJobs.length === 1 ? "opportunity" : "opportunities"}`;
        }

        if (jobResultTitle) {
            jobResultTitle.textContent = currentSearch
                ? `Results for "${currentSearch}"`
                : currentFilter !== "all"
                    ? `${currentFilter} opportunities`
                    : "Jobs matched to your profile";
        }

        noResults?.classList.toggle("visible", visibleJobs.length === 0);
        updateSavedPreview();
    }

    function performSearch() {
        currentSearch = normalize(searchInput?.value);
        currentLocation = normalize(locationInput?.value);

        if (currentSearch || currentLocation) {
            currentFilter = "all";

            document.querySelectorAll(".filter-button").forEach(button => {
                button.classList.toggle(
                    "active",
                    normalize(button.dataset.filter) === "all"
                );
            });
        }

        renderJobs();
    }

    searchButton?.addEventListener("click", performSearch);
    searchInput?.addEventListener("input", performSearch);
    locationInput?.addEventListener("input", performSearch);

    [searchInput, locationInput].forEach(input => {
        input?.addEventListener("keydown", event => {
            if (event.key === "Enter") performSearch();
        });
    });

    sortSelect?.addEventListener("change", () => {
        currentSort = sortSelect.value;
        renderJobs();
    });

    document.querySelectorAll(".filter-button").forEach(button => {
        button.addEventListener("click", () => {
            currentFilter = normalize(button.dataset.filter);

            document.querySelectorAll(".filter-button").forEach(item => {
                item.classList.toggle("active", item === button);
            });

            renderJobs();
        });
    });

    document.querySelectorAll("[data-quick-filter]").forEach(button => {
        button.addEventListener("click", () => {
            currentFilter = normalize(button.dataset.quickFilter);

            document.querySelectorAll(".filter-button").forEach(item => {
                item.classList.toggle(
                    "active",
                    normalize(item.dataset.filter) === currentFilter
                );
            });

            document.querySelector(".jobs-list-area")?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            renderJobs();
        });
    });

    // JOB DETAILS
    function showJobDetails(job) {
        $(".job-details-modal")?.remove();

        const skills = getSkills(job);
        const modal = document.createElement("div");
        modal.className = "job-details-modal";

        modal.style.cssText = `
            position:fixed;
            inset:0;
            z-index:99999;
            background:rgba(5,12,26,.82);
            display:flex;
            align-items:center;
            justify-content:center;
            padding:18px;
            overflow:auto;
        `;

        modal.innerHTML = `
            <section role="dialog" aria-modal="true"
                style="background:#111b2e;color:#e8eef8;
                border:1px solid #33445f;border-radius:16px;
                padding:26px;max-width:600px;width:100%;
                max-height:90vh;overflow:auto">

                <button class="jd-close" type="button"
                    style="float:right;padding:7px 12px;cursor:pointer">✕</button>

                <p style="color:#93c5fd">JOB DETAILS</p>
                <h2>${escapeHTML(job.title)}</h2>
                <p>${escapeHTML(getCompany(job))}</p>

                <p><strong>Location:</strong> ${escapeHTML(job.location || "Not specified")}</p>
                <p><strong>Employment:</strong> ${escapeHTML(job.employment_type || "Not specified")}</p>
                <p><strong>Salary:</strong> ${escapeHTML(formatSalary(job))}</p>
                <p><strong>Experience:</strong> ${escapeHTML(formatExperience(job))}</p>
                <p><strong>Education:</strong> ${escapeHTML(job.education || "Not specified")}</p>

                <h3>Required skills</h3>
                <p>${skills.length ? skills.map(escapeHTML).join(" · ") : "Not specified"}</p>

                <h3>Job description</h3>
                <p style="white-space:pre-wrap">${escapeHTML(job.description || "No description provided.")}</p>

                <label for="jdCoverLetter">Cover letter (optional)</label>
                <textarea id="jdCoverLetter" rows="4"
                    placeholder="Explain why you are suitable for this role"
                    style="display:block;width:100%;box-sizing:border-box;
                    margin:8px 0;padding:11px;border-radius:8px;
                    background:#0b1220;color:white;border:1px solid #475569"></textarea>

                <p class="jd-status" role="status" aria-live="polite"></p>

                <button class="jd-apply" type="button"
                    style="background:#4f46e5;color:white;border:0;
                    border-radius:8px;padding:12px 18px;
                    cursor:pointer;font-weight:600">Apply Now</button>
            </section>
        `;

        document.body.appendChild(modal);

        modal.querySelector(".jd-close").addEventListener("click", () => modal.remove());

        modal.addEventListener("click", event => {
            if (event.target === modal) modal.remove();
        });

        modal.querySelector(".jd-apply").addEventListener("click", async event => {
            const button = event.currentTarget;
            const status = modal.querySelector(".jd-status");

            // Never submit demo or invalid job IDs.
            if (!validJobId(job) || !jobs.some(item =>
                Number(item.id) === Number(job.id)
            )) {
                status.textContent =
                    "This is not a published backend job. Refresh the jobs page and select a real job.";
                return;
            }

            if (!token) {
                status.textContent =
                    "Please sign in again. Login token not found.";
                return;
            }

            button.disabled = true;
            button.textContent = "Submitting...";
            status.textContent = "Submitting your application...";

            try {
                const response = await fetch(`${API}/applications`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        job_id: Number(job.id),
                        cover_letter:
                            modal.querySelector("#jdCoverLetter").value.trim() || null
                    })
                });

                const result = await response.json().catch(() => ({}));

                if (!response.ok) {
                    if (response.status === 409) {
                        status.textContent =
                            "You have already applied for this job.";
                    } else if (response.status === 401 || response.status === 403) {
                        status.textContent =
                            "Your session may have expired or your account is not a candidate. Please sign in again.";
                    } else {
                        status.textContent =
                            typeof result.detail === "string"
                                ? result.detail
                                : `Application failed. HTTP ${response.status}`;
                    }

                    button.disabled = false;
                    button.textContent = "Apply Now";
                    return;
                }

                status.textContent =
                    "Application submitted successfully! You can view it in My Applications.";

                button.textContent = "Applied";
                button.disabled = true;

            } catch (error) {
                console.error("Application submission error:", error);

                status.textContent =
                    "Cannot connect to backend. Check that FastAPI is running.";

                button.disabled = false;
                button.textContent = "Apply Now";
            }
        });
    }

    // LOAD REAL PUBLISHED DATABASE JOBS
    async function loadJobs() {
        if (!jobList) return;

        jobList.innerHTML = "<p style='padding:20px'>Loading published jobs...</p>";

        if (!token) {
            jobList.innerHTML =
                "<p style='padding:20px'>Please sign in to view published jobs.</p>";
            return;
        }

        try {
            const response = await fetch(`${API}/jobs`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Unable to load jobs. HTTP ${response.status}`);
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new Error("Unexpected jobs response from backend.");
            }

            // Keep only actual database records with valid IDs.
            jobs = data.filter(job =>
                validJobId(job) &&
                job.is_active !== false &&
                (!job.status || normalize(job.status) === "published")
            );

            renderJobs();

            console.log("Published backend jobs loaded:", jobs);

            if (!jobs.length && jobList) {
                jobList.innerHTML = `
                    <p style="padding:20px">
                        No published jobs are available right now.
                        Ask a recruiter to publish a job first.
                    </p>
                `;
            }

        } catch (error) {
            console.error("Job loading error:", error);

            jobList.innerHTML = `
                <p style="padding:20px;color:#dc6b6b">
                    ${escapeHTML(error.message)}
                    <br><br>
                    Check that your backend is running on port 8000.
                </p>
            `;

            if (jobCount) jobCount.textContent = "0 opportunities";
        }
    }

    // START
    updateSavedPreview();
    loadJobs();

    console.log("DevRecruit AI Jobs initialized.");
});
