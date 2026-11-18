"use strict";

document.addEventListener("DOMContentLoaded", function () {

    initializeSidebar();
    initializeSearch();
    initializeFilters();
    initializeDragAndDrop();
    initializeCandidateCards();
    initializeAddCandidate();
    initializeRefresh();
    initializeLogout();
    initializeCompactMode();

    updateAllColumnCounts();
    updateFilterCount();
});


/* =======================================================
   SIDEBAR
======================================================= */

function initializeSidebar() {

    const sidebar =
        document.getElementById("pipelineSidebar");

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

    const search =
        document.getElementById(
            "pipelineSearch"
        );


    if (!search) {
        return;
    }


    search.addEventListener(
        "input",
        function () {

            applyPipelineFilters();

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


    const filterIds = [
        "jobFilter",
        "matchFilter",
        "priorityFilter",
        "sourceFilter"
    ];


    filterIds.forEach(
        function (id) {

            const element =
                document.getElementById(id);


            if (!element) {
                return;
            }


            element.addEventListener(
                "change",
                function () {

                    applyPipelineFilters();
                    updateFilterCount();

                }
            );

        }
    );


    if (clearButton) {

        clearButton.addEventListener(
            "click",
            clearPipelineFilters
        );

    }

}


/* =======================================================
   APPLY FILTERS
======================================================= */

function applyPipelineFilters() {

    const cards =
        document.querySelectorAll(
            ".pipeline-card"
        );


    const searchElement =
        document.getElementById(
            "pipelineSearch"
        );

    const jobElement =
        document.getElementById(
            "jobFilter"
        );

    const matchElement =
        document.getElementById(
            "matchFilter"
        );

    const priorityElement =
        document.getElementById(
            "priorityFilter"
        );

    const sourceElement =
        document.getElementById(
            "sourceFilter"
        );


    const search =
        searchElement
            ? searchElement.value
                .trim()
                .toLowerCase()
            : "";


    const job =
        jobElement
            ? jobElement.value
            : "all";


    const minimumMatch =
        matchElement
            ? Number(matchElement.value)
            : 0;


    const priority =
        priorityElement
            ? priorityElement.value
            : "all";


    const source =
        sourceElement
            ? sourceElement.value
            : "all";


    cards.forEach(
        function (card) {

            const name =
                (
                    card.dataset.name || ""
                ).toLowerCase();


            const role =
                card.dataset.role || "";


            const score =
                Number(
                    card.dataset.match || 0
                );


            const cardPriority =
                card.dataset.priority || "";


            const cardSource =
                card.dataset.source || "";


            const matchesSearch =
                !search ||
                name.includes(search) ||
                role.includes(search);


            const matchesJob =
                job === "all" ||
                role === job;


            const matchesScore =
                score >= minimumMatch;


            const matchesPriority =
                priority === "all" ||
                cardPriority === priority;


            const matchesSource =
                source === "all" ||
                cardSource === source;


            const visible =
                matchesSearch &&
                matchesJob &&
                matchesScore &&
                matchesPriority &&
                matchesSource;


            if (visible) {

                card.classList.remove(
                    "filtered-out"
                );

            } else {

                card.classList.add(
                    "filtered-out"
                );

            }

        }
    );

}


/* =======================================================
   FILTER COUNT
======================================================= */

function updateFilterCount() {

    const counter =
        document.getElementById(
            "filterCount"
        );


    if (!counter) {
        return;
    }


    let count = 0;


    const ids = [
        "jobFilter",
        "matchFilter",
        "priorityFilter",
        "sourceFilter"
    ];


    ids.forEach(
        function (id) {

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

        }
    );


    counter.textContent = count;


    if (count > 0) {

        counter.classList.add(
            "visible"
        );

    } else {

        counter.classList.remove(
            "visible"
        );

    }

}


/* =======================================================
   CLEAR FILTERS
======================================================= */

function clearPipelineFilters() {

    const search =
        document.getElementById(
            "pipelineSearch"
        );

    const job =
        document.getElementById(
            "jobFilter"
        );

    const match =
        document.getElementById(
            "matchFilter"
        );

    const priority =
        document.getElementById(
            "priorityFilter"
        );

    const source =
        document.getElementById(
            "sourceFilter"
        );


    if (search) {
        search.value = "";
    }

    if (job) {
        job.value = "all";
    }

    if (match) {
        match.value = "0";
    }

    if (priority) {
        priority.value = "all";
    }

    if (source) {
        source.value = "all";
    }


    updateFilterCount();
    applyPipelineFilters();

}


/* =======================================================
   DRAG AND DROP
======================================================= */

function initializeDragAndDrop() {

    const cards =
        document.querySelectorAll(
            ".pipeline-card"
        );


    const dropZones =
        document.querySelectorAll(
            ".column-body"
        );


    cards.forEach(
        function (card) {

            card.addEventListener(
                "dragstart",
                handleDragStart
            );


            card.addEventListener(
                "dragend",
                handleDragEnd
            );

        }
    );


    dropZones.forEach(
        function (zone) {

            zone.addEventListener(
                "dragover",
                handleDragOver
            );


            zone.addEventListener(
                "dragleave",
                handleDragLeave
            );


            zone.addEventListener(
                "drop",
                handleDrop
            );

        }
    );

}


let draggedCandidate = null;


function handleDragStart(event) {

    draggedCandidate =
        event.currentTarget;


    draggedCandidate.classList.add(
        "dragging"
    );


    event.dataTransfer.effectAllowed =
        "move";


    event.dataTransfer.setData(
        "text/plain",
        draggedCandidate.dataset.name || ""
    );

}


function handleDragEnd() {

    if (draggedCandidate) {

        draggedCandidate.classList.remove(
            "dragging"
        );

    }


    document
        .querySelectorAll(
            ".column-body.drag-over"
        )
        .forEach(
            function (zone) {

                zone.classList.remove(
                    "drag-over"
                );

            }
        );


    draggedCandidate = null;

}


function handleDragOver(event) {

    event.preventDefault();

    event.dataTransfer.dropEffect =
        "move";


    event.currentTarget.classList.add(
        "drag-over"
    );

}


function handleDragLeave(event) {

    event.currentTarget.classList.remove(
        "drag-over"
    );

}


function handleDrop(event) {

    event.preventDefault();


    const zone =
        event.currentTarget;


    zone.classList.remove(
        "drag-over"
    );


    if (!draggedCandidate) {
        return;
    }


    const newStage =
        zone.dataset.dropStage;


    const oldStage =
        draggedCandidate.dataset.stage;


    if (
        !newStage ||
        newStage === oldStage
    ) {
        return;
    }


    zone.appendChild(
        draggedCandidate
    );


    draggedCandidate.dataset.stage =
        newStage;


    draggedCandidate.classList.remove(
        "filtered-out"
    );


    updateAllColumnCounts();


    showToast(
        "Pipeline Updated",
        draggedCandidate.dataset.name +
        " moved to " +
        getStageLabel(newStage) +
        ".",
        "fa-solid fa-arrow-right"
    );

}


/* =======================================================
   CANDIDATE CARDS
======================================================= */

function initializeCandidateCards() {

    const cards =
        document.querySelectorAll(
            ".pipeline-card"
        );


    cards.forEach(
        function (card) {

            const nameArea =
                card.querySelector(
                    ".card-name"
                );


            if (nameArea) {

                nameArea.style.cursor =
                    "pointer";


                nameArea.addEventListener(
                    "click",
                    function (event) {

                        event.stopPropagation();

                        openCandidateModal(
                            card
                        );

                    }
                );

            }


            const avatar =
                card.querySelector(
                    ".candidate-avatar"
                );


            if (avatar) {

                avatar.style.cursor =
                    "pointer";


                avatar.addEventListener(
                    "click",
                    function (event) {

                        event.stopPropagation();

                        openCandidateModal(
                            card
                        );

                    }
                );

            }


            const menu =
                card.querySelector(
                    ".card-menu"
                );


            if (menu) {

                menu.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();
                        event.stopPropagation();

                        openCandidateModal(
                            card
                        );

                    }
                );

            }

        }
    );


    const modal =
        document.getElementById(
            "candidateModal"
        );


    const modalBackdrop =
        document.getElementById(
            "modalBackdrop"
        );


    const close =
        document.getElementById(
            "modalClose"
        );


    const closeButton =
        document.getElementById(
            "modalCloseButton"
        );


    const interviewButton =
        document.getElementById(
            "modalInterviewButton"
        );


    const shortlistButton =
        document.getElementById(
            "modalShortlistButton"
        );


    if (modalBackdrop) {

        modalBackdrop.addEventListener(
            "click",
            closeCandidateModal
        );

    }


    if (close) {

        close.addEventListener(
            "click",
            closeCandidateModal
        );

    }


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeCandidateModal
        );

    }


    if (interviewButton) {

        interviewButton.addEventListener(
            "click",
            function () {

                const candidateName =
                    modal
                        ? modal.dataset.candidate
                        : "";


                closeCandidateModal();


                showToast(
                    "Interview",
                    "Interview scheduling for " +
                    candidateName +
                    " is ready to connect with the interview module.",
                    "fa-regular fa-calendar"
                );

            }
        );

    }


    if (shortlistButton) {

        shortlistButton.addEventListener(
            "click",
            function () {

                const candidateName =
                    modal
                        ? modal.dataset.candidate
                        : "";


                showToast(
                    "Candidate Shortlisted",
                    candidateName +
                    " has been added to your shortlist.",
                    "fa-solid fa-star"
                );

            }
        );

    }


    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                closeCandidateModal();
                closeAddCandidateModal();

            }

        }
    );

}


