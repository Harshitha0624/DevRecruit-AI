

"use strict";

/* ============================================================
   DEVRECRUIT AI - LEARNING HUB
   API-driven course catalogue and course navigation
============================================================ */

const LEARNING_API = "http://127.0.0.1:8000/api/learning-hub";

let learningResources = [];
let activeCategory = "all";


/* ============================================================
   INITIALIZATION
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    initializeSidebar();
    initializeCourseFilters();
    initializeCourseSearch();
    initializeLearningActions();
    initializeLogout();
    setActiveNavigation();

    loadLearningResources();
    loadLearningStats();

});


/* ============================================================
   AUTHENTICATION
============================================================ */

function getLearningToken() {

    return (
        sessionStorage.getItem("devrecruit_candidate_token") ||
        sessionStorage.getItem("access_token") ||
        localStorage.getItem("access_token") ||
        localStorage.getItem("token")
    );

}


/* ============================================================
   API REQUEST
============================================================ */

async function learningApiRequest(path = "", options = {}) {

    const token = getLearningToken();

    if (!token) {
        throw new Error(
            "Login session not found. Please log in again."
        );
    }

    const response = await fetch(
        `${LEARNING_API}${path}`,
        {
            ...options,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                ...(options.headers || {})
            }
        }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {

        throw new Error(
            typeof data.detail === "string"
                ? data.detail
                : `Learning API error: ${response.status}`
        );

    }

    return data;

}


/* ============================================================
   SIDEBAR
============================================================ */

function initializeSidebar() {

    const sidebar =
        document.getElementById("candidateSidebar");

    const overlay =
        document.getElementById("sidebarOverlay");

    const menuButton =
        document.getElementById("mobileMenuButton");

    const closeButton =
        document.getElementById("sidebarClose");

    if (!sidebar || !overlay) return;


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


    menuButton?.addEventListener("click", openSidebar);

    closeButton?.addEventListener("click", closeSidebar);

    overlay.addEventListener("click", closeSidebar);


    document.querySelectorAll(
        ".candidate-sidebar .nav-item"
    ).forEach(item => {

        item.addEventListener("click", () => {

            if (window.innerWidth <= 900) {
                closeSidebar();
            }

        });

    });


    window.addEventListener("resize", () => {

        if (window.innerWidth > 900) {
            closeSidebar();
        }

    });

}


/* ============================================================
   CATEGORY FILTERS
============================================================ */

function initializeCourseFilters() {

    document.querySelectorAll(
        ".learning-tab"
    ).forEach(tab => {

        tab.addEventListener("click", () => {

            document.querySelectorAll(
                ".learning-tab"
            ).forEach(item => {
                item.classList.remove("active");
            });

            tab.classList.add("active");

            activeCategory =
                tab.dataset.category || "all";

            renderLearningResources();

        });

    });

}


/* ============================================================
   COURSE SEARCH
============================================================ */

function initializeCourseSearch() {

    const searchInput =
        document.getElementById("courseSearch");

    searchInput?.addEventListener(
        "input",
        renderLearningResources
    );

}


/* ============================================================
   SAFE TEXT
============================================================ */

function learningText(value, fallback = "") {

    if (value === null || value === undefined) {
        return fallback;
    }

    return String(value);

}


/* ============================================================
   CREATE HTML ELEMENT
============================================================ */

function createLearningElement(
    tag,
    className = "",
    text = ""
) {

    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (text !== "") {
        element.textContent = text;
    }

    return element;

}


/* ============================================================
   CATEGORY MATCHING
============================================================ */

function normalizeCategory(value) {

    return learningText(value)
        .toLowerCase()
        .replace(/[_-]/g, " ")
        .trim();

}


