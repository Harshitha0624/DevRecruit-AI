"use strict";

document.addEventListener("DOMContentLoaded", () => {

    initializeSidebar();
    initializeSettingsNavigation();
    initializeAccountSettings();
    initializeResetButtons();
    initializeTogglePersistence();
    initializeThemeSelector();
    initializeSecurityActions();
    initializeDeleteAccount();
    initializeLogout();
    restoreSavedSettings();

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
   SETTINGS NAVIGATION
======================================================= */

function initializeSettingsNavigation() {

    const navigationItems =
        document.querySelectorAll(
            ".settings-nav-item[data-section]"
        );


    const panels =
        document.querySelectorAll(
            ".settings-panel"
        );


    if (!navigationItems.length) {
        return;
    }


    navigationItems.forEach(item => {

        item.addEventListener(
            "click",
            () => {

                const section =
                    item.dataset.section;


                navigationItems.forEach(
                    navItem => {

                        navItem.classList.remove(
                            "active"
                        );

                    }
                );


                panels.forEach(panel => {

                    panel.classList.remove(
                        "active"
                    );

                });


                item.classList.add(
                    "active"
                );


                const selectedPanel =
                    document.getElementById(
                        `${section}Panel`
                    );


                if (selectedPanel) {

                    selectedPanel.classList.add(
                        "active"
                    );

                }


                try {

                    localStorage.setItem(
                        "devrecruit_settings_section",
                        section
                    );

                } catch (error) {

                    console.warn(
                        "Unable to save settings section.",
                        error
                    );

                }

            }
        );

    });


    restoreSettingsSection();

}


/* =======================================================
   RESTORE ACTIVE SECTION
======================================================= */

function restoreSettingsSection() {

    let savedSection = "account";


    try {

        savedSection =
            localStorage.getItem(
                "devrecruit_settings_section"
            ) || "account";

    } catch (error) {

        console.warn(
            "Unable to read settings section.",
            error
        );

    }


    const navigationItem =
        document.querySelector(
            `.settings-nav-item[data-section="${savedSection}"]`
        );


    if (navigationItem) {

        navigationItem.click();

    }

}


/* =======================================================
   ACCOUNT SETTINGS
======================================================= */

function initializeAccountSettings() {

    const saveButton =
        document.getElementById(
            "saveAccountButton"
        );


    if (!saveButton) {
        return;
    }


    saveButton.addEventListener(
        "click",
        () => {

            const firstName =
                document.getElementById(
                    "firstName"
                );

            const lastName =
                document.getElementById(
                    "lastName"
                );

            const email =
                document.getElementById(
                    "emailAddress"
                );

            const role =
                document.getElementById(
                    "developerRole"
                );

            const experience =
                document.getElementById(
                    "experienceLevel"
                );


            if (!firstName || !lastName || !email) {
                return;
            }


            if (
                firstName.value.trim() === "" ||
                lastName.value.trim() === ""
            ) {

                showToast(
                    "Incomplete Information",
                    "Please enter your first and last name.",
                    "fa-solid fa-circle-exclamation"
                );

                return;

            }


            if (
                !isValidEmail(
                    email.value.trim()
                )
            ) {

                showToast(
                    "Invalid Email",
                    "Please enter a valid email address.",
                    "fa-solid fa-envelope"
                );

                return;

            }


            const accountData = {

                firstName:
                    firstName.value.trim(),

                lastName:
                    lastName.value.trim(),

                email:
                    email.value.trim(),

                role:
                    role
                        ? role.value
                        : "",

                experience:
                    experience
                        ? experience.value
                        : ""

            };


            try {

                localStorage.setItem(
                    "devrecruit_account_settings",
                    JSON.stringify(accountData)
                );

            } catch (error) {

                console.warn(
                    "Unable to save account settings.",
                    error
                );

            }


            updateDisplayedUserName(
                accountData.firstName,
                accountData.lastName
            );


            showToast(
                "Changes Saved",
                "Your account information has been updated successfully.",
                "fa-solid fa-circle-check"
            );

        }
    );

}


/* =======================================================
   EMAIL VALIDATION
======================================================= */

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
    );

}


/* =======================================================
   UPDATE HEADER / SIDEBAR NAME
======================================================= */

function updateDisplayedUserName(
    firstName,
    lastName
) {

    const fullName =
        `${firstName} ${lastName}`.trim();


    const profileName =
        document.querySelector(
            ".profile-details strong"
        );


    const headerName =
        document.querySelector(
            ".header-user-info strong"
        );


    if (profileName) {
        profileName.textContent =
            firstName || "Candidate";
    }


    if (headerName) {
        headerName.textContent =
            firstName || "Candidate";
    }


    const avatar =
        document.querySelector(
            ".profile-avatar"
        );


    const headerAvatar =
        document.querySelector(
            ".header-avatar"
        );


    const initials =
        `${firstName.charAt(0)}${lastName.charAt(0)}`
            .toUpperCase();


    if (avatar) {
        avatar.textContent =
            initials || "CA";
    }


    if (headerAvatar) {
        headerAvatar.textContent =
            initials || "CA";
    }


    return fullName;

}


