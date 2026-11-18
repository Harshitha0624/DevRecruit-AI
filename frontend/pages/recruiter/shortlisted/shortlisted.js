"use strict";

document.addEventListener("DOMContentLoaded", function () {

    initializeSidebar();
    initializeSearch();
    initializeFilters();
    initializeSorting();
    initializeViewToggle();
    initializeCandidateActions();
    initializeScheduleModal();
    initializeRefresh();
    initializePagination();
    initializeLogout();

    applyFilters();

});


/* =======================================================
   SIDEBAR
======================================================= */

function initializeSidebar() {

    const sidebar =
        document.getElementById("shortlistedSidebar");

    const overlay =
        document.getElementById("sidebarOverlay");

    const menuButton =
        document.getElementById("mobileMenuButton");

    const closeButton =
        document.getElementById("sidebarClose");


    function openSidebar() {

        if (sidebar) {
            sidebar.classList.add("open");
        }

        if (overlay) {
            overlay.classList.add("active");
        }

        document.body.style.overflow = "hidden";

    }


    function closeSidebar() {

        if (sidebar) {
            sidebar.classList.remove("open");
        }

        if (overlay) {
            overlay.classList.remove("active");
        }

        document.body.style.overflow = "";

    }


    if (menuButton) {
        menuButton.addEventListener("click", openSidebar);
    }

    if (closeButton) {
        closeButton.addEventListener("click", closeSidebar);
    }

    if (overlay) {
        overlay.addEventListener("click", closeSidebar);
    }


    window.addEventListener("resize", function () {

        if (window.innerWidth > 900) {
            closeSidebar();
        }

    });

}


/* =======================================================
   SEARCH
======================================================= */

function initializeSearch() {

    const search =
        document.getElementById("shortlistSearch");


    if (!search) {
        return;
    }


    search.addEventListener("input", function () {

        applyFilters();

    });

}


/* =======================================================
   FILTERS
======================================================= */

function initializeFilters() {

    const filterButton =
        document.getElementById("filterButton");

    const filterPanel =
        document.getElementById("filterPanel");

    const clearButton =
        document.getElementById("clearFilters");


    if (filterButton && filterPanel) {

        filterButton.addEventListener("click", function () {

            filterPanel.classList.toggle("open");

        });

    }


    const filterIds = [
        "stageFilter",
        "matchFilter",
        "roleFilter"
    ];


    filterIds.forEach(function (id) {

        const element =
            document.getElementById(id);


        if (!element) {
            return;
        }


        element.addEventListener("change", function () {

            applyFilters();
            updateFilterCount();

        });

    });


    if (clearButton) {

        clearButton.addEventListener(
            "click",
            clearFilters
        );

    }

}


/* =======================================================
   APPLY FILTERS
======================================================= */

function applyFilters() {

    const cards =
        document.querySelectorAll(
            ".shortlisted-card"
        );


    const searchInput =
        document.getElementById(
            "shortlistSearch"
        );

    const stageFilter =
        document.getElementById(
            "stageFilter"
        );

    const matchFilter =
        document.getElementById(
            "matchFilter"
        );

    const roleFilter =
        document.getElementById(
            "roleFilter"
        );


    const searchValue =
        searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";


    const selectedStage =
        stageFilter
            ? stageFilter.value
            : "all";


    const minimumMatch =
        matchFilter
            ? Number(matchFilter.value)
            : 0;


    const selectedRole =
        roleFilter
            ? roleFilter.value
            : "all";


    let visibleCount = 0;


    cards.forEach(function (card) {

        const name =
            (card.dataset.name || "").toLowerCase();

        const role =
            (card.dataset.role || "").toLowerCase();

        const stage =
            card.dataset.stage || "";

        const match =
            Number(card.dataset.match || 0);


        const text =
            name + " " + role;


        const matchesSearch =
            !searchValue ||
            text.includes(searchValue);


        const matchesStage =
            selectedStage === "all" ||
            stage === selectedStage;


        const matchesMatch =
            match >= minimumMatch;


        const matchesRole =
            selectedRole === "all" ||
            role === selectedRole;


        const visible =
            matchesSearch &&
            matchesStage &&
            matchesMatch &&
            matchesRole;


        if (visible) {

            card.classList.remove("hidden");

            visibleCount++;

        } else {

            card.classList.add("hidden");

        }

    });


    updateCandidateCount(visibleCount);
    updateEmptyState(visibleCount);
    updateGridCards();

}