function matchesLearningCategory(resource) {

    if (
        activeCategory === "all" ||
        activeCategory === ""
    ) {
        return true;
    }

    const selected = normalizeCategory(activeCategory);

    const category = normalizeCategory(resource.category);
    const subcategory = normalizeCategory(resource.subcategory);
    const skill = normalizeCategory(resource.skill);
    const platform = normalizeCategory(resource.platform);

    const combined = [
        category,
        subcategory,
        skill,
        platform
    ].join(" ");

    // Match the actual categories used by the Learning Hub.
    const aliases = {
        "learn by skill": ["learn by skill", "skill"],
        "backend": ["backend", "api", "server"],
        "frontend": ["frontend", "web development"],
        "ai ml": ["artificial intelligence", "machine learning", "ai ml"],
        "artificial intelligence": ["artificial intelligence", "machine learning", "ai"],
        "cloud": ["cloud", "aws", "azure", "deployment"],
        "programming": ["programming", "python", "java", "coding"]
    };

    const terms = aliases[selected] || [selected];

    return terms.some(term => combined.includes(term));

}


/* ============================================================
   COURSE SEARCH MATCHING
============================================================ */

function matchesLearningSearch(resource, searchTerm) {

    if (!searchTerm) return true;

    const searchable = [
        resource.title,
        resource.description,
        resource.category,
        resource.subcategory,
        resource.skill,
        resource.company,
        resource.platform,
        resource.level,
        resource.access_type
    ]
        .map(value => learningText(value))
        .join(" ")
        .toLowerCase();

    return searchable.includes(searchTerm);

}


/* ============================================================
   LOAD COURSES FROM BACKEND
============================================================ */

async function loadLearningResources() {

    const grid =
        document.getElementById("courseGrid");

    if (!grid) {
        console.error("Course grid #courseGrid was not found.");
        return;
    }

    grid.replaceChildren(
        createLearningElement(
            "p",
            "course-loading",
            "Loading courses from DevRecruit AI..."
        )
    );

    try {

        const data = await learningApiRequest("");

        if (Array.isArray(data)) {

            learningResources = data;

        } else if (Array.isArray(data.resources)) {

            learningResources = data.resources;

        } else if (Array.isArray(data.items)) {

            learningResources = data.items;

        } else if (Array.isArray(data.results)) {

            learningResources = data.results;

        } else {

            learningResources = [];

        }

        renderLearningResources();

        console.log(
            `Learning Hub loaded ${learningResources.length} courses.`
        );

    } catch (error) {

        console.error(
            "Learning Hub loading failed:",
            error
        );

        grid.replaceChildren();

        const errorElement = createLearningElement(
            "p",
            "course-error",
            error.message
        );

        grid.appendChild(errorElement);

        updateLearningCourseCount(0);

        const emptyState =
            document.getElementById("courseEmpty");

        if (emptyState) {
            emptyState.style.display = "none";
        }

    }

}


/* ============================================================
   CREATE COURSE CARD
============================================================ */

function createCourseCard(resource) {

    const card = createLearningElement(
        "article",
        "course-card"
    );

    const category = normalizeCategory(resource.category);

    card.dataset.category = category;
    card.dataset.title = learningText(resource.title);


    // HEADER

    const header = createLearningElement(
        "div",
        "course-header"
    );

    const categoryBadge = createLearningElement(
        "span",
        "course-category",
        learningText(resource.category, "Learning")
    );

    const accessBadge = createLearningElement(
        "span",
        "course-access",
        learningText(resource.access_type, "Check provider")
    );

    header.append(
        categoryBadge,
        accessBadge
    );


    // TITLE

    const title = createLearningElement(
        "h3",
        "course-title",
        learningText(resource.title, "Untitled Course")
    );


    // DESCRIPTION

    const description = createLearningElement(
        "p",
        "course-description",
        learningText(
            resource.description,
            "Explore this learning resource."
        )
    );


    // COURSE DETAILS

    const meta = createLearningElement(
        "div",
        "course-meta"
    );

    const platform = createLearningElement(
        "span",
        "course-platform",
        learningText(resource.platform, "Online platform")
    );

    const duration = createLearningElement(
        "span",
        "course-duration",
        learningText(resource.duration, "Self-paced")
    );

    const level = createLearningElement(
        "span",
        "course-level",
        learningText(resource.level, "All levels")
    );

    meta.append(
        platform,
        duration,
        level
    );


    // FOOTER

    const footer = createLearningElement(
        "div",
        "course-footer"
    );

    const button = createLearningElement(
        "button",
        "course-button",
        "Start Learning"
    );

    button.type = "button";

    button.addEventListener("click", () => {

        openLearningCourse(resource, button);

    });

    footer.appendChild(button);


    card.append(
        header,
        title,
        description,
        meta,
        footer
    );

    return card;

}


