/* =======================================================
   DEVRECRUIT AI
   CANDIDATE ASSESSMENT CENTER
======================================================= */

"use strict";


/* =======================================================
   DOM READY
======================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeSidebar();
    initializeAssessmentFilters();
    initializeAssessmentSearch();
    initializeAssessmentActions();
    initializeLogout();

    updateAssessmentCount();

});


/* =======================================================
   SIDEBAR
======================================================= */

function initializeSidebar() {

    const sidebar =
        document.getElementById("candidateSidebar");

    const overlay =
        document.getElementById("sidebarOverlay");

    const menuButton =
        document.getElementById("mobileMenuButton");

    const closeButton =
        document.getElementById("sidebarClose");


    if (!sidebar || !overlay) {
        return;
    }


    function openSidebar() {

        sidebar.classList.add("open");
        overlay.classList.add("active");

        document.body.style.overflow = "hidden";
    }


    function closeSidebar() {

        sidebar.classList.remove("open");
        overlay.classList.remove("active");

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


    overlay.addEventListener(
        "click",
        closeSidebar
    );


    document.querySelectorAll(
        ".candidate-sidebar .nav-item"
    ).forEach(item => {

        item.addEventListener(
            "click",
            () => {

                if (
                    window.innerWidth <= 900
                ) {

                    closeSidebar();

                }

            }
        );

    });


    window.addEventListener(
        "resize",
        () => {

            if (window.innerWidth > 900) {
                closeSidebar();
            }

        }
    );

}


/* =======================================================
   ASSESSMENT FILTERS
======================================================= */

function initializeAssessmentFilters() {

    const filterButtons =
        document.querySelectorAll(
            ".assessment-tab"
        );

    const assessmentCards =
        document.querySelectorAll(
            ".assessment-card"
        );


    if (!filterButtons.length) {
        return;
    }


    filterButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                filterButtons.forEach(
                    item => {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                const filter =
                    button.dataset.filter ||
                    "all";


                assessmentCards.forEach(
                    card => {

                        const status =
                            card.dataset.status;


                        if (
                            filter === "all" ||
                            status === filter
                        ) {

                            card.style.display =
                                "flex";

                        } else {

                            card.style.display =
                                "none";

                        }

                    }
                );


                applyCurrentSearch();

                updateAssessmentCount();

            }
        );

    });

}


/* =======================================================
   SEARCH
======================================================= */

function initializeAssessmentSearch() {

    const searchInput =
        document.getElementById(
            "assessmentSearch"
        );


    if (!searchInput) {
        return;
    }


    searchInput.addEventListener(
        "input",
        () => {

            applyCurrentSearch();

            updateAssessmentCount();

        }
    );

}


/* =======================================================
   SEARCH + FILTER COMBINATION
======================================================= */

function applyCurrentSearch() {

    const searchInput =
        document.getElementById(
            "assessmentSearch"
        );


    const activeFilter =
        document.querySelector(
            ".assessment-tab.active"
        );


    const cards =
        document.querySelectorAll(
            ".assessment-card"
        );


    const emptyState =
        document.getElementById(
            "assessmentEmpty"
        );


    const searchTerm =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const filter =
        activeFilter
            ? activeFilter.dataset.filter
            : "all";


    let visibleCards = 0;


    cards.forEach(card => {

        const status =
            card.dataset.status ||
            "";


        const title =
            card.dataset.title ||
            card.innerText ||
            "";


        const type =
            card.dataset.type ||
            "";


        const searchableText =
            `${title} ${type}`
                .toLowerCase();


        const matchesFilter =
            filter === "all" ||
            status === filter;


        const matchesSearch =
            searchTerm === "" ||
            searchableText.includes(
                searchTerm
            );


        if (
            matchesFilter &&
            matchesSearch
        ) {

            card.style.display =
                "flex";

            visibleCards++;

        } else {

            card.style.display =
                "none";

        }

    });


    if (emptyState) {

        if (visibleCards === 0) {

            emptyState.classList.add(
                "visible"
            );

        } else {

            emptyState.classList.remove(
                "visible"
            );

        }

    }

}


/* =======================================================
   ASSESSMENT COUNT
======================================================= */

