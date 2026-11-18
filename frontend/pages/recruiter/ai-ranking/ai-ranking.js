"use strict";

document.addEventListener("DOMContentLoaded", function () {

    initializeSidebar();
    initializeSearch();
    initializeFilters();
    initializeSorting();
    initializeCandidateActions();
    initializeReanalysis();
    initializeRefresh();
    initializeRankingMethod();
    initializeLogout();

});


/* =======================================================
   SIDEBAR
======================================================= */

function initializeSidebar() {

    const sidebar =
        document.getElementById("rankingSidebar");

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
        menuButton.addEventListener(
            "click",
            openSidebar
        );
    }


    if (closeButton) {
        closeButton.addEventListener(
            "click",
            closeSidebar
        );
    }


    if (overlay) {
        overlay.addEventListener(
            "click",
            closeSidebar
        );
    }


    window.addEventListener(
        "resize",
        function () {

            if (window.innerWidth > 900) {
                closeSidebar();
            }

        }
    );

}


/* =======================================================
   SEARCH
======================================================= */

function initializeSearch() {

    const searchInput =
        document.getElementById(
            "candidateSearch"
        );

    if (!searchInput) {
        return;
    }


    searchInput.addEventListener(
        "input",
        function () {

            applyAllFilters();

        }
    );

}


/* =======================================================
   FILTERS
======================================================= */

function initializeFilters() {

    const filterButton =
        document.getElementById(
            "filterButton"
        );

    const filterPanel =
        document.getElementById(
            "filterPanel"
        );

    const clearButton =
        document.getElementById(
            "clearFilters"
        );

    const emptyReset =
        document.getElementById(
            "emptyStateReset"
        );


    if (filterButton && filterPanel) {

        filterButton.addEventListener(
            "click",
            function () {

                filterPanel.classList.toggle(
                    "open"
                );

            }
        );

    }


    const filters = [

        document.getElementById(
            "matchFilter"
        ),

        document.getElementById(
            "experienceFilter"
        ),

        document.getElementById(
            "statusFilter"
        )

    ];


    filters.forEach(function (filter) {

        if (!filter) {
            return;
        }


        filter.addEventListener(
            "change",
            function () {

                applyAllFilters();
                updateFilterCount();

            }
        );

    });


    if (clearButton) {

        clearButton.addEventListener(
            "click",
            clearFilters
        );

    }


    if (emptyReset) {

        emptyReset.addEventListener(
            "click",
            clearFilters
        );

    }

}


/* =======================================================
   APPLY FILTERS
======================================================= */

function applyAllFilters() {

    const cards =
        document.querySelectorAll(
            ".candidate-card"
        );

    const searchInput =
        document.getElementById(
            "candidateSearch"
        );

    const matchFilter =
        document.getElementById(
            "matchFilter"
        );

    const experienceFilter =
        document.getElementById(
            "experienceFilter"
        );

    const statusFilter =
        document.getElementById(
            "statusFilter"
        );


    const searchValue =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const minimumMatch =
        matchFilter
            ? Number(matchFilter.value)
            : 0;


    const selectedExperience =
        experienceFilter
            ? experienceFilter.value
            : "all";


    const selectedStatus =
        statusFilter
            ? statusFilter.value
            : "all";


    let visibleCount = 0;


    cards.forEach(function (card) {

        const name =
            (
                card.dataset.name || ""
            ).toLowerCase();


        const role =
            (
                card.dataset.role || ""
            ).toLowerCase();


        const match =
            Number(
                card.dataset.match || 0
            );


        const experience =
            card.dataset.experience || "";


        const status =
            card.dataset.status || "";


        const searchableText =
            name + " " + role;


        const matchesSearch =
            !searchValue ||
            searchableText.includes(
                searchValue
            );


        const matchesScore =
            match >= minimumMatch;


        const matchesExperience =
            selectedExperience === "all" ||
            experience === selectedExperience;


        const matchesStatus =
            selectedStatus === "all" ||
            status === selectedStatus;


        const visible =
            matchesSearch &&
            matchesScore &&
            matchesExperience &&
            matchesStatus;


        if (visible) {

            card.classList.remove(
                "hidden"
            );

            visibleCount++;

        } else {

            card.classList.add(
                "hidden"
            );

        }

    });


    updateCandidateCount(
        visibleCount
    );


    updateEmptyState(
        visibleCount
    );

}


/* =======================================================
   UPDATE CANDIDATE COUNT
======================================================= */