/* =======================================================
   OPEN CANDIDATE MODAL
======================================================= */

function openCandidateModal(card) {

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


    const name =
        card.dataset.name ||
        "Candidate";


    const match =
        card.dataset.match ||
        "0";


    const priority =
        card.dataset.priority ||
        "medium";


    const source =
        card.dataset.source ||
        "career";


    const stage =
        card.dataset.stage ||
        "applied";


    const role =
        getRoleLabel(
            card.dataset.role
        );


    const avatar =
        card.querySelector(
            ".candidate-avatar"
        );


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


    const modalPriority =
        document.getElementById(
            "modalPriority"
        );


    const modalSource =
        document.getElementById(
            "modalSource"
        );


    const modalSkills =
        document.getElementById(
            "modalSkills"
        );


    if (modalAvatar) {

        modalAvatar.textContent =
            avatar
                ? avatar.textContent.trim()
                : getInitials(name);

    }


    if (modalName) {
        modalName.textContent =
            name;
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


    if (modalPriority) {
        modalPriority.textContent =
            capitalize(priority);
    }


    if (modalSource) {
        modalSource.textContent =
            capitalize(source);
    }


    if (modalSkills) {
        modalSkills.textContent =
            match + "%";
    }


    modal.dataset.candidate =
        name;


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
        !document
            .getElementById(
                "addCandidateModal"
            )
            ?.classList.contains("open")
    ) {

        document.body.style.overflow =
            "";

    }

}


