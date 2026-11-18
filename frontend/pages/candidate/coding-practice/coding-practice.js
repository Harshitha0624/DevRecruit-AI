/* =========================================================
   DEVRECRUIT AI — CODING PRACTICE LAB
   File: coding-practice.js
========================================================= */

"use strict";

/* -------------------- INITIALIZATION -------------------- */

document.addEventListener("DOMContentLoaded", () => {
    initializeSidebar();
    initializeTopicFilters();
    initializeProblemSearch();
    initializeProblemActions();
    initializePracticeActions();
    initializeLogout();
    initializeCodingArena();
    setActiveNavigation();
    applyProblemFilters();
});

/* -------------------- SAFE DOM HELPERS -------------------- */

const getElement = (id) => document.getElementById(id);

function showToast(title, message, icon = "fa-solid fa-circle-info") {
    let toast = document.querySelector(".coding-toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.className = "coding-toast";

        toast.innerHTML = `
            <div class="toast-icon"><i></i></div>
            <div class="toast-content">
                <strong></strong>
                <span></span>
            </div>
            <button type="button" aria-label="Close notification">
                <i class="fa-solid fa-xmark"></i>
            </button>
        `;

        document.body.appendChild(toast);

        toast.querySelector("button").addEventListener("click", () => {
            hideToast(toast);
        });
    }

    const iconElement = toast.querySelector(".toast-icon i");
    const titleElement = toast.querySelector(".toast-content strong");
    const messageElement = toast.querySelector(".toast-content span");

    if (iconElement) iconElement.className = icon;
    if (titleElement) titleElement.textContent = title;
    if (messageElement) messageElement.textContent = message;

    toast.classList.add("show");

    clearTimeout(toast.hideTimer);

    toast.hideTimer = setTimeout(() => {
        hideToast(toast);
    }, 4000);
}

function hideToast(toast) {
    if (toast) toast.classList.remove("show");
}

/* -------------------- SIDEBAR -------------------- */

function initializeSidebar() {
    const sidebar = getElement("candidateSidebar");
    const overlay = getElement("sidebarOverlay");
    const menuButton = getElement("mobileMenuButton");
    const closeButton = getElement("sidebarClose");

    function openSidebar() {
        if (!sidebar || !overlay) return;

        sidebar.classList.add("open");
        overlay.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function closeSidebar() {
        if (!sidebar || !overlay) return;

        sidebar.classList.remove("open");
        overlay.classList.remove("active");
        document.body.style.overflow = "";
    }

    menuButton?.addEventListener("click", openSidebar);
    closeButton?.addEventListener("click", closeSidebar);
    overlay?.addEventListener("click", closeSidebar);

    sidebar?.querySelectorAll(".nav-item").forEach((item) => {
        item.addEventListener("click", () => {
            if (window.innerWidth <= 900) closeSidebar();
        });
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 900) closeSidebar();
    });
}

/* -------------------- TOPIC FILTERS -------------------- */

function initializeTopicFilters() {
    document.querySelectorAll(".topic-tab").forEach((tab) => {
        tab.addEventListener("click", () => {
            document.querySelectorAll(".topic-tab").forEach((item) => {
                item.classList.remove("active");
            });

            tab.classList.add("active");
            applyProblemFilters();
        });
    });
}

/* -------------------- SEARCH -------------------- */

function initializeProblemSearch() {
    const searchInput = getElement("problemSearch");

    searchInput?.addEventListener("input", applyProblemFilters);
}

function applyProblemFilters() {
    const activeTab = document.querySelector(".topic-tab.active");
    const searchInput = getElement("problemSearch");
    const cards = document.querySelectorAll(".problem-card");
    const emptyState = getElement("problemEmpty");

    const selectedTopic = activeTab?.dataset.topic || "all";
    const searchTerm = (searchInput?.value || "").trim().toLowerCase();

    let visibleCount = 0;

    cards.forEach((card) => {
        const topic = card.dataset.topic || "";
        const searchableText = (
            (card.dataset.title || "") + " " + card.textContent
        ).toLowerCase();

        const matchesTopic =
            selectedTopic === "all" || topic === selectedTopic;

        const matchesSearch =
            !searchTerm || searchableText.includes(searchTerm);

        const visible = matchesTopic && matchesSearch;

        card.style.display = visible ? "flex" : "none";

        if (visible) visibleCount++;
    });

    if (emptyState) {
        emptyState.classList.toggle("visible", visibleCount === 0);
    }

    updateProblemCount();
}

function updateProblemCount() {
    const countElement = getElement("problemCount");
    if (!countElement) return;

    const visibleCount = [...document.querySelectorAll(".problem-card")]
        .filter((card) => card.style.display !== "none")
        .length;

    countElement.textContent =
        `${visibleCount} problem${visibleCount === 1 ? "" : "s"}`;
}

