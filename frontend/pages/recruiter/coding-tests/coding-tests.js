/* =======================================================
   DEVRECRUIT — CODING TESTS
======================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* ===================================================
       ELEMENTS
    =================================================== */

    const sidebar =
        document.querySelector("#codingTestsSidebar");

    const sidebarOverlay =
        document.querySelector("#sidebarOverlay");

    const mobileMenuButton =
        document.querySelector("#mobileMenuButton");

    const sidebarClose =
        document.querySelector("#sidebarClose");

    const searchInput =
        document.querySelector("#codingTestSearch");

    const statusFilter =
        document.querySelector("#codingStatusFilter");

    const difficultyFilter =
        document.querySelector("#difficultyFilter");

    const clearFiltersButton =
        document.querySelector("#clearCodingFilters");

    const refreshButton =
        document.querySelector("#refreshCodingTests");

    const refreshListButton =
        document.querySelector("#refreshCodingList");

    const tableBody =
        document.querySelector("#codingTestTableBody");

    const tableActions =
        document.querySelectorAll(".table-action");


    /* ===================================================
       SIDEBAR
    =================================================== */

    function openSidebar() {

        if (!sidebar) return;

        sidebar.classList.add("open");

        if (sidebarOverlay) {
            sidebarOverlay.classList.add("active");
        }

    }


    function closeSidebar() {

        if (!sidebar) return;

        sidebar.classList.remove("open");

        if (sidebarOverlay) {
            sidebarOverlay.classList.remove("active");
        }

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
       FILTER CODING TESTS
    =================================================== */

    function filterCodingTests() {

        if (!tableBody) return;

        const rows =
            tableBody.querySelectorAll("tr");

        const searchTerm =
            searchInput
                ? searchInput.value.trim().toLowerCase()
                : "";

        const selectedStatus =
            statusFilter
                ? statusFilter.value
                : "all";

        const selectedDifficulty =
            difficultyFilter
                ? difficultyFilter.value
                : "all";


        rows.forEach((row) => {

            const name =
                (row.dataset.name || "").toLowerCase();

            const role =
                (row.dataset.role || "").toLowerCase();

            const skill =
                (row.dataset.skill || "").toLowerCase();

            const status =
                (row.dataset.status || "").toLowerCase();

            const difficulty =
                (row.dataset.difficulty || "").toLowerCase();


            const matchesSearch =
                !searchTerm ||
                name.includes(searchTerm) ||
                role.includes(searchTerm) ||
                skill.includes(searchTerm);


            const matchesStatus =
                selectedStatus === "all" ||
                status === selectedStatus;


            const matchesDifficulty =
                selectedDifficulty === "all" ||
                difficulty === selectedDifficulty;


            row.style.display =
                matchesSearch &&
                matchesStatus &&
                matchesDifficulty
                    ? ""
                    : "none";

        });

    }


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterCodingTests
        );

    }


    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            filterCodingTests
        );

    }


    if (difficultyFilter) {

        difficultyFilter.addEventListener(
            "change",
            filterCodingTests
        );

    }


    /* ===================================================
       CLEAR FILTERS
    =================================================== */

    if (clearFiltersButton) {

        clearFiltersButton.addEventListener(
            "click",
            () => {

                if (searchInput) {
                    searchInput.value = "";
                }

                if (statusFilter) {
                    statusFilter.value = "all";
                }

                if (difficultyFilter) {
                    difficultyFilter.value = "all";
                }


                tableActions.forEach((button) => {

                    button.classList.remove("active");

                });


                const allButton =
                    document.querySelector(
                        '.table-action[data-view="all"]'
                    );


                if (allButton) {
                    allButton.classList.add("active");
                }


                filterCodingTests();


                showToast(
                    "Filters Cleared",
                    "All coding test filters have been reset."
                );

            }
        );

    }


    /* ===================================================
       QUICK TABLE FILTERS
    =================================================== */

    tableActions.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                tableActions.forEach((item) => {

                    item.classList.remove("active");

                });


                button.classList.add("active");


                const view =
                    button.dataset.view || "all";


                if (statusFilter) {

                    statusFilter.value =
                        view === "all"
                            ? "all"
                            : view;

                }


                filterCodingTests();

            }
        );

    });


    /* ===================================================
       DETAILS MODAL
    =================================================== */

    const codingModal =
        document.querySelector("#codingModal");

    const modalBackdrop =
        document.querySelector("#modalBackdrop");

    const modalClose =
        document.querySelector("#modalClose");


    const viewButtons =
        document.querySelectorAll(".coding-view");


    viewButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const row =
                    button.closest("tr");


                if (!row) return;


                populateCodingModal(row);

                openCodingModal();

            }
        );

    });


    function populateCodingModal(row) {

        const name =
            row.dataset.name ||
            "Coding Test";

        const role =
            row.dataset.role ||
            "Software Engineer";

        const difficulty =
            row.dataset.difficulty ||
            "medium";

        const status =
            row.dataset.status ||
            "active";


        const nameElement =
            document.querySelector("#modalCodingName");

        const roleElement =
            document.querySelector("#modalCodingRole");

        const difficultyElement =
            document.querySelector("#modalDifficulty");

        const statusElement =
            document.querySelector("#modalStatus");


        if (nameElement) {
            nameElement.textContent = name;
        }


        if (roleElement) {
            roleElement.textContent = role;
        }


        if (difficultyElement) {
            difficultyElement.textContent =
                formatValue(difficulty);
        }


        if (statusElement) {
            statusElement.textContent =
                formatValue(status);
        }


        const cells =
            row.querySelectorAll("td");


        if (cells.length >= 7) {

            const questions =
                cells[2]?.textContent.trim() || "—";

            const language =
                cells[3]?.textContent.trim() || "—";

            const candidates =
                cells[4]?.textContent.trim() || "—";

            const score =
                cells[5]?.textContent.trim() || "—";


            const questionElement =
                document.querySelector("#modalQuestions");

            const languageElement =
                document.querySelector("#modalLanguage");

            const candidatesElement =
                document.querySelector("#modalCandidates");

            const scoreElement =
                document.querySelector("#modalScore");


            if (questionElement) {
                questionElement.textContent =
                    questions;
            }


            if (languageElement) {
                languageElement.textContent =
                    language;
            }


            if (candidatesElement) {
                candidatesElement.textContent =
                    candidates;
            }


            if (scoreElement) {
                scoreElement.textContent =
                    score;
            }

        }


        updateModalSkills(row);

    }


    function updateModalSkills(row) {

        const skillsContainer =
            document.querySelector("#modalSkills");


        if (!skillsContainer) return;


        const skillText =
            row.dataset.skill || "";


        if (!skillText) return;


        const skills =
            skillText
                .split(" ")
                .filter(Boolean);


        skillsContainer.innerHTML = "";


        skills.forEach((skill) => {

            const tag =
                document.createElement("span");

            tag.textContent = skill;

            skillsContainer.appendChild(tag);

        });

    }


    function formatValue(value) {

        if (!value) return "";

        return value.charAt(0).toUpperCase() +
            value.slice(1);

    }


    function openCodingModal() {

        if (!codingModal) return;

        codingModal.classList.add("open");

        document.body.style.overflow = "hidden";

    }


    function closeCodingModal() {

        if (!codingModal) return;

        codingModal.classList.remove("open");

        document.body.style.overflow = "";

    }


    if (modalClose) {

        modalClose.addEventListener(
            "click",
            closeCodingModal
        );

    }


    if (modalBackdrop) {

        modalBackdrop.addEventListener(
            "click",
            closeCodingModal
        );

    }


    /* ===================================================
       CREATE CODING TEST MODAL
    =================================================== */

    const createCodingModal =
        document.querySelector("#createCodingModal");

    const createCodingButton =
        document.querySelector("#createCodingTestButton");

    const createBackdrop =
        document.querySelector("#createBackdrop");

    const createClose =
        document.querySelector("#createClose");

    const createCancel =
        document.querySelector("#createCancel");


    function openCreateModal() {

        if (!createCodingModal) return;

        createCodingModal.classList.add("open");

        document.body.style.overflow = "hidden";


        const nameInput =
            document.querySelector("#codingTestName");


        if (nameInput) {

            setTimeout(() => {

                nameInput.focus();

            }, 100);

        }

    }


    function closeCreateModal() {

        if (!createCodingModal) return;

        createCodingModal.classList.remove("open");

        document.body.style.overflow = "";

    }


    if (createCodingButton) {

        createCodingButton.addEventListener(
            "click",
            openCreateModal
        );

    }


    if (createClose) {

        createClose.addEventListener(
            "click",
            closeCreateModal
        );

    }


    if (createCancel) {

        createCancel.addEventListener(
            "click",
            closeCreateModal
        );

    }


    if (createBackdrop) {

        createBackdrop.addEventListener(
            "click",
            closeCreateModal
        );

    }


    /* ===================================================
       CREATE FORM
    =================================================== */

    const createForm =
        document.querySelector("#createCodingTestForm");


    if (createForm) {

        createForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();


                const name =
                    document.querySelector(
                        "#codingTestName"
                    )?.value.trim();


                const role =
                    document.querySelector(
                        "#codingTestRole"
                    )?.value.trim();


                const difficulty =
                    document.querySelector(
                        "#codingDifficulty"
                    )?.value;


                const language =
                    document.querySelector(
                        "#codingLanguage"
                    )?.value;


                const questions =
                    document.querySelector(
                        "#codingQuestionCount"
                    )?.value;


                const duration =
                    document.querySelector(
                        "#codingDuration"
                    )?.value;


                const passingScore =
                    document.querySelector(
                        "#codingPassingScore"
                    )?.value;


                const skills =
                    document.querySelector(
                        "#codingSkills"
                    )?.value.trim();


                const description =
                    document.querySelector(
                        "#codingDescription"
                    )?.value.trim();


                if (!name || !role) {

                    showToast(
                        "Missing Information",
                        "Please enter the test name and target role."
                    );

                    return;

                }


                closeCreateModal();

                createForm.reset();


                showToast(
                    "Coding Test Created",
                    `${name} has been created successfully.`
                );


                console.log(
                    "Coding test created:",
                    {
                        name,
                        role,
                        difficulty,
                        language,
                        questions,
                        duration,
                        passingScore,
                        skills,
                        description
                    }
                );

            }
        );

    }


    /* ===================================================
       TEMPLATES
    =================================================== */

    const templatesButton =
        document.querySelector(
            "#codingTemplatesButton"
        );


    if (templatesButton) {

        templatesButton.addEventListener(
            "click",
            () => {

                showToast(
                    "Coding Templates",
                    "Coding test template library will be connected to the backend."
                );

            }
        );

    }


    /* ===================================================
       DUPLICATE
    =================================================== */

    const duplicateButton =
        document.querySelector(
            "#duplicateCodingButton"
        );


    if (duplicateButton) {

        duplicateButton.addEventListener(
            "click",
            () => {

                closeCodingModal();


                showToast(
                    "Test Duplicated",
                    "A copy of the coding test has been prepared."
                );

            }
        );

    }


    /* ===================================================
       EDIT
    =================================================== */

    const editButton =
        document.querySelector(
            "#editCodingButton"
        );


    if (editButton) {

        editButton.addEventListener(
            "click",
            () => {

                closeCodingModal();


                showToast(
                    "Edit Mode",
                    "Coding test editor will be connected to the backend."
                );

            }
        );

    }


    /* ===================================================
       SUBMISSIONS
    =================================================== */

    const submissionsButton =
        document.querySelector(
            "#viewSubmissionsButton"
        );


    if (submissionsButton) {

        submissionsButton.addEventListener(
            "click",
            () => {

                showToast(
                    "Candidate Submissions",
                    "Submission results will be connected to the backend."
                );

            }
        );

    }


    /* ===================================================
       REFRESH
    =================================================== */

    function refreshCodingTests() {

        if (!tableBody) return;


        tableBody.style.opacity = "0.5";


        setTimeout(() => {

            tableBody.style.opacity = "1";


            showToast(
                "Coding Tests Refreshed",
                "Coding test data has been refreshed."
            );

        }, 500);

    }


    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            refreshCodingTests
        );

    }


    if (refreshListButton) {

        refreshListButton.addEventListener(
            "click",
            refreshCodingTests
        );

    }


    /* ===================================================
       LOGOUT
    =================================================== */

    const logoutButton =
        document.querySelector("#logoutButton");


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            () => {

                const confirmed =
                    window.confirm(
                        "Are you sure you want to sign out?"
                    );


                if (!confirmed) return;


                showToast(
                    "Signing Out",
                    "You have been signed out successfully."
                );


                setTimeout(() => {

                    console.log(
                        "Logout will be connected to authentication backend."
                    );

                }, 800);

            }
        );

    }


    /* ===================================================
       PAGINATION
    =================================================== */

    const paginationNumbers =
        document.querySelectorAll(
            ".pagination-number"
        );


    paginationNumbers.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                paginationNumbers.forEach(
                    (item) => {
                        item.classList.remove("active");
                    }
                );


                button.classList.add("active");


                showToast(
                    "Page Changed",
                    `Showing coding tests from page ${button.textContent.trim()}.`
                );

            }
        );

    });


    /* ===================================================
       TOAST
    =================================================== */

    const toast =
        document.querySelector("#codingToast");

    const toastTitle =
        document.querySelector("#toastTitle");

    const toastMessage =
        document.querySelector("#toastMessage");

    const toastClose =
        document.querySelector("#toastClose");


    let toastTimer;


    function showToast(title, message) {

        if (!toast) return;


        if (toastTitle) {
            toastTitle.textContent = title;
        }


        if (toastMessage) {
            toastMessage.textContent = message;
        }


        toast.classList.add("show");


        clearTimeout(toastTimer);


        toastTimer = setTimeout(() => {

            hideToast();

        }, 4000);

    }


    function hideToast() {

        if (!toast) return;

        toast.classList.remove("show");

    }


    if (toastClose) {

        toastClose.addEventListener(
            "click",
            hideToast
        );

    }


    /* ===================================================
       ESCAPE KEY
    =================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key !== "Escape") return;


            closeSidebar();
            closeCodingModal();
            closeCreateModal();
            hideToast();

        }
    );


    /* ===================================================
       INITIALIZE
    =================================================== */

    filterCodingTests();

});