/* ============================================================
   OPEN INTERNAL COURSE PAGE
============================================================ */

function openLearningCourse(resource, button) {

    if (!resource || resource.id === undefined || resource.id === null) {

        showToast(
            "Course unavailable",
            "This course does not have a valid database ID.",
            "fa-solid fa-circle-exclamation"
        );

        return;

    }

    const courseId = String(resource.id);

    if (!/^\d+$/.test(courseId)) {

        showToast(
            "Invalid course",
            "The course ID returned by the backend is invalid.",
            "fa-solid fa-circle-exclamation"
        );

        return;

    }

    button.disabled = true;
    button.textContent = "Opening...";

    const coursePage = new URL(
        "course.html",
        window.location.href
    );

    coursePage.searchParams.set("id", courseId);

    window.location.href = coursePage.href;

}


/* ============================================================
   RENDER COURSE CATALOGUE
============================================================ */

function renderLearningResources() {

    const grid =
        document.getElementById("courseGrid");

    const search =
        document.getElementById("courseSearch");

    const empty =
        document.getElementById("courseEmpty");

    if (!grid) return;

    const searchTerm = (
        search?.value || ""
    ).trim().toLowerCase();


    const filteredResources = learningResources.filter(
        resource => {

            return (
                matchesLearningCategory(resource) &&
                matchesLearningSearch(resource, searchTerm)
            );

        }
    );


    grid.replaceChildren();


    filteredResources.forEach(resource => {

        const card = createCourseCard(resource);

        grid.appendChild(card);

    });


    updateLearningCourseCount(filteredResources.length);


    if (empty) {

        empty.style.display =
            filteredResources.length === 0
                ? "block"
                : "none";

        if (filteredResources.length === 0) {

            empty.textContent =
                learningResources.length === 0
                    ? "No published courses are currently available."
                    : "No courses match your search or selected category.";

        }

    }


}


/* ============================================================
   UPDATE COURSE COUNT
============================================================ */

function updateLearningCourseCount(count) {

    const countElement =
        document.getElementById("courseCount");

    if (!countElement) return;

    countElement.textContent = String(count);

}


/* ============================================================
   CONTINUE LEARNING
============================================================ */

function initializeLearningActions() {

    const continueButton =
        document.getElementById("continueLearning");

    const generatePathButton =
        document.getElementById("generatePath");

    const pathButton =
        document.getElementById("pathButton");

    const goalButton =
        document.getElementById("learningGoalButton");

    const advisorButton =
        document.getElementById("advisorButton");


    continueButton?.addEventListener("click", () => {

        const firstCourse =
            document.querySelector(".course-card");

        if (firstCourse) {

            firstCourse.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            showToast(
                "Learning Hub",
                "Choose a course to continue learning.",
                "fa-solid fa-book-open"
            );

        } else {

            showToast(
                "No courses available",
                "Courses will appear here when they are loaded.",
                "fa-solid fa-circle-info"
            );

        }

    });


    generatePathButton?.addEventListener(
        "click",
        generateAIPath
    );


    pathButton?.addEventListener("click", () => {

        const currentModule =
            document.querySelector(".path-module.current");

        if (currentModule) {

            currentModule.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }

    });


    goalButton?.addEventListener("click", () => {

        const firstCourse =
            document.querySelector(".course-card");

        if (firstCourse) {

            firstCourse.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }

        showToast(
            "Daily Learning Goal",
            "Complete a lesson to make progress towards your goal.",
            "fa-solid fa-bullseye"
        );

    });


    advisorButton?.addEventListener(
        "click",
        showAIRecommendation
    );

}


/* ============================================================
   AI PATH BUTTON
============================================================ */

function generateAIPath() {

    const button =
        document.getElementById("generatePath");

    if (!button) return;

    showToast(
        "Learning Path",
        "Your existing learning path is available in the dashboard.",
        "fa-solid fa-route"
    );

}


/* ============================================================
   AI ADVISOR
============================================================ */

function showAIRecommendation() {

    showToast(
        "AI Learning Advisor",
        "Explore courses related to your skills and career interests.",
        "fa-solid fa-brain"
    );

}