function updateCandidateCount(count) {

    const countElement =
        document.getElementById(
            "candidateCount"
        );


    if (countElement) {
        countElement.textContent =
            count;
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

        emptyState.classList.add(
            "visible"
        );

    } else {

        emptyState.classList.remove(
            "visible"
        );

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


    let count = 0;


    const matchFilter =
        document.getElementById(
            "matchFilter"
        );

    const experienceFilter =
        document.getElementById(
            "experienceFilter"
        );

    const statusFilter =
        document.getElementById(
            "statusFilter"
        );


    if (
        matchFilter &&
        matchFilter.value !== "0"
    ) {
        count++;
    }


    if (
        experienceFilter &&
        experienceFilter.value !== "all"
    ) {
        count++;
    }


    if (
        statusFilter &&
        statusFilter.value !== "all"
    ) {
        count++;
    }


    countElement.textContent =
        count;


    if (count > 0) {

        countElement.classList.add(
            "visible"
        );

    } else {

        countElement.classList.remove(
            "visible"
        );

    }

}


/* =======================================================
   CLEAR FILTERS
======================================================= */

function clearFilters() {

    const searchInput =
        document.getElementById(
            "candidateSearch"
        );

    const matchFilter =
        document.getElementById(
            "matchFilter"
        );

    const experienceFilter =
        document.getElementById(
            "experienceFilter"
        );

    const statusFilter =
        document.getElementById(
            "statusFilter"
        );


    if (searchInput) {
        searchInput.value = "";
    }


    if (matchFilter) {
        matchFilter.value = "0";
    }


    if (experienceFilter) {
        experienceFilter.value = "all";
    }


    if (statusFilter) {
        statusFilter.value = "all";
    }


    applyAllFilters();
    updateFilterCount();

}


/* =======================================================
   SORTING
======================================================= */

function initializeSorting() {

    const sortSelect =
        document.getElementById(
            "sortSelect"
        );


    if (!sortSelect) {
        return;
    }


    sortSelect.addEventListener(
        "change",
        function () {

            sortCandidates(
                sortSelect.value
            );

        }
    );

}


function sortCandidates(sortType) {

    const list =
        document.getElementById(
            "candidateList"
        );


    if (!list) {
        return;
    }


    const cards =
        Array.from(
            list.querySelectorAll(
                ".candidate-card"
            )
        );


    cards.sort(
        function (a, b) {

            if (sortType === "match") {

                return (
                    Number(b.dataset.match) -
                    Number(a.dataset.match)
                );

            }


            if (sortType === "assessment") {

                return (
                    Number(b.dataset.assessment) -
                    Number(a.dataset.assessment)
                );

            }


            if (
                sortType ===
                "experience"
            ) {

                const experienceOrder = {
                    senior: 3,
                    mid: 2,
                    junior: 1
                };


                return (
                    experienceOrder[
                        b.dataset.experience
                    ] -
                    experienceOrder[
                        a.dataset.experience
                    ]
                );

            }


            if (
                sortType ===
                "recent"
            ) {

                return 0;

            }


            return 0;

        }
    );


    cards.forEach(
        function (card) {

            list.appendChild(
                card
            );

        }
    );


    updateRankNumbers();

}


/* =======================================================
   UPDATE RANK NUMBERS
======================================================= */

function updateRankNumbers() {

    const cards =
        document.querySelectorAll(
            ".candidate-card:not(.hidden)"
        );


    cards.forEach(
        function (card, index) {

            const rank =
                card.querySelector(
                    ".rank-number"
                );


            if (!rank) {
                return;
            }


            const number =
                String(
                    index + 1
                ).padStart(
                    2,
                    "0"
                );


            rank.textContent =
                "#" + number;

        }
    );

}


/* =======================================================
   CANDIDATE ACTIONS
======================================================= */

function initializeCandidateActions() {

    const viewButtons =
        document.querySelectorAll(
            ".view-action"
        );


    const shortlistButtons =
        document.querySelectorAll(
            ".shortlist-action"
        );


    viewButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    openCandidateModal(
                        button.dataset.candidate
                    );

                }
            );

        }
    );


    shortlistButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    toggleShortlist(
                        button
                    );

                }
            );

        }
    );


    const modalClose =
        document.getElementById(
            "modalClose"
        );

    const modalCloseButton =
        document.getElementById(
            "modalCloseButton"
        );

    const modalBackdrop =
        document.getElementById(
            "candidateModalBackdrop"
        );


    if (modalClose) {

        modalClose.addEventListener(
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


    if (modalBackdrop) {

        modalBackdrop.addEventListener(
            "click",
            closeCandidateModal
        );

    }


    const modalShortlist =
        document.getElementById(
            "modalShortlistButton"
        );


    if (modalShortlist) {

        modalShortlist.addEventListener(
            "click",
            function () {

                showToast(
                    "Candidate Shortlisted",
                    "Candidate has been added to the shortlist.",
                    "fa-solid fa-star"
                );

                closeCandidateModal();

            }
        );

    }


    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                closeCandidateModal();
                closeMethodModal();

            }

        }
    );

}


