/* =======================================================
   DEVRECRUIT AI
   CANDIDATE DASHBOARD
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


    /* ===================================================
       MOBILE MENU
    =================================================== */

    if (mobileMenuButton) {

        mobileMenuButton.addEventListener(
            "click",
            openSidebar
        );

    }


    /* ===================================================
       SIDEBAR CLOSE
    =================================================== */

    if (sidebarClose) {

        sidebarClose.addEventListener(
            "click",
            closeSidebar
        );

    }


    /* ===================================================
       OVERLAY CLOSE
    =================================================== */

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

        item.addEventListener("click", () => {

            navItems.forEach(nav => {

                nav.classList.remove("active");

            });

            item.classList.add("active");

            /*
             * Close mobile navigation after
             * selecting a page.
             */

            if (
                window.innerWidth <= 900
            ) {

                closeSidebar();

            }

        });

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
                 * Backend session/token cleanup
                 * will be added during authentication
                 * integration.
                 */

                window.location.href =
                    "../../auth/role-selection/index.html";

            }
        );

    }


    /* ===================================================
       RESIZE HANDLING
    =================================================== */

    window.addEventListener(
        "resize",
        () => {

            if (window.innerWidth > 900) {

                if (sidebarOverlay) {
                    sidebarOverlay.classList.remove(
                        "active"
                    );
                }

                if (sidebar) {
                    sidebar.classList.remove(
                        "open"
                    );
                }

                document.body.style.overflow = "";

            }

        }
    );


    /* ===================================================
       KEYBOARD NAVIGATION
    =================================================== */

    navItems.forEach(item => {

        item.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    item.click();

                }

            }
        );

    });


    /* ===================================================
       DASHBOARD ENTRY ANIMATION
    =================================================== */

    const animatedElements =
        document.querySelectorAll(
            ".kpi-card, .dashboard-card, .welcome-section"
        );


    animatedElements.forEach(
        (element, index) => {

            element.animate(

                [
                    {
                        opacity:0,
                        transform:"translateY(18px)"
                    },
                    {
                        opacity:1,
                        transform:"translateY(0)"
                    }
                ],

                {
                    duration:450,
                    delay:index * 70,
                    easing:"ease-out",
                    fill:"forwards"
                }

            );

        }
    );


    /* ===================================================
       PROGRESS BAR ENTRY
    =================================================== */

    const progressBars =
        document.querySelectorAll(
            ".progress-fill"
        );


    progressBars.forEach(bar => {

        const finalWidth =
            bar.style.width;

        bar.style.width = "0";


        requestAnimationFrame(() => {

            setTimeout(() => {

                bar.style.width =
                    finalWidth;

            }, 300);

        });

    });


    /* ===================================================
       SCORE RING ENTRY
    =================================================== */

    const scoreRing =
        document.querySelector(".score-ring");


    if (scoreRing) {

        scoreRing.animate(

            [
                {
                    transform:"scale(.85)",
                    opacity:.3
                },
                {
                    transform:"scale(1)",
                    opacity:1
                }
            ],

            {
                duration:700,
                easing:"ease-out",
                fill:"forwards"
            }

        );

    }

});