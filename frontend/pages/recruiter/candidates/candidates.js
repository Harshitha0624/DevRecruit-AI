"use strict";

document.addEventListener("DOMContentLoaded", function () {

    initializeSidebar();
    initializeSearch();
    initializeFilters();
    initializeSorting();
    initializeViewToggle();
    initializeCandidateActions();
    initializeAddCandidate();
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
        document.getElementById("candidatesSidebar");

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

    const searchInput =
        document.getElementById("candidateSearch");


    if (!searchInput) {
        return;
    }


    searchInput.addEventListener("input", function () {

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

    const resetButton =
        document.getElementById("emptyStateReset");


    if (filterButton && filterPanel) {

        filterButton.addEventListener("click", function () {

            filterPanel.classList.toggle("open");

        });

    }


    const filterIds = [
        "statusFilter",
        "experienceFilter",
        "matchFilter",
        "locationFilter"
    ];


    filterIds.forEach(function (id) {

        const filter =
            document.getElementById(id);


        if (!filter) {
            return;
        }


        filter.addEventListener("change", function () {

            applyFilters();
            updateFilterCount();

        });

    });


    if (clearButton) {
        clearButton.addEventListener("click", clearFilters);
    }


    if (resetButton) {
        resetButton.addEventListener("click", clearFilters);
    }

}


/* =======================================================
   APPLY FILTERS
======================================================= */

function applyFilters() {

    const rows =
        document.querySelectorAll(".candidate-row");


    const searchInput =
        document.getElementById("candidateSearch");

    const statusFilter =
        document.getElementById("statusFilter");

    const experienceFilter =
        document.getElementById("experienceFilter");

    const matchFilter =
        document.getElementById("matchFilter");

    const locationFilter =
        document.getElementById("locationFilter");


    const searchValue =
        searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";


    const selectedStatus =
        statusFilter
            ? statusFilter.value
            : "all";


    const selectedExperience =
        experienceFilter
            ? experienceFilter.value
            : "all";


    const minimumMatch =
        matchFilter
            ? Number(matchFilter.value)
            : 0;


    const selectedLocation =
        locationFilter
            ? locationFilter.value
            : "all";


    let visibleCount = 0;


    rows.forEach(function (row) {

        const name =
            (row.dataset.name || "").toLowerCase();

        const role =
            (row.dataset.role || "").toLowerCase();

        const location =
            (row.dataset.location || "").toLowerCase();

        const status =
            row.dataset.status || "";

        const experience =
            row.dataset.experience || "";

        const match =
            Number(row.dataset.match || 0);


        const rowText =
            name + " " +
            role + " " +
            location;


        const matchesSearch =
            !searchValue ||
            rowText.includes(searchValue);


        const matchesStatus =
            selectedStatus === "all" ||
            status === selectedStatus;


        const matchesExperience =
            selectedExperience === "all" ||
            experience === selectedExperience;


        const matchesMatch =
            match >= minimumMatch;


        const matchesLocation =
            selectedLocation === "all" ||
            location === selectedLocation;


        const visible =
            matchesSearch &&
            matchesStatus &&
            matchesExperience &&
            matchesMatch &&
            matchesLocation;


        if (visible) {

            row.classList.remove("hidden");

            visibleCount++;

        } else {

            row.classList.add("hidden");

        }

    });


    updateCandidateCount(visibleCount);
    updateEmptyState(visibleCount);
    updateGridCards();
    updateGridVisibility();
}


/* =======================================================
   CANDIDATE COUNT
======================================================= */

function updateCandidateCount(count) {

    const countElement =
        document.getElementById("candidateCount");


    if (countElement) {
        countElement.textContent = count;
    }

}


/* =======================================================
   EMPTY STATE
======================================================= */

function updateEmptyState(count) {

    const emptyState =
        document.getElementById("emptyState");


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

    const filterCount =
        document.getElementById("filterCount");


    if (!filterCount) {
        return;
    }


    const ids = [
        "statusFilter",
        "experienceFilter",
        "matchFilter",
        "locationFilter"
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


    filterCount.textContent = count;


    if (count > 0) {

        filterCount.classList.add("visible");

    } else {

        filterCount.classList.remove("visible");

    }

}


/* =======================================================
   CLEAR FILTERS
======================================================= */

function clearFilters() {

    const searchInput =
        document.getElementById("candidateSearch");

    const statusFilter =
        document.getElementById("statusFilter");

    const experienceFilter =
        document.getElementById("experienceFilter");

    const matchFilter =
        document.getElementById("matchFilter");

    const locationFilter =
        document.getElementById("locationFilter");


    if (searchInput) {
        searchInput.value = "";
    }


    if (statusFilter) {
        statusFilter.value = "all";
    }


    if (experienceFilter) {
        experienceFilter.value = "all";
    }


    if (matchFilter) {
        matchFilter.value = "0";
    }


    if (locationFilter) {
        locationFilter.value = "all";
    }


    updateFilterCount();
    applyFilters();

}


/* =======================================================
   SORTING
======================================================= */

function initializeSorting() {

    const sortSelect =
        document.getElementById("sortSelect");


    if (!sortSelect) {
        return;
    }


    sortSelect.addEventListener("change", function () {

        sortCandidates(sortSelect.value);

    });

}


function sortCandidates(sortType) {

    const table =
        document.querySelector(".candidate-table");


    if (!table) {
        return;
    }


    const rows =
        Array.from(
            table.querySelectorAll(".candidate-row")
        );


    rows.sort(function (a, b) {

        if (sortType === "match") {

            return (
                Number(b.dataset.match || 0) -
                Number(a.dataset.match || 0)
            );

        }


        if (sortType === "name") {

            return (
                a.dataset.name || ""
            ).localeCompare(
                b.dataset.name || ""
            );

        }


        if (sortType === "experience") {

            const order = {
                junior: 1,
                mid: 2,
                senior: 3
            };


            return (
                (order[b.dataset.experience] || 0) -
                (order[a.dataset.experience] || 0)
            );

        }


        if (sortType === "recent") {

            return (
                new Date(b.dataset.date) -
                new Date(a.dataset.date)
            );

        }


        return 0;

    });


    rows.forEach(function (row) {

        table.appendChild(row);

    });


    updateGridCards();
}


/* =======================================================
   VIEW TOGGLE
======================================================= */

function initializeViewToggle() {

    const tableButton =
        document.getElementById("tableViewButton");

    const gridButton =
        document.getElementById("gridViewButton");

    const tableView =
        document.getElementById("tableView");

    const gridView =
        document.getElementById("gridView");


    if (
        !tableButton ||
        !gridButton ||
        !tableView ||
        !gridView
    ) {
        return;
    }


    tableButton.addEventListener("click", function () {

        tableButton.classList.add("active");
        gridButton.classList.remove("active");

        tableView.style.display = "block";
        gridView.classList.remove("active");

    });


    gridButton.addEventListener("click", function () {

        gridButton.classList.add("active");
        tableButton.classList.remove("active");

        tableView.style.display = "none";
        gridView.classList.add("active");

        updateGridCards();
        updateGridVisibility();

    });

}


/* =======================================================
   CREATE GRID CARDS
======================================================= */

function updateGridCards() {

    const grid =
        document.getElementById("gridView");


    if (!grid) {
        return;
    }


    const rows =
        document.querySelectorAll(".candidate-row");


    grid.innerHTML = "";


    rows.forEach(function (row) {

        const name =
            row.dataset.name || "";

        const role =
            row.dataset.role || "";

        const experience =
            row.dataset.experience || "";

        const match =
            row.dataset.match || "0";

        const status =
            row.dataset.status || "";

        const location =
            row.dataset.location || "";

        const avatarElement =
            row.querySelector(".candidate-avatar");

        const initials =
            avatarElement
                ? avatarElement.textContent.trim()
                : "C";


        const card =
            document.createElement("article");


        card.className = "grid-card";


        card.dataset.name = name;
        card.dataset.role = role;
        card.dataset.experience = experience;
        card.dataset.match = match;
        card.dataset.status = status;
        card.dataset.location = location;


        const statusLabel =
            getStatusLabel(status);


        card.innerHTML = `

            <div class="grid-card-header">

                <div class="grid-profile">

                    <div class="candidate-avatar avatar-blue">
                        ${initials}
                    </div>

                    <div>

                        <strong>
                            ${escapeHTML(name)}
                        </strong>

                        <span>
                            ${escapeHTML(location)}
                        </span>

                    </div>

                </div>


                <div class="grid-match">

                    <strong>
                        ${escapeHTML(match)}%
                    </strong>

                    <span>
                        AI Match
                    </span>

                </div>

            </div>


            <div class="grid-role">
                ${escapeHTML(role)}
            </div>


            <div class="grid-details">

                <span>
                    ${escapeHTML(
                        formatExperience(experience)
                    )}
                </span>

                <span>
                    ${escapeHTML(statusLabel)}
                </span>

            </div>


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
                    class="grid-shortlist"
                    data-candidate="${escapeAttribute(name)}">

                    <i class="fa-solid fa-star"></i>
                    Shortlist

                </button>

            </div>

        `;


        grid.appendChild(card);

    });


    initializeGridActions();
}


/* =======================================================
   GRID ACTIONS
======================================================= */

function initializeGridActions() {

    const viewButtons =
        document.querySelectorAll(".grid-view");


    const shortlistButtons =
        document.querySelectorAll(".grid-shortlist");


    viewButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            openCandidateModal(
                button.dataset.candidate
            );

        });

    });


    shortlistButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            shortlistCandidate(
                button.dataset.candidate
            );

        });

    });

}