/* =======================================================
   COUNT
======================================================= */

function updateCandidateCount(count) {

    const element =
        document.getElementById(
            "candidateCount"
        );


    if (element) {
        element.textContent = count;
    }

}


/* =======================================================
   EMPTY STATE
======================================================= */

function updateEmptyState(count) {

    const emptyState =
        document.getElementById(
            "emptyState"
        );


    if (!emptyState) {
        return;
    }


    if (count === 0) {

        emptyState.classList.add("visible");

    } else {

        emptyState.classList.remove("visible");

    }

}


/* =======================================================
   FILTER COUNT
======================================================= */

function updateFilterCount() {

    const countElement =
        document.getElementById(
            "filterCount"
        );


    if (!countElement) {
        return;
    }


    const ids = [
        "stageFilter",
        "matchFilter",
        "roleFilter"
    ];


    let count = 0;


    ids.forEach(function (id) {

        const element =
            document.getElementById(id);


        if (!element) {
            return;
        }


        if (
            element.value !== "all" &&
            element.value !== "0"
        ) {

            count++;

        }

    });


    countElement.textContent = count;


    if (count > 0) {

        countElement.classList.add("visible");

    } else {

        countElement.classList.remove("visible");

    }

}


/* =======================================================
   CLEAR FILTERS
======================================================= */

function clearFilters() {

    const search =
        document.getElementById(
            "shortlistSearch"
        );

    const stage =
        document.getElementById(
            "stageFilter"
        );

    const match =
        document.getElementById(
            "matchFilter"
        );

    const role =
        document.getElementById(
            "roleFilter"
        );


    if (search) {
        search.value = "";
    }

    if (stage) {
        stage.value = "all";
    }

    if (match) {
        match.value = "0";
    }

    if (role) {
        role.value = "all";
    }


    updateFilterCount();
    applyFilters();

}


/* =======================================================
   SORTING
======================================================= */

function initializeSorting() {

    const select =
        document.getElementById(
            "sortSelect"
        );


    if (!select) {
        return;
    }


    select.addEventListener("change", function () {

        sortCandidates(select.value);

    });

}


function sortCandidates(type) {

    const list =
        document.getElementById(
            "shortlistList"
        );


    if (!list) {
        return;
    }


    const cards =
        Array.from(
            list.querySelectorAll(
                ".shortlisted-card"
            )
        );


    cards.sort(function (a, b) {

        if (type === "match") {

            return (
                Number(b.dataset.match || 0) -
                Number(a.dataset.match || 0)
            );

        }


        if (type === "recent") {

            return (
                new Date(b.dataset.date) -
                new Date(a.dataset.date)
            );

        }


        if (type === "name") {

            return (
                a.dataset.name || ""
            ).localeCompare(
                b.dataset.name || ""
            );

        }


        if (type === "stage") {

            const order = {
                interview: 1,
                interviewed: 2,
                offer: 3
            };


            return (
                (order[a.dataset.stage] || 0) -
                (order[b.dataset.stage] || 0)
            );

        }


        return 0;

    });


    cards.forEach(function (card) {

        list.appendChild(card);

    });


    updateGridCards();

}


/* =======================================================
   VIEW TOGGLE
======================================================= */

function initializeViewToggle() {

    const listButton =
        document.getElementById(
            "listViewButton"
        );

    const gridButton =
        document.getElementById(
            "gridViewButton"
        );

    const list =
        document.getElementById(
            "shortlistList"
        );

    const grid =
        document.getElementById(
            "gridView"
        );


    if (
        !listButton ||
        !gridButton ||
        !list ||
        !grid
    ) {
        return;
    }


    listButton.addEventListener(
        "click",
        function () {

            listButton.classList.add("active");
            gridButton.classList.remove("active");

            list.style.display = "flex";
            grid.classList.remove("active");

        }
    );


    gridButton.addEventListener(
        "click",
        function () {

            gridButton.classList.add("active");
            listButton.classList.remove("active");

            list.style.display = "none";
            grid.classList.add("active");

            updateGridCards();

        }
    );

}