function updateAssessmentCount() {

    const countElement =
        document.getElementById(
            "assessmentCount"
        );


    if (!countElement) {
        return;
    }


    const cards =
        document.querySelectorAll(
            ".assessment-card"
        );


    let visibleCount = 0;


    cards.forEach(card => {

        if (
            card.style.display !==
            "none"
        ) {

            visibleCount++;

        }

    });


    countElement.textContent =
        `${visibleCount} assessment${
            visibleCount === 1
                ? ""
                : "s"
        }`;

}


/* =======================================================
   ASSESSMENT ACTIONS
======================================================= */

function initializeAssessmentActions() {

    const startButtons =
        document.querySelectorAll(
            ".start-assessment"
        );


    const resultButtons =
        document.querySelectorAll(
            ".view-result"
        );


    startButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const assessment =
                    button.dataset.assessment ||
                    "Assessment";


                startAssessment(
                    assessment,
                    button
                );

            }
        );

    });


    resultButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const assessment =
                    button.dataset.assessment ||
                    "Assessment";


                viewAssessmentResult(
                    assessment
                );

            }
        );

    });

}


/* =======================================================
   START ASSESSMENT
======================================================= */

function startAssessment(
    assessmentName,
    button
) {

    showToast(
        "Assessment Ready",
        `${assessmentName} is ready to begin.`,
        "fa-solid fa-clipboard-check"
    );


    if (button) {

        const originalHTML =
            button.innerHTML;


        button.disabled = true;

        button.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Loading
        `;


        setTimeout(() => {

            /*
             * TEMPORARY FRONTEND FLOW
             *
             * Later this button will redirect
             * to the real assessment engine.
             */

            button.disabled = false;

            button.innerHTML =
                originalHTML;


            showToast(
                "Assessment Module",
                "Assessment engine will open here.",
                "fa-solid fa-code"
            );

        }, 900);

    }

}


/* =======================================================
   VIEW RESULT
======================================================= */

function viewAssessmentResult(
    assessmentName
) {

    showToast(
        "Assessment Result",
        `Opening result for ${assessmentName}.`,
        "fa-solid fa-chart-column"
    );

}


/* =======================================================
   TOAST SYSTEM
======================================================= */

function showToast(
    title,
    message,
    icon = "fa-solid fa-circle-info"
) {

    let toast =
        document.querySelector(
            ".assessment-toast"
        );


    /*
     * Create toast dynamically if it
     * does not already exist.
     */

    if (!toast) {

        toast =
            document.createElement(
                "div"
            );


        toast.className =
            "assessment-toast";


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
                aria-label="Close notification"
            >
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
            () => {

                hideToast(toast);

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
            icon;

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
            () => {

                hideToast(toast);

            },
            4000
        );

}


/* =======================================================
   HIDE TOAST
======================================================= */

function hideToast(toast) {

    if (!toast) {
        return;
    }


    toast.classList.remove(
        "show"
    );

}


/* =======================================================
   LOGOUT
======================================================= */

function initializeLogout() {

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (!logoutButton) {
        return;
    }


    logoutButton.addEventListener(
        "click",
        () => {

            const confirmed =
                window.confirm(
                    "Are you sure you want to sign out?"
                );


            if (!confirmed) {
                return;
            }


            /*
             * Clear frontend session data.
             * Backend authentication will later
             * replace this with a real API logout.
             */

            try {

                sessionStorage.clear();

            } catch (error) {

                console.warn(
                    "Session storage could not be cleared.",
                    error
                );

            }


            showToast(
                "Signed Out",
                "Redirecting to the role selection page.",
                "fa-solid fa-right-from-bracket"
            );


            setTimeout(
                () => {

                    window.location.href =
                        "../../auth/role-selection/index.html";

                },
                900
            );

        }
    );

}


/* =======================================================
   ACTIVE SIDEBAR STATE
======================================================= */

function setActiveNavigation() {

    const currentPath =
        window.location.pathname
            .toLowerCase();


    document.querySelectorAll(
        ".candidate-sidebar .nav-item"
    ).forEach(item => {

        const href =
            item.getAttribute("href");


        if (!href) {
            return;
        }


        if (
            currentPath.includes(
                href
                    .replace(
                        "index.html",
                        ""
                    )
                    .replace(
                        "../",
                        ""
                    )
            )
        ) {

            item.classList.add(
                "active"
            );

        }

    });

}


/* =======================================================
   INITIAL ACTIVE NAVIGATION
======================================================= */

setActiveNavigation();