/* =======================================================
   ADD CANDIDATE
======================================================= */

let selectedAddStage = "applied";


function initializeAddCandidate() {

    const buttons =
        document.querySelectorAll(
            ".add-stage-button"
        );


    buttons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    selectedAddStage =
                        button.dataset.stage ||
                        "applied";


                    openAddCandidateModal(
                        selectedAddStage
                    );

                }
            );

        }
    );


    const form =
        document.getElementById(
            "addCandidateForm"
        );


    if (form) {

        form.addEventListener(
            "submit",
            handleAddCandidate
        );

    }


    const close =
        document.getElementById(
            "addModalClose"
        );


    const cancel =
        document.getElementById(
            "cancelAddCandidate"
        );


    const backdrop =
        document.getElementById(
            "addModalBackdrop"
        );


    if (close) {

        close.addEventListener(
            "click",
            closeAddCandidateModal
        );

    }


    if (cancel) {

        cancel.addEventListener(
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

}


function openAddCandidateModal(stage) {

    const modal =
        document.getElementById(
            "addCandidateModal"
        );


    const label =
        document.getElementById(
            "addStageLabel"
        );


    if (!modal) {
        return;
    }


    selectedAddStage =
        stage;


    if (label) {

        label.textContent =
            "Add candidate to " +
            getStageLabel(stage);

    }


    modal.classList.add(
        "open"
    );


    document.body.style.overflow =
        "hidden";

}


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
        !document
            .getElementById(
                "candidateModal"
            )
            ?.classList.contains("open")
    ) {

        document.body.style.overflow =
            "";

    }

}


