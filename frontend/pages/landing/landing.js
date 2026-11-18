/* =======================================================
   LANDING PAGE
======================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================
       HERO ENTRY ANIMATION
    ===================================== */

    const hero = document.querySelector(".hero");

    if (hero) {

        hero.animate(
            [
                {
                    opacity: 0,
                    transform: "translateY(80px)"
                },
                {
                    opacity: 1,
                    transform: "translateY(0)"
                }
            ],
            {
                duration: 1200,
                easing: "ease-out",
                fill: "forwards"
            }
        );

    }


    /* =====================================
       HERO STAT CARD ANIMATION
    ===================================== */

    const stats = document.querySelectorAll(".stat-card");

    stats.forEach((card, index) => {

        card.animate(
            [
                {
                    opacity: 0,
                    transform: "translateY(40px)"
                },
                {
                    opacity: 1,
                    transform: "translateY(0)"
                }
            ],
            {
                duration: 800,
                delay: index * 200,
                fill: "forwards"
            }
        );

    });


    /* =====================================
       FLOATING CARD ANIMATION
    ===================================== */

    const floatingCards =
        document.querySelectorAll(".floating-card");

    floatingCards.forEach((card, index) => {

        card.style.animationDelay = `${index}s`;

    });


    /* =====================================
       COMPANY SLIDER
    ===================================== */

    const slider =
        document.querySelector(".company-track");

    if (slider) {

        slider.addEventListener("mouseenter", () => {

            slider.style.animationPlayState = "paused";

        });

        slider.addEventListener("mouseleave", () => {

            slider.style.animationPlayState = "running";

        });

    }


    /* =====================================
       PLATFORM COUNTERS
    ===================================== */

    const counters =
        document.querySelectorAll(".counter");

    counters.forEach(counter => {

        const target =
            Number(counter.dataset.target);

        let current = 0;

        const duration = 2000;

        const increment =
            target / (duration / 16);

        function updateCounter() {

            current += increment;

            if (current < target) {

                counter.innerText =
                    Math.floor(current);

                requestAnimationFrame(
                    updateCounter
                );

            } else {

                counter.innerText = target;

            }

        }

        updateCounter();

    });


    /* =====================================
       FEATURE CARD ANIMATION
    ===================================== */

    const featureCards =
        document.querySelectorAll(".feature-card");

    featureCards.forEach((card, index) => {

        card.animate(
            [
                {
                    opacity: 0,
                    transform: "translateY(50px)"
                },
                {
                    opacity: 1,
                    transform: "translateY(0)"
                }
            ],
            {
                duration: 700,
                delay: index * 120,
                fill: "forwards"
            }
        );

    });


    /* =====================================
       WORKFLOW CARD ANIMATION
    ===================================== */

    const workflowCards =
        document.querySelectorAll(".workflow-card");

    workflowCards.forEach((card, index) => {

        card.animate(
            [
                {
                    opacity: 0,
                    transform: "translateY(60px)"
                },
                {
                    opacity: 1,
                    transform: "translateY(0)"
                }
            ],
            {
                duration: 800,
                delay: index * 180,
                fill: "forwards"
            }
        );

    });


    /* =====================================
       AI DASHBOARD ANIMATION
    ===================================== */

    const aiDashboard =
        document.querySelector(".ai-dashboard");

    if (aiDashboard) {

        aiDashboard.animate(
            [
                {
                    opacity: 0,
                    transform: "translateX(80px)"
                },
                {
                    opacity: 1,
                    transform: "translateX(0)"
                }
            ],
            {
                duration: 1000,
                fill: "forwards"
            }
        );

    }


    /* =====================================
       BLOCKCHAIN CARD ANIMATION
    ===================================== */

    const certificateCard =
        document.querySelector(".certificate-card");

    if (certificateCard) {

        certificateCard.animate(
            [
                {
                    opacity: 0,
                    transform: "translateX(80px)"
                },
                {
                    opacity: 1,
                    transform: "translateX(0)"
                }
            ],
            {
                duration: 1000,
                fill: "forwards"
            }
        );

    }


    /* =====================================
       CANDIDATE DASHBOARD ANIMATION
    ===================================== */

    const candidateDashboard =
        document.querySelector(".candidate-dashboard");

    if (candidateDashboard) {

        candidateDashboard.animate(
            [
                {
                    opacity: 0,
                    transform: "translateX(80px)"
                },
                {
                    opacity: 1,
                    transform: "translateX(0)"
                }
            ],
            {
                duration: 1000,
                fill: "forwards"
            }
        );

    }


    /* =====================================
       RECRUITER DASHBOARD ANIMATION
    ===================================== */

    const recruiterDashboard =
        document.querySelector(".recruiter-dashboard");

    if (recruiterDashboard) {

        recruiterDashboard.animate(
            [
                {
                    opacity: 0,
                    transform: "translateX(-80px)"
                },
                {
                    opacity: 1,
                    transform: "translateX(0)"
                }
            ],
            {
                duration: 1000,
                fill: "forwards"
            }
        );

    }


    /* =====================================
       FAQ ACCORDION
    ===================================== */

    const faqItems =
        document.querySelectorAll(".faq-item");

    faqItems.forEach(item => {

        const question =
            item.querySelector(".faq-question");

        question.addEventListener("click", () => {

            const isActive =
                item.classList.contains("active");

            faqItems.forEach(otherItem => {

                otherItem.classList.remove("active");

            });

            if (!isActive) {

                item.classList.add("active");

            }

        });

    });


    /* =====================================
       CONTACT FORM
    ===================================== */

    const contactForm =
        document.querySelector("#contactForm");

    const contactSuccess =
        document.querySelector("#contactSuccess");

    if (contactForm) {

        contactForm.addEventListener("submit", (event) => {

            event.preventDefault();

            if (contactSuccess) {

                contactSuccess.classList.add("show");

            }

            contactForm.reset();

        });

    }

});