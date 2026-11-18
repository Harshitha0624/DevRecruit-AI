/* =======================================================
   DEVRECRUIT — RECRUITER JOBS
======================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* ===================================================
       ELEMENTS
    =================================================== */

    const sidebar =
        document.querySelector("#jobsSidebar");

    const sidebarOverlay =
        document.querySelector("#sidebarOverlay");

    const mobileMenuButton =
        document.querySelector("#mobileMenuButton");

    const sidebarClose =
        document.querySelector("#sidebarClose");

    const jobSearch =
        document.querySelector("#jobSearch");

    const statusFilter =
        document.querySelector("#jobStatusFilter");

    const typeFilter =
        document.querySelector("#jobTypeFilter");

    const locationFilter =
        document.querySelector("#jobLocationFilter");

    const clearFilters =
        document.querySelector("#clearJobFilters");

    const jobsGrid =
        document.querySelector("#jobsGrid");

    const emptyState =
        document.querySelector("#emptyJobState");

    const resultCount =
        document.querySelector("#jobResultCount");

    const viewButtons =
        document.querySelectorAll(".view-button");

    const createJobButton =
        document.querySelector("#createJobButton");

    const jobModal =
        document.querySelector("#jobModal");

    const modalOverlay =
        document.querySelector("#modalOverlay");

    const modalClose =
        document.querySelector("#modalClose");

    const cancelJobButton =
        document.querySelector("#cancelJobButton");

    const jobForm =
        document.querySelector("#jobForm");

    const logoutButton =
        document.querySelector("#logoutButton");

    const toast =
        document.querySelector("#jobsToast");

    const toastTitle =
        document.querySelector("#toastTitle");

    const toastMessage =
        document.querySelector("#toastMessage");

    const toastClose =
        document.querySelector("#toastClose");

    let toastTimer;


    /* ===================================================
       SIDEBAR
    =================================================== */

    function openSidebar() {

        sidebar?.classList.add("open");

        sidebarOverlay?.classList.add("active");

    }


    function closeSidebar() {

        sidebar?.classList.remove("open");

        sidebarOverlay?.classList.remove("active");

    }


    mobileMenuButton?.addEventListener(
        "click",
        openSidebar
    );


    sidebarClose?.addEventListener(
        "click",
        closeSidebar
    );


    sidebarOverlay?.addEventListener(
        "click",
        closeSidebar
    );


    /* ===================================================
       TOAST
    =================================================== */

    function showToast(
        title,
        message
    ) {

        if (!toast) return;


        if (toastTitle) {

            toastTitle.textContent =
                title;

        }


        if (toastMessage) {

            toastMessage.textContent =
                message;

        }


        toast.classList.add(
            "show"
        );


        clearTimeout(
            toastTimer
        );


        toastTimer =
            setTimeout(
                () => {

                    toast.classList.remove(
                        "show"
                    );

                },
                3500
            );

    }


    toastClose?.addEventListener(
        "click",
        () => {

            toast?.classList.remove(
                "show"
            );

        }
    );


    /* ===================================================
       JOB FILTERING
    =================================================== */

    function applyFilters() {

        const search =
            (
                jobSearch?.value ||
                ""
            )
            .trim()
            .toLowerCase();


        const selectedStatus =
            statusFilter?.value ||
            "all";


        const selectedType =
            typeFilter?.value ||
            "all";


        const selectedLocation =
            locationFilter?.value ||
            "all";


        const jobCards =
            Array.from(
                document.querySelectorAll(
                    ".job-card"
                )
            );


        let visibleJobs = 0;


        jobCards.forEach(
            (job) => {

                const jobSearchText =
                    (
                        job.dataset.search ||
                        job.textContent ||
                        ""
                    )
                    .toLowerCase();


                const jobStatus =
                    job.dataset.status ||
                    "";


                const jobType =
                    job.dataset.type ||
                    "";


                const jobLocation =
                    job.dataset.location ||
                    "";


                const matchesSearch =
                    !search ||
                    jobSearchText.includes(
                        search
                    );


                const matchesStatus =
                    selectedStatus === "all" ||
                    jobStatus === selectedStatus;


                const matchesType =
                    selectedType === "all" ||
                    jobType === selectedType;


                const matchesLocation =
                    selectedLocation === "all" ||
                    jobLocation === selectedLocation;


                const visible =
                    matchesSearch &&
                    matchesStatus &&
                    matchesType &&
                    matchesLocation;


                job.style.display =
                    visible
                        ? ""
                        : "flex";


                if (visible) {

                    visibleJobs++;

                }

            }
        );


        if (emptyState) {

            emptyState.classList.toggle(
                "show",
                visibleJobs === 0
            );

        }


        if (jobsGrid) {

            jobsGrid.style.display =
                visibleJobs === 0
                    ? "none"
                    : "";

        }


        if (resultCount) {

            resultCount.textContent =
                `Showing ${visibleJobs} job${
                    visibleJobs === 1
                        ? ""
                        : "s"
                }`;

        }

    }


    jobSearch?.addEventListener(
        "input",
        applyFilters
    );


    statusFilter?.addEventListener(
        "change",
        applyFilters
    );


    typeFilter?.addEventListener(
        "change",
        applyFilters
    );


    locationFilter?.addEventListener(
        "change",
        applyFilters
    );


    /* ===================================================
       CLEAR FILTERS
    =================================================== */

    clearFilters?.addEventListener(
        "click",
        () => {

            if (jobSearch) {

                jobSearch.value =
                    "";

            }


            if (statusFilter) {

                statusFilter.value =
                    "all";

            }


            if (typeFilter) {

                typeFilter.value =
                    "all";

            }


            if (locationFilter) {

                locationFilter.value =
                    "all";

            }


            applyFilters();


            showToast(
                "Filters Reset",
                "All job filters have been cleared."
            );

        }
    );


    /* ===================================================
       GRID / LIST VIEW
    =================================================== */

    viewButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const selectedView =
                        button.dataset.view;


                    viewButtons.forEach(
                        (item) => {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    if (
                        selectedView ===
                        "list"
                    ) {

                        jobsGrid?.classList.add(
                            "list-view"
                        );

                    } else {

                        jobsGrid?.classList.remove(
                            "list-view"
                        );

                    }

                }
            );

        }
    );


    /* ===================================================
       CREATE JOB MODAL
    =================================================== */

    function openJobModal() {

        if (!jobModal) return;


        jobModal.classList.add(
            "open"
        );


        jobModal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.style.overflow =
            "hidden";


        setTimeout(
            () => {

                document
                    .querySelector(
                        "#jobTitle"
                    )
                    ?.focus();

            },
            150
        );

    }


    function closeJobModal() {

        if (!jobModal) return;


        jobModal.classList.remove(
            "open"
        );


        jobModal.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.style.overflow =
            "";

    }


    createJobButton?.addEventListener(
        "click",
        openJobModal
    );


    modalClose?.addEventListener(
        "click",
        closeJobModal
    );


    cancelJobButton?.addEventListener(
        "click",
        closeJobModal
    );


    modalOverlay?.addEventListener(
        "click",
        closeJobModal
    );


    /* ===================================================
       CREATE JOB
    =================================================== */

    jobForm?.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            const title =
                document
                    .querySelector(
                        "#jobTitle"
                    )
                    ?.value
                    .trim();


            const department =
                document
                    .querySelector(
                        "#jobDepartment"
                    )
                    ?.value;


            const type =
                document
                    .querySelector(
                        "#jobType"
                    )
                    ?.value;


            const location =
                document
                    .querySelector(
                        "#jobLocation"
                    )
                    ?.value;


            const description =
                document
                    .querySelector(
                        "#jobDescription"
                    )
                    ?.value
                    .trim();


            if (
                !title ||
                !department ||
                !type ||
                !location ||
                !description
            ) {

                showToast(
                    "Missing Information",
                    "Please complete all required job fields."
                );

                return;

            }


            const skills =
                document
                    .querySelector(
                        "#jobSkills"
                    )
                    ?.value
                    .trim();


            const salary =
                document
                    .querySelector(
                        "#jobSalary"
                    )
                    ?.value
                    .trim();


            const experience =
                document
                    .querySelector(
                        "#jobExperience"
                    )
                    ?.value;


            const locationLabel =
                getLocationLabel(
                    location
                );


            const typeLabel =
                getJobTypeLabel(
                    type
                );


            const jobCard =
                createJobCard({
                    title,
                    department,
                    type,
                    typeLabel,
                    location,
                    locationLabel,
                    skills,
                    salary,
                    experience
                });


            if (jobsGrid) {

                jobsGrid.prepend(
                    jobCard
                );

            }


            updateJobSummary();

            applyFilters();

            closeJobModal();


            jobForm.reset();


            showToast(
                "Job Published",
                `${title} has been added to your active job postings.`
            );

        }
    );


    /* ===================================================
       CREATE JOB CARD
    =================================================== */

    function createJobCard(data) {

        const article =
            document.createElement(
                "article"
            );


        article.className =
            "job-card";


        article.dataset.status =
            "active";


        article.dataset.type =
            data.type;


        article.dataset.location =
            data.location;


        article.dataset.search =
            `${data.title} ${data.department} ${data.locationLabel} ${data.skills || ""}`
                .toLowerCase();


        const logoText =
            getLogoText(
                data.title
            );


        const logoClass =
            getLogoClass(
                data.type
            );


        const salaryText =
            data.salary ||
            "Not specified";


        const skillsHTML =
            createSkillsHTML(
                data.skills
            );


        article.innerHTML = `

            <div class="job-card-top">

                <div class="company-logo ${logoClass}">
                    ${logoText}
                </div>

                <div class="job-card-actions">

                    <button
                        class="job-action"
                        type="button"
                        title="More options">

                        <i class="fa-solid fa-ellipsis"></i>

                    </button>

                </div>

            </div>


            <div class="job-title-area">

                <span class="job-status active">

                    <i class="fa-solid fa-circle"></i>

                    Active

                </span>

                <h4>
                    ${escapeHTML(data.title)}
                </h4>

                <p>
                    ${escapeHTML(data.department)} ·
                    ${escapeHTML(data.locationLabel)}
                </p>

            </div>


            <div class="job-tags">

                ${skillsHTML}

            </div>


            <div class="job-meta">

                <span>

                    <i class="fa-solid fa-location-dot"></i>

                    ${escapeHTML(data.locationLabel)}

                </span>

                <span>

                    <i class="fa-solid fa-clock"></i>

                    ${escapeHTML(data.typeLabel)}

                </span>

                <span>

                    <i class="fa-solid fa-indian-rupee-sign"></i>

                    ${escapeHTML(salaryText)}

                </span>

            </div>


            <div class="job-card-footer">

                <div class="application-info">

                    <strong>
                        0
                    </strong>

                    <span>
                        Applications
                    </span>

                </div>

                <div class="job-date">
                    Posted just now
                </div>

                <button
                    class="manage-job-button"
                    type="button">

                    Manage

                    <i class="fa-solid fa-arrow-right"></i>

                </button>

            </div>

        `;


        return article;

    }


    /* ===================================================
       SKILLS HTML
    =================================================== */

    function createSkillsHTML(
        skills
    ) {

        if (!skills) {

            return `
                <span>
                    Skills to be added
                </span>
            `;

        }


        const skillList =
            skills
                .split(",")
                .map(
                    (skill) =>
                        skill.trim()
                )
                .filter(
                    Boolean
                );


        if (
            skillList.length === 0
        ) {

            return `
                <span>
                    Skills to be added
                </span>
            `;

        }


        const visibleSkills =
            skillList.slice(
                0,
                3
            );


        let html =
            visibleSkills
                .map(
                    (skill) =>
                        `<span>${escapeHTML(skill)}</span>`
                )
                .join("");


        if (
            skillList.length > 3
        ) {

            html += `
                <span>
                    +${skillList.length - 3}
                </span>
            `;

        }


        return html;

    }


    /* ===================================================
       JOB LABEL HELPERS
    =================================================== */

    function getJobTypeLabel(
        type
    ) {

        const labels = {

            "full-time":
                "Full Time",

            "part-time":
                "Part Time",

            "contract":
                "Contract",

            "internship":
                "Internship"

        };


        return (
            labels[type] ||
            type
        );

    }


    function getLocationLabel(
        location
    ) {

        const labels = {

            bengaluru:
                "Bengaluru",

            hybrid:
                "Hybrid",

            remote:
                "Remote"

        };


        return (
            labels[location] ||
            location
        );

    }


    function getLogoText(
        title
    ) {

        const words =
            title
                .trim()
                .split(/\s+/)
                .filter(Boolean);


        if (
            words.length >= 2
        ) {

            return (
                words[0][0] +
                words[1][0]
            ).toUpperCase();

        }


        return title
            .substring(0, 2)
            .toUpperCase();

    }


    function getLogoClass(
        type
    ) {

        const classes = {

            "full-time":
                "blue-logo",

            "part-time":
                "purple-logo",

            contract:
                "cyan-logo",

            internship:
                "green-logo"

        };


        return (
            classes[type] ||
            "blue-logo"
        );

    }


    /* ===================================================
       ESCAPE HTML
    =================================================== */

    function escapeHTML(
        value
    ) {

        return String(
            value ?? ""
        )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

    }


    /* ===================================================
       JOB ACTIONS
    =================================================== */

    document.addEventListener(
        "click",
        (event) => {

            const manageButton =
                event.target.closest(
                    ".manage-job-button"
                );


            if (manageButton) {

                const card =
                    manageButton.closest(
                        ".job-card"
                    );


                const title =
                    card
                        ?.querySelector(
                            ".job-title-area h4"
                        )
                        ?.textContent
                        .trim();


                if (!title) return;


                showToast(
                    "Job Management",
                    `Management actions for "${title}" will connect to the backend.`
                );


                return;

            }


            const actionButton =
                event.target.closest(
                    ".job-action"
                );


            if (actionButton) {

                const card =
                    actionButton.closest(
                        ".job-card"
                    );


                if (!card) return;


                toggleJobActions(
                    card,
                    actionButton
                );

            }

        }
    );


    /* ===================================================
       JOB ACTION MENU
    =================================================== */

    function toggleJobActions(
        card,
        button
    ) {

        closeAllActionMenus();


        let menu =
            card.querySelector(
                ".job-action-menu"
            );


        if (!menu) {

            menu =
                document.createElement(
                    "div"
                );


            menu.className =
                "job-action-menu";


            menu.innerHTML = `

                <button
                    type="button"
                    data-action="edit">

                    <i class="fa-solid fa-pen"></i>

                    Edit Job

                </button>

                <button
                    type="button"
                    data-action="duplicate">

                    <i class="fa-regular fa-copy"></i>

                    Duplicate

                </button>

                <button
                    type="button"
                    data-action="close">

                    <i class="fa-solid fa-pause"></i>

                    Change Status

                </button>

                <button
                    type="button"
                    data-action="delete"
                    class="danger">

                    <i class="fa-solid fa-trash"></i>

                    Delete

                </button>

            `;


            card
                .querySelector(
                    ".job-card-actions"
                )
                ?.appendChild(
                    menu
                );


            menu
                .querySelectorAll(
                    "button"
                )
                .forEach(
                    (item) => {

                        item.addEventListener(
                            "click",
                            () => {

                                handleJobAction(
                                    item.dataset.action,
                                    card
                                );

                                menu.remove();

                            }
                        );

                    }
                );

        }


        menu.classList.add(
            "show"
        );


        button.setAttribute(
            "aria-expanded",
            "true"
        );

    }


    function closeAllActionMenus() {

        document
            .querySelectorAll(
                ".job-action-menu.show"
            )
            .forEach(
                (menu) => {

                    menu.classList.remove(
                        "show"
                    );

                }
            );

    }


    /* ===================================================
       HANDLE JOB ACTION
    =================================================== */

    function handleJobAction(
        action,
        card
    ) {

        const title =
            card
                ?.querySelector(
                    ".job-title-area h4"
                )
                ?.textContent
                .trim() ||
            "Job";


        if (
            action ===
            "edit"
        ) {

            showToast(
                "Edit Job",
                `Editing "${title}" will be connected to the job editor.`
            );


            return;

        }


        if (
            action ===
            "duplicate"
        ) {

            const duplicate =
                card.cloneNode(
                    true
                );


            const duplicateTitle =
                duplicate.querySelector(
                    ".job-title-area h4"
                );


            if (duplicateTitle) {

                duplicateTitle.textContent =
                    `${title} — Copy`;

            }


            duplicate.dataset.search =
                (
                    duplicate.dataset.search ||
                    ""
                ) +
                " copy";


            jobsGrid?.prepend(
                duplicate
            );


            updateJobSummary();

            applyFilters();


            showToast(
                "Job Duplicated",
                `"${title}" has been duplicated.`
            );


            return;

        }


        if (
            action ===
            "close"
        ) {

            changeJobStatus(
                card
            );


            return;

        }


        if (
            action ===
            "delete"
        ) {

            const confirmed =
                window.confirm(
                    `Delete "${title}"?`
                );


            if (!confirmed) return;


            card.remove();


            updateJobSummary();

            applyFilters();


            showToast(
                "Job Deleted",
                `"${title}" has been removed from your job postings.`
            );

        }

    }


    /* ===================================================
       CHANGE JOB STATUS
    =================================================== */

    function changeJobStatus(
        card
    ) {

        if (!card) return;


        const statusElement =
            card.querySelector(
                ".job-status"
            );


        const currentStatus =
            card.dataset.status;


        if (
            currentStatus ===
            "active"
        ) {

            card.dataset.status =
                "closed";


            if (statusElement) {

                statusElement.className =
                    "job-status closed";

                statusElement.innerHTML =
                    `
                        <i class="fa-solid fa-circle"></i>
                        Closed
                    `;

            }


            showToast(
                "Job Closed",
                "The job posting has been closed."
            );

        } else {

            card.dataset.status =
                "active";


            if (statusElement) {

                statusElement.className =
                    "job-status active";

                statusElement.innerHTML =
                    `
                        <i class="fa-solid fa-circle"></i>
                        Active
                    `;

            }


            showToast(
                "Job Activated",
                "The job posting is active again."
            );

        }


        updateJobSummary();

        applyFilters();

    }


    /* ===================================================
       UPDATE SUMMARY COUNTS
    =================================================== */

    function updateJobSummary() {

        const cards =
            Array.from(
                document.querySelectorAll(
                    ".job-card"
                )
            );


        const active =
            cards.filter(
                (card) =>
                    card.dataset.status ===
                    "active"
            ).length;


        const drafts =
            cards.filter(
                (card) =>
                    card.dataset.status ===
                    "draft"
            ).length;


        const navCount =
            document.querySelector(
                "#jobsNavCount"
            );


        const activeCount =
            document.querySelector(
                "#activeJobsCount"
            );


        const draftCount =
            document.querySelector(
                "#draftJobsCount"
            );


        if (navCount) {

            navCount.textContent =
                cards.length;

        }


        if (activeCount) {

            activeCount.textContent =
                active;

        }


        if (draftCount) {

            draftCount.textContent =
                drafts;

        }

    }


    /* ===================================================
       PAGINATION
    =================================================== */

    const paginationButtons =
        document.querySelectorAll(
            ".pagination button"
        );


    paginationButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    if (
                        button.disabled ||
                        button.classList.contains(
                            "active"
                        )
                    ) {

                        return;

                    }


                    const page =
                        button.textContent.trim();


                    if (
                        !/^\d+$/.test(
                            page
                        )
                    ) {

                        showToast(
                            "Pagination",
                            "More job postings will load from the backend."
                        );

                        return;

                    }


                    paginationButtons.forEach(
                        (item) => {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    showToast(
                        "Page Changed",
                        `Job posting page ${page} selected.`
                    );

                }
            );

        }
    );


    /* ===================================================
       LOGOUT
    =================================================== */

    logoutButton?.addEventListener(
        "click",
        () => {

            const confirmed =
                window.confirm(
                    "Are you sure you want to sign out?"
                );


            if (!confirmed) return;


            showToast(
                "Signing Out",
                "You have been signed out successfully."
            );


            console.log(
                "Logout will be connected to the authentication backend."
            );

        }
    );


    /* ===================================================
       KEYBOARD SHORTCUTS
    =================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key ===
                "Escape"
            ) {

                closeJobModal();

                closeAllActionMenus();

                closeSidebar();

                toast?.classList.remove(
                    "show"
                );

            }


            if (
                (event.ctrlKey ||
                    event.metaKey) &&
                event.key.toLowerCase() ===
                    "k"
            ) {

                event.preventDefault();

                jobSearch?.focus();

            }

        }
    );


    /* ===================================================
       CLOSE ACTION MENUS OUTSIDE
    =================================================== */

    document.addEventListener(
        "click",
        (event) => {

            if (
                !event.target.closest(
                    ".job-card-actions"
                )
            ) {

                closeAllActionMenus();

            }

        }
    );


    /* ===================================================
       INITIALIZE
    =================================================== */

    updateJobSummary();

    applyFilters();


    console.log(
        "DevRecruit Recruiter Jobs initialized successfully."
    );

});