/* =======================================================
   GRID CARDS
======================================================= */

function updateGridCards() {

    const grid =
        document.getElementById(
            "gridView"
        );


    if (!grid) {
        return;
    }


    const cards =
        document.querySelectorAll(
            ".shortlisted-card"
        );


    grid.innerHTML = "";


    cards.forEach(function (card) {

        const name =
            card.dataset.name || "";

        const role =
            card.dataset.role || "";

        const match =
            card.dataset.match || "0";

        const stage =
            card.dataset.stage || "";

        const avatar =
            card.querySelector(
                ".candidate-avatar"
            );


        const initials =
            avatar
                ? avatar.textContent.trim()
                : getInitials(name);


        const location =
            getCandidateLocation(card);


        const gridCard =
            document.createElement("article");


        gridCard.className =
            "grid-card";


        if (card.classList.contains("hidden")) {

            gridCard.classList.add("hidden");

        }


        gridCard.dataset.name = name;


        gridCard.innerHTML = `

            <div class="grid-top">

                <div class="grid-profile">

                    <div class="candidate-avatar avatar-blue">
                        ${escapeHTML(initials)}
                    </div>

                    <div>

                        <strong>
                            ${escapeHTML(name)}
                        </strong>

                        <span>
                            Shortlisted Candidate
                        </span>

                    </div>

                </div>


                <div class="grid-score">

                    <strong>
                        ${escapeHTML(match)}%
                    </strong>

                    <span>
                        AI Match
                    </span>

                </div>

            </div>


            <div class="grid-role">

                ${escapeHTML(
                    getRoleLabel(role)
                )}

            </div>


            <div class="grid-location">

                <i class="fa-solid fa-location-dot"></i>

                ${escapeHTML(location)}

            </div>


            <span class="grid-stage ${escapeAttribute(stage)}">

                ${escapeHTML(
                    getStageLabel(stage)
                )}

            </span>


            <div class="grid-actions">

                <button
                    type="button"
                    class="grid-view"
                    data-candidate="${escapeAttribute(name)}">

                    <i class="fa-regular fa-eye"></i>
                    View Profile

                </button>


                <button
                    type="button"
                    class="grid-schedule"
                    data-candidate="${escapeAttribute(name)}">

                    <i class="fa-regular fa-calendar"></i>
                    Schedule

                </button>

            </div>

        `;


        grid.appendChild(gridCard);

    });


    initializeGridActions();

}


/* =======================================================
   GRID ACTIONS
======================================================= */

function initializeGridActions() {

    const viewButtons =
        document.querySelectorAll(
            ".grid-view"
        );


    const scheduleButtons =
        document.querySelectorAll(
            ".grid-schedule"
        );


    viewButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                openCandidateModal(
                    button.dataset.candidate
                );

            }
        );

    });


    scheduleButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                openScheduleModal(
                    button.dataset.candidate
                );

            }
        );

    });

}


/* =======================================================
   CANDIDATE ACTIONS
======================================================= */

function initializeCandidateActions() {

    const viewButtons =
        document.querySelectorAll(
            ".action-button.view"
        );


    const scheduleButtons =
        document.querySelectorAll(
            ".action-button.schedule"
        );


    const removeButtons =
        document.querySelectorAll(
            ".action-button.remove"
        );


    viewButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                openCandidateModal(
                    button.dataset.candidate
                );

            }
        );

    });


    scheduleButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                openScheduleModal(
                    button.dataset.candidate
                );

            }
        );

    });


    removeButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                removeFromShortlist(
                    button.dataset.candidate,
                    button.closest(
                        ".shortlisted-card"
                    )
                );

            }
        );

    });


    const modalClose =
        document.getElementById(
            "modalClose"
        );

    const modalBackdrop =
        document.getElementById(
            "modalBackdrop"
        );

    const modalCloseButton =
        document.getElementById(
            "modalCloseButton"
        );

    const modalAIButton =
        document.getElementById(
            "modalAIButton"
        );

    const modalPipelineButton =
        document.getElementById(
            "modalPipelineButton"
        );


    if (modalClose) {

        modalClose.addEventListener(
            "click",
            closeCandidateModal
        );

    }


    if (modalBackdrop) {

        modalBackdrop.addEventListener(
            "click",
            closeCandidateModal
        );

    }


    if (modalCloseButton) {

        modalCloseButton.addEventListener(
            "click",
            closeCandidateModal
        );

    }


    if (modalAIButton) {

        modalAIButton.addEventListener(
            "click",
            function () {

                window.location.href =
                    "../ai-ranking/index.html";

            }
        );

    }


    if (modalPipelineButton) {

        modalPipelineButton.addEventListener(
            "click",
            function () {

                window.location.href =
                    "../pipeline/index.html";

            }
        );

    }


    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                closeCandidateModal();
                closeScheduleModal();

            }

        }
    );

}


