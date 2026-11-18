/* =======================================================
   DEVRECRUIT AI
   AI SKILL PROFILE
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

    const navItems =
        document.querySelectorAll(
            ".sidebar-navigation .nav-item"
        );

    const filterButton =
        document.querySelector("#skillFilterButton");

    const progressBars =
        document.querySelectorAll(
            ".skill-progress-item .progress-track span"
        );


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


    /* ===================================================
       ESCAPE KEY
    =================================================== */

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


    /* ===================================================
       NAVIGATION
    =================================================== */

    navItems.forEach(item => {

        item.addEventListener(
            "click",
            () => {

                navItems.forEach(nav => {

                    nav.classList.remove("active");

                });

                item.classList.add("active");


                if (window.innerWidth <= 900) {

                    closeSidebar();

                }

            }
        );

    });


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
                 * Real authentication/session cleanup
                 * will be connected when the backend
                 * authentication system is implemented.
                 */

                window.location.href =
                    "../../auth/role-selection/index.html";

            }
        );

    }


    /* ===================================================
       SKILL PROGRESS ANIMATION
    =================================================== */

    progressBars.forEach(bar => {

        const finalWidth =
            bar.style.width;

        bar.style.width = "0%";

        bar.style.transition =
            "width 1.2s cubic-bezier(.22,1,.36,1)";


        setTimeout(() => {

            bar.style.width =
                finalWidth;

        }, 250);

    });


    /* ===================================================
       SCORE RING ANIMATION
    =================================================== */

    const scoreRing =
        document.querySelector(
            ".skill-score-ring"
        );


    if (scoreRing) {

        scoreRing.animate(

            [
                {
                    transform:"scale(.82)",
                    opacity:.25
                },

                {
                    transform:"scale(1)",
                    opacity:1
                }
            ],

            {
                duration:800,

                easing:"cubic-bezier(.22,1,.36,1)",

                fill:"forwards"

            }

        );

    }


    /* ===================================================
       STAT CARD ANIMATION
    =================================================== */

    const statCards =
        document.querySelectorAll(
            ".skill-stat-card"
        );


    statCards.forEach(
        (card, index) => {

            card.animate(

                [
                    {
                        opacity:0,
                        transform:"translateY(25px)"
                    },

                    {
                        opacity:1,
                        transform:"translateY(0)"
                    }
                ],

                {
                    duration:550,

                    delay:150 + index * 100,

                    easing:"ease-out",

                    fill:"forwards"

                }

            );

        }
    );


    /* ===================================================
       CATEGORY CARD ANIMATION
    =================================================== */

    const categoryCards =
        document.querySelectorAll(
            ".skill-category-card"
        );


    categoryCards.forEach(
        (card, index) => {

            card.animate(

                [
                    {
                        opacity:0,
                        transform:"translateY(25px)"
                    },

                    {
                        opacity:1,
                        transform:"translateY(0)"
                    }
                ],

                {
                    duration:550,

                    delay:300 + index * 100,

                    easing:"ease-out",

                    fill:"forwards"

                }

            );

        }
    );


    /* ===================================================
       FILTER BUTTON
    =================================================== */

    if (filterButton) {

        filterButton.addEventListener(
            "click",
            () => {

                const currentText =
                    filterButton.childNodes[2];

                /*
                 * Temporary frontend interaction.
                 *
                 * Later this will become a real
                 * filter dropdown connected to
                 * backend skill categories.
                 */

                const categories = [
                    "All Skills",
                    "Programming",
                    "AI & ML",
                    "Database",
                    "Cloud & DevOps"
                ];


                let currentIndex =
                    Number(
                        filterButton.dataset.index || 0
                    );


                currentIndex =
                    (currentIndex + 1)
                    % categories.length;


                filterButton.dataset.index =
                    currentIndex;


                if (currentText) {

                    currentText.textContent =
                        ` ${categories[currentIndex]} `;

                }

            }
        );

    }


    /* ===================================================
       INTERSECTION ANIMATION
    =================================================== */

    const insightCards =
        document.querySelectorAll(
            ".insight-card"
        );

    const evidenceItems =
        document.querySelectorAll(
            ".evidence-item"
        );


    const revealItems = [
        ...insightCards,
        ...evidenceItems
    ];


    revealItems.forEach(item => {

        item.style.opacity = "0";

        item.style.transform =
            "translateY(20px)";

    });


    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (!entry.isIntersecting) {
                            return;
                        }


                        entry.target.animate(

                            [
                                {
                                    opacity:0,
                                    transform:
                                        "translateY(20px)"
                                },

                                {
                                    opacity:1,
                                    transform:
                                        "translateY(0)"
                                }
                            ],

                            {
                                duration:500,

                                easing:"ease-out",

                                fill:"forwards"
                            }

                        );


                        observer.unobserve(
                            entry.target
                        );

                    });

                },

                {
                    threshold:0.12
                }

            );


        revealItems.forEach(item => {

            observer.observe(item);

        });

    } else {

        revealItems.forEach(item => {

            item.style.opacity = "1";

            item.style.transform =
                "translateY(0)";

        });

    }


    /* ===================================================
       RESPONSIVE CLEANUP
    =================================================== */

    window.addEventListener(
        "resize",
        () => {

            if (window.innerWidth > 900) {

                closeSidebar();

            }

        }
    );

});