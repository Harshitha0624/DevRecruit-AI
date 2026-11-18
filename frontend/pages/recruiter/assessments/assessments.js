/* =======================================================
   DEVRECRUIT — ASSESSMENTS
======================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* ===================================================
       ELEMENTS
    =================================================== */

    const sidebar = document.querySelector("#assessmentsSidebar");
    const sidebarOverlay = document.querySelector("#sidebarOverlay");
    const mobileMenuButton = document.querySelector("#mobileMenuButton");
    const sidebarClose = document.querySelector("#sidebarClose");

    const searchInput = document.querySelector("#assessmentSearch");
    const statusFilter = document.querySelector("#assessmentStatusFilter");
    const typeFilter = document.querySelector("#assessmentTypeFilter");

    const clearFiltersButton =
        document.querySelector("#clearAssessmentFilters");

    const refreshButton =
        document.querySelector("#refreshAssessments");

    const refreshListButton =
        document.querySelector("#refreshAssessmentList");

    const tableBody =
        document.querySelector("#assessmentTableBody");

    const tableActions =
        document.querySelectorAll(".table-action");

    const assessmentModal =
        document.querySelector("#assessmentModal");

    const modalBackdrop =
        document.querySelector("#modalBackdrop");

    const modalClose =
        document.querySelector("#modalClose");

    const createModal =
        document.querySelector("#createModal");

    const createBackdrop =
        document.querySelector("#createBackdrop");

    const createClose =
        document.querySelector("#createClose");

    const createCancel =
        document.querySelector("#createCancel");

    const createAssessmentButton =
        document.querySelector("#createAssessmentButton");

    const createAssessmentForm =
        document.querySelector("#createAssessmentForm");

    const assessmentTemplatesButton =
        document.querySelector("#assessmentTemplatesButton");

    const logoutButton =
        document.querySelector("#logoutButton");

    const toast =
        document.querySelector("#assessmentToast");

    const toastTitle =
        document.querySelector("#toastTitle");

    const toastMessage =
        document.querySelector("#toastMessage");

    const toastClose =
        document.querySelector("#toastClose");


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
       SEARCH + FILTER
    =================================================== */

    function filterAssessments() {

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

        const selectedType =
            typeFilter
                ? typeFilter.value
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

            const type =
                (row.dataset.type || "").toLowerCase();


            const matchesSearch =
                !searchTerm ||
                name.includes(searchTerm) ||
                role.includes(searchTerm) ||
                skill.includes(searchTerm);


            const matchesStatus =
                selectedStatus === "all" ||
                status === selectedStatus;


            const matchesType =
                selectedType === "all" ||
                type === selectedType;


            row.style.display =
                matchesSearch &&
                matchesStatus &&
                matchesType
                    ? ""
                    : "none";

        });

    }


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterAssessments
        );

    }


    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            filterAssessments
        );

    }


    if (typeFilter) {

        typeFilter.addEventListener(
            "change",
            filterAssessments
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

                if (typeFilter) {
                    typeFilter.value = "all";
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

                filterAssessments();

                showToast(
                    "Filters Cleared",
                    "All assessment filters have been reset."
                );

            }
        );

    }


    /* ===================================================
       QUICK TABLE FILTERS
    =================================================== */

    tableActions.forEach((button) => {

        button.addEventListener("click", () => {

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

            filterAssessments();

        });

    });


    /* ===================================================
       OPEN ASSESSMENT DETAILS
    =================================================== */

    const viewButtons =
        document.querySelectorAll(".assessment-view");


    viewButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const row =
                    button.closest("tr");

                if (!row) return;

                populateAssessmentModal(row);

                openAssessmentModal();

            }
        );

    });


    function populateAssessmentModal(row) {

        const name =
            row.dataset.name || "Assessment";

        const role =
            row.dataset.role || "Recruitment Role";

        const type =
            row.dataset.type || "technical";


        const nameElement =
            document.querySelector(
                "#modalAssessmentName"
            );

        const roleElement =
            document.querySelector(
                "#modalAssessmentRole"
            );

        const typeElement =
            document.querySelector(
                "#modalType"
            );

        const statusElement =
            document.querySelector(
                "#modalStatus"
            );


        if (nameElement) {
            nameElement.textContent = name;
        }

        if (roleElement) {
            roleElement.textContent = role;
        }

        if (typeElement) {
            typeElement.textContent =
                formatType(type);
        }

        if (statusElement) {

            const status =
                row.dataset.status || "active";

            statusElement.textContent =
                formatType(status);

        }


        const cells =
            row.querySelectorAll("td");


        if (cells.length >= 7) {

            const questionValue =
                cells[2]?.textContent.trim() || "—";

            const candidateValue =
                cells[3]?.textContent.trim() || "—";

            const scoreValue =
                cells[4]?.textContent.trim() || "—";

            const completionValue =
                cells[5]?.textContent.trim() || "—";


            const questions =
                document.querySelector("#modalQuestions");

            const candidates =
                document.querySelector("#modalCandidates");

            const score =
                document.querySelector("#modalScore");

            const completion =
                document.querySelector("#modalCompletion");


            if (questions) {
                questions.textContent =
                    questionValue;
            }

            if (candidates) {
                candidates.textContent =
                    candidateValue;
            }

            if (score) {
                score.textContent =
                    scoreValue;
            }

            if (completion) {

                completion.textContent =
                    completionValue;

            }

        }

    }


    function formatType(value) {

        if (!value) return "";

        return value
            .charAt(0)
            .toUpperCase() +
            value.slice(1);

    }


    /* ===================================================
       ASSESSMENT MODAL
    =================================================== */

    function openAssessmentModal() {

        if (!assessmentModal) return;

        assessmentModal.classList.add("open");

        document.body.style.overflow = "hidden";

    }


    function closeAssessmentModal() {

        if (!assessmentModal) return;

        assessmentModal.classList.remove("open");

        document.body.style.overflow = "";

    }


    if (modalClose) {

        modalClose.addEventListener(
            "click",
            closeAssessmentModal
        );

    }


    if (modalBackdrop) {

        modalBackdrop.addEventListener(
            "click",
            closeAssessmentModal
        );

    }


    /* ===================================================
       CREATE ASSESSMENT MODAL
    =================================================== */

    function openCreateModal() {

        if (!createModal) return;

        createModal.classList.add("open");

        document.body.style.overflow = "hidden";

        const nameInput =
            document.querySelector("#assessmentName");

        if (nameInput) {

            setTimeout(() => {

                nameInput.focus();

            }, 100);

        }

    }


    function closeCreateModal() {

        if (!createModal) return;

        createModal.classList.remove("open");

        document.body.style.overflow = "";

    }


    if (createAssessmentButton) {

        createAssessmentButton.addEventListener(
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
       CREATE ASSESSMENT
    =================================================== */

    if (createAssessmentForm) {

        createAssessmentForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();


                const name =
                    document.querySelector(
                        "#assessmentName"
                    )?.value.trim();


                const role =
                    document.querySelector(
                        "#assessmentRole"
                    )?.value.trim();


                const type =
                    document.querySelector(
                        "#assessmentType"
                    )?.value;


                const questions =
                    document.querySelector(
                        "#questionCount"
                    )?.value;


                const duration =
                    document.querySelector(
                        "#assessmentDuration"
                    )?.value;


                if (!name || !role || !type) {

                    showToast(
                        "Missing Information",
                        "Please fill in all required fields."
                    );

                    return;

                }


                closeCreateModal();

                createAssessmentForm.reset();


                showToast(
                    "Assessment Created",
                    `${name} has been created successfully.`
                );


                console.log(
                    "Assessment created:",
                    {
                        name,
                        role,
                        type,
                        questions,
                        duration
                    }
                );

            }
        );

    }


    /* ===================================================
       TEMPLATES
    =================================================== */

    if (assessmentTemplatesButton) {

        assessmentTemplatesButton.addEventListener(
            "click",
            () => {

                showToast(
                    "Assessment Templates",
                    "Template library will be connected to the backend."
                );

            }
        );

    }


    /* ===================================================
       DUPLICATE ASSESSMENT
    =================================================== */

    const duplicateButton =
        document.querySelector(
            "#duplicateAssessmentButton"
        );


    if (duplicateButton) {

        duplicateButton.addEventListener(
            "click",
            () => {

                closeAssessmentModal();

                showToast(
                    "Assessment Duplicated",
                    "A copy of the assessment has been prepared."
                );

            }
        );

    }


    /* ===================================================
       EDIT ASSESSMENT
    =================================================== */

    const editButton =
        document.querySelector(
            "#editAssessmentButton"
        );


    if (editButton) {

        editButton.addEventListener(
            "click",
            () => {

                closeAssessmentModal();

                showToast(
                    "Edit Mode",
                    "Assessment editor will be connected to the backend."
                );

            }
        );

    }


    /* ===================================================
       VIEW SUBMISSIONS
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
                    "Submission management will be connected to the backend."
                );

            }
        );

    }


    /* ===================================================
       REFRESH
    =================================================== */

    function refreshAssessments() {

        if (!tableBody) return;

        tableBody.style.opacity = "0.5";


        setTimeout(() => {

            tableBody.style.opacity = "1";

            showToast(
                "Assessments Refreshed",
                "Assessment data has been refreshed."
            );

        }, 500);

    }


    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            refreshAssessments
        );

    }


    if (refreshListButton) {

        refreshListButton.addEventListener(
            "click",
            refreshAssessments
        );

    }


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
       TOAST
    =================================================== */

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
            closeAssessmentModal();
            closeCreateModal();
            hideToast();

        }
    );


    /* ===================================================
       INITIALIZE
    =================================================== */

    filterAssessments();

});