/* =======================================================
   GRID VISIBILITY
======================================================= */

function updateGridVisibility() {

    const grid =
        document.getElementById("gridView");


    if (!grid) {
        return;
    }


    const visibleRows =
        document.querySelectorAll(
            ".candidate-row:not(.hidden)"
        );


    const cards =
        grid.querySelectorAll(".grid-card");


    cards.forEach(function (card) {

        const name =
            card.dataset.name;


        let visible = false;


        visibleRows.forEach(function (row) {

            if (
                row.dataset.name === name
            ) {

                visible = true;

            }

        });


        if (visible) {

            card.classList.remove("hidden");

        } else {

            card.classList.add("hidden");

        }

    });

}


/* =======================================================
   CANDIDATE ACTIONS
======================================================= */

function initializeCandidateActions() {

    const viewButtons =
        document.querySelectorAll(".row-action.view");


    const shortlistButtons =
        document.querySelectorAll(
            ".row-action.shortlist"
        );


    const moreButtons =
        document.querySelectorAll(
            ".row-action.more"
        );


    viewButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            openCandidateModal(
                button.dataset.candidate
            );

        });

    });


    shortlistButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            toggleShortlist(
                button
            );

        });

    });


    moreButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            showToast(
                "Candidate Options",
                "More candidate actions will be available here.",
                "fa-solid fa-ellipsis"
            );

        });

    });


    const modalClose =
        document.getElementById("modalClose");

    const modalBackdrop =
        document.getElementById("modalBackdrop");

    const modalCloseButton =
        document.getElementById("modalCloseButton");

    const modalAIButton =
        document.getElementById("modalAIButton");

    const modalShortlistButton =
        document.getElementById("modalShortlistButton");


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


    if (modalShortlistButton) {

        modalShortlistButton.addEventListener(
            "click",
            function () {

                const name =
                    modalShortlistButton.dataset.candidate;


                if (name) {

                    shortlistCandidate(name);

                }

            }
        );

    }


    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            closeCandidateModal();
            closeAddCandidateModal();

        }

    });

}


