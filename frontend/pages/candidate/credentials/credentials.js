"use strict";

document.addEventListener("DOMContentLoaded", () => {

    initializeSidebar();
    initializeCredentialFilters();
    initializeCredentialSearch();
    initializeCredentialActions();
    initializeVerification();
    initializeAIAdvisor();
    initializeLogout();

    updateCredentialCount();

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
   CREDENTIAL FILTERS
======================================================= */

function initializeCredentialFilters() {

    const tabs =
        document.querySelectorAll(
            ".credential-tab"
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


                applyCredentialFilters();

            }
        );

    });

}


/* =======================================================
   SEARCH
======================================================= */

function initializeCredentialSearch() {

    const searchInput =
        document.getElementById(
            "credentialSearch"
        );


    if (!searchInput) {
        return;
    }


    searchInput.addEventListener(
        "input",
        applyCredentialFilters
    );

}


/* =======================================================
   FILTER CREDENTIALS
======================================================= */

function applyCredentialFilters() {

    const activeTab =
        document.querySelector(
            ".credential-tab.active"
        );


    const searchInput =
        document.getElementById(
            "credentialSearch"
        );


    const cards =
        document.querySelectorAll(
            ".credential-card"
        );


    const emptyState =
        document.getElementById(
            "credentialEmpty"
        );


    const selectedStatus =
        activeTab
            ? activeTab.dataset.status
            : "all";


    const searchTerm =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    let visibleCards = 0;


    cards.forEach(card => {

        const status =
            card.dataset.status || "";


        const title =
            card.dataset.title ||
            card.innerText ||
            "";


        const matchesStatus =
            selectedStatus === "all" ||
            status === selectedStatus;


        const matchesSearch =
            searchTerm === "" ||
            title
                .toLowerCase()
                .includes(searchTerm);


        if (
            matchesStatus &&
            matchesSearch
        ) {

            card.style.display = "";

            visibleCards++;

        } else {

            card.style.display = "none";

        }

    });


    if (emptyState) {

        if (visibleCards === 0) {

            emptyState.classList.add(
                "visible"
            );

        } else {

            emptyState.classList.remove(
                "visible"
            );

        }

    }


    updateCredentialCount();

}


/* =======================================================
   COUNT
======================================================= */

function updateCredentialCount() {

    const countElement =
        document.getElementById(
            "credentialCount"
        );


    if (!countElement) {
        return;
    }


    const cards =
        document.querySelectorAll(
            ".credential-card"
        );


    let visibleCount = 0;


    cards.forEach(card => {

        if (
            card.style.display !== "none"
        ) {

            visibleCount++;

        }

    });


    countElement.textContent =
        `${visibleCount} credential${visibleCount === 1 ? "" : "s"}`;

}


/* =======================================================
   CREDENTIAL ACTIONS
======================================================= */

function initializeCredentialActions() {

    const viewButtons =
        document.querySelectorAll(
            ".view-credential"
        );


    const verifyButtons =
        document.querySelectorAll(
            ".verify-credential"
        );


    const pendingButtons =
        document.querySelectorAll(
            ".pending-action"
        );


    const copyButtons =
        document.querySelectorAll(
            ".copy-id"
        );


    viewButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const credential =
                    button.dataset.credential ||
                    "Credential";


                showToast(
                    "Credential Details",
                    `${credential} details are ready to view.`,
                    "fa-solid fa-certificate"
                );

            }
        );

    });


    verifyButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const credential =
                    button.dataset.credential ||
                    "Credential";


                verifyCredential(
                    credential,
                    button
                );

            }
        );

    });


    pendingButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const credential =
                    button.dataset.credential ||
                    "Credential";


                showToast(
                    "Verification Pending",
                    `${credential} is currently waiting for verification.`,
                    "fa-solid fa-clock"
                );

            }
        );

    });


    copyButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const id =
                    button.dataset.id;


                if (!id) {
                    return;
                }


                copyVerificationId(
                    id,
                    button
                );

            }
        );

    });

}


/* =======================================================
   VERIFY CREDENTIAL
======================================================= */

