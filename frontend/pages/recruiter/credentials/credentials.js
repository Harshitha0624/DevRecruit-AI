/* =======================================================
   DEVRECRUIT — CREDENTIAL VERIFICATION
======================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* ===================================================
       ELEMENTS
    =================================================== */

    const sidebar =
        document.querySelector("#credentialsSidebar");

    const sidebarOverlay =
        document.querySelector("#sidebarOverlay");

    const mobileMenuButton =
        document.querySelector("#mobileMenuButton");

    const sidebarClose =
        document.querySelector("#sidebarClose");

    const searchInput =
        document.querySelector("#credentialSearch");

    const statusFilter =
        document.querySelector("#credentialStatusFilter");

    const typeFilter =
        document.querySelector("#credentialTypeFilter");

    const clearFiltersButton =
        document.querySelector("#clearCredentialFilters");

    const refreshButton =
        document.querySelector("#refreshCredentials");

    const refreshListButton =
        document.querySelector("#refreshCredentialList");

    const tableBody =
        document.querySelector("#credentialTableBody");


    /* ===================================================
       SIDEBAR
    =================================================== */

    function openSidebar() {

        if (!sidebar) return;

        sidebar.classList.add("open");

        sidebarOverlay?.classList.add("active");
    }


    function closeSidebar() {

        if (!sidebar) return;

        sidebar.classList.remove("open");

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
       FILTER CREDENTIALS
    =================================================== */

    function filterCredentials() {

        if (!tableBody) return;

        const rows =
            tableBody.querySelectorAll("tr");

        const searchTerm =
            searchInput?.value
                .trim()
                .toLowerCase() || "";

        const selectedStatus =
            statusFilter?.value || "all";

        const selectedType =
            typeFilter?.value || "all";


        rows.forEach((row) => {

            const name =
                (row.dataset.name || "").toLowerCase();

            const credential =
                (row.dataset.credential || "").toLowerCase();

            const institution =
                (row.dataset.institution || "").toLowerCase();

            const status =
                (row.dataset.status || "").toLowerCase();

            const type =
                (row.dataset.type || "").toLowerCase();


            const matchesSearch =
                !searchTerm ||
                name.includes(searchTerm) ||
                credential.includes(searchTerm) ||
                institution.includes(searchTerm);


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


    searchInput?.addEventListener(
        "input",
        filterCredentials
    );


    statusFilter?.addEventListener(
        "change",
        filterCredentials
    );


    typeFilter?.addEventListener(
        "change",
        filterCredentials
    );


    /* ===================================================
       TABLE QUICK FILTERS
    =================================================== */

    const tableActions =
        document.querySelectorAll(".table-action");


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


            filterCredentials();

        });

    });


    /* ===================================================
       CLEAR FILTERS
    =================================================== */

    clearFiltersButton?.addEventListener(
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


            allButton?.classList.add("active");


            filterCredentials();


            showToast(
                "Filters Cleared",
                "All credential filters have been reset."
            );

        }
    );


    /* ===================================================
       CREDENTIAL DETAILS MODAL
    =================================================== */

    const credentialModal =
        document.querySelector("#credentialModal");

    const modalBackdrop =
        document.querySelector("#modalBackdrop");

    const modalClose =
        document.querySelector("#modalClose");


    const viewButtons =
        document.querySelectorAll(".credential-view");


    viewButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const row =
                    button.closest("tr");


                if (!row) return;


                populateCredentialModal(row);

                openCredentialModal();

            }
        );

    });


    function populateCredentialModal(row) {

        const candidate =
            row.dataset.name ||
            "Candidate";

        const credential =
            row.dataset.credential ||
            "Credential";

        const institution =
            row.dataset.institution ||
            "Institution";

        const status =
            row.dataset.status ||
            "pending";

        const type =
            row.dataset.type ||
            "certification";


        setText(
            "#modalCredentialName",
            credential
        );

        setText(
            "#modalCandidateName",
            candidate
        );

        setText(
            "#modalCandidate",
            candidate
        );

        setText(
            "#modalCredentialType",
            formatValue(type)
        );

        setText(
            "#modalIssuer",
            institution
        );


        const cells =
            row.querySelectorAll("td");


        if (cells.length >= 8) {

            setText(
                "#modalIssueDate",
                cells[5]?.textContent.trim() || "—"
            );

        }


        updateVerificationResult(status);

        updateBlockchainData(row);

    }


    function updateVerificationResult(status) {

        const result =
            document.querySelector("#verificationResult");

        const icon =
            document.querySelector(
                ".verification-result-icon i"
            );

        const title =
            document.querySelector("#verificationTitle");

        const message =
            document.querySelector("#verificationMessage");


        if (!result) return;


        result.classList.remove(
            "verified",
            "pending",
            "flagged"
        );


        result.classList.add(status);


        if (status === "verified") {

            if (icon) {
                icon.className =
                    "fa-solid fa-circle-check";
            }

            if (title) {
                title.textContent =
                    "Credential Verified";
            }

            if (message) {
                message.textContent =
                    "This credential matches the verified blockchain record.";
            }

        }


        else if (status === "pending") {

            if (icon) {
                icon.className =
                    "fa-solid fa-clock";
            }

            if (title) {
                title.textContent =
                    "Verification Pending";
            }

            if (message) {
                message.textContent =
                    "This credential is awaiting blockchain verification.";
            }

        }


        else {

            if (icon) {
                icon.className =
                    "fa-solid fa-triangle-exclamation";
            }

            if (title) {
                title.textContent =
                    "Credential Flagged";
            }

            if (message) {
                message.textContent =
                    "This credential requires manual recruiter review.";
            }

        }

    }


    function updateBlockchainData(row) {

        const status =
            row.dataset.status || "pending";


        const hash =
            status === "verified"
                ? "0x8f4c2d91...92ab7d"
                : status === "pending"
                    ? "Pending blockchain transaction"
                    : "Verification record flagged";


        const block =
            status === "verified"
                ? "#18,429,731"
                : "—";


        const network =
            status === "verified"
                ? "Ethereum"
                : "Awaiting confirmation";


        setText(
            "#transactionHash",
            hash
        );

        setText(
            "#blockNumber",
            block
        );

        setText(
            "#blockchainNetwork",
            network
        );


        const ipfsHash =
            status === "verified"
                ? "QmX7b...4f8A"
                : "Pending";


        setText(
            "#ipfsHash",
            ipfsHash
        );

    }


    function setText(selector, value) {

        const element =
            document.querySelector(selector);


        if (element) {
            element.textContent = value;
        }

    }


    function formatValue(value) {

        if (!value) return "";

        return value.charAt(0).toUpperCase() +
            value.slice(1);

    }


    function openCredentialModal() {

        credentialModal?.classList.add("open");

        document.body.style.overflow = "hidden";

    }


    function closeCredentialModal() {

        credentialModal?.classList.remove("open");

        document.body.style.overflow = "";

    }


    modalClose?.addEventListener(
        "click",
        closeCredentialModal
    );


    modalBackdrop?.addEventListener(
        "click",
        closeCredentialModal
    );


    /* ===================================================
       MANUAL VERIFICATION MODAL
    =================================================== */

    const verifyModal =
        document.querySelector("#verifyModal");

    const verifyButton =
        document.querySelector("#verifyCredentialButton");

    const verifyBackdrop =
        document.querySelector("#verifyBackdrop");

    const verifyClose =
        document.querySelector("#verifyClose");

    const verifyCancel =
        document.querySelector("#verifyCancel");


    function openVerifyModal() {

        verifyModal?.classList.add("open");

        document.body.style.overflow = "hidden";

    }


    function closeVerifyModal() {

        verifyModal?.classList.remove("open");

        document.body.style.overflow = "";

    }


    verifyButton?.addEventListener(
        "click",
        openVerifyModal
    );


    verifyClose?.addEventListener(
        "click",
        closeVerifyModal
    );


    verifyCancel?.addEventListener(
        "click",
        closeVerifyModal
    );


    verifyBackdrop?.addEventListener(
        "click",
        closeVerifyModal
    );


    /* ===================================================
       VERIFICATION FORM
    =================================================== */

    const verifyForm =
        document.querySelector("#verifyCredentialForm");


    verifyForm?.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            const email =
                document.querySelector(
                    "#candidateEmail"
                )?.value.trim();


            const credentialId =
                document.querySelector(
                    "#credentialId"
                )?.value.trim();


            const hash =
                document.querySelector(
                    "#credentialHash"
                )?.value.trim();


            if (!email ||
                !credentialId ||
                !hash) {

                showToast(
                    "Missing Information",
                    "Please complete all verification fields."
                );

                return;

            }


            closeVerifyModal();


            verifyForm.reset();


            showToast(
                "Verification Started",
                "The credential is being checked against the blockchain record."
            );


            console.log(
                "Credential verification request:",
                {
                    email,
                    credentialId,
                    hash
                }
            );

        }
    );


    /* ===================================================
       COPY TRANSACTION HASH
    =================================================== */

    const copyHashButton =
        document.querySelector("#copyHashButton");


    copyHashButton?.addEventListener(
        "click",
        async () => {

            const hash =
                document.querySelector(
                    "#transactionHash"
                )?.textContent.trim();


            if (!hash) return;


            try {

                await navigator.clipboard.writeText(hash);

                showToast(
                    "Hash Copied",
                    "Transaction hash copied to clipboard."
                );

            }

            catch (error) {

                showToast(
                    "Copy Failed",
                    "Unable to copy the transaction hash."
                );

            }

        }
    );


    /* ===================================================
       RE-VERIFY
    =================================================== */

    const reverifyButton =
        document.querySelector(
            "#reverifyCredentialButton"
        );


    reverifyButton?.addEventListener(
        "click",
        () => {

            showToast(
                "Verification Started",
                "Checking the credential against the latest blockchain record."
            );

        }
    );


    /* ===================================================
       APPROVE CREDENTIAL
    =================================================== */

    const approveButton =
        document.querySelector(
            "#approveCredentialButton"
        );


    approveButton?.addEventListener(
        "click",
        () => {

            const result =
                document.querySelector(
                    "#verificationResult"
                );


            if (result) {

                result.classList.remove(
                    "pending",
                    "flagged"
                );

                result.classList.add(
                    "verified"
                );

            }


            setText(
                "#verificationTitle",
                "Credential Approved"
            );


            setText(
                "#verificationMessage",
                "The recruiter has approved this credential."
            );


            const icon =
                document.querySelector(
                    ".verification-result-icon i"
                );


            if (icon) {

                icon.className =
                    "fa-solid fa-circle-check";

            }


            showToast(
                "Credential Approved",
                "The credential has been approved successfully."
            );

        }
    );


    /* ===================================================
       VIEW DOCUMENT
    =================================================== */

    const documentButton =
        document.querySelector(
            "#downloadCredentialButton"
        );


    documentButton?.addEventListener(
        "click",
        () => {

            showToast(
                "Credential Document",
                "The decentralized document viewer will be connected to IPFS."
            );

        }
    );


    /* ===================================================
       VIEW IPFS
    =================================================== */

    const ipfsButton =
        document.querySelector(
            "#viewIpfsButton"
        );


    ipfsButton?.addEventListener(
        "click",
        () => {

            const hash =
                document.querySelector(
                    "#ipfsHash"
                )?.textContent.trim();


            showToast(
                "IPFS Document",
                `Opening decentralized document: ${hash}`
            );

        }
    );


    /* ===================================================
       VERIFICATION GUIDE
    =================================================== */

    const guideButton =
        document.querySelector(
            "#verificationGuideButton"
        );


    guideButton?.addEventListener(
        "click",
        () => {

            showToast(
                "Verification Guide",
                "Credentials are checked using issuer data, blockchain records and decentralized document hashes."
            );

        }
    );


    /* ===================================================
       REFRESH
    =================================================== */

    function refreshCredentials() {

        if (!tableBody) return;


        tableBody.style.opacity = "0.45";


        setTimeout(() => {

            tableBody.style.opacity = "1";


            showToast(
                "Credentials Refreshed",
                "Credential verification data has been refreshed."
            );

        }, 500);

    }


    refreshButton?.addEventListener(
        "click",
        refreshCredentials
    );


    refreshListButton?.addEventListener(
        "click",
        refreshCredentials
    );


    /* ===================================================
       PAGINATION
    =================================================== */

    const paginationButtons =
        document.querySelectorAll(
            ".pagination-number"
        );


    paginationButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                paginationButtons.forEach(
                    (item) => {
                        item.classList.remove("active");
                    }
                );


                button.classList.add("active");


                showToast(
                    "Page Changed",
                    `Showing credential records from page ${button.textContent.trim()}.`
                );

            }
        );

    });


    /* ===================================================
       LOGOUT
    =================================================== */

    const logoutButton =
        document.querySelector("#logoutButton");


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
        document.querySelector("#credentialsToast");

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


        toastTimer =
            setTimeout(() => {

                hideToast();

            }, 4000);

    }


    function hideToast() {

        toast?.classList.remove("show");

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

            if (event.key !== "Escape") return;


            closeSidebar();
            closeCredentialModal();
            closeVerifyModal();
            hideToast();

        }
    );


    /* ===================================================
       INITIALIZE
    =================================================== */

    filterCredentials();

});