/* =======================================================
   OPEN CANDIDATE MODAL
======================================================= */

function openCandidateModal(candidateName) {

    const rows =
        document.querySelectorAll(".candidate-row");


    let selectedRow = null;


    rows.forEach(function (row) {

        if (
            row.dataset.name === candidateName
        ) {

            selectedRow = row;

        }

    });


    if (!selectedRow) {
        return;
    }


    const modal =
        document.getElementById("candidateModal");


    if (!modal) {
        return;
    }


    const avatar =
        selectedRow.querySelector(".candidate-avatar");


    const role =
        selectedRow.dataset.role || "Developer";


    const match =
        selectedRow.dataset.match || "0";


    const experience =
        selectedRow.dataset.experience || "mid";


    const location =
        selectedRow.dataset.location || "Not available";


    const status =
        selectedRow.dataset.status || "screening";


    const date =
        selectedRow.dataset.date || "";


    const modalAvatar =
        document.getElementById("modalAvatar");

    const modalName =
        document.getElementById("modalName");

    const modalRole =
        document.getElementById("modalRole");

    const modalMatch =
        document.getElementById("modalMatch");

    const modalProgress =
        document.getElementById("modalProgress");

    const modalExperience =
        document.getElementById("modalExperience");

    const modalLocation =
        document.getElementById("modalLocation");

    const modalStatus =
        document.getElementById("modalStatus");

    const modalDate =
        document.getElementById("modalDate");

    const modalShortlist =
        document.getElementById(
            "modalShortlistButton"
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


    if (modalExperience) {

        modalExperience.textContent =
            formatExperience(
                experience
            );

    }


    if (modalLocation) {
        modalLocation.textContent =
            capitalize(location);
    }


    if (modalStatus) {
        modalStatus.textContent =
            getStatusLabel(status);
    }


    if (modalDate) {

        modalDate.textContent =
            formatDate(date);

    }


    if (modalShortlist) {

        modalShortlist.dataset.candidate =
            candidateName;

    }


    modal.classList.add("open");

    document.body.style.overflow = "hidden";

}


/* =======================================================
   CLOSE CANDIDATE MODAL
======================================================= */

function closeCandidateModal() {

    const modal =
        document.getElementById("candidateModal");


    if (modal) {

        modal.classList.remove("open");

    }


    if (
        !document.getElementById(
            "addCandidateModal"
        )?.classList.contains("open")
    ) {

        document.body.style.overflow = "";

    }

}


/* =======================================================
   SHORTLIST
======================================================= */

function toggleShortlist(button) {

    const row =
        button.closest(".candidate-row");


    const candidateName =
        button.dataset.candidate ||
        row?.dataset.name ||
        "Candidate";


    const active =
        button.classList.contains("active");


    if (active) {

        button.classList.remove("active");


        button.innerHTML =
            '<i class="fa-regular fa-star"></i>';


        showToast(
            "Removed from Shortlist",
            candidateName +
            " has been removed from your shortlist.",
            "fa-regular fa-star"
        );

    } else {

        button.classList.add("active");


        button.innerHTML =
            '<i class="fa-solid fa-star"></i>';


        showToast(
            "Candidate Shortlisted",
            candidateName +
            " has been added to your shortlist.",
            "fa-solid fa-star"
        );

    }

}


/* =======================================================
   SHORTLIST BY NAME
======================================================= */

function shortlistCandidate(candidateName) {

    const rows =
        document.querySelectorAll(".candidate-row");


    let targetButton = null;


    rows.forEach(function (row) {

        if (
            row.dataset.name === candidateName
        ) {

            targetButton =
                row.querySelector(
                    ".row-action.shortlist"
                );

        }

    });


    if (targetButton) {

        if (
            !targetButton.classList.contains("active")
        ) {

            toggleShortlist(
                targetButton
            );

        } else {

            showToast(
                "Already Shortlisted",
                candidateName +
                " is already in your shortlist.",
                "fa-solid fa-star"
            );

        }

    }

}


/* =======================================================
   ADD CANDIDATE
======================================================= */

function initializeAddCandidate() {

    const openButton =
        document.getElementById(
            "addCandidateButton"
        );

    const modal =
        document.getElementById(
            "addCandidateModal"
        );

    const closeButton =
        document.getElementById(
            "addModalClose"
        );

    const backdrop =
        document.getElementById(
            "addModalBackdrop"
        );

    const cancelButton =
        document.getElementById(
            "cancelAddCandidate"
        );

    const form =
        document.getElementById(
            "addCandidateForm"
        );


    if (openButton) {

        openButton.addEventListener(
            "click",
            function () {

                if (modal) {

                    modal.classList.add(
                        "open"
                    );

                    document.body.style.overflow =
                        "hidden";

                }

            }
        );

    }


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeAddCandidateModal
        );

    }


    if (backdrop) {

        backdrop.addEventListener(
            "click",
            closeAddCandidateModal
        );

    }


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            closeAddCandidateModal
        );

    }


    if (form) {

        form.addEventListener(
            "submit",
            handleAddCandidate
        );

    }

}


