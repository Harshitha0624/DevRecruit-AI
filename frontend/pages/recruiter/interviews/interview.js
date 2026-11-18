/* =======================================================
   DEVRECRUIT — INTERVIEWS
======================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* ===================================================
       ELEMENTS
    =================================================== */

    const sidebar = document.querySelector("#interviewsSidebar");
    const sidebarOverlay = document.querySelector("#sidebarOverlay");
    const mobileMenuButton = document.querySelector("#mobileMenuButton");
    const sidebarClose = document.querySelector("#sidebarClose");

    const searchInput = document.querySelector("#interviewSearch");
    const statusFilter = document.querySelector("#statusFilter");
    const typeFilter = document.querySelector("#typeFilter");

    const clearFiltersButton =
        document.querySelector("#clearInterviewFilters");

    const upcomingItems =
        document.querySelectorAll(".upcoming-interview");

    const tableRows =
        document.querySelectorAll("#interviewTableBody tr");

    const calendarGrid =
        document.querySelector("#calendarGrid");

    const calendarMonth =
        document.querySelector("#calendarMonth");

    const previousMonth =
        document.querySelector("#previousMonth");

    const nextMonth =
        document.querySelector("#nextMonth");

    const todayButton =
        document.querySelector("#todayButton");

    const scheduleButton =
        document.querySelector("#scheduleInterviewButton");

    const scheduleModal =
        document.querySelector("#scheduleModal");

    const scheduleBackdrop =
        document.querySelector("#scheduleBackdrop");

    const scheduleClose =
        document.querySelector("#scheduleClose");

    const scheduleCancel =
        document.querySelector("#scheduleCancel");

    const scheduleForm =
        document.querySelector("#scheduleForm");

    const interviewModal =
        document.querySelector("#interviewModal");

    const modalBackdrop =
        document.querySelector("#modalBackdrop");

    const modalClose =
        document.querySelector("#modalClose");

    const viewAllButton =
        document.querySelector("#viewAllInterviews");

    const refreshButton =
        document.querySelector("#refreshInterviews");

    const refreshListButton =
        document.querySelector("#refreshInterviewList");

    const logoutButton =
        document.querySelector("#logoutButton");

    const toast =
        document.querySelector("#interviewToast");

    const toastTitle =
        document.querySelector("#toastTitle");

    const toastMessage =
        document.querySelector("#toastMessage");

    const toastClose =
        document.querySelector("#toastClose");

    const tableViewButtons =
        document.querySelectorAll(".table-view");

    const tableActionButtons =
        document.querySelectorAll(".table-action");

    const interviewMenuButtons =
        document.querySelectorAll(".interview-menu");


    /* ===================================================
       STATE
    =================================================== */

    let currentCalendarDate = new Date(2026, 7, 1);

    let selectedInterview = null;

    let toastTimer = null;


    /* ===================================================
       INTERVIEW DATA
    =================================================== */

    const interviewData = {

        "Meera Joshi": {
            position: "Senior Full Stack Developer",
            interviewer: "Rahul Sharma",
            type: "Technical",
            date: "Aug 18, 2026",
            time: "10:30 AM",
            duration: "45 minutes",
            status: "Scheduled"
        },

        "Karan Singh": {
            position: "AI / ML Engineer",
            interviewer: "Priya Nair",
            type: "Managerial",
            date: "Aug 18, 2026",
            time: "2:00 PM",
            duration: "60 minutes",
            status: "Scheduled"
        },

        "Alex Kumar": {
            position: "Senior Full Stack Developer",
            interviewer: "Vikram Shah",
            type: "HR",
            date: "Aug 19, 2026",
            time: "11:00 AM",
            duration: "30 minutes",
            status: "Pending"
        },

        "Sarah Patel": {
            position: "Backend Engineer",
            interviewer: "Arjun Rao",
            type: "Technical",
            date: "Aug 20, 2026",
            time: "3:30 PM",
            duration: "45 minutes",
            status: "Scheduled"
        },

        "Priya Menon": {
            position: "AI / ML Engineer",
            interviewer: "Neha Kapoor",
            type: "Final Round",
            date: "Aug 21, 2026",
            time: "4:00 PM",
            duration: "60 minutes",
            status: "Scheduled"
        }

    };


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

    function applyFilters() {

        const searchValue =
            searchInput
                ? searchInput.value
                    .trim()
                    .toLowerCase()
                : "";

        const selectedStatus =
            statusFilter
                ? statusFilter.value
                : "all";

        const selectedType =
            typeFilter
                ? typeFilter.value
                : "all";


        upcomingItems.forEach((item) => {

            const name =
                (item.dataset.name || "")
                    .toLowerCase();

            const role =
                (item.dataset.role || "")
                    .toLowerCase();

            const interviewer =
                (item.dataset.interviewer || "")
                    .toLowerCase();

            const status =
                (item.dataset.status || "")
                    .toLowerCase();

            const type =
                (item.dataset.type || "")
                    .toLowerCase();


            const matchesSearch =
                !searchValue ||
                name.includes(searchValue) ||
                role.includes(searchValue) ||
                interviewer.includes(searchValue);

            const matchesStatus =
                selectedStatus === "all" ||
                status === selectedStatus;

            const matchesType =
                selectedType === "all" ||
                type === selectedType;


            if (
                matchesSearch &&
                matchesStatus &&
                matchesType
            ) {

                item.style.display = "grid";

            } else {

                item.style.display = "none";

            }

        });


        tableRows.forEach((row) => {

            const name =
                (row.dataset.name || "")
                    .toLowerCase();

            const status =
                (row.dataset.status || "")
                    .toLowerCase();


            const matchesSearch =
                !searchValue ||
                name.includes(searchValue);

            const matchesStatus =
                selectedStatus === "all" ||
                status === selectedStatus;


            if (
                matchesSearch &&
                matchesStatus
            ) {

                row.style.display = "";

            } else {

                row.style.display = "none";

            }

        });

    }


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            applyFilters
        );

    }


    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            applyFilters
        );

    }


    if (typeFilter) {

        typeFilter.addEventListener(
            "change",
            applyFilters
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

                applyFilters();

                showToast(
                    "Filters Cleared",
                    "All interview filters have been reset."
                );

            }
        );

    }


    /* ===================================================
       CALENDAR
    =================================================== */

    const calendarEvents = {

        "2026-08-18": [
            {
                name: "Meera Joshi",
                type: "technical"
            },
            {
                name: "Karan Singh",
                type: "managerial"
            }
        ],

        "2026-08-19": [
            {
                name: "Alex Kumar",
                type: "hr"
            }
        ],

        "2026-08-20": [
            {
                name: "Sarah Patel",
                type: "technical"
            }
        ],

        "2026-08-21": [
            {
                name: "Priya Menon",
                type: "final"
            }
        ]

    };


    function formatCalendarKey(
        year,
        month,
        day
    ) {

        return [
            year,
            String(month + 1).padStart(2, "0"),
            String(day).padStart(2, "0")
        ].join("-");

    }


    function renderCalendar() {

        if (!calendarGrid) return;

        calendarGrid.innerHTML = "";


        const year =
            currentCalendarDate.getFullYear();

        const month =
            currentCalendarDate.getMonth();


        const firstDay =
            new Date(
                year,
                month,
                1
            );

        const lastDay =
            new Date(
                year,
                month + 1,
                0
            );


        /*
         * Convert Sunday-first JavaScript
         * index into Monday-first calendar.
         */

        let startingDay =
            firstDay.getDay();

        startingDay =
            startingDay === 0
                ? 6
                : startingDay - 1;


        const daysInMonth =
            lastDay.getDate();


        const previousMonthLastDay =
            new Date(
                year,
                month,
                0
            ).getDate();


        const totalCells =
            Math.ceil(
                (
                    startingDay +
                    daysInMonth
                ) / 7
            ) * 7;


        for (
            let index = 0;
            index < totalCells;
            index++
        ) {

            const dayCell =
                document.createElement("div");

            dayCell.className =
                "calendar-day";


            let dayNumber;
            let cellMonth = month;
            let cellYear = year;


            if (index < startingDay) {

                dayNumber =
                    previousMonthLastDay -
                    startingDay +
                    index +
                    1;

                cellMonth = month - 1;

                if (cellMonth < 0) {

                    cellMonth = 11;
                    cellYear--;

                }

                dayCell.classList.add(
                    "other-month"
                );

            } else if (
                index >=
                startingDay + daysInMonth
            ) {

                dayNumber =
                    index -
                    (
                        startingDay +
                        daysInMonth
                    ) +
                    1;

                cellMonth = month + 1;

                if (cellMonth > 11) {

                    cellMonth = 0;
                    cellYear++;

                }

                dayCell.classList.add(
                    "other-month"
                );

            } else {

                dayNumber =
                    index -
                    startingDay +
                    1;

            }


            const dayNumberElement =
                document.createElement("div");

            dayNumberElement.className =
                "day-number";

            dayNumberElement.textContent =
                dayNumber;


            dayCell.appendChild(
                dayNumberElement
            );


            const eventKey =
                formatCalendarKey(
                    cellYear,
                    cellMonth,
                    dayNumber
                );


            const events =
                calendarEvents[eventKey];


            if (
                events &&
                !dayCell.classList.contains(
                    "other-month"
                )
            ) {

                const eventContainer =
                    document.createElement("div");

                eventContainer.className =
                    "calendar-events";


                events
                    .slice(0, 2)
                    .forEach((event) => {

                        const eventElement =
                            document.createElement(
                                "div"
                            );

                        eventElement.className =
                            `calendar-event ${event.type}`;

                        eventElement.textContent =
                            event.name;

                        eventContainer.appendChild(
                            eventElement
                        );

                    });


                if (events.length > 2) {

                    const moreElement =
                        document.createElement(
                            "div"
                        );

                    moreElement.className =
                        "calendar-event";

                    moreElement.textContent =
                        `+${events.length - 2} more`;

                    eventContainer.appendChild(
                        moreElement
                    );

                }


                dayCell.appendChild(
                    eventContainer
                );

            }


            dayCell.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".calendar-day.selected"
                        )
                        .forEach((day) => {

                            day.classList.remove(
                                "selected"
                            );

                        });


                    dayCell.classList.add(
                        "selected"
                    );


                    const selectedDate =
                        new Date(
                            cellYear,
                            cellMonth,
                            dayNumber
                        );


                    const selectedKey =
                        formatCalendarKey(
                            cellYear,
                            cellMonth,
                            dayNumber
                        );


                    if (
                        calendarEvents[selectedKey]
                    ) {

                        const firstEvent =
                            calendarEvents[
                                selectedKey
                            ][0];

                        openInterviewModal(
                            firstEvent.name
                        );

                    } else {

                        showToast(
                            "No Interviews",
                            "There are no interviews scheduled for this date."
                        );

                    }

                }
            );


            calendarGrid.appendChild(
                dayCell
            );

        }


        const monthName =
            currentCalendarDate.toLocaleString(
                "en-US",
                {
                    month: "long"
                }
            );


        if (calendarMonth) {

            calendarMonth.textContent =
                `${monthName} ${year}`;

        }

    }


    renderCalendar();


    /* ===================================================
       CALENDAR NAVIGATION
    =================================================== */

    if (previousMonth) {

        previousMonth.addEventListener(
            "click",
            () => {

                currentCalendarDate.setMonth(
                    currentCalendarDate.getMonth() - 1
                );

                renderCalendar();

            }
        );

    }


    if (nextMonth) {

        nextMonth.addEventListener(
            "click",
            () => {

                currentCalendarDate.setMonth(
                    currentCalendarDate.getMonth() + 1
                );

                renderCalendar();

            }
        );

    }


    if (todayButton) {

        todayButton.addEventListener(
            "click",
            () => {

                currentCalendarDate =
                    new Date(
                        2026,
                        7,
                        1
                    );

                renderCalendar();

                showToast(
                    "Calendar Reset",
                    "Interview calendar returned to August 2026."
                );

            }
        );

    }


    /* ===================================================
       INTERVIEW MODAL
    =================================================== */

    function openInterviewModal(
        candidateName
    ) {

        if (!interviewModal) return;


        const data =
            interviewData[candidateName];


        if (!data) {

            showToast(
                "Candidate Not Found",
                "Interview details could not be loaded."
            );

            return;

        }


        selectedInterview =
            candidateName;


        const modalCandidate =
            document.querySelector(
                "#modalCandidate"
            );

        const modalPosition =
            document.querySelector(
                "#modalPosition"
            );

        const modalInterviewer =
            document.querySelector(
                "#modalInterviewer"
            );

        const modalType =
            document.querySelector(
                "#modalType"
            );

        const modalDate =
            document.querySelector(
                "#modalDate"
            );

        const modalTime =
            document.querySelector(
                "#modalTime"
            );

        const modalStatus =
            document.querySelector(
                "#modalStatus"
            );


        if (modalCandidate) {
            modalCandidate.textContent =
                candidateName;
        }

        if (modalPosition) {
            modalPosition.textContent =
                data.position;
        }

        if (modalInterviewer) {
            modalInterviewer.textContent =
                data.interviewer;
        }

        if (modalType) {
            modalType.textContent =
                data.type;
        }

        if (modalDate) {
            modalDate.textContent =
                data.date;
        }

        if (modalTime) {
            modalTime.textContent =
                data.time;
        }

        if (modalStatus) {
            modalStatus.textContent =
                data.status;
        }


        interviewModal.classList.add(
            "open"
        );

        document.body.style.overflow =
            "hidden";

    }


    function closeInterviewModal() {

        if (!interviewModal) return;

        interviewModal.classList.remove(
            "open"
        );

        document.body.style.overflow = "";

        selectedInterview = null;

    }


    /* ===================================================
       UPCOMING ITEM CLICK
    =================================================== */

    upcomingItems.forEach((item) => {

        item.addEventListener(
            "click",
            (event) => {

                if (
                    event.target.closest(
                        ".interview-menu"
                    )
                ) {
                    return;
                }


                const candidate =
                    item.dataset.name;


                openInterviewModal(
                    candidate
                );

            }
        );

    });


    /* ===================================================
       UPCOMING MENU
    =================================================== */

    interviewMenuButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                (event) => {

                    event.stopPropagation();


                    const item =
                        button.closest(
                            ".upcoming-interview"
                        );


                    if (!item) return;


                    openInterviewModal(
                        item.dataset.name
                    );

                }
            );

        }
    );


    /* ===================================================
       TABLE VIEW BUTTONS
    =================================================== */

    tableViewButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const row =
                        button.closest("tr");


                    if (!row) return;


                    openInterviewModal(
                        row.dataset.name
                    );

                }
            );

        }
    );


    if (modalClose) {

        modalClose.addEventListener(
            "click",
            closeInterviewModal
        );

    }


    if (modalBackdrop) {

        modalBackdrop.addEventListener(
            "click",
            closeInterviewModal
        );

    }


    /* ===================================================
       SCHEDULE MODAL
    =================================================== */

    function openScheduleModal() {

        if (!scheduleModal) return;

        scheduleModal.classList.add(
            "open"
        );

        document.body.style.overflow =
            "hidden";

    }


    function closeScheduleModal() {

        if (!scheduleModal) return;

        scheduleModal.classList.remove(
            "open"
        );

        document.body.style.overflow = "";

    }


    if (scheduleButton) {

        scheduleButton.addEventListener(
            "click",
            openScheduleModal
        );

    }


    if (scheduleClose) {

        scheduleClose.addEventListener(
            "click",
            closeScheduleModal
        );

    }


    if (scheduleCancel) {

        scheduleCancel.addEventListener(
            "click",
            closeScheduleModal
        );

    }


    if (scheduleBackdrop) {

        scheduleBackdrop.addEventListener(
            "click",
            closeScheduleModal
        );

    }


    /* ===================================================
       SCHEDULE FORM
    =================================================== */

    if (scheduleForm) {

        scheduleForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();


                const candidate =
                    document.querySelector(
                        "#scheduleCandidate"
                    ).value;

                const interviewer =
                    document.querySelector(
                        "#scheduleInterviewer"
                    ).value;

                const date =
                    document.querySelector(
                        "#scheduleDate"
                    ).value;

                const time =
                    document.querySelector(
                        "#scheduleTime"
                    ).value;

                const type =
                    document.querySelector(
                        "#scheduleType"
                    ).value;


                if (
                    !candidate ||
                    !interviewer ||
                    !date ||
                    !time ||
                    !type
                ) {

                    showToast(
                        "Missing Information",
                        "Please complete all required fields."
                    );

                    return;

                }


                closeScheduleModal();

                scheduleForm.reset();


                showToast(
                    "Interview Scheduled",
                    `${candidate}'s interview has been scheduled successfully.`
                );

            }
        );

    }


    /* ===================================================
       VIEW ALL
    =================================================== */

    if (viewAllButton) {

        viewAllButton.addEventListener(
            "click",
            () => {

                const tableSection =
                    document.querySelector(
                        ".interview-table-section"
                    );


                if (tableSection) {

                    tableSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }

            }
        );

    }


    /* ===================================================
       TABLE VIEW FILTERS
    =================================================== */

    tableActionButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    tableActionButtons
                        .forEach((item) => {

                            item.classList.remove(
                                "active"
                            );

                        });


                    button.classList.add(
                        "active"
                    );


                    const view =
                        button.dataset.view;


                    tableRows.forEach(
                        (row) => {

                            const date =
                                row.querySelector(
                                    "td:nth-child(4)"
                                )?.textContent
                                    .trim()
                                    .toLowerCase();


                            let visible = true;


                            if (
                                view === "today"
                            ) {

                                visible =
                                    date.includes(
                                        "aug 18"
                                    );

                            }


                            if (
                                view === "week"
                            ) {

                                visible =
                                    [
                                        "aug 18",
                                        "aug 19",
                                        "aug 20",
                                        "aug 21"
                                    ].some(
                                        (day) =>
                                            date.includes(day)
                                    );

                            }


                            row.style.display =
                                visible
                                    ? ""
                                    : "none";

                        }
                    );

                }
            );

        }
    );


    /* ===================================================
       REFRESH
    =================================================== */

    function refreshInterviews() {

        renderCalendar();

        applyFilters();

        showToast(
            "Interviews Refreshed",
            "The interview schedule has been refreshed."
        );

    }


    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            refreshInterviews
        );

    }


    if (refreshListButton) {

        refreshListButton.addEventListener(
            "click",
            refreshInterviews
        );

    }


    /* ===================================================
       JOIN MEETING
    =================================================== */

    const joinMeetingButton =
        document.querySelector(
            "#joinMeetingButton"
        );


    if (joinMeetingButton) {

        joinMeetingButton.addEventListener(
            "click",
            () => {

                showToast(
                    "Meeting Ready",
                    "Meeting integration will be connected to the backend later."
                );

            }
        );

    }


    /* ===================================================
       EDIT INTERVIEW
    =================================================== */

    const editInterviewButton =
        document.querySelector(
            "#editInterviewButton"
        );


    if (editInterviewButton) {

        editInterviewButton.addEventListener(
            "click",
            () => {

                closeInterviewModal();

                openScheduleModal();


                showToast(
                    "Edit Mode",
                    "Update the interview details in the scheduling form."
                );

            }
        );

    }


    /* ===================================================
       CANCEL INTERVIEW
    =================================================== */

    const cancelInterviewButton =
        document.querySelector(
            "#cancelInterviewButton"
        );


    if (cancelInterviewButton) {

        cancelInterviewButton.addEventListener(
            "click",
            () => {

                if (!selectedInterview) {

                    closeInterviewModal();

                    return;

                }


                const candidate =
                    selectedInterview;


                closeInterviewModal();


                showToast(
                    "Interview Cancelled",
                    `${candidate}'s interview has been cancelled.`
                );

            }
        );

    }


    /* ===================================================
       LOGOUT
    =================================================== */

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            () => {

                showToast(
                    "Signed Out",
                    "You have been signed out of the recruiter portal."
                );


                setTimeout(() => {

                    window.location.href =
                        "../../login/index.html";

                }, 1000);

            }
        );

    }


    /* ===================================================
       TOAST
    =================================================== */

    function showToast(
        title,
        message
    ) {

        if (!toast) return;


        if (toastTitle) {
            toastTitle.textContent =
                title;
        }

        if (toastMessage) {
            toastMessage.textContent =
                message;
        }


        toast.classList.add(
            "show"
        );


        clearTimeout(
            toastTimer
        );


        toastTimer =
            setTimeout(() => {

                toast.classList.remove(
                    "show"
                );

            }, 3500);

    }


    if (toastClose) {

        toastClose.addEventListener(
            "click",
            () => {

                toast.classList.remove(
                    "show"
                );

            }
        );

    }


    /* ===================================================
       ESCAPE KEY
    =================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key !== "Escape"
            ) {
                return;
            }


            closeInterviewModal();

            closeScheduleModal();

            closeSidebar();

        }
    );


    /* ===================================================
       INITIALIZATION
    =================================================== */

    applyFilters();

});