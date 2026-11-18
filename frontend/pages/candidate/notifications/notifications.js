"use strict";

document.addEventListener("DOMContentLoaded", () => {

    initializeSidebar();
    initializeNotificationFilters();
    initializeNotificationSearch();
    initializeNotificationActions();
    initializeMarkAllRead();
    initializePreferences();
    initializeAIInsight();
    initializeHeaderNotification();
    initializeLogout();

    updateNotificationCount();

});


/* =======================================================
   SIDEBAR
======================================================= */

function initializeSidebar() {

    const sidebar =
        document.getElementById("candidateSidebar");

    const overlay =
        document.getElementById("sidebarOverlay");

    const menuButton =
        document.getElementById("mobileMenuButton");

    const closeButton =
        document.getElementById("sidebarClose");


    if (!sidebar || !overlay) {
        return;
    }


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


    if (menuButton) {

        menuButton.addEventListener(
            "click",
            openSidebar
        );

    }


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeSidebar
        );

    }


    overlay.addEventListener(
        "click",
        closeSidebar
    );


    document.querySelectorAll(
        ".candidate-sidebar .nav-item"
    ).forEach(item => {

        item.addEventListener(
            "click",
            () => {

                if (window.innerWidth <= 900) {
                    closeSidebar();
                }

            }
        );

    });


    window.addEventListener(
        "resize",
        () => {

            if (window.innerWidth > 900) {
                closeSidebar();
            }

        }
    );

}


/* =======================================================
   FILTER TABS
======================================================= */

function initializeNotificationFilters() {

    const tabs =
        document.querySelectorAll(
            ".notification-tab"
        );


    if (!tabs.length) {
        return;
    }


    tabs.forEach(tab => {

        tab.addEventListener(
            "click",
            () => {

                tabs.forEach(item => {

                    item.classList.remove(
                        "active"
                    );

                });


                tab.classList.add("active");

                applyNotificationFilters();

            }
        );

    });

}


/* =======================================================
   SEARCH
======================================================= */

function initializeNotificationSearch() {

    const searchInput =
        document.getElementById(
            "notificationSearch"
        );


    if (!searchInput) {
        return;
    }


    searchInput.addEventListener(
        "input",
        applyNotificationFilters
    );

}


/* =======================================================
   APPLY FILTERS
======================================================= */

function applyNotificationFilters() {

    const activeTab =
        document.querySelector(
            ".notification-tab.active"
        );


    const searchInput =
        document.getElementById(
            "notificationSearch"
        );


    const notifications =
        document.querySelectorAll(
            ".notification-item"
        );


    const emptyState =
        document.getElementById(
            "notificationEmpty"
        );


    const selectedFilter =
        activeTab
            ? activeTab.dataset.filter
            : "all";


    const searchTerm =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    let visibleCount = 0;


    notifications.forEach(notification => {

        const type =
            notification.dataset.type || "";


        const readStatus =
            notification.dataset.read === "true";


        const title =
            notification.dataset.title ||
            notification.innerText ||
            "";


        let matchesFilter = true;


        if (selectedFilter === "unread") {

            matchesFilter =
                !readStatus;

        } else if (
            selectedFilter !== "all"
        ) {

            matchesFilter =
                type === selectedFilter;

        }


        const matchesSearch =
            searchTerm === "" ||
            title
                .toLowerCase()
                .includes(searchTerm);


        if (
            matchesFilter &&
            matchesSearch
        ) {

            notification.style.display = "";

            visibleCount++;

        } else {

            notification.style.display = "none";

        }

    });


    if (emptyState) {

        if (visibleCount === 0) {

            emptyState.classList.add(
                "visible"
            );

        } else {

            emptyState.classList.remove(
                "visible"
            );

        }

    }


    updateNotificationListCount(
        visibleCount
    );

}


/* =======================================================
   UPDATE LIST COUNT
======================================================= */

function updateNotificationListCount(
    count
) {

    const countElement =
        document.getElementById(
            "notificationListCount"
        );


    if (!countElement) {
        return;
    }


    countElement.textContent =
        `${count} notification${count === 1 ? "" : "s"}`;

}


/* =======================================================
   NOTIFICATION ACTIONS
======================================================= */