/* =======================================================
   HANDLE ADD CANDIDATE
======================================================= */

function handleAddCandidate(event) {

    event.preventDefault();


    const nameInput =
        document.getElementById(
            "candidateName"
        );


    const roleInput =
        document.getElementById(
            "candidateRole"
        );


    const matchInput =
        document.getElementById(
            "candidateMatch"
        );


    const priorityInput =
        document.getElementById(
            "candidatePriority"
        );


    if (
        !nameInput ||
        !roleInput ||
        !matchInput ||
        !priorityInput
    ) {
        return;
    }


    const name =
        nameInput.value.trim();


    const role =
        roleInput.value;


    const match =
        Number(
            matchInput.value
        );


    const priority =
        priorityInput.value;


    if (!name || !role) {

        showToast(
            "Missing Details",
            "Please enter the candidate name and role.",
            "fa-solid fa-circle-exclamation"
        );

        return;

    }


    const card =
        createCandidateCard(
            name,
            role,
            match,
            priority,
            selectedAddStage
        );


    const zone =
        document.querySelector(
            '.column-body[data-drop-stage="' +
            selectedAddStage +
            '"]'
        );


    if (!zone) {
        return;
    }


    zone.appendChild(card);


    closeAddCandidateModal();


    event.target.reset();


    initializeCardDragEvents(
        card
    );


    initializeSingleCardActions(
        card
    );


    updateAllColumnCounts();


    showToast(
        "Candidate Added",
        name +
        " has been added to " +
        getStageLabel(
            selectedAddStage
        ) +
        ".",
        "fa-solid fa-user-plus"
    );

}


/* =======================================================
   CREATE CARD
======================================================= */

function createCandidateCard(
    name,
    role,
    match,
    priority,
    stage
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "pipeline-card";


    card.draggable =
        true;


    card.dataset.name =
        name;


    card.dataset.role =
        role;


    card.dataset.match =
        String(match);


    card.dataset.priority =
        priority;


    card.dataset.source =
        "career";


    card.dataset.stage =
        stage;


    const initials =
        getInitials(name);


    card.innerHTML = `

        <div class="card-top">

            <span class="candidate-avatar avatar-blue">
                ${escapeHTML(initials)}
            </span>

            <button
                class="card-menu"
                type="button"
                aria-label="Candidate options">

                <i class="fa-solid fa-ellipsis"></i>

            </button>

        </div>


        <div class="card-name">
            ${escapeHTML(name)}
        </div>


        <div class="card-role">
            ${escapeHTML(
                getRoleLabel(role)
            )}
        </div>


        <div class="card-tags">

            <span>
                Developer
            </span>

            <span>
                New
            </span>

        </div>


        <div class="card-bottom">

            <div class="ai-score">

                <i class="fa-solid fa-brain"></i>

                <strong>
                    ${escapeHTML(match)}%
                </strong>

            </div>


            <span class="priority ${escapeAttribute(priority)}">
                ${escapeHTML(
                    capitalize(priority)
                )}
            </span>

        </div>

    `;


    return card;

}


/* =======================================================
   INITIALIZE NEW CARD
======================================================= */

function initializeCardDragEvents(card) {

    card.addEventListener(
        "dragstart",
        handleDragStart
    );


    card.addEventListener(
        "dragend",
        handleDragEnd
    );

}