/* =======================================================
   ADD CANDIDATE SUBMIT
======================================================= */

function handleAddCandidate(event) {

    event.preventDefault();


    const name =
        document.getElementById(
            "candidateName"
        )?.value.trim();


    const email =
        document.getElementById(
            "candidateEmail"
        )?.value.trim();


    const role =
        document.getElementById(
            "candidateRole"
        )?.value.trim();


    const location =
        document.getElementById(
            "candidateLocation"
        )?.value.trim();


    const experience =
        document.getElementById(
            "candidateExperience"
        )?.value;


    if (
        !name ||
        !email ||
        !role ||
        !location ||
        !experience
    ) {

        showToast(
            "Missing Information",
            "Please complete all candidate details.",
            "fa-solid fa-circle-exclamation"
        );

        return;

    }


    addCandidateToTable(
        name,
        email,
        role,
        location,
        experience
    );


    closeAddCandidateModal();


    const form =
        document.getElementById(
            "addCandidateForm"
        );


    if (form) {
        form.reset();
    }


    showToast(
        "Candidate Added",
        name +
        " has been added to the talent database.",
        "fa-solid fa-user-plus"
    );

}


/* =======================================================
   ADD CANDIDATE TO TABLE
======================================================= */

function addCandidateToTable(
    name,
    email,
    role,
    location,
    experience
) {

    const table =
        document.querySelector(
            ".candidate-table"
        );


    if (!table) {
        return;
    }


    const initials =
        getInitials(name);


    const date =
        new Date()
            .toISOString()
            .split("T")[0];


    const row =
        document.createElement("article");


    row.className =
        "candidate-row";


    row.dataset.name =
        name;

    row.dataset.role =
        role;

    row.dataset.experience =
        experience;

    row.dataset.match =
        "0";

    row.dataset.status =
        "screening";

    row.dataset.location =
        location.toLowerCase();

    row.dataset.date =
        date;


    row.innerHTML = `

        <div class="candidate-cell candidate-profile">

            <div class="candidate-avatar avatar-blue">
                ${escapeHTML(initials)}
            </div>

            <div>

                <strong>
                    ${escapeHTML(name)}
                </strong>

                <span>
                    ${escapeHTML(email)}
                </span>

                <small>
                    ${escapeHTML(location)}
                </small>

            </div>

        </div>


        <div class="candidate-cell">

            <strong>
                ${escapeHTML(role)}
            </strong>

            <span>
                Engineering
            </span>

        </div>


        <div class="candidate-cell">

            <strong>
                New
            </strong>

            <span>
                ${escapeHTML(
                    formatExperience(experience)
                )}
            </span>

        </div>


        <div class="candidate-cell">

            <div class="match-score potential">

                <strong>
                    Pending
                </strong>

                <div>
                    <span style="width:0%"></span>
                </div>

            </div>

        </div>


        <div class="candidate-cell">

            <span class="status-pill screening">
                Screening
            </span>

        </div>


        <div class="candidate-cell">

            <strong>
                Today
            </strong>

            <span>
                Just now
            </span>

        </div>


        <div class="candidate-cell actions">

            <button
                class="row-action view"
                data-candidate="${escapeAttribute(name)}">

                <i class="fa-regular fa-eye"></i>

            </button>


            <button
                class="row-action shortlist"
                data-candidate="${escapeAttribute(name)}">

                <i class="fa-regular fa-star"></i>

            </button>


            <button
                class="row-action more"
                data-candidate="${escapeAttribute(name)}">

                <i class="fa-solid fa-ellipsis"></i>

            </button>

        </div>

    `;


    table.appendChild(row);


    initializeDynamicRowActions(row);


    updateGridCards();


    applyFilters();

}