/* =======================================================
   OPEN CANDIDATE MODAL
======================================================= */

function openCandidateModal(candidateName) {

    const cards =
        document.querySelectorAll(
            ".shortlisted-card"
        );


    let card = null;


    cards.forEach(function (item) {

        if (
            item.dataset.name === candidateName
        ) {

            card = item;

        }

    });


    if (!card) {
        return;
    }


    const modal =
        document.getElementById(
            "candidateModal"
        );


    if (!modal) {
        return;
    }


    const avatar =
        card.querySelector(
            ".candidate-avatar"
        );


    const match =
        card.dataset.match || "0";

    const stage =
        card.dataset.stage || "";

    const role =
        getRoleLabel(
            card.dataset.role || ""
        );

    const location =
        getCandidateLocation(card);


    const modalAvatar =
        document.getElementById(
            "modalAvatar"
        );

    const modalName =
        document.getElementById(
            "modalName"
        );

    const modalRole =
        document.getElementById(
            "modalRole"
        );

    const modalMatch =
        document.getElementById(
            "modalMatch"
        );

    const modalProgress =
        document.getElementById(
            "modalProgress"
        );

    const modalStage =
        document.getElementById(
            "modalStage"
        );

    const modalLocation =
        document.getElementById(
            "modalLocation"
        );

    const modalDate =
        document.getElementById(
            "modalDate"
        );

    const modalExperience =
        document.getElementById(
            "modalExperience"
        );


    if (modalAvatar && avatar) {

        modalAvatar.textContent =
            avatar.textContent.trim();

    }


    if (modalName) {
        modalName.textContent =
            candidateName;
    }


    if (modalRole) {
        modalRole.textContent =
            role;
    }


    if (modalMatch) {
        modalMatch.textContent =
            match + "%";
    }


    if (modalProgress) {
        modalProgress.style.width =
            match + "%";
    }


    if (modalStage) {
        modalStage.textContent =
            getStageLabel(stage);
    }


    if (modalLocation) {
        modalLocation.textContent =
            location;
    }


    if (modalDate) {
        modalDate.textContent =
            formatDate(
                card.dataset.date
            );
    }


    if (modalExperience) {

        modalExperience.textContent =
            getExperience(
                card
            );

    }


    modal.classList.add("open");

    document.body.style.overflow = "hidden";

}


/* =======================================================
   CLOSE CANDIDATE MODAL
======================================================= */

function closeCandidateModal() {

    const modal =
        document.getElementById(
            "candidateModal"
        );


    if (modal) {
        modal.classList.remove("open");
    }


    if (
        !document.getElementById(
            "scheduleModal"
        )?.classList.contains("open")
    ) {

        document.body.style.overflow = "";

    }

}


/* =======================================================
   REMOVE FROM SHORTLIST
======================================================= */

function removeFromShortlist(
    candidateName,
    card
) {

    if (!card) {
        return;
    }


    const confirmed =
        window.confirm(
            "Remove " +
            candidateName +
            " from the shortlist?"
        );


    if (!confirmed) {
        return;
    }


    card.classList.add("removing");


    setTimeout(function () {

        card.remove();

        updateGridCards();
        applyFilters();

        showToast(
            "Removed from Shortlist",
            candidateName +
            " has been removed from the shortlist.",
            "fa-regular fa-star"
        );

    }, 250);

}


/* =======================================================
   SCHEDULE MODAL
======================================================= */