/* =======================================================
   RESET ACCOUNT FORM
======================================================= */

function initializeResetButtons() {

    const resetButtons =
        document.querySelectorAll(
            "[data-reset]"
        );


    resetButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const resetType =
                    button.dataset.reset;


                if (resetType !== "account") {
                    return;
                }


                const confirmed =
                    window.confirm(
                        "Reset the account fields to their saved values?"
                    );


                if (!confirmed) {
                    return;
                }


                restoreAccountSettings();


                showToast(
                    "Account Restored",
                    "The saved account information has been restored.",
                    "fa-solid fa-rotate-left"
                );

            }
        );

    });

}


/* =======================================================
   TOGGLE PERSISTENCE
======================================================= */

function initializeTogglePersistence() {

    const toggles =
        document.querySelectorAll(
            '.toggle input[type="checkbox"]'
        );


    toggles.forEach(toggle => {

        toggle.addEventListener(
            "change",
            () => {

                saveToggleValue(
                    toggle.id,
                    toggle.checked
                );


                const label =
                    getToggleLabel(toggle);


                showToast(
                    "Preference Updated",
                    `${label} has been ${toggle.checked ? "enabled" : "disabled"}.`,
                    toggle.checked
                        ? "fa-solid fa-check"
                        : "fa-solid fa-power-off"
                );

            }
        );

    });

}


/* =======================================================
   TOGGLE LABEL
======================================================= */

function getToggleLabel(toggle) {

    const parent =
        toggle.closest(
            ".privacy-option, .preference-item, .ai-option, .ai-mode-card, .security-option, .appearance-option, .privacy-visibility-card"
        );


    if (!parent) {
        return "Setting";
    }


    const heading =
        parent.querySelector(
            "strong"
        );


    return heading
        ? heading.textContent.trim()
        : "Setting";

}


/* =======================================================
   SAVE TOGGLE
======================================================= */

function saveToggleValue(
    id,
    value
) {

    if (!id) {
        return;
    }


    try {

        localStorage.setItem(
            `devrecruit_toggle_${id}`,
            String(value)
        );

    } catch (error) {

        console.warn(
            "Unable to save toggle.",
            error
        );

    }

}


/* =======================================================
   RESTORE SAVED SETTINGS
======================================================= */

function restoreSavedSettings() {

    restoreAccountSettings();

    restoreToggles();

    restoreTheme();

}


/* =======================================================
   RESTORE ACCOUNT
======================================================= */

function restoreAccountSettings() {

    let savedAccount = null;


    try {

        const raw =
            localStorage.getItem(
                "devrecruit_account_settings"
            );


        if (raw) {

            savedAccount =
                JSON.parse(raw);

        }

    } catch (error) {

        console.warn(
            "Unable to restore account settings.",
            error
        );

    }


    if (!savedAccount) {
        return;
    }


    const firstName =
        document.getElementById(
            "firstName"
        );

    const lastName =
        document.getElementById(
            "lastName"
        );

    const email =
        document.getElementById(
            "emailAddress"
        );

    const role =
        document.getElementById(
            "developerRole"
        );

    const experience =
        document.getElementById(
            "experienceLevel"
        );


    if (firstName && savedAccount.firstName) {
        firstName.value =
            savedAccount.firstName;
    }


    if (lastName && savedAccount.lastName) {
        lastName.value =
            savedAccount.lastName;
    }


    if (email && savedAccount.email) {
        email.value =
            savedAccount.email;
    }


    if (role && savedAccount.role) {
        role.value =
            savedAccount.role;
    }


    if (
        experience &&
        savedAccount.experience
    ) {

        experience.value =
            savedAccount.experience;

    }


    updateDisplayedUserName(
        savedAccount.firstName || "",
        savedAccount.lastName || ""
    );

}


/* =======================================================
   RESTORE TOGGLES
======================================================= */

function restoreToggles() {

    const toggles =
        document.querySelectorAll(
            '.toggle input[type="checkbox"]'
        );


    toggles.forEach(toggle => {

        try {

            const saved =
                localStorage.getItem(
                    `devrecruit_toggle_${toggle.id}`
                );


            if (saved !== null) {

                toggle.checked =
                    saved === "true";

            }

        } catch (error) {

            console.warn(
                `Unable to restore ${toggle.id}.`,
                error
            );

        }

    });

}


/* =======================================================
   THEME SELECTOR
======================================================= */