/* =======================================================
   TOGGLE SHORTLIST
======================================================= */

function toggleShortlist(button) {

    const active =
        button.classList.contains(
            "active"
        );


    const icon =
        button.querySelector(
            "i"
        );


    if (active) {

        button.classList.remove(
            "active"
        );


        button.innerHTML =
            '<i class="fa-regular fa-star"></i> Shortlist';


        showToast(
            "Removed from Shortlist",
            "Candidate has been removed from your shortlist.",
            "fa-regular fa-star"
        );

    } else {

        button.classList.add(
            "active"
        );


        button.innerHTML =
            '<i class="fa-solid fa-star"></i> Shortlisted';


        showToast(
            "Candidate Shortlisted",
            "Candidate has been added to your shortlist.",
            "fa-solid fa-star"
        );

    }

}


/* =======================================================
   OPEN CANDIDATE MODAL
======================================================= */

function openCandidateModal(candidateName) {

    const cards =
        document.querySelectorAll(
            ".candidate-card"
        );


    let selectedCard = null;


    cards.forEach(
        function (card) {

            if (
                card.dataset.name ===
                candidateName
            ) {

                selectedCard =
                    card;

            }

        }
    );


    if (!selectedCard) {
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
        selectedCard.querySelector(
            ".candidate-avatar"
        );


    const role =
        selectedCard.dataset.role ||
        "Developer";


    const match =
        selectedCard.dataset.match ||
        "0";


    const assessment =
        selectedCard.dataset.assessment ||
        "0";


    const experienceElement =
        selectedCard.querySelector(
            ".candidate-meta span:nth-child(2)"
        );


    const experience =
        experienceElement
            ? experienceElement.textContent.trim()
            : "Not available";


    const modalAvatar =
        document.getElementById(
            "modalAvatar"
        );


    const modalName =
        document.getElementById(
            "modalCandidateName"
        );


    const modalRole =
        document.getElementById(
            "modalCandidateRole"
        );


    const modalScore =
        document.getElementById(
            "modalMatchScore"
        );


    const modalScoreBar =
        document.getElementById(
            "modalScoreBar"
        );


    const modalExperience =
        document.getElementById(
            "modalExperience"
        );


    const modalAssessment =
        document.getElementById(
            "modalAssessment"
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


    if (modalScore) {
        modalScore.textContent =
            match + "%";
    }


    if (modalScoreBar) {
        modalScoreBar.style.width =
            match + "%";
    }


    if (modalExperience) {
        modalExperience.textContent =
            experience;
    }


    if (modalAssessment) {
        modalAssessment.textContent =
            assessment + "%";
    }


    modal.classList.add(
        "open"
    );


    document.body.style.overflow =
        "hidden";

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

        modal.classList.remove(
            "open"
        );

    }


    if (
        !document.querySelector(
            ".method-modal.open"
        )
    ) {

        document.body.style.overflow =
            "";

    }

}


/* =======================================================
   RE-ANALYZE
======================================================= */

function initializeReanalysis() {

    const button =
        document.getElementById(
            "reanalyzeButton"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        function () {

            reanalyzeCandidates(
                button
            );

        }
    );

}


function reanalyzeCandidates(button) {

    if (button.disabled) {
        return;
    }


    const originalHTML =
        button.innerHTML;


    button.disabled = true;


    button.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Analyzing...';


    setTimeout(
        function () {

            button.disabled =
                false;


            button.innerHTML =
                originalHTML;


            showToast(
                "AI Analysis Complete",
                "Candidate rankings have been refreshed successfully.",
                "fa-solid fa-brain"
            );


            applyAllFilters();

        },
        1600
    );

}


/* =======================================================
   REFRESH
======================================================= */

function initializeRefresh() {

    const button =
        document.getElementById(
            "refreshRanking"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        function () {

            button.classList.add(
                "rotating"
            );


            setTimeout(
                function () {

                    button.classList.remove(
                        "rotating"
                    );


                    showToast(
                        "Ranking Refreshed",
                        "Latest candidate ranking data is now displayed.",
                        "fa-solid fa-rotate"
                    );

                },
                900
            );

        }
    );

}


/* =======================================================
   RANKING METHOD
======================================================= */

function initializeRankingMethod() {

    const button =
        document.getElementById(
            "rankingMethodButton"
        );


    const modal =
        document.getElementById(
            "methodModal"
        );


    const closeButton =
        document.getElementById(
            "methodClose"
        );


    const backdrop =
        document.getElementById(
            "methodBackdrop"
        );


    if (
        !button ||
        !modal
    ) {
        return;
    }


    button.addEventListener(
        "click",
        function () {

            modal.classList.add(
                "open"
            );

            document.body.style.overflow =
                "hidden";

        }
    );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeMethodModal
        );

    }


    if (backdrop) {

        backdrop.addEventListener(
            "click",
            closeMethodModal
        );

    }

}