function initializeNotificationActions() {

    const notifications =
        document.querySelectorAll(
            ".notification-item"
        );


    notifications.forEach(notification => {

        const menuButton =
            notification.querySelector(
                ".notification-menu"
            );


        if (menuButton) {

            menuButton.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    toggleNotificationRead(
                        notification
                    );

                }
            );

        }


        notification.addEventListener(
            "click",
            event => {

                if (
                    event.target.closest(
                        ".notification-menu"
                    )
                ) {
                    return;
                }


                if (
                    notification.dataset.read !==
                    "true"
                ) {

                    markNotificationRead(
                        notification
                    );

                }


                const title =
                    notification.dataset.title ||
                    "Notification";


                showToast(
                    "Notification Opened",
                    title,
                    "fa-solid fa-bell"
                );

            }
        );

    });

}


/* =======================================================
   TOGGLE READ
======================================================= */

function toggleNotificationRead(
    notification
) {

    const isRead =
        notification.dataset.read === "true";


    if (isRead) {

        markNotificationUnread(
            notification
        );

    } else {

        markNotificationRead(
            notification
        );

    }

}


/* =======================================================
   MARK READ
======================================================= */

function markNotificationRead(
    notification
) {

    notification.dataset.read = "true";

    notification.classList.remove(
        "unread"
    );

    notification.classList.add(
        "read"
    );


    const unreadDot =
        notification.querySelector(
            ".unread-dot"
        );


    if (unreadDot) {
        unreadDot.remove();
    }


    updateNotificationCount();


    showToast(
        "Marked as Read",
        "The notification has been marked as read.",
        "fa-solid fa-check"
    );


    applyNotificationFilters();

}


/* =======================================================
   MARK UNREAD
======================================================= */

function markNotificationUnread(
    notification
) {

    notification.dataset.read = "false";

    notification.classList.remove(
        "read"
    );

    notification.classList.add(
        "unread"
    );


    const titleRow =
        notification.querySelector(
            ".notification-title-row"
        );


    if (
        titleRow &&
        !titleRow.querySelector(".unread-dot")
    ) {

        const dot =
            document.createElement("span");

        dot.className =
            "unread-dot";

        titleRow.appendChild(dot);

    }


    updateNotificationCount();

    applyNotificationFilters();


    showToast(
        "Marked as Unread",
        "The notification has been returned to your unread list.",
        "fa-solid fa-envelope"
    );

}


/* =======================================================
   MARK ALL READ
======================================================= */

function initializeMarkAllRead() {

    const button =
        document.getElementById(
            "markAllReadButton"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            const notifications =
                document.querySelectorAll(
                    ".notification-item"
                );


            let changed = false;


            notifications.forEach(
                notification => {

                    if (
                        notification.dataset.read !==
                        "true"
                    ) {

                        markNotificationReadSilently(
                            notification
                        );

                        changed = true;

                    }

                }
            );


            updateNotificationCount();

            applyNotificationFilters();


            showToast(
                changed
                    ? "All Notifications Read"
                    : "Already Up to Date",
                changed
                    ? "All notification alerts have been marked as read."
                    : "There are no unread notifications.",
                "fa-solid fa-check-double"
            );

        }
    );

}


/* =======================================================
   SILENT READ
======================================================= */

function markNotificationReadSilently(
    notification
) {

    notification.dataset.read =
        "true";


    notification.classList.remove(
        "unread"
    );


    notification.classList.add(
        "read"
    );


    const dot =
        notification.querySelector(
            ".unread-dot"
        );


    if (dot) {
        dot.remove();
    }

}


/* =======================================================
   UPDATE UNREAD COUNT
======================================================= */

function updateNotificationCount() {

    const notifications =
        document.querySelectorAll(
            ".notification-item"
        );


    let unreadCount = 0;


    notifications.forEach(
        notification => {

            if (
                notification.dataset.read !==
                "true"
            ) {

                unreadCount++;

            }

        }
    );


    const unreadCountElement =
        document.getElementById(
            "unreadCount"
        );


    const unreadStatElement =
        document.getElementById(
            "unreadStat"
        );


    if (unreadCountElement) {

        unreadCountElement.textContent =
            unreadCount;

    }


    if (unreadStatElement) {

        unreadStatElement.textContent =
            unreadCount;

    }


    const headerCount =
        document.querySelector(
            ".notification-count"
        );


    if (headerCount) {

        headerCount.textContent =
            unreadCount;

        headerCount.style.display =
            unreadCount > 0
                ? "flex"
                : "none";

    }


    const sidebarDot =
        document.querySelector(
            ".notification-dot"
        );


    if (sidebarDot) {

        sidebarDot.style.display =
            unreadCount > 0
                ? "block"
                : "none";

    }

}