/* =======================================================
   DYNAMIC ROW ACTIONS
======================================================= */

function initializeDynamicRowActions(row) {

    const view =
        row.querySelector(".row-action.view");

    const shortlist =
        row.querySelector(".row-action.shortlist");

    const more =
        row.querySelector(".row-action.more");


    if (view) {

        view.addEventListener(
            "click",
            function () {

                openCandidateModal(
                    row.dataset.name
                );

            }
        );

    }


    if (shortlist) {

        shortlist.addEventListener(
            "click",
            function () {

                toggleShortlist(
                    shortlist
                );

            }
        );

    }


    if (more) {

        more.addEventListener(
            "click",
            function () {

                showToast(
                    "Candidate Options",
                    "More candidate actions will be available here.",
                    "fa-solid fa-ellipsis"
                );

            }
        );

    }

}


/* =======================================================
   CLOSE ADD MODAL
======================================================= */

function closeAddCandidateModal() {

    const modal =
        document.getElementById(
            "addCandidateModal"
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
   REFRESH
======================================================= */

function initializeRefresh() {

    const button =
        document.getElementById(
            "refreshCandidates"
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
                    "Candidates Refreshed",
                    "Latest candidate information is now displayed.",
                    "fa-solid fa-rotate"
                );

            }, 800);

        }
    );


    addRefreshStyle();

}