function initializeThemeSelector() {

    const themeOptions =
        document.querySelectorAll(
            ".theme-option"
        );


    if (!themeOptions.length) {
        return;
    }


    themeOptions.forEach(option => {

        option.addEventListener(
            "click",
            () => {

                const theme =
                    option.dataset.theme;


                themeOptions.forEach(
                    item => {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                option.classList.add(
                    "active"
                );


                applyTheme(theme);


                try {

                    localStorage.setItem(
                        "devrecruit_theme",
                        theme
                    );

                } catch (error) {

                    console.warn(
                        "Unable to save theme.",
                        error
                    );

                }


                showToast(
                    "Appearance Updated",
                    `${capitalize(theme)} theme selected.`,
                    "fa-solid fa-palette"
                );

            }
        );

    });

}


/* =======================================================
   APPLY THEME
======================================================= */

function applyTheme(theme) {

    const body =
        document.body;


    body.classList.remove(
        "dark-theme"
    );


    if (theme === "dark") {

        body.classList.add(
            "dark-theme"
        );

    }


    if (theme === "system") {

        const systemDark =
            window.matchMedia &&
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;


        if (systemDark) {

            body.classList.add(
                "dark-theme"
            );

        }

    }


    updateThemeButtons(
        theme
    );

}


/* =======================================================
   UPDATE THEME BUTTONS
======================================================= */

function updateThemeButtons(
    theme
) {

    document.querySelectorAll(
        ".theme-option"
    ).forEach(option => {

        option.classList.toggle(
            "active",
            option.dataset.theme === theme
        );

    });

}


/* =======================================================
   RESTORE THEME
======================================================= */

function restoreTheme() {

    let theme = "light";


    try {

        theme =
            localStorage.getItem(
                "devrecruit_theme"
            ) || "light";

    } catch (error) {

        console.warn(
            "Unable to restore theme.",
            error
        );

    }


    applyTheme(theme);

}


/* =======================================================
   SYSTEM THEME CHANGE
======================================================= */

if (window.matchMedia) {

    const systemTheme =
        window.matchMedia(
            "(prefers-color-scheme: dark)"
        );


    systemTheme.addEventListener(
        "change",
        event => {

            let savedTheme = "light";


            try {

                savedTheme =
                    localStorage.getItem(
                        "devrecruit_theme"
                    ) || "light";

            } catch (error) {

                return;

            }


            if (savedTheme === "system") {

                document.body.classList.toggle(
                    "dark-theme",
                    event.matches
                );

            }

        }
    );

}


/* =======================================================
   SECURITY ACTIONS
======================================================= */

function initializeSecurityActions() {

    const buttons =
        document.querySelectorAll(
            "[data-security-action]"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const action =
                    button.dataset.securityAction;


                if (action === "password") {

                    showToast(
                        "Password Security",
                        "Password change flow will connect to backend authentication.",
                        "fa-solid fa-key"
                    );

                }


                if (action === "sessions") {

                    showToast(
                        "Active Sessions",
                        "Session management will be connected to the authentication service.",
                        "fa-solid fa-laptop"
                    );

                }

            }
        );

    });

}


/* =======================================================
   DELETE ACCOUNT
======================================================= */

function initializeDeleteAccount() {

    const button =
        document.getElementById(
            "deleteAccountButton"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            const firstConfirmation =
                window.confirm(
                    "Delete your DevRecruit account? This action cannot be undone."
                );


            if (!firstConfirmation) {
                return;
            }


            const secondConfirmation =
                window.prompt(
                    'Type DELETE to confirm account deletion.'
                );


            if (
                secondConfirmation === null ||
                secondConfirmation.trim().toUpperCase() !==
                "DELETE"
            ) {

                showToast(
                    "Deletion Cancelled",
                    "Your account was not deleted.",
                    "fa-solid fa-shield-halved"
                );

                return;

            }


            try {

                localStorage.clear();

                sessionStorage.clear();

            } catch (error) {

                console.warn(
                    "Unable to clear storage.",
                    error
                );

            }


            showToast(
                "Account Deletion Requested",
                "Your account deletion request has been submitted.",
                "fa-solid fa-trash"
            );


            setTimeout(
                () => {

                    window.location.href =
                        "../../auth/role-selection/index.html";

                },
                1200
            );

        }
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
                    "Unable to clear session.",
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
   TOAST
======================================================= */

function showToast(
    title,
    message,
    icon = "fa-solid fa-circle-info"
) {

    let toast =
        document.querySelector(
            ".settings-toast"
        );


    if (!toast) {

        toast =
            document.createElement(
                "div"
            );


        toast.className =
            "settings-toast";


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
                aria-label="Close"
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
            () => {

                hideToast(toast);

            }
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
            () => {

                hideToast(toast);

            },
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
   CAPITALIZE
======================================================= */

function capitalize(value) {

    if (!value) {
        return "";
    }


    return value.charAt(0).toUpperCase() +
        value.slice(1);

}