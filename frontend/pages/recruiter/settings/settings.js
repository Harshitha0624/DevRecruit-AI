/* =======================================================
   DEVRECRUIT — RECRUITER SETTINGS
======================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* ===================================================
       ELEMENTS
    =================================================== */

    const sidebar =
        document.querySelector("#settingsSidebar");

    const overlay =
        document.querySelector("#sidebarOverlay");

    const mobileMenu =
        document.querySelector("#mobileMenuButton");

    const sidebarClose =
        document.querySelector("#sidebarClose");

    const toast =
        document.querySelector("#settingsToast");

    const toastTitle =
        document.querySelector("#toastTitle");

    const toastMessage =
        document.querySelector("#toastMessage");

    const toastClose =
        document.querySelector("#toastClose");

    let toastTimer;


    /* ===================================================
       SIDEBAR
    =================================================== */

    function openSidebar() {

        sidebar?.classList.add("open");
        overlay?.classList.add("active");

    }


    function closeSidebar() {

        sidebar?.classList.remove("open");
        overlay?.classList.remove("active");

    }


    mobileMenu?.addEventListener(
        "click",
        openSidebar
    );

    sidebarClose?.addEventListener(
        "click",
        closeSidebar
    );

    overlay?.addEventListener(
        "click",
        closeSidebar
    );


    /* ===================================================
       TOAST
    =================================================== */

    function showToast(
        title,
        message
    ) {

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
            toast.classList.remove("show");
        }, 3500);

    }


    toastClose?.addEventListener(
        "click",
        () => {
            toast?.classList.remove("show");
        }
    );


    /* ===================================================
       SETTINGS MENU
    =================================================== */

    const menuItems =
        document.querySelectorAll(
            ".settings-menu-item"
        );

    const panels =
        document.querySelectorAll(
            ".settings-panel"
        );


    menuItems.forEach((item) => {

        item.addEventListener(
            "click",
            () => {

                const section =
                    item.dataset.section;

                if (!section) return;


                menuItems.forEach((menuItem) => {

                    menuItem.classList.remove(
                        "active"
                    );

                });


                panels.forEach((panel) => {

                    panel.classList.remove(
                        "active"
                    );

                });


                item.classList.add(
                    "active"
                );


                const selectedPanel =
                    document.querySelector(
                        `#${section}Section`
                    );


                selectedPanel?.classList.add(
                    "active"
                );


                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );

    });


    /* ===================================================
       PROFILE FORM
    =================================================== */

    const profileForm =
        document.querySelector(
            "#profileForm"
        );

    const resetProfile =
        document.querySelector(
            "#resetProfile"
        );


    const originalProfileValues = {

        firstName:
            document.querySelector("#firstName")?.value || "",

        lastName:
            document.querySelector("#lastName")?.value || "",

        email:
            document.querySelector("#email")?.value || "",

        phone:
            document.querySelector("#phone")?.value || "",

        jobTitle:
            document.querySelector("#jobTitle")?.value || "",

        department:
            document.querySelector("#department")?.value || "",

        bio:
            document.querySelector("#bio")?.value || ""

    };


    profileForm?.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            const firstName =
                document.querySelector(
                    "#firstName"
                )?.value.trim();

            const lastName =
                document.querySelector(
                    "#lastName"
                )?.value.trim();

            const email =
                document.querySelector(
                    "#email"
                )?.value.trim();


            if (
                !firstName ||
                !lastName ||
                !email
            ) {

                showToast(
                    "Missing Information",
                    "Please complete the required profile fields."
                );

                return;

            }


            if (!isValidEmail(email)) {

                showToast(
                    "Invalid Email",
                    "Please enter a valid email address."
                );

                return;

            }


            showToast(
                "Profile Saved",
                "Your recruiter profile has been updated successfully."
            );

        }
    );


    resetProfile?.addEventListener(
        "click",
        () => {

            Object.entries(
                originalProfileValues
            ).forEach(
                ([id, value]) => {

                    const field =
                        document.querySelector(
                            `#${id}`
                        );

                    if (field) {
                        field.value = value;
                    }

                }
            );


            showToast(
                "Changes Cancelled",
                "Your profile changes have been reset."
            );

        }
    );


    /* ===================================================
       EMAIL VALIDATION
    =================================================== */

    function isValidEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            email
        );

    }


    /* ===================================================
       COMPANY FORM
    =================================================== */

    const companyForm =
        document.querySelector(
            "#companyForm"
        );


    companyForm?.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            const companyName =
                document.querySelector(
                    "#companyName"
                )?.value.trim();


            if (!companyName) {

                showToast(
                    "Missing Information",
                    "Please enter your company name."
                );

                return;

            }


            showToast(
                "Company Details Saved",
                "Your organization information has been updated."
            );

        }
    );


    /* ===================================================
       NOTIFICATION PREFERENCES
    =================================================== */

    const saveNotifications =
        document.querySelector(
            "#saveNotifications"
        );


    saveNotifications?.addEventListener(
        "click",
        () => {

            const switches =
                document.querySelectorAll(
                    "#notificationsSection .switch input"
                );


            const enabledCount =
                Array.from(switches).filter(
                    (input) => input.checked
                ).length;


            showToast(
                "Notification Preferences Saved",
                `${enabledCount} notification preferences are enabled.`
            );

        }
    );


    /* ===================================================
       PASSWORD VISIBILITY
    =================================================== */

    const passwordToggles =
        document.querySelectorAll(
            ".password-toggle"
        );


    passwordToggles.forEach(
        (toggle) => {

            toggle.addEventListener(
                "click",
                () => {

                    const targetId =
                        toggle.dataset.target;

                    const input =
                        document.querySelector(
                            `#${targetId}`
                        );

                    const icon =
                        toggle.querySelector("i");


                    if (!input) return;


                    if (
                        input.type ===
                        "password"
                    ) {

                        input.type =
                            "text";

                        icon?.classList.remove(
                            "fa-eye"
                        );

                        icon?.classList.add(
                            "fa-eye-slash"
                        );

                    } else {

                        input.type =
                            "password";

                        icon?.classList.remove(
                            "fa-eye-slash"
                        );

                        icon?.classList.add(
                            "fa-eye"
                        );

                    }

                }
            );

        }
    );


    /* ===================================================
       SECURITY / PASSWORD
    =================================================== */

    const securityForm =
        document.querySelector(
            "#securityForm"
        );


    securityForm?.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            const currentPassword =
                document.querySelector(
                    "#currentPassword"
                )?.value;


            const newPassword =
                document.querySelector(
                    "#newPassword"
                )?.value;


            const confirmPassword =
                document.querySelector(
                    "#confirmPassword"
                )?.value;


            if (
                !currentPassword ||
                !newPassword ||
                !confirmPassword
            ) {

                showToast(
                    "Missing Information",
                    "Please complete all password fields."
                );

                return;

            }


            if (newPassword.length < 8) {

                showToast(
                    "Weak Password",
                    "Your new password must contain at least 8 characters."
                );

                return;

            }


            if (
                newPassword !==
                confirmPassword
            ) {

                showToast(
                    "Passwords Do Not Match",
                    "Please make sure both new password fields match."
                );

                return;

            }


            showToast(
                "Password Updated",
                "Your password has been updated successfully."
            );


            securityForm.reset();

        }
    );


    /* ===================================================
       TWO-FACTOR AUTHENTICATION
    =================================================== */

    const twoFactorToggle =
        document.querySelector(
            "#twoFactorToggle"
        );


    twoFactorToggle?.addEventListener(
        "change",
        () => {

            if (
                twoFactorToggle.checked
            ) {

                showToast(
                    "Two-Factor Enabled",
                    "Additional account protection is active."
                );

            } else {

                showToast(
                    "Two-Factor Disabled",
                    "Two-factor authentication has been turned off."
                );

            }

        }
    );


    /* ===================================================
       AI PREFERENCES
    =================================================== */

    const saveAIPreferences =
        document.querySelector(
            "#saveAIPreferences"
        );


    saveAIPreferences?.addEventListener(
        "click",
        () => {

            const switches =
                document.querySelectorAll(
                    "#aiSection .switch input"
                );


            const enabled =
                Array.from(
                    switches
                ).filter(
                    (input) =>
                        input.checked
                ).length;


            showToast(
                "AI Preferences Saved",
                `${enabled} AI recruitment features are currently enabled.`
            );

        }
    );


    /* ===================================================
       APPEARANCE / THEME
    =================================================== */

    const themeCards =
        document.querySelectorAll(
            ".theme-card"
        );


    let selectedTheme =
        "light";


    themeCards.forEach(
        (card) => {

            card.addEventListener(
                "click",
                () => {

                    selectedTheme =
                        card.dataset.theme ||
                        "light";


                    themeCards.forEach(
                        (themeCard) => {

                            themeCard.classList.remove(
                                "active"
                            );

                        }
                    );


                    card.classList.add(
                        "active"
                    );


                    applyTheme(
                        selectedTheme
                    );

                }
            );

        }
    );


    function applyTheme(theme) {

        if (theme === "dark") {

            document.documentElement.dataset.theme =
                "dark";

            showToast(
                "Dark Theme Selected",
                "Dark appearance will be connected to the global theme system."
            );

            return;

        }


        if (theme === "system") {

            document.documentElement.dataset.theme =
                "system";

            showToast(
                "System Theme Selected",
                "Your interface will follow your device preference."
            );

            return;

        }


        document.documentElement.dataset.theme =
            "light";

    }


    const saveAppearance =
        document.querySelector(
            "#saveAppearance"
        );


    saveAppearance?.addEventListener(
        "click",
        () => {

            try {

                localStorage.setItem(
                    "devrecruitTheme",
                    selectedTheme
                );

            } catch (error) {

                console.warn(
                    "Unable to save theme preference.",
                    error
                );

            }


            showToast(
                "Appearance Saved",
                `${capitalize(selectedTheme)} theme preference has been saved.`
            );

        }
    );


    /* ===================================================
       LOAD SAVED THEME
    =================================================== */

    try {

        const savedTheme =
            localStorage.getItem(
                "devrecruitTheme"
            );


        if (
            savedTheme &&
            ["light", "dark", "system"].includes(
                savedTheme
            )
        ) {

            selectedTheme =
                savedTheme;


            themeCards.forEach(
                (card) => {

                    card.classList.toggle(
                        "active",
                        card.dataset.theme ===
                        savedTheme
                    );

                }
            );


            document.documentElement.dataset.theme =
                savedTheme;

        }

    } catch (error) {

        console.warn(
            "Unable to load saved theme.",
            error
        );

    }


    /* ===================================================
       INTEGRATIONS
    =================================================== */

    const integrationButtons =
        document.querySelectorAll(
            ".integration-button"
        );


    integrationButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const card =
                        button.closest(
                            ".integration-card"
                        );


                    const name =
                        card?.querySelector(
                            ".integration-info strong"
                        )?.textContent ||
                        "Service";


                    if (
                        button.classList.contains(
                            "connected"
                        )
                    ) {

                        showToast(
                            `${name} Settings`,
                            `Manage ${name} integration settings from here.`
                        );

                    } else {

                        button.textContent =
                            "Connected";

                        button.classList.add(
                            "connected"
                        );


                        const badge =
                            card?.querySelector(
                                ".available-badge"
                            );


                        if (badge) {

                            badge.textContent =
                                "Connected";

                            badge.className =
                                "connected-badge";

                        }


                        showToast(
                            `${name} Connected`,
                            `${name} integration has been connected successfully.`
                        );

                    }

                }
            );

        }
    );


    /* ===================================================
       PROFILE AVATAR
    =================================================== */

    const changeAvatarButton =
        document.querySelector(
            "#changeAvatarButton"
        );

    const avatarInput =
        document.querySelector(
            "#avatarInput"
        );

    const profileLargeAvatar =
        document.querySelector(
            ".profile-large-avatar"
        );


    changeAvatarButton?.addEventListener(
        "click",
        () => {

            avatarInput?.click();

        }
    );


    avatarInput?.addEventListener(
        "change",
        () => {

            const file =
                avatarInput.files?.[0];


            if (!file) return;


            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                showToast(
                    "Invalid File",
                    "Please select a valid image file."
                );

                avatarInput.value =
                    "";

                return;

            }


            if (
                file.size >
                5 * 1024 * 1024
            ) {

                showToast(
                    "File Too Large",
                    "Profile images must be smaller than 5 MB."
                );

                avatarInput.value =
                    "";

                return;

            }


            const reader =
                new FileReader();


            reader.onload =
                (event) => {

                    profileLargeAvatar.style.backgroundImage =
                        `url("${event.target.result}")`;

                    profileLargeAvatar.style.backgroundSize =
                        "cover";

                    profileLargeAvatar.style.backgroundPosition =
                        "center";

                    profileLargeAvatar.style.color =
                        "transparent";


                    showToast(
                        "Profile Photo Updated",
                        "Your new profile image is ready to save."
                    );

                };


            reader.readAsDataURL(
                file
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
       ESCAPE KEY
    =================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key ===
                "Escape"
            ) {

                closeSidebar();

                toast?.classList.remove(
                    "show"
                );

            }

        }
    );


    /* ===================================================
       HELPER
    =================================================== */

    function capitalize(value) {

        if (!value) return "";

        return (
            value.charAt(0).toUpperCase() +
            value.slice(1)
        );

    }


    /* ===================================================
       INITIALIZE
    =================================================== */

    console.log(
        "DevRecruit Recruiter Settings initialized successfully."
    );

});