function initializeScheduleModal() {

    const closeButton =
        document.getElementById(
            "scheduleClose"
        );

    const backdrop =
        document.getElementById(
            "scheduleBackdrop"
        );

    const cancelButton =
        document.getElementById(
            "cancelSchedule"
        );

    const form =
        document.getElementById(
            "scheduleForm"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeScheduleModal
        );

    }


    if (backdrop) {

        backdrop.addEventListener(
            "click",
            closeScheduleModal
        );

    }


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            closeScheduleModal
        );

    }


    if (form) {

        form.addEventListener(
            "submit",
            handleScheduleSubmit
        );

    }


    setMinimumInterviewDate();

}


/* =======================================================
   OPEN SCHEDULE MODAL
======================================================= */

function openScheduleModal(candidateName) {

    const modal =
        document.getElementById(
            "scheduleModal"
        );


    const candidateElement =
        document.getElementById(
            "scheduleCandidate"
        );


    if (!modal) {
        return;
    }


    if (candidateElement) {

        candidateElement.textContent =
            candidateName;

    }


    modal.classList.add("open");

    document.body.style.overflow = "hidden";

}


/* =======================================================
   CLOSE SCHEDULE MODAL
======================================================= */

function closeScheduleModal() {

    const modal =
        document.getElementById(
            "scheduleModal"
        );


    if (modal) {

        modal.classList.remove(
            "open"
        );

    }


    if (
        !document.getElementById(
            "candidateModal"
        )?.classList.contains("open")
    ) {

        document.body.style.overflow = "";

    }

}


/* =======================================================
   MINIMUM INTERVIEW DATE
======================================================= */

function setMinimumInterviewDate() {

    const dateInput =
        document.getElementById(
            "interviewDate"
        );


    if (!dateInput) {
        return;
    }


    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            today.getDate()
        ).padStart(2, "0");


    dateInput.min =
        year + "-" +
        month + "-" +
        day;

}


/* =======================================================
   SCHEDULE SUBMIT
======================================================= */

function handleScheduleSubmit(event) {

    event.preventDefault();


    const candidate =
        document.getElementById(
            "scheduleCandidate"
        )?.textContent ||
        "Candidate";


    const date =
        document.getElementById(
            "interviewDate"
        )?.value;


    const time =
        document.getElementById(
            "interviewTime"
        )?.value;


    const type =
        document.getElementById(
            "interviewType"
        )?.value;


    if (!date || !time) {

        showToast(
            "Missing Details",
            "Please select an interview date and time.",
            "fa-solid fa-circle-exclamation"
        );

        return;

    }


    closeScheduleModal();


    showToast(
        "Interview Scheduled",
        candidate +
        " has been scheduled for a " +
        formatInterviewType(type) +
        ".",
        "fa-regular fa-calendar-check"
    );


    event.target.reset();

    setMinimumInterviewDate();

}


/* =======================================================
   REFRESH
======================================================= */

function initializeRefresh() {

    const button =
        document.getElementById(
            "refreshShortlist"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        function () {

            button.classList.add(
                "refreshing"
            );


            setTimeout(function () {

                button.classList.remove(
                    "refreshing"
                );


                showToast(
                    "Shortlist Refreshed",
                    "Your shortlisted candidates are up to date.",
                    "fa-solid fa-rotate"
                );

            }, 800);

        }
    );


    const style =
        document.createElement("style");


    style.textContent = `

        #refreshShortlist.refreshing i {
            animation:
                shortlistRefresh
                0.8s
                linear
                infinite;
        }

        @keyframes shortlistRefresh {

            from {
                transform: rotate(0deg);
            }

            to {
                transform: rotate(360deg);
            }

        }

        .shortlisted-card.removing {
            opacity: 0;
            transform: translateX(20px);
        }

    `;


    document.head.appendChild(style);

}


/* =======================================================
   PAGINATION
======================================================= */

function initializePagination() {

    const buttons =
        document.querySelectorAll(
            ".pagination-button:not(:disabled)"
        );


    buttons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                buttons.forEach(function (item) {

                    item.classList.remove(
                        "active"
                    );

                });


                if (
                    !button.querySelector("i")
                ) {

                    button.classList.add(
                        "active"
                    );

                }


                showToast(
                    "Pagination",
                    "Additional shortlist pages will connect to the backend.",
                    "fa-solid fa-list"
                );

            }
        );

    });

}