/* ============================================================
   TOAST NOTIFICATION
============================================================ */

function showToast(
    title,
    message,
    icon = "fa-solid fa-circle-info"
) {

    let toast = document.querySelector(
        ".learning-toast"
    );

    if (!toast) {

        toast = document.createElement("div");

        toast.className = "learning-toast";

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

        document.body.appendChild(toast);

        toast.querySelector("button").addEventListener(
            "click",
            () => hideToast(toast)
        );

    }


    toast.querySelector(
        ".toast-icon i"
    ).className = icon;


    toast.querySelector(
        ".toast-content strong"
    ).textContent = title;


    toast.querySelector(
        ".toast-content span"
    ).textContent = message;


    toast.classList.add("show");

    clearTimeout(toast.hideTimer);

    toast.hideTimer = setTimeout(
        () => hideToast(toast),
        4000
    );

}


/* ============================================================
   HIDE TOAST
============================================================ */

function hideToast(toast) {

    if (!toast) return;

    toast.classList.remove("show");

}


/* ============================================================
   LOGOUT
============================================================ */

function initializeLogout() {

    const logoutButton =
        document.getElementById("logoutButton");

    if (!logoutButton) return;

    logoutButton.addEventListener("click", () => {

        const confirmed = window.confirm(
            "Are you sure you want to sign out?"
        );

        if (!confirmed) return;

        try {

            sessionStorage.clear();

        } catch (error) {

            console.warn(
                "Session storage could not be cleared.",
                error
            );

        }

        try {

            localStorage.removeItem("devrecruit_candidate_token");
            localStorage.removeItem("access_token");
            localStorage.removeItem("token");

        } catch (error) {

            console.warn(
                "Local storage could not be cleared.",
                error
            );

        }

        window.location.href =
            "../../auth/role-selection/index.html";

    });

}


/* ============================================================
   ACTIVE NAVIGATION
============================================================ */

function setActiveNavigation() {

    const currentPage =
        window.location.pathname.toLowerCase();

    document.querySelectorAll(
        ".candidate-sidebar .nav-item"
    ).forEach(item => {

        const href =
            item.getAttribute("href");

        if (!href) return;

        if (
            currentPage.includes("/learning/") &&
            href.toLowerCase().includes("learning")
        ) {

            item.classList.add("active");

        } else if (
            currentPage.includes("/jobs/") &&
            href.toLowerCase().includes("jobs")
        ) {

            item.classList.add("active");

        }

    });

}


/* ============================================================
   LEARNING STATISTICS
   Uses the same authenticated API helper as the course catalogue.
============================================================ */
async function loadLearningStats() {

    const completedElement =
        document.getElementById("completedCourses");

    const inProgressElement =
        document.getElementById("inProgressCourses");

    const notStartedElement =
        document.getElementById("notStartedCourses");

    const overallElement =
        document.getElementById("overallLearningProgress");

    // Do nothing if this page does not contain the statistics section.
    if (
        !completedElement ||
        !inProgressElement ||
        !notStartedElement ||
        !overallElement
    ) {
        return;
    }

    try {
        const result = await learningApiRequest("/my-learning");

        if (!result || result.success !== true) {
            throw new Error("The learning statistics response was unsuccessful.");
        }

        const completed = Number(result.completed ?? 0);
        const inProgress = Number(result.in_progress ?? 0);
        const notStarted = Number(result.not_started ?? 0);
        const overallProgress = Number(result.overall_progress_percent ?? 0);

        completedElement.textContent =
            Number.isFinite(completed) ? String(completed) : "0";

        inProgressElement.textContent =
            Number.isFinite(inProgress) ? String(inProgress) : "0";

        notStartedElement.textContent =
            Number.isFinite(notStarted) ? String(notStarted) : "0";

        overallElement.textContent =
            `${Math.round(Number.isFinite(overallProgress) ? overallProgress : 0)}%`;

    } catch (error) {
        console.error("Learning statistics could not be loaded:", error);
        // Keep the HTML placeholders visible rather than showing fabricated values.
    }

}

/* ============================================================
   END OF LEARNING HUB
============================================================ */