/* =======================================================
   PREFERENCES
======================================================= */

function initializePreferences() {

    const button =
        document.getElementById(
            "notificationPreferencesButton"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            showToast(
                "Notification Preferences",
                "Notification preferences will be connected to your account settings.",
                "fa-solid fa-sliders"
            );

        }
    );

}


/* =======================================================
   HEADER NOTIFICATION
======================================================= */

function initializeHeaderNotification() {

    const button =
        document.getElementById(
            "headerNotificationButton"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            const unread =
                document.querySelectorAll(
                    '.notification-item[data-read="false"]'
                );


            if (unread.length) {

                unread[0].scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });


                showToast(
                    "Unread Notification",
                    "Jumped to your most recent unread notification.",
                    "fa-solid fa-bell"
                );

            } else {

                showToast(
                    "All Caught Up",
                    "You have no unread notifications.",
                    "fa-solid fa-circle-check"
                );

            }

        }
    );

}


/* =======================================================
   AI INSIGHT
======================================================= */

function initializeAIInsight() {

    const button =
        document.getElementById(
            "aiInsightButton"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            const originalHTML =
                button.innerHTML;


            button.disabled = true;


            button.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Analyzing
            `;


            setTimeout(
                () => {

                    button.disabled = false;

                    button.innerHTML =
                        originalHTML;


                    showToast(
                        "AI Activity Insight",
                        "Recruiter activity has increased. Prioritize the pending assessment and keep your profile credentials updated.",
                        "fa-solid fa-brain"
                    );

                },
                1100
            );

        }
    );

}


/* =======================================================
   TOAST
======================================================= */

function showToast(
    title,
    message,
    icon = "fa-solid fa-circle-info"
) {

    let toast =
        document.querySelector(
            ".notifications-toast"
        );


    if (!toast) {

        toast =
            document.createElement(
                "div"
            );


        toast.className =
            "notifications-toast";


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


        document.body.appendChild(
            toast
        );


        const closeButton =
            toast.querySelector(
                "> button"
            );


        closeButton.addEventListener(
            "click",
            () => hideToast(toast)
        );

    }


    const iconElement =
        toast.querySelector(
            ".toast-icon i"
        );


    const titleElement =
        toast.querySelector(
            ".toast-content strong"
        );


    const messageElement =
        toast.querySelector(
            ".toast-content span"
        );


    iconElement.className =
        icon;


    titleElement.textContent =
        title;


    messageElement.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toast.hideTimer
    );


    toast.hideTimer =
        setTimeout(
            () => hideToast(toast),
            4000
        );

}


/* =======================================================
   HIDE TOAST
======================================================= */

function hideToast(toast) {

    if (!toast) {
        return;
    }


    toast.classList.remove(
        "show"
    );

}


/* =======================================================
   LOGOUT
======================================================= */

function initializeLogout() {

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (!logoutButton) {
        return;
    }


    logoutButton.addEventListener(
        "click",
        () => {

            const confirmed =
                window.confirm(
                    "Are you sure you want to sign out?"
                );


            if (!confirmed) {
                return;
            }


            try {

                sessionStorage.clear();

            } catch (error) {

                console.warn(
                    "Session storage could not be cleared.",
                    error
                );

            }


            showToast(
                "Signed Out",
                "Redirecting to role selection.",
                "fa-solid fa-right-from-bracket"
            );


            setTimeout(
                () => {

                    window.location.href =
                        "../../auth/role-selection/index.html";

                },
                900
            );

        }
    );

}


/* =======================================================
   INITIAL FILTER STATE
======================================================= */

function initializeNotificationState() {

    applyNotificationFilters();

    updateNotificationCount();

}


initializeNotificationState();