/* =======================================================
   LOGOUT
======================================================= */

function initializeLogout() {

    const button =
        document.getElementById(
            "logoutButton"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        function () {

            const confirmed =
                window.confirm(
                    "Are you sure you want to sign out?"
                );


            if (!confirmed) {
                return;
            }


            try {

                sessionStorage.clear();

                localStorage.removeItem(
                    "recruiterSession"
                );

            } catch (error) {

                console.warn(
                    "Storage could not be cleared.",
                    error
                );

            }


            showToast(
                "Signed Out",
                "Redirecting to recruiter login...",
                "fa-solid fa-right-from-bracket"
            );


            setTimeout(function () {

                window.location.href =
                    "../login/index.html";

            }, 900);

        }
    );

}


/* =======================================================
   HELPERS
======================================================= */

function getStageLabel(stage) {

    const labels = {

        interview: "Interview",

        interviewed: "Interviewed",

        offer: "Offer Stage"

    };


    return (
        labels[stage] ||
        capitalize(stage)
    );

}


function getRoleLabel(role) {

    const labels = {

        "full-stack":
            "Full Stack Developer",

        backend:
            "Backend Engineer",

        ai:
            "AI / ML Engineer",

        frontend:
            "Frontend Developer"

    };


    return (
        labels[role] ||
        "Developer"
    );

}


function getCandidateLocation(card) {

    const small =
        card.querySelector(
            ".candidate-info small"
        );


    if (!small) {
        return "Not available";
    }


    const text =
        small.textContent
            .replace(/\s+/g, " ")
            .trim();


    return text
        .split("•")[0]
        .trim();

}


function getExperience(card) {

    const small =
        card.querySelector(
            ".candidate-info small"
        );


    if (!small) {
        return "Not specified";
    }


    const text =
        small.textContent
            .replace(/\s+/g, " ")
            .trim();


    const parts =
        text.split("•");


    if (parts.length > 1) {

        return parts[1].trim();

    }


    return "Not specified";

}


function formatDate(dateString) {

    if (!dateString) {
        return "Not available";
    }


    const date =
        new Date(dateString);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return dateString;

    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


function formatInterviewType(type) {

    const labels = {

        technical:
            "Technical Interview",

        hr:
            "HR Interview",

        final:
            "Final Interview"

    };


    return (
        labels[type] ||
        "Interview"
    );

}


function capitalize(value) {

    if (!value) {
        return "";
    }


    return (
        value.charAt(0).toUpperCase() +
        value.slice(1)
    );

}


function getInitials(name) {

    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(function (part) {

            return part
                .charAt(0)
                .toUpperCase();

        })
        .join("");

}


function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function escapeAttribute(value) {

    return escapeHTML(value);

}


/* =======================================================
   TOAST
======================================================= */

function showToast(
    title,
    message,
    icon
) {

    let toast =
        document.querySelector(
            ".shortlist-toast"
        );


    if (!toast) {

        toast =
            document.createElement(
                "div"
            );


        toast.className =
            "shortlist-toast";


        toast.innerHTML = `

            <div class="toast-icon">

                <i></i>

            </div>


            <div class="toast-content">

                <strong></strong>

                <span></span>

            </div>


            <button
                type="button"
                aria-label="Close notification">

                <i class="fa-solid fa-xmark"></i>

            </button>

        `;


        document.body.appendChild(
            toast
        );


        const closeButton =
            toast.querySelector(
                "button"
            );


        closeButton.addEventListener(
            "click",
            function () {

                toast.classList.remove(
                    "show"
                );

            }
        );

    }


    const iconElement =
        toast.querySelector(
            ".toast-icon i"
        );


    const titleElement =
        toast.querySelector(
            ".toast-content strong"
        );


    const messageElement =
        toast.querySelector(
            ".toast-content span"
        );


    if (iconElement) {

        iconElement.className =
            icon ||
            "fa-solid fa-circle-info";

    }


    if (titleElement) {

        titleElement.textContent =
            title;

    }


    if (messageElement) {

        messageElement.textContent =
            message;

    }


    toast.classList.add("show");


    clearTimeout(
        toast.hideTimer
    );


    toast.hideTimer =
        setTimeout(function () {

            toast.classList.remove(
                "show"
            );

        }, 4000);

}