/* =======================================================
   DEVRECRUIT — RECRUITER NOTIFICATIONS
======================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* ===================================================
       ELEMENTS
    =================================================== */

    const sidebar =
        document.querySelector("#notificationsSidebar");

    const sidebarOverlay =
        document.querySelector("#sidebarOverlay");

    const mobileMenuButton =
        document.querySelector("#mobileMenuButton");

    const sidebarClose =
        document.querySelector("#sidebarClose");

    const notificationList =
        document.querySelector("#notificationList");

    const notifications =
        document.querySelectorAll(".notification-item");

    const searchInput =
        document.querySelector("#notificationSearch");

    const typeFilter =
        document.querySelector("#notificationType");

    const statusFilter =
        document.querySelector("#notificationStatus");

    const clearFiltersButton =
        document.querySelector("#clearNotificationFilters");

    const notificationTabs =
        document.querySelectorAll(".notification-tab");

    const markAllReadButton =
        document.querySelector("#markAllReadButton");

    const unreadCountElement =
        document.querySelector("#unreadCount");

    const totalCountElement =
        document.querySelector("#totalCount");

    const headerNotificationCount =
        document.querySelector("#headerNotificationCount");

    const resultCount =
        document.querySelector("#notificationResultCount");

    const emptyState =
        document.querySelector("#emptyNotificationState");


    /* ===================================================
       SIDEBAR
    =================================================== */

    function openSidebar() {

        sidebar?.classList.add("open");

        sidebarOverlay?.classList.add("active");

    }


    function closeSidebar() {

        sidebar?.classList.remove("open");

        sidebarOverlay?.classList.remove("active");

    }


    mobileMenuButton?.addEventListener(
        "click",
        openSidebar
    );


    sidebarClose?.addEventListener(
        "click",
        closeSidebar
    );


    sidebarOverlay?.addEventListener(
        "click",
        closeSidebar
    );


    /* ===================================================
       NOTIFICATION STATE
    =================================================== */

    function getAllNotifications() {

        return Array.from(
            document.querySelectorAll(
                ".notification-item"
            )
        );

    }


    function getUnreadNotifications() {

        return getAllNotifications().filter(
            (notification) =>
                notification.dataset.status ===
                "unread"
        );

    }


    /* ===================================================
       UPDATE COUNTS
    =================================================== */

    function updateCounts() {

        const all =
            getAllNotifications();

        const unread =
            getUnreadNotifications();


        if (totalCountElement) {

            totalCountElement.textContent =
                all.length;

        }


        if (unreadCountElement) {

            unreadCountElement.textContent =
                unread.length;

        }


        if (headerNotificationCount) {

            headerNotificationCount.textContent =
                unread.length;

        }


        const unreadTabBadge =
            document.querySelector(
                ".notification-tab[data-filter='unread'] b"
            );


        if (unreadTabBadge) {

            unreadTabBadge.textContent =
                unread.length;

        }


        const sidebarBadge =
            document.querySelector(
                ".sidebar-footer .nav-item.active .notification-dot"
            );


        if (sidebarBadge) {

            sidebarBadge.style.display =
                unread.length > 0
                    ? "block"
                    : "none";

        }

    }


    /* ===================================================
       MARK SINGLE NOTIFICATION
    =================================================== */

    function markAsRead(notification) {

        if (!notification) return;


        notification.dataset.status =
            "read";


        notification.classList.remove(
            "unread"
        );


        const button =
            notification.querySelector(
                ".mark-read-button"
            );


        if (button) {

            button.title =
                "Mark as unread";

            button.innerHTML =
                '<i class="fa-solid fa-envelope"></i>';

        }


        updateCounts();

        applyFilters();

    }


    function markAsUnread(notification) {

        if (!notification) return;


        notification.dataset.status =
            "unread";


        notification.classList.add(
            "unread"
        );


        const button =
            notification.querySelector(
                ".mark-read-button"
            );


        if (button) {

            button.title =
                "Mark as read";

            button.innerHTML =
                '<i class="fa-solid fa-check"></i>';

        }


        updateCounts();

        applyFilters();

    }


    /* ===================================================
       MARK READ BUTTON
    =================================================== */

    document.addEventListener(
        "click",
        (event) => {

            const button =
                event.target.closest(
                    ".mark-read-button"
                );


            if (!button) return;


            const notification =
                button.closest(
                    ".notification-item"
                );


            if (!notification) return;


            if (
                notification.dataset.status ===
                "unread"
            ) {

                markAsRead(
                    notification
                );


                showToast(
                    "Marked as Read",
                    "The notification has been marked as read."
                );

            } else {

                markAsUnread(
                    notification
                );


                showToast(
                    "Marked as Unread",
                    "The notification has been marked as unread."
                );

            }

        }
    );


    /* ===================================================
       MARK ALL AS READ
    =================================================== */

    markAllReadButton?.addEventListener(
        "click",
        () => {

            const unread =
                getUnreadNotifications();


            if (unread.length === 0) {

                showToast(
                    "Already Up to Date",
                    "There are no unread notifications."
                );

                return;

            }


            unread.forEach(
                (notification) => {

                    notification.dataset.status =
                        "read";

                    notification.classList.remove(
                        "unread"
                    );


                    const button =
                        notification.querySelector(
                            ".mark-read-button"
                        );


                    if (button) {

                        button.title =
                            "Mark as unread";

                        button.innerHTML =
                            '<i class="fa-solid fa-envelope"></i>';

                    }

                }
            );


            updateCounts();

            applyFilters();


            showToast(
                "All Notifications Read",
                `${unread.length} notifications marked as read.`
            );

        }
    );


    /* ===================================================
       DELETE NOTIFICATION
    =================================================== */

    document.addEventListener(
        "click",
        (event) => {

            const button =
                event.target.closest(
                    ".delete-notification"
                );


            if (!button) return;


            const notification =
                button.closest(
                    ".notification-item"
                );


            if (!notification) return;


            const title =
                notification.querySelector(
                    ".notification-top strong"
                )?.textContent ||
                "Notification";


            notification.style.opacity =
                "0";


            notification.style.transform =
                "translateX(20px)";


            setTimeout(
                () => {

                    notification.remove();


                    updateCounts();

                    applyFilters();


                    showToast(
                        "Notification Deleted",
                        `${title} was removed.`
                    );

                },
                220
            );

        }
    );


    /* ===================================================
       SEARCH
    =================================================== */

    searchInput?.addEventListener(
        "input",
        applyFilters
    );


    /* ===================================================
       TYPE FILTER
    =================================================== */

    typeFilter?.addEventListener(
        "change",
        applyFilters
    );


    /* ===================================================
       STATUS FILTER
    =================================================== */

    statusFilter?.addEventListener(
        "change",
        applyFilters
    );


    /* ===================================================
       TABS
    =================================================== */

    notificationTabs.forEach(
        (tab) => {

            tab.addEventListener(
                "click",
                () => {

                    notificationTabs.forEach(
                        (item) => {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    tab.classList.add(
                        "active"
                    );


                    const filter =
                        tab.dataset.filter ||
                        "all";


                    if (
                        filter === "unread"
                    ) {

                        if (statusFilter) {

                            statusFilter.value =
                                "unread";

                        }

                    } else {

                        if (statusFilter) {

                            statusFilter.value =
                                "all";

                        }

                    }


                    applyFilters();

                }
            );

        }
    );


    /* ===================================================
       APPLY FILTERS
    =================================================== */

    function applyFilters() {

        const search =
            (
                searchInput?.value ||
                ""
            )
            .trim()
            .toLowerCase();


        const selectedType =
            typeFilter?.value ||
            "all";


        const selectedStatus =
            statusFilter?.value ||
            "all";


        const items =
            getAllNotifications();


        let visibleCount = 0;


        items.forEach(
            (notification) => {

                const type =
                    notification.dataset.type ||
                    "";


                const status =
                    notification.dataset.status ||
                    "";


                const searchableText =
                    (
                        notification.dataset.search ||
                        notification.textContent ||
                        ""
                    )
                    .toLowerCase();


                const matchesSearch =
                    !search ||
                    searchableText.includes(
                        search
                    );


                const matchesType =
                    selectedType === "all" ||
                    type === selectedType;


                const matchesStatus =
                    selectedStatus === "all" ||
                    status === selectedStatus;


                const visible =
                    matchesSearch &&
                    matchesType &&
                    matchesStatus;


                notification.style.display =
                    visible
                        ? ""
                        : "flex";


                if (visible) {

                    visibleCount++;

                }

            }
        );


        if (emptyState) {

            emptyState.classList.toggle(
                "show",
                visibleCount === 0
            );

        }


        if (notificationList) {

            notificationList.style.display =
                visibleCount === 0
                    ? "none"
                    : "";

        }


        if (resultCount) {

            resultCount.textContent =
                `Showing ${visibleCount} notification${
                    visibleCount === 1
                        ? ""
                        : "s"
                }`;

        }

    }


    /* ===================================================
       CLEAR FILTERS
    =================================================== */

    clearFiltersButton?.addEventListener(
        "click",
        () => {

            if (searchInput) {

                searchInput.value =
                    "";

            }


            if (typeFilter) {

                typeFilter.value =
                    "all";

            }


            if (statusFilter) {

                statusFilter.value =
                    "all";

            }


            notificationTabs.forEach(
                (tab) => {

                    tab.classList.toggle(
                        "active",
                        tab.dataset.filter ===
                        "all"
                    );

                }
            );


            applyFilters();


            showToast(
                "Filters Cleared",
                "All notification filters have been reset."
            );

        }
    );


    /* ===================================================
       REFRESH
    =================================================== */

    const refreshButton =
        document.querySelector(
            "#refreshNotifications"
        );


    refreshButton?.addEventListener(
        "click",
        () => {

            refreshButton.classList.add(
                "refreshing"
            );


            setTimeout(
                () => {

                    refreshButton.classList.remove(
                        "refreshing"
                    );


                    updateCounts();

                    applyFilters();


                    showToast(
                        "Notifications Refreshed",
                        "Your notification feed is up to date."
                    );

                },
                600
            );

        }
    );


    /* ===================================================
       PAGINATION DEMO
    =================================================== */

    const paginationButtons =
        document.querySelectorAll(
            ".pagination button:not(:disabled)"
        );


    paginationButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    if (
                        button.classList.contains(
                            "active"
                        )
                    ) {

                        return;

                    }


                    document
                        .querySelectorAll(
                            ".pagination button"
                        )
                        .forEach(
                            (item) => {

                                item.classList.remove(
                                    "active"
                                );

                            }
                        );


                    button.classList.add(
                        "active"
                    );


                    showToast(
                        "Pagination",
                        "Additional notification pages will be connected to the backend."
                    );

                }
            );

        }
    );


    /* ===================================================
       NOTIFICATION CLICK
    =================================================== */

    notifications.forEach(
        (notification) => {

            notification.addEventListener(
                "click",
                (event) => {

                    if (
                        event.target.closest(
                            ".notification-actions"
                        )
                    ) {

                        return;

                    }


                    if (
                        notification.dataset.status ===
                        "unread"
                    ) {

                        markAsRead(
                            notification
                        );

                    }

                }
            );

        }
    );


    /* ===================================================
       LOGOUT
    =================================================== */

    const logoutButton =
        document.querySelector(
            "#logoutButton"
        );


    logoutButton?.addEventListener(
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


            console.log(
                "Logout will be connected to the authentication backend."
            );

        }
    );


    /* ===================================================
       TOAST
    =================================================== */

    const toast =
        document.querySelector(
            "#notificationsToast"
        );

    const toastTitle =
        document.querySelector(
            "#toastTitle"
        );

    const toastMessage =
        document.querySelector(
            "#toastMessage"
        );

    const toastClose =
        document.querySelector(
            "#toastClose"
        );


    let toastTimer;


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
            setTimeout(
                hideToast,
                4000
            );

    }


    function hideToast() {

        toast?.classList.remove(
            "show"
        );

    }


    toastClose?.addEventListener(
        "click",
        hideToast
    );


    /* ===================================================
       ESCAPE KEY
    =================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape"
            ) {

                closeSidebar();

                hideToast();

            }

        }
    );


    /* ===================================================
       INITIALIZE
    =================================================== */

    updateCounts();

    applyFilters();


    console.log(
        "DevRecruit Notifications initialized successfully."
    );

});