/* =======================================================
   CLOSE METHOD MODAL
======================================================= */

function closeMethodModal() {

    const modal =
        document.getElementById(
            "methodModal"
        );


    if (modal) {

        modal.classList.remove(
            "open"
        );

    }


    if (
        !document.querySelector(
            ".candidate-modal.open"
        )
    ) {

        document.body.style.overflow =
            "";

    }

}


/* =======================================================
   JOB CHANGE
======================================================= */

function initializeJobSelector() {

    const select =
        document.getElementById(
            "jobSelect"
        );


    if (!select) {
        return;
    }


    select.addEventListener(
        "change",
        function () {

            const jobName =
                select.options[
                    select.selectedIndex
                ].text;


            showToast(
                "Job Updated",
                "Ranking candidates for " + jobName + ".",
                "fa-solid fa-briefcase"
            );


            setTimeout(
                function () {

                    showToast(
                        "AI Ranking Updated",
                        "Candidates have been re-ranked for the selected role.",
                        "fa-solid fa-brain"
                    );

                },
                700
            );

        }
    );

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


            setTimeout(
                function () {

                    window.location.href =
                        "../login/index.html";

                },
                900
            );

        }
    );

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
            ".ranking-toast"
        );


    if (!toast) {

        toast =
            document.createElement(
                "div"
            );


        toast.className =
            "ranking-toast";


        toast.innerHTML =
            '<div class="toast-icon">' +
                '<i></i>' +
            '</div>' +

            '<div class="toast-content">' +
                '<strong></strong>' +
                '<span></span>' +
            '</div>' +

            '<button type="button" aria-label="Close">' +
                '<i class="fa-solid fa-xmark"></i>' +
            '</button>';


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
        setTimeout(
            function () {

                toast.classList.remove(
                    "show"
                );

            },
            4000
        );

}


/* =======================================================
   TOAST STYLES
======================================================= */

(function addToastStyles() {

    const style =
        document.createElement(
            "style"
        );


    style.textContent = `

        .ranking-toast {
            position: fixed;
            right: 24px;
            bottom: 24px;

            width: min(350px, calc(100vw - 30px));

            display: flex;
            align-items: center;

            gap: 11px;

            padding: 13px 14px;

            border: 1px solid #dfe5ee;
            border-radius: 12px;

            background: #ffffff;

            box-shadow:
                0 18px 45px rgba(15, 23, 42, 0.14);

            transform:
                translateY(25px);

            opacity: 0;

            pointer-events: none;

            transition:
                opacity 0.25s ease,
                transform 0.25s ease;

            z-index: 5000;
        }

        .ranking-toast.show {
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

        .ranking-toast button {
            width: 25px;
            height: 25px;

            display: flex;
            align-items: center;
            justify-content: center;

            border: 0;
            border-radius: 7px;

            color: #94a3b8;
            background: #f1f5f9;
        }

        .rotating {
            animation:
                rankingRotate 0.9s linear;
        }

        @keyframes rankingRotate {
            from {
                transform: rotate(0deg);
            }

            to {
                transform: rotate(360deg);
            }
        }

    `;


    document.head.appendChild(
        style
    );

})();


/* =======================================================
   INITIALIZE JOB SELECTOR
======================================================= */

initializeJobSelector();