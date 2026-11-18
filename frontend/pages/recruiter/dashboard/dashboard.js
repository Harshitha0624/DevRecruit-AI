"use strict";

document.addEventListener("DOMContentLoaded", function () {

    initializeSidebar();
    initializeSearch();
    initializeAIInsights();
    initializeCandidateActions();
    initializePipelineInteractions();
    initializeLogout();

});


/* =======================================================
   SIDEBAR
======================================================= */

function initializeSidebar() {

    const sidebar = document.getElementById("recruiterSidebar");
    const overlay = document.getElementById("sidebarOverlay");
    const menuButton = document.getElementById("mobileMenuButton");
    const closeButton = document.getElementById("sidebarClose");

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
   GLOBAL SEARCH
======================================================= */

function initializeSearch() {

    const searchButton =
        document.getElementById("globalSearchButton");

    const modal =
        document.getElementById("searchModal");

    const closeButton =
        document.getElementById("closeSearchModal");

    const backdrop =
        document.getElementById("searchModalBackdrop");

    const searchInput =
        document.getElementById("globalSearchInput");


    if (!searchButton || !modal) {
        return;
    }


    function openSearch() {

        modal.classList.add("open");

        document.body.style.overflow = "hidden";

        if (searchInput) {

            setTimeout(function () {

                searchInput.focus();

            }, 100);

        }

    }


    function closeSearch() {

        modal.classList.remove("open");

        document.body.style.overflow = "";

        if (searchInput) {
            searchInput.value = "";
        }

    }


    searchButton.addEventListener(
        "click",
        openSearch
    );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeSearch
        );

    }


    if (backdrop) {

        backdrop.addEventListener(
            "click",
            closeSearch
        );

    }


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                modal.classList.contains("open")
            ) {

                closeSearch();

            }


            if (
                (event.ctrlKey || event.metaKey) &&
                event.key.toLowerCase() === "k"
            ) {

                event.preventDefault();

                openSearch();

            }

        }
    );


    const quickButtons =
        document.querySelectorAll(
            "[data-search-target]"
        );


    quickButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const target =
                    button.dataset.searchTarget;

                navigateFromSearch(target);

            }
        );

    });


    if (searchInput) {

        searchInput.addEventListener(
            "keydown",
            function (event) {

                if (event.key !== "Enter") {
                    return;
                }


                const query =
                    searchInput.value
                        .trim()
                        .toLowerCase();


                if (!query) {
                    return;
                }


                handleSearchQuery(query);

            }
        );

    }

}


/* =======================================================
   SEARCH NAVIGATION
======================================================= */

function navigateFromSearch(target) {

    const routes = {

        candidates:
            "../candidates/index.html",

        jobs:
            "../jobs/index.html",

        assessments:
            "../assessments/index.html",

        interviews:
            "../interviews/index.html"

    };


    if (routes[target]) {

        window.location.href =
            routes[target];

    }

}


/* =======================================================
   SEARCH QUERY
======================================================= */

function handleSearchQuery(query) {

    const routes = [

        {
            words: [
                "candidate",
                "candidates",
                "developer",
                "talent"
            ],
            url: "../candidates/index.html"
        },

        {
            words: [
                "job",
                "jobs",
                "position",
                "opening"
            ],
            url: "../jobs/index.html"
        },

        {
            words: [
                "assessment",
                "assessments",
                "test",
                "evaluation"
            ],
            url: "../assessments/index.html"
        },

        {
            words: [
                "interview",
                "interviews",
                "schedule"
            ],
            url: "../interviews/index.html"
        },

        {
            words: [
                "credential",
                "credentials",
                "certificate",
                "verification"
            ],
            url: "../credentials/index.html"
        },

        {
            words: [
                "message",
                "messages",
                "chat"
            ],
            url: "../messages/index.html"
        },

        {
            words: [
                "analytics",
                "reports",
                "statistics"
            ],
            url: "../analytics/index.html"
        }

    ];


    let matchedRoute = null;


    for (let i = 0; i < routes.length; i++) {

        for (let j = 0; j < routes[i].words.length; j++) {

            if (
                query.includes(
                    routes[i].words[j]
                )
            ) {

                matchedRoute =
                    routes[i].url;

                break;

            }

        }


        if (matchedRoute) {
            break;
        }

    }


    if (matchedRoute) {

        window.location.href =
            matchedRoute;

        return;

    }


    showToast(
        "No Direct Match",
        "No recruiter module matched your search.",
        "fa-solid fa-magnifying-glass"
    );

}


