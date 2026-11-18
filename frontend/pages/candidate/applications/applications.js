/* =======================================================
   DEVRECRUIT AI
   CANDIDATE APPLICATION TRACKER
======================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* ===================================================
       ELEMENTS
    =================================================== */

    const sidebar =
        document.querySelector("#candidateSidebar");

    const sidebarOverlay =
        document.querySelector("#sidebarOverlay");

    const mobileMenuButton =
        document.querySelector("#mobileMenuButton");

    const sidebarClose =
        document.querySelector("#sidebarClose");

    const logoutButton =
        document.querySelector("#logoutButton");

    const filterButtons =
        document.querySelectorAll(
            ".application-filter"
        );

    const searchInput =
        document.querySelector(
            "#applicationSearch"
        );

    const applicationItems =
        Array.from(
            document.querySelectorAll(
                ".application-item"
            )
        );

    const applicationList =
        document.querySelector(
            "#applicationList"
        );

    const applicationCount =
        document.querySelector(
            "#applicationCount"
        );

    const emptyState =
        document.querySelector(
            "#applicationsEmpty"
        );

    const actionButtons =
        document.querySelectorAll(
            ".application-action"
        );


    /* ===================================================
       STATE
    =================================================== */

    let currentStatus = "all";

    let currentSearch = "";


    /* ===================================================
       SIDEBAR
    =================================================== */

    function openSidebar() {

        if (!sidebar) return;

        sidebar.classList.add("open");

        if (sidebarOverlay) {
            sidebarOverlay.classList.add("active");
        }

        document.body.style.overflow = "hidden";

    }


    function closeSidebar() {

        if (!sidebar) return;

        sidebar.classList.remove("open");

        if (sidebarOverlay) {
            sidebarOverlay.classList.remove("active");
        }

        document.body.style.overflow = "";

    }


    if (mobileMenuButton) {

        mobileMenuButton.addEventListener(
            "click",
            openSidebar
        );

    }


    if (sidebarClose) {

        sidebarClose.addEventListener(
            "click",
            closeSidebar
        );

    }


    if (sidebarOverlay) {

        sidebarOverlay.addEventListener(
            "click",
            closeSidebar
        );

    }


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                sidebar &&
                sidebar.classList.contains("open")
            ) {

                closeSidebar();

            }

        }
    );


    window.addEventListener(
        "resize",
        () => {

            if (window.innerWidth > 900) {
                closeSidebar();
            }

        }
    );


    /* ===================================================
       LOGOUT
    =================================================== */

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            () => {

                const confirmed =
                    window.confirm(
                        "Are you sure you want to sign out?"
                    );

                if (!confirmed) return;

                /*
                 * Temporary frontend navigation.
                 * Real authentication cleanup will
                 * be connected with backend later.
                 */

                window.location.href =
                    "../../auth/role-selection/index.html";

            }
        );

    }


    /* ===================================================
       NORMALIZE TEXT
    =================================================== */

    function normalizeText(value) {

        return String(value || "")
            .toLowerCase()
            .trim();

    }


    /* ===================================================
       CAPITALIZE
    =================================================== */

    function capitalize(value) {

        if (!value) return "";

        return (
            value.charAt(0).toUpperCase() +
            value.slice(1)
        );

    }


    /* ===================================================
       GET APPLICATION DATA
    =================================================== */

    function getApplicationData(item) {

        return {

            status:
                normalizeText(
                    item.dataset.status
                ),

            title:
                normalizeText(
                    item.dataset.title
                ),

            company:
                normalizeText(
                    item.dataset.company
                )

        };

    }


    /* ===================================================
       STATUS MATCH
    =================================================== */

    function matchesStatus(item) {

        if (
            currentStatus === "all"
        ) {

            return true;

        }


        const data =
            getApplicationData(item);


        return (
            data.status ===
            currentStatus
        );

    }


    /* ===================================================
       SEARCH MATCH
    =================================================== */

    function matchesSearch(item) {

        if (!currentSearch) {
            return true;
        }


        const data =
            getApplicationData(item);


        return (
            data.title.includes(
                currentSearch
            ) ||

            data.company.includes(
                currentSearch
            )

        );

    }


    /* ===================================================
       RENDER APPLICATIONS
    =================================================== */

    function renderApplications() {

        const visibleApplications =
            applicationItems.filter(
                item => {

                    return (
                        matchesStatus(item) &&
                        matchesSearch(item)
                    );

                }
            );


        /*
         * Hide everything first.
         */

        applicationItems.forEach(
            item => {

                item.style.display =
                    "none";

            }
        );


        /*
         * Show matching applications.
         */

        visibleApplications.forEach(
            (item, index) => {

                item.style.display =
                    "flex";

                item.style.animation =
                    "none";


                requestAnimationFrame(
                    () => {

                        item.style.animation =
                            `applicationItemIn .35s ease ${index * 45}ms both`;

                    }
                );

            }
        );


        /* =================================================
           COUNT
        ================================================= */

        if (applicationCount) {

            applicationCount.textContent =
                `${visibleApplications.length} ${
                    visibleApplications.length === 1
                        ? "application"
                        : "applications"
                }`;

        }


        /* =================================================
           EMPTY STATE
        ================================================= */

        if (emptyState) {

            emptyState.classList.toggle(
                "visible",
                visibleApplications.length === 0
            );

        }

    }


    /* ===================================================
       FILTER BUTTONS
    =================================================== */

    filterButtons.forEach(
        button => {

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


                    currentStatus =
                        normalizeText(
                            button.dataset.status
                        );


                    renderApplications();

                }
            );

        }
    );


    /* ===================================================
       SEARCH
    =================================================== */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            () => {

                currentSearch =
                    normalizeText(
                        searchInput.value
                    );


                renderApplications();

            }
        );

    }


    /* ===================================================
       APPLICATION ACTION
    =================================================== */

    actionButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();


                    const item =
                        button.closest(
                            ".application-item"
                        );

                    if (!item) return;


                    const title =
                        item.dataset.title ||
                        button.dataset.application ||
                        "Application";


                    const company =
                        item.dataset.company ||
                        "Company";


                    const status =
                        item.dataset.status ||
                        "review";


                    showApplicationToast(
                        title,
                        company,
                        status
                    );

                }
            );

        }
    );


    /* ===================================================
       APPLICATION CARD CLICK
    =================================================== */

    applicationItems.forEach(
        item => {

            item.setAttribute(
                "tabindex",
                "0"
            );


            item.addEventListener(
                "click",
                event => {

                    /*
                     * Do not open the preview
                     * if the arrow button was clicked.
                     */

                    if (
                        event.target.closest(
                            ".application-action"
                        )
                    ) {

                        return;

                    }


                    const title =
                        item.dataset.title ||
                        "Application";


                    const company =
                        item.dataset.company ||
                        "Company";


                    const status =
                        item.dataset.status ||
                        "review";


                    showApplicationToast(
                        title,
                        company,
                        status
                    );

                }
            );


            item.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key === "Enter"
                    ) {

                        item.click();

                    }

                }
            );

        }
    );


    /* ===================================================
       APPLICATION TOAST
    =================================================== */

    function showApplicationToast(
        title,
        company,
        status
    ) {

        /*
         * Remove previous toast.
         */

        const oldToast =
            document.querySelector(
                ".application-detail-toast"
            );


        if (oldToast) {
            oldToast.remove();
        }


        const toast =
            document.createElement(
                "div"
            );


        toast.className =
            "application-detail-toast";


        toast.innerHTML = `

            <div class="toast-icon">

                <i class="fa-solid fa-layer-group"></i>

            </div>

            <div class="toast-content">

                <strong>
                    ${title}
                </strong>

                <span>
                    ${company} • Status: ${capitalize(status)}
                </span>

            </div>

            <button
                type="button"
                aria-label="Close"
            >

                <i class="fa-solid fa-xmark"></i>

            </button>

        `;


        document.body.appendChild(
            toast
        );


        requestAnimationFrame(
            () => {

                toast.classList.add(
                    "show"
                );

            }
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


        setTimeout(
            () => {

                if (
                    document.body.contains(
                        toast
                    )
                ) {

                    hideToast(toast);

                }

            },
            4500
        );

    }


    /* ===================================================
       HIDE TOAST
    =================================================== */

    function hideToast(toast) {

        toast.classList.remove(
            "show"
        );


        setTimeout(
            () => {

                if (
                    document.body.contains(
                        toast
                    )
                ) {

                    toast.remove();

                }

            },
            250
        );

    }


    /* ===================================================
       PIPELINE INTERACTION
    =================================================== */

    const pipelineSteps =
        document.querySelectorAll(
            ".pipeline-step"
        );


    pipelineSteps.forEach(
        step => {

            step.addEventListener(
                "click",
                () => {

                    /*
                     * The pipeline is currently
                     * a visual overview.
                     *
                     * Backend-driven filtering will
                     * be connected later.
                     */

                    const label =
                        step.querySelector(
                            "strong"
                        )?.textContent.trim();


                    if (!label) return;


                    if (
                        label === "Applied"
                    ) {

                        setFilter("all");

                        return;

                    }


                    if (
                        label === "Reviewed"
                    ) {

                        setFilter("review");

                        return;

                    }


                    if (
                        label === "Interview"
                    ) {

                        setFilter("interview");

                        return;

                    }


                    if (
                        label === "Offer"
                    ) {

                        setFilter("offer");

                    }

                }
            );


            step.style.cursor =
                "pointer";

        }
    );


    /* ===================================================
       SET FILTER PROGRAMMATICALLY
    =================================================== */

    function setFilter(status) {

        currentStatus =
            status;


        filterButtons.forEach(
            button => {

                button.classList.toggle(
                    "active",
                    normalizeText(
                        button.dataset.status
                    ) === status
                );

            }
        );


        renderApplications();


        const list =
            document.querySelector(
                ".application-list-card"
            );


        if (list) {

            list.scrollIntoView({
                behavior:"smooth",
                block:"start"
            });

        }

    }


    /* ===================================================
       ANIMATION
    =================================================== */

    const intro =
        document.querySelector(
            ".applications-intro"
        );

    const stats =
        document.querySelector(
            ".application-stats"
        );

    const pipeline =
        document.querySelector(
            ".pipeline-card"
        );

    const toolbar =
        document.querySelector(
            ".applications-toolbar"
        );


    function revealElement(
        element,
        delay = 0
    ) {

        if (!element) return;


        element.animate(

            [
                {
                    opacity:0,
                    transform:
                        "translateY(16px)"
                },

                {
                    opacity:1,
                    transform:
                        "translateY(0)"
                }

            ],

            {
                duration:600,
                delay,
                easing:
                    "cubic-bezier(.22,1,.36,1)",
                fill:"forwards"
            }

        );

    }


    revealElement(
        intro,
        0
    );


    revealElement(
        stats,
        100
    );


    revealElement(
        pipeline,
        180
    );


    revealElement(
        toolbar,
        260
    );


    /* ===================================================
       STAT CARD ANIMATION
    =================================================== */

    const statCards =
        document.querySelectorAll(
            ".stat-card"
        );


    statCards.forEach(
        (card, index) => {

            card.animate(

                [
                    {
                        opacity:0,
                        transform:
                            "translateY(12px)"
                    },

                    {
                        opacity:1,
                        transform:
                            "translateY(0)"
                    }

                ],

                {
                    duration:500,
                    delay:
                        150 + index * 70,
                    easing:"ease-out",
                    fill:"forwards"
                }

            );

        }
    );


    /* ===================================================
       REDUCED MOTION
    =================================================== */

    if (
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {

        document
            .querySelectorAll("*")
            .forEach(
                element => {

                    element
                        .getAnimations()
                        .forEach(
                            animation => {

                                animation.cancel();

                            }
                        );

                }
            );

    }


    /* ===================================================
       INITIAL RENDER
    =================================================== */

    renderApplications();


    /* ===================================================
       COMPLETE
    =================================================== */

    console.log(
        "DevRecruit AI Applications loaded successfully."
    );

});