function initializeSingleCardActions(card) {

    const nameArea =
        card.querySelector(
            ".card-name"
        );


    const avatar =
        card.querySelector(
            ".candidate-avatar"
        );


    const menu =
        card.querySelector(
            ".card-menu"
        );


    if (nameArea) {

        nameArea.style.cursor =
            "pointer";


        nameArea.addEventListener(
            "click",
            function () {

                openCandidateModal(
                    card
                );

            }
        );

    }


    if (avatar) {

        avatar.style.cursor =
            "pointer";


        avatar.addEventListener(
            "click",
            function () {

                openCandidateModal(
                    card
                );

            }
        );

    }


    if (menu) {

        menu.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                openCandidateModal(
                    card
                );

            }
        );

    }

}


/* =======================================================
   REFRESH
======================================================= */

function initializeRefresh() {

    const buttons = [
        document.getElementById(
            "refreshPipeline"
        ),
        document.getElementById(
            "refreshButton"
        )
    ];


    buttons.forEach(
        function (button) {

            if (!button) {
                return;
            }


            button.addEventListener(
                "click",
                function () {

                    button.classList.add(
                        "refreshing"
                    );


                    setTimeout(
                        function () {

                            button.classList.remove(
                                "refreshing"
                            );


                            showToast(
                                "Pipeline Refreshed",
                                "Your hiring pipeline is up to date.",
                                "fa-solid fa-rotate"
                            );

                        },
                        700
                    );

                }
            );

        }
    );


    const style =
        document.createElement(
            "style"
        );


    style.textContent = `

        .refreshing i {
            animation:
                pipelineRefresh
                0.7s
                linear
                infinite;
        }

        @keyframes pipelineRefresh {

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

}


/* =======================================================
   COMPACT MODE
======================================================= */

function initializeCompactMode() {

    const button =
        document.getElementById(
            "compactButton"
        );


    const board =
        document.getElementById(
            "pipelineBoard"
        );


    if (!button || !board) {
        return;
    }


    button.addEventListener(
        "click",
        function () {

            board.classList.toggle(
                "compact-mode"
            );


            const enabled =
                board.classList.contains(
                    "compact-mode"
                );


            button.classList.toggle(
                "active",
                enabled
            );


            showToast(
                enabled
                    ? "Compact Mode"
                    : "Normal Mode",
                enabled
                    ? "Pipeline cards are now compact."
                    : "Pipeline cards returned to normal size.",
                "fa-solid fa-compress"
            );

        }
    );

}


/* =======================================================
   COLUMN COUNTS
======================================================= */

function updateAllColumnCounts() {

    const columns =
        document.querySelectorAll(
            ".pipeline-column"
        );


    columns.forEach(
        function (column) {

            const countElement =
                column.querySelector(
                    ".column-header b"
                );


            const cards =
                column.querySelectorAll(
                    ".pipeline-card"
                );


            if (countElement) {

                countElement.textContent =
                    cards.length;

            }

        }
    );

}


/* =======================================================
   STAGE LABEL
======================================================= */

function getStageLabel(stage) {

    const labels = {

        applied:
            "Applied",

        screening:
            "Screening",

        assessment:
            "Assessment",

        interview:
            "Interview",

        offer:
            "Offer",

        hired:
            "Hired"

    };


    return (
        labels[stage] ||
        capitalize(stage)
    );

}


/* =======================================================
   ROLE LABEL
======================================================= */

function getRoleLabel(role) {

    const labels = {

        "full-stack":
            "Full Stack Developer",

        backend:
            "Backend Engineer",

        ai:
            "AI / ML Engineer"

    };


    return (
        labels[role] ||
        "Developer"
    );

}


/* =======================================================
   INITIALS
======================================================= */

function getInitials(name) {

    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(
            function (part) {

                return part
                    .charAt(0)
                    .toUpperCase();

            }
        )
        .join("");

}


/* =======================================================
   CAPITALIZE
======================================================= */

function capitalize(value) {

    if (!value) {
        return "";
    }


    return (
        value.charAt(0).toUpperCase() +
        value.slice(1)
    );

}


/* =======================================================
   ESCAPE HTML
======================================================= */

function escapeHTML(value) {

    return String(value)
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
            ".pipeline-toast"
        );


    if (!toast) {

        toast =
            document.createElement(
                "div"
            );


        toast.className =
            "pipeline-toast";


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
        setTimeout(
            function () {

                toast.classList.remove(
                    "show"
                );

            },
            4000
        );

}