/* -------------------- CODING LIBRARY ACTIONS -------------------- */

function initializeProblemActions() {
    document.querySelectorAll(".solve-button").forEach((button) => {
        button.addEventListener("click", () => {
            const problemName = button.dataset.problem || "Coding Problem";
            openProblem(problemName);
        });
    });
}

function openProblem(problemName) {
    const arena = getElement("codingArena");

    if (!arena) {
        showToast(
            "Coding Arena Not Found",
            "Check that index.html contains the element with id codingArena.",
            "fa-solid fa-triangle-exclamation"
        );
        return;
    }

    arena.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    const editor = getElement("arenaCode");
    const selector = getElement("arenaChallenge");

    /*
     * The library cards are separate from the three executable
     * sample exercises. Do not silently submit a different problem.
     */
    const supportedLibraryProblems = {
        "Sum of Two Numbers": "sum",
        "Reverse a String": "reverse",
        "Palindrome Check": "palindrome"
    };

    if (selector && supportedLibraryProblems[problemName]) {
        selector.value = supportedLibraryProblems[problemName];

        selector.dispatchEvent(
            new Event("change", { bubbles: true })
        );
    }

    if (editor) {
        setTimeout(() => editor.focus(), 350);
    }

    if (supportedLibraryProblems[problemName]) {
        showToast(
            "Coding Arena Ready",
            `${problemName} loaded. Write and run your solution.`,
            "fa-solid fa-code"
        );
    } else {
        showToast(
            "Problem Selected",
            `${problemName}: the Arena currently executes its three sample exercises. This library problem still needs its own test cases.`,
            "fa-solid fa-code"
        );
    }
}

/* -------------------- PRACTICE ACTIONS -------------------- */

function initializePracticeActions() {
    const continueButton = getElement("continuePractice");
    const aiChallengeButton = getElement("aiChallengeButton");
    const goalButton = getElement("goalButton");

    continueButton?.addEventListener("click", () => {
        const firstVisibleCard = [...document.querySelectorAll(".problem-card")]
            .find((card) => card.style.display !== "none");

        if (firstVisibleCard) {
            firstVisibleCard.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            firstVisibleCard.querySelector(".solve-button")?.focus();
        } else {
            getElement("problemLibrary")?.scrollIntoView({
                behavior: "smooth"
            });
        }

        showToast(
            "Continue Practice",
            "Choose a visible challenge to begin.",
            "fa-solid fa-play"
        );
    });

    aiChallengeButton?.addEventListener("click", generateAIChallenge);

    goalButton?.addEventListener("click", () => {
        getElement("problemLibrary")?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        showToast(
            "Daily Goal",
            "Choose a coding challenge to continue practising.",
            "fa-solid fa-bullseye"
        );
    });
}

/*
 * This is a random recommendation placeholder, not a connected AI API.
 */
function generateAIChallenge() {
    const challenges = [
        {
            title: "API Rate Limiting",
            message: "Suggested backend challenge: practise request limits."
        },
        {
            title: "Graph Traversal",
            message: "Suggested algorithms challenge: practise graph traversal."
        },
        {
            title: "SQL Window Functions",
            message: "Suggested SQL challenge: practise analytical queries."
        },
        {
            title: "Distributed Queue Design",
            message: "Suggested system design challenge: design a reliable queue."
        }
    ];

    const selected = challenges[
        Math.floor(Math.random() * challenges.length)
    ];

    showToast(
        `Suggested Challenge: ${selected.title}`,
        selected.message,
        "fa-solid fa-wand-magic-sparkles"
    );
}

/* -------------------- CODING ARENA -------------------- */