/* =======================================================
   AI INSIGHTS
======================================================= */

function initializeAIInsights() {

    const button =
        document.getElementById(
            "generateInsightButton"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        function () {

            generateAIInsight(button);

        }
    );

}


/* =======================================================
   GENERATE AI INSIGHT
======================================================= */

function generateAIInsight(button) {

    if (button.disabled) {
        return;
    }


    const originalContent =
        button.innerHTML;


    button.disabled = true;


    button.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Analyzing Recruitment Data...';


    setTimeout(function () {

        button.disabled = false;

        button.innerHTML =
            originalContent;


        updateAIInsights();


        showToast(
            "AI Insight Generated",
            "AI identified 6 high-potential candidates requiring attention.",
            "fa-solid fa-brain"
        );

    }, 1400);

}


/* =======================================================
   UPDATE AI INSIGHTS
======================================================= */

function updateAIInsights() {

    const items =
        document.querySelectorAll(
            ".insight-item"
        );


    const insights = [

        {
            title:
                "6 high-potential candidates",

            description:
                "AI detected strong skill alignment across your active engineering roles.",

            icon:
                "fa-solid fa-bullseye"
        },

        {
            title:
                "3 applications are aging",

            description:
                "These candidates have remained in screening longer than your normal review cycle.",

            icon:
                "fa-solid fa-clock"
        },

        {
            title:
                "Skill gap detected",

            description:
                "Cloud and distributed systems experience is currently the biggest hiring gap.",

            icon:
                "fa-solid fa-chart-line"
        }

    ];


    items.forEach(function (item, index) {

        if (!insights[index]) {
            return;
        }


        const data =
            insights[index];


        const icon =
            item.querySelector(
                ".insight-icon i"
            );

        const title =
            item.querySelector(
                "strong"
            );

        const description =
            item.querySelector(
                "span"
            );


        if (icon) {
            icon.className =
                data.icon;
        }


        if (title) {
            title.textContent =
                data.title;
        }


        if (description) {
            description.textContent =
                data.description;
        }

    });

}


/* =======================================================
   CANDIDATE ACTIONS
======================================================= */

function initializeCandidateActions() {

    const buttons =
        document.querySelectorAll(
            ".row-action[data-candidate]"
        );


    buttons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const candidate =
                    button.dataset.candidate;


                showToast(
                    "Candidate Selected",
                    "Opening AI profile for " + candidate + ".",
                    "fa-solid fa-user-check"
                );

            }
        );

    });

}


/* =======================================================
   PIPELINE
======================================================= */

function initializePipelineInteractions() {

    const stages =
        document.querySelectorAll(
            ".pipeline-stage"
        );


    stages.forEach(function (stage) {

        stage.addEventListener(
            "click",
            function () {

                const name =
                    stage.querySelector(
                        ".stage-top span"
                    );


                if (!name) {
                    return;
                }


                showToast(
                    "Pipeline Stage",
                    "Viewing " +
                    name.textContent.trim() +
                    " candidates.",
                    "fa-solid fa-filter"
                );

            }
        );

    });

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

            } catch (error) {

                console.warn(
                    "Session storage could not be cleared.",
                    error
                );

            }


            showToast(
                "Signed Out",
                "Redirecting to role selection...",
                "fa-solid fa-right-from-bracket"
            );


            setTimeout(function () {

                window.location.href =
                    "../../auth/role-selection/index.html";

            }, 900);

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
            ".recruiter-toast"
        );


    if (!toast) {

        toast =
            document.createElement(
                "div"
            );


        toast.className =
            "recruiter-toast";


        toast.innerHTML =

            '<div class="recruiter-toast-icon">' +
                '<i></i>' +
            '</div>' +

            '<div class="recruiter-toast-content">' +
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
            ".recruiter-toast-icon i"
        );

    const titleElement =
        toast.querySelector(
            ".recruiter-toast-content strong"
        );

    const messageElement =
        toast.querySelector(
            ".recruiter-toast-content span"
        );


    if (iconElement) {
        iconElement.className =
            icon || "fa-solid fa-circle-info";
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