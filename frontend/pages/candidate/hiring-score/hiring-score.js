/* =======================================================
   DEVRECRUIT AI
   AI HIRING SCORE
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

    const scoreCircle =
        document.querySelector(".score-circle");

    const scoreNumber =
        document.querySelector(".score-circle-inner strong");

    const factorBars =
        document.querySelectorAll(
            ".factor-progress span"
        );

    const roleBars =
        document.querySelectorAll(
            ".role-progress span"
        );

    const rankingBar =
        document.querySelector(
            ".ranking-progress span"
        );

    const improvementItems =
        document.querySelectorAll(
            ".improvement-item"
        );

    const cards =
        document.querySelectorAll(
            ".main-score-card, " +
            ".ranking-card, " +
            ".match-card, " +
            ".factor-item, " +
            ".role-item, " +
            ".improvement-item"
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
                 *
                 * Real session/token cleanup
                 * will be connected with the backend
                 * authentication system later.
                 */

                window.location.href =
                    "../../auth/role-selection/index.html";

            }
        );

    }


    /* ===================================================
       SCORE ANIMATION
    =================================================== */

    function animateScore() {

        if (!scoreNumber) return;

        const targetScore = 91;

        const duration = 1600;

        const startTime =
            performance.now();


        function updateScore(currentTime) {

            const elapsed =
                currentTime - startTime;

            const progress =
                Math.min(
                    elapsed / duration,
                    1
                );


            /*
             * Smooth ease-out animation.
             */

            const eased =
                1 -
                Math.pow(
                    1 - progress,
                    3
                );


            const currentScore =
                Math.floor(
                    eased * targetScore
                );


            scoreNumber.textContent =
                currentScore;


            if (progress < 1) {

                requestAnimationFrame(
                    updateScore
                );

            } else {

                scoreNumber.textContent =
                    targetScore;

            }

        }


        requestAnimationFrame(
            updateScore
        );

    }


    /* ===================================================
       SCORE CIRCLE ENTRY
    =================================================== */

    if (scoreCircle) {

        scoreCircle.animate(

            [
                {
                    opacity:0,

                    transform:
                        "scale(.78) rotate(-25deg)"
                },

                {
                    opacity:1,

                    transform:
                        "scale(1) rotate(0deg)"
                }

            ],

            {
                duration:900,

                easing:
                    "cubic-bezier(.22,1,.36,1)",

                fill:"forwards"

            }

        );

    }


    setTimeout(
        animateScore,
        300
    );


    /* ===================================================
       PROGRESS BAR ANIMATION
    =================================================== */

    function animateProgressBars() {

        factorBars.forEach(
            bar => {

                const targetWidth =
                    bar.style.width;

                bar.style.width =
                    "0%";

                bar.style.transition =
                    "width 1.2s cubic-bezier(.22,1,.36,1)";


                setTimeout(() => {

                    bar.style.width =
                        targetWidth;

                }, 150);

            }
        );


        roleBars.forEach(
            bar => {

                const targetWidth =
                    bar.style.width;

                bar.style.width =
                    "0%";

                bar.style.transition =
                    "width 1.2s cubic-bezier(.22,1,.36,1)";


                setTimeout(() => {

                    bar.style.width =
                        targetWidth;

                }, 250);

            }
        );


        if (rankingBar) {

            const targetWidth =
                rankingBar.style.width;

            rankingBar.style.width =
                "0%";

            rankingBar.style.transition =
                "width 1.3s cubic-bezier(.22,1,.36,1)";


            setTimeout(() => {

                rankingBar.style.width =
                    targetWidth;

            }, 350);

        }

    }


    animateProgressBars();


    /* ===================================================
       CARD ENTRY ANIMATION
    =================================================== */

    cards.forEach(
        (card, index) => {

            card.style.opacity =
                "0";

            card.style.transform =
                "translateY(22px)";


            card.animate(

                [
                    {
                        opacity:0,

                        transform:
                            "translateY(22px)"
                    },

                    {
                        opacity:1,

                        transform:
                            "translateY(0)"
                    }

                ],

                {
                    duration:600,

                    delay:
                        150 + index * 65,

                    easing:"ease-out",

                    fill:"forwards"

                }

            );

        }
    );


    /* ===================================================
       IMPROVEMENT ITEM INTERACTION
    =================================================== */

    improvementItems.forEach(
        item => {

            item.addEventListener(
                "click",
                () => {

                    improvementItems.forEach(
                        other => {

                            other.classList.remove(
                                "selected"
                            );

                        }
                    );


                    item.classList.add(
                        "selected"
                    );

                }
            );

        }
    );


    /* ===================================================
       ROLE HOVER INTELLIGENCE
    =================================================== */

    const roleItems =
        document.querySelectorAll(
            ".role-item"
        );


    roleItems.forEach(
        role => {

            role.addEventListener(
                "mouseenter",
                () => {

                    role.classList.add(
                        "role-highlight"
                    );

                }
            );


            role.addEventListener(
                "mouseleave",
                () => {

                    role.classList.remove(
                        "role-highlight"
                    );

                }
            );

        }
    );


    /* ===================================================
       SCROLL REVEAL
    =================================================== */

    const revealElements =
        document.querySelectorAll(
            ".factor-card, " +
            ".role-match-card, " +
            ".improvement-card"
        );


    if (
        "IntersectionObserver"
        in window
    ) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                !entry.isIntersecting
                            ) {

                                return;

                            }


                            entry.target.animate(

                                [
                                    {
                                        opacity:0,

                                        transform:
                                            "translateY(25px)"
                                    },

                                    {
                                        opacity:1,

                                        transform:
                                            "translateY(0)"
                                    }

                                ],

                                {
                                    duration:600,

                                    easing:"ease-out",

                                    fill:"forwards"

                                }

                            );


                            observer.unobserve(
                                entry.target
                            );

                        }
                    );

                },

                {
                    threshold:.12
                }

            );


        revealElements.forEach(
            element => {

                observer.observe(
                    element
                );

            }
        );

    }


    /* ===================================================
       RESPONSIVE SIDEBAR
    =================================================== */

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth > 900
            ) {

                closeSidebar();

            }

        }
    );


    /* ===================================================
       ACCESSIBILITY
    =================================================== */

    document
        .querySelectorAll(
            ".role-item, .improvement-item"
        )
        .forEach(
            element => {

                element.setAttribute(
                    "tabindex",
                    "0"
                );


                element.addEventListener(
                    "keydown",
                    event => {

                        if (
                            event.key === "Enter" ||
                            event.key === " "
                        ) {

                            event.preventDefault();

                            element.click();

                        }

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

        cards.forEach(card => {

            card.getAnimations()
                .forEach(animation => {

                    animation.cancel();

                });

            card.style.opacity = "1";

            card.style.transform =
                "none";

        });


        if (scoreNumber) {

            scoreNumber.textContent =
                "91";

        }


        factorBars.forEach(
            bar => {

                bar.style.transition =
                    "none";

            }
        );


        roleBars.forEach(
            bar => {

                bar.style.transition =
                    "none";

            }
        );

    }


    /* ===================================================
       INITIAL PAGE STATE
    =================================================== */

    console.log(
        "DevRecruit AI Hiring Score loaded successfully."
    );

});