/* =======================================================
   REFRESH ANIMATION
======================================================= */

function addRefreshStyle() {

    const style =
        document.createElement("style");


    style.textContent = `

        #refreshCandidates.refreshing i {
            animation: candidateRefresh
                0.8s linear infinite;
        }

        @keyframes candidateRefresh {

            from {
                transform: rotate(0deg);
            }

            to {
                transform: rotate(360deg);
            }

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
            ".pagination-button:not(.disabled)"
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
                    !button.querySelector(
                        "i"
                    )
                ) {

                    button.classList.add(
                        "active"
                    );

                }


                showToast(
                    "Pagination",
                    "Pagination is ready for backend integration.",
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

function getStatusLabel(status) {

    const labels = {

        screening: "Screening",

        assessment: "Assessment",

        interview: "Interview",

        shortlisted: "Shortlisted",

        rejected: "Rejected"

    };


    return (
        labels[status] ||
        capitalize(status)
    );

}


function formatExperience(experience) {

    const labels = {

        junior: "0–2 Years",

        mid: "2–5 Years",

        senior: "5+ Years"

    };


    return (
        labels[experience] ||
        "Not specified"
    );

}


function formatDate(dateString) {

    if (!dateString) {
        return "Not available";
    }


    const date =
        new Date(dateString);


    if (Number.isNaN(date.getTime())) {
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


function capitalize(value) {

    if (!value) {
        return "";
    }


    return value.charAt(0).toUpperCase() +
        value.slice(1);

}


function getInitials(name) {

    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(function (part) {

            return part.charAt(0).toUpperCase();

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
            ".candidate-toast"
        );


    if (!toast) {

        toast =
            document.createElement(
                "div"
            );


        toast.className =
            "candidate-toast";


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


    toast.classList.add(
        "show"
    );


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


/* =======================================================
   TOAST STYLES
======================================================= */

(function addToastStyles() {

    const style =
        document.createElement("style");


    style.textContent = `

        .candidate-toast {

            position: fixed;

            right: 24px;
            bottom: 24px;

            width:
                min(
                    350px,
                    calc(100vw - 30px)
                );

            display: flex;
            align-items: center;

            gap: 10px;

            padding: 13px;

            border: 1px solid #e1e7ef;
            border-radius: 12px;

            background: #ffffff;

            box-shadow:
                0 18px 45px
                rgba(
                    15,
                    23,
                    42,
                    0.15
                );

            opacity: 0;

            transform:
                translateY(20px);

            pointer-events: none;

            transition:
                opacity 0.25s ease,
                transform 0.25s ease;

            z-index: 6000;

        }


        .candidate-toast.show {

            opacity: 1;

            transform:
                translateY(0);

            pointer-events: auto;

        }


        .toast-icon {

            width: 35px;
            height: 35px;

            display: flex;
            align-items: center;
            justify-content: center;

            flex-shrink: 0;

            border-radius: 9px;

            color: #2563eb;

            background: #eff6ff;

            font-size: 11px;

        }


        .toast-content {

            flex: 1;

            display: flex;
            flex-direction: column;

        }


        .toast-content strong {

            color: #334155;

            font-size: 8px;
            font-weight: 800;

        }


        .toast-content span {

            margin-top: 3px;

            color: #94a3b8;

            font-size: 6px;

            line-height: 1.4;

        }


        .candidate-toast button {

            width: 25px;
            height: 25px;

            display: flex;
            align-items: center;
            justify-content: center;

            border: 0;
            border-radius: 7px;

            color: #94a3b8;

            background: #f1f5f9;

            cursor: pointer;

        }

    `;


    document.head.appendChild(
        style
    );

})();