function verifyCredential(
    credential,
    button
) {

    if (!button) {
        return;
    }


    const originalHTML =
        button.innerHTML;


    button.disabled = true;


    button.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Checking
    `;


    setTimeout(
        () => {

            button.disabled = false;

            button.innerHTML =
                originalHTML;


            showToast(
                "Credential Verified",
                `${credential} passed the verification check.`,
                "fa-solid fa-shield-check"
            );

        },
        1200
    );

}


/* =======================================================
   COPY VERIFICATION ID
======================================================= */

function copyVerificationId(
    verificationId,
    button
) {

    if (
        !navigator.clipboard ||
        !navigator.clipboard.writeText
    ) {

        showToast(
            "Verification ID",
            verificationId,
            "fa-solid fa-fingerprint"
        );

        return;
    }


    navigator.clipboard
        .writeText(verificationId)
        .then(() => {

            const originalHTML =
                button.innerHTML;


            button.innerHTML =
                `<i class="fa-solid fa-check"></i>`;


            showToast(
                "Copied",
                `${verificationId} copied to clipboard.`,
                "fa-solid fa-copy"
            );


            setTimeout(
                () => {

                    button.innerHTML =
                        originalHTML;

                },
                1200
            );

        })
        .catch(() => {

            showToast(
                "Verification ID",
                verificationId,
                "fa-solid fa-fingerprint"
            );

        });

}


/* =======================================================
   QUICK VERIFICATION
======================================================= */

function initializeVerification() {

    const input =
        document.getElementById(
            "verificationInput"
        );


    const button =
        document.getElementById(
            "quickVerifyButton"
        );


    if (!input || !button) {
        return;
    }


    function performVerification() {

        const value =
            input.value
                .trim()
                .toUpperCase();


        if (!value) {

            showToast(
                "Verification ID Required",
                "Enter a credential verification ID first.",
                "fa-solid fa-circle-exclamation"
            );

            input.focus();

            return;
        }


        button.disabled = true;


        button.innerHTML =
            `<i class="fa-solid fa-spinner fa-spin"></i>`;


        setTimeout(
            () => {

                button.disabled = false;

                button.innerHTML =
                    `<i class="fa-solid fa-arrow-right"></i>`;


                const validIds = [
                    "DR-PY-8F42A1",
                    "DR-API-71C92B",
                    "DR-SQL-53D82C",
                    "DR-ML-29E51F"
                ];


                if (
                    validIds.includes(value)
                ) {

                    showToast(
                        "Credential Verified",
                        `${value} is a valid registered credential.`,
                        "fa-solid fa-circle-check"
                    );

                } else {

                    showToast(
                        "Verification Result",
                        `${value} could not be matched with the current registered credentials.`,
                        "fa-solid fa-circle-exclamation"
                    );

                }

            },
            1000
        );

    }


    button.addEventListener(
        "click",
        performVerification
    );


    input.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                event.preventDefault();

                performVerification();

            }

        }
    );

}


/* =======================================================
   HERO VERIFY BUTTON
======================================================= */

const heroVerifyButton =
    document.getElementById(
        "verifyCredentialButton"
    );


if (heroVerifyButton) {

    heroVerifyButton.addEventListener(
        "click",
        () => {

            const input =
                document.getElementById(
                    "verificationInput"
                );


            if (input) {

                input.focus();

                input.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }


            showToast(
                "Credential Verification",
                "Enter a verification ID to check its authenticity.",
                "fa-solid fa-shield-halved"
            );

        }
    );

}


/* =======================================================
   SHARE VERIFICATION
======================================================= */

const shareProfileButton =
    document.getElementById(
        "shareProfileButton"
    );


if (shareProfileButton) {

    shareProfileButton.addEventListener(
        "click",
        async () => {

            const shareData = {

                title:
                    "DevRecruit Verified Profile",

                text:
                    "View my verified developer credentials on DevRecruit AI.",

                url:
                    window.location.href

            };


            if (
                navigator.share
            ) {

                try {

                    await navigator.share(
                        shareData
                    );

                    showToast(
                        "Profile Shared",
                        "Your verification profile was shared successfully.",
                        "fa-solid fa-share-nodes"
                    );

                } catch (error) {

                    if (
                        error.name !==
                        "AbortError"
                    ) {

                        showToast(
                            "Share Cancelled",
                            "The sharing window was closed.",
                            "fa-solid fa-circle-info"
                        );

                    }

                }

                return;
            }


            if (
                navigator.clipboard
            ) {

                try {

                    await navigator.clipboard.writeText(
                        window.location.href
                    );


                    showToast(
                        "Verification Link Copied",
                        "Your verification profile link is ready to share.",
                        "fa-solid fa-link"
                    );

                } catch (error) {

                    showToast(
                        "Share Profile",
                        "Your verification profile is ready to share.",
                        "fa-solid fa-share-nodes"
                    );

                }

            } else {

                showToast(
                    "Share Profile",
                    "Your verification profile is ready to share.",
                    "fa-solid fa-share-nodes"
                );

            }

        }
    );

}


/* =======================================================
   AI ADVISOR
======================================================= */

function initializeAIAdvisor() {

    const button =
        document.getElementById(
            "credentialAdvisorButton"
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
                        "AI Credential Recommendation",
                        "Cloud Engineering and System Design are the strongest next credentials for your target developer profile.",
                        "fa-solid fa-wand-magic-sparkles"
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
            ".credentials-toast"
        );


    if (!toast) {

        toast =
            document.createElement("div");

        toast.className =
            "credentials-toast";


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


    toast.classList.add("show");


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
   ACTIVE NAVIGATION
======================================================= */

function setActiveNavigation() {

    const currentPage =
        window.location.pathname
            .toLowerCase();


    document.querySelectorAll(
        ".candidate-sidebar .nav-item"
    ).forEach(item => {

        const href =
            item.getAttribute("href");


        if (!href) {
            return;
        }


        if (
            currentPage.includes(
                "credentials"
            ) &&
            href.includes(
                "credentials"
            )
        ) {

            item.classList.add(
                "active"
            );

        }

    });

}


setActiveNavigation();