function initializeCodingArena() {
    const code = getElement("arenaCode");
    const runButton = getElement("arenaRun");
    const submitButton = getElement("arenaSubmit");
    const resetButton = getElement("arenaReset");
    const challengeSelect = getElement("arenaChallenge");
    const languageSelect = getElement("arenaLanguage");

    if (
        !code ||
        !runButton ||
        !submitButton ||
        !resetButton ||
        !challengeSelect ||
        !languageSelect
    ) {
        console.warn(
            "Coding Arena initialization skipped: one or more required HTML elements are missing."
        );
        return;
    }

    const challenges = {
        sum: {
            title: "Sum of Two Numbers",
            description: "Read two integers and print their sum.",
            input: "3 5",
            output: "8",
            xp: 10,
            starter: {
                javascript:
                    "const [a, b] = requireInput().trim().split(/\\s+/).map(Number);\nconsole.log(a + b);",
                python:
                    "a, b = map(int, input().split())\nprint(a + b)"
            }
        },

        reverse: {
            title: "Reverse a String",
            description: "Print the input string in reverse order.",
            input: "hello",
            output: "olleh",
            xp: 15,
            starter: {
                javascript:
                    "console.log(requireInput().trim().split('').reverse().join(''));",
                python:
                    "s = input()\nprint(s[::-1])"
            }
        },

        palindrome: {
            title: "Palindrome Check",
            description:
                "Print true if the input text reads the same backwards.",
            input: "level",
            output: "true",
            xp: 25,
            starter: {
                javascript:
                    "const s = requireInput().trim();\nconsole.log(String(s === s.split('').reverse().join('')));",
                python:
                    "s = input().strip()\nprint(str(s == s[::-1]).lower())"
            }
        }
    };

    let worker = null;
    let activeRun = null;

    const STORAGE_KEY = "devrecruit_coding_arena_progress";

    let xp = 0;
    let completed = new Set();

    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

        if (Number.isFinite(saved.xp) && saved.xp >= 0) {
            xp = saved.xp;
        }

        if (Array.isArray(saved.completed)) {
            completed = new Set(
                saved.completed.filter((key) =>
                    Object.prototype.hasOwnProperty.call(challenges, key)
                )
            );
        }
    } catch (error) {
        console.warn("Saved Arena progress could not be loaded.", error);
    }

    function currentChallenge() {
        return challenges[challengeSelect.value] || challenges.sum;
    }

    function setStatus(message) {
        const status = getElement("arenaStatus");
        if (status) status.textContent = message;
    }

    function refreshProgress() {
        const xpElement = getElement("arenaXP");
        const solvedElement = getElement("arenaSolved");
        const levelElement = getElement("arenaLevel");

        if (xpElement) xpElement.textContent = `⭐ ${xp} XP`;

        if (solvedElement) {
            solvedElement.textContent =
                `${completed.size} challenge${completed.size === 1 ? "" : "s"} completed`;
        }

        if (levelElement) {
            const level = Math.floor(xp / 50) + 1;
            const label = level === 1 ? "Beginner" : "Intermediate";
            levelElement.textContent = `Level ${level} · ${label}`;
        }
    }

    function saveProgress() {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                    xp,
                    completed: [...completed]
                })
            );
        } catch (error) {
            console.warn("Arena progress could not be saved.", error);
        }
    }

    function stopActiveRun() {
        if (activeRun) {
            clearTimeout(activeRun.timeout);
            activeRun = null;
        }

        if (worker) {
            worker.terminate();
            worker = null;
        }
    }

    function loadChallenge(resetCode = true) {
        stopActiveRun();

        const challenge = currentChallenge();

        const title = getElement("arenaProblemTitle");
        const description = getElement("arenaProblemDescription");
        const exampleInput = getElement("arenaExampleInput");
        const exampleOutput = getElement("arenaExampleOutput");
        const input = getElement("arenaInput");
        const output = getElement("arenaOutput");

        if (title) title.textContent = challenge.title;
        if (description) description.textContent = challenge.description;
        if (exampleInput) exampleInput.textContent = challenge.input;
        if (exampleOutput) exampleOutput.textContent = challenge.output;
        if (input) input.value = challenge.input;
        if (output) output.textContent = "Ready to run.";

        if (resetCode) {
            code.value =
                challenge.starter[languageSelect.value] ||
                challenge.starter.javascript;
        }

        runButton.disabled = false;
        submitButton.disabled = false;

        setStatus(
            completed.has(challengeSelect.value)
                ? "Challenge previously completed. You can practise again."
                : "Challenge loaded. Write your solution and click Run Code."
        );
    }

    /*
     * Executes JavaScript inside a Web Worker, separate from the page.
     * This runner is intended for the supplied sample exercises, not
     * for securely executing untrusted code on a production server.
     */
    function runJavaScript(source, input) {
        return new Promise((resolve, reject) => {
            stopActiveRun();

            const workerSource = `
                "use strict";

                self.onmessage = function(event) {
                    const data = event.data;
                    const output = [];

                    const console = {
                        log: function(...args) {
                            output.push(args.map(value => {
                                if (typeof value === "object" && value !== null) {
                                    try { return JSON.stringify(value); }
                                    catch (_) { return String(value); }
                                }
                                return String(value);
                            }).join(" "));
                        },
                        error: function(...args) {
                            output.push(args.map(String).join(" "));
                        }
                    };

                    function requireInput() {
                        return data.input;
                    }

                    try {
                        const fn = new Function(
                            "console",
                            "requireInput",
                            data.source
                        );

                        fn(console, requireInput);

                        self.postMessage({
                            output: output.join("\\n")
                        });
                    } catch (error) {
                        self.postMessage({
                            error: error && error.message
                                ? error.message
                                : String(error)
                        });
                    }
                };
            `;

            let objectURL;

            try {
                const blob = new Blob([workerSource], {
                    type: "text/javascript"
                });

                objectURL = URL.createObjectURL(blob);
                worker = new Worker(objectURL);
            } catch (error) {
                if (objectURL) URL.revokeObjectURL(objectURL);
                reject(new Error("Could not start the JavaScript runner."));
                return;
            }

            const thisWorker = worker;

            activeRun = {
                timeout: setTimeout(() => {
                    if (worker === thisWorker) {
                        thisWorker.terminate();
                        worker = null;
                        activeRun = null;
                    }

                    URL.revokeObjectURL(objectURL);
                    reject(new Error("Execution timed out after 2 seconds."));
                }, 2000)
            };

            thisWorker.onmessage = (event) => {
                if (worker !== thisWorker) return;

                clearTimeout(activeRun?.timeout);
                activeRun = null;
                worker = null;
                thisWorker.terminate();
                URL.revokeObjectURL(objectURL);

                if (event.data.error) {
                    reject(new Error(event.data.error));
                } else {
                    resolve(event.data.output);
                }
            };

            thisWorker.onerror = () => {
                if (worker !== thisWorker) return;

                clearTimeout(activeRun?.timeout);
                activeRun = null;
                worker = null;
                thisWorker.terminate();
                URL.revokeObjectURL(objectURL);

                reject(new Error("The code could not be executed."));
            };

            thisWorker.postMessage({ source, input });
        });
    }

    async function execute(checkAnswer = false) {
        if (runButton.disabled || submitButton.disabled) return;

        if (languageSelect.value !== "javascript") {
            const output = getElement("arenaOutput");

            if (output) {
                output.textContent =
                    "Python execution is not connected. Select JavaScript to run code in this browser.";
            }

            setStatus(
                "Python requires a Python execution service, which is not connected yet."
            );
            return;
        }

        const output = getElement("arenaOutput");
        const input = getElement("arenaInput");

        const challengeKey = challengeSelect.value;
        const challenge = currentChallenge();
        const source = code.value;
        const inputValue = input ? input.value : "";

        runButton.disabled = true;
        submitButton.disabled = true;

        if (output) output.textContent = "Running...";
        setStatus("Executing your JavaScript solution…");

        try {
            const result = await runJavaScript(source, inputValue);

            if (output) output.textContent = result || "(No output)";

            if (!checkAnswer) {
                setStatus(
                    "Execution finished. Use Submit to compare the result with the sample answer."
                );
                return;
            }

            /*
             * Comparison uses the selected challenge's sample output.
             * This is not a complete hidden-test or backend judge.
             */
            if (result.trim() !== challenge.output.trim()) {
                setStatus(
                    "Not passed: your output does not match the expected sample output."
                );
                return;
            }

            if (!completed.has(challengeKey)) {
                completed.add(challengeKey);
                xp += challenge.xp;
                saveProgress();
                refreshProgress();

                showToast(
                    "Challenge Passed!",
                    `You earned ${challenge.xp} XP.`,
                    "fa-solid fa-circle-check"
                );
            } else {
                showToast(
                    "Correct Answer",
                    "You already earned XP for this challenge.",
                    "fa-solid fa-circle-check"
                );
            }

            setStatus("✓ Sample answer passed!");
        } catch (error) {
            if (output) output.textContent = error.message;

            setStatus("Execution failed. Check your code and try again.");
        } finally {
            runButton.disabled = false;
            submitButton.disabled = false;
        }
    }

    runButton.addEventListener("click", () => execute(false));
    submitButton.addEventListener("click", () => execute(true));

    challengeSelect.addEventListener("change", () => loadChallenge(true));
    languageSelect.addEventListener("change", () => loadChallenge(true));
    resetButton.addEventListener("click", () => loadChallenge(true));

    loadChallenge(true);
    refreshProgress();
}

/* -------------------- LOGOUT -------------------- */

function initializeLogout() {
    const logoutButton = getElement("logoutButton");
    if (!logoutButton) return;

    logoutButton.addEventListener("click", () => {
        const confirmed = window.confirm(
            "Are you sure you want to sign out?"
        );

        if (!confirmed) return;

        try {
            sessionStorage.clear();
        } catch (error) {
            console.warn("Session storage could not be cleared.", error);
        }

        showToast(
            "Signed Out",
            "Redirecting to role selection.",
            "fa-solid fa-right-from-bracket"
        );

        setTimeout(() => {
            window.location.href =
                "../../auth/role-selection/index.html";
        }, 900);
    });
}

/* -------------------- ACTIVE NAVIGATION -------------------- */

function setActiveNavigation() {
    const currentPage = window.location.pathname.toLowerCase();

    document.querySelectorAll(".candidate-sidebar .nav-item").forEach((item) => {
        const href = (item.getAttribute("href") || "").toLowerCase();

        if (
            currentPage.includes("coding-practice") &&
            href.includes("coding-practice")
        ) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });
}