/* =======================================================
   DEVRECRUIT AI
   RECRUITER LOGIN
======================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* ===================================================
       ELEMENTS
    =================================================== */

    const loginForm =
        document.querySelector("#recruiterLoginForm");

    const emailInput =
        document.querySelector("#recruiterEmail");

    const passwordInput =
        document.querySelector("#recruiterPassword");

    const passwordToggle =
        document.querySelector("#passwordToggle");

    const loginButton =
        document.querySelector(".login-button");

    const loginMessage =
        document.querySelector("#loginMessage");

    const forgotPassword =
        document.querySelector("#forgotPassword");


    /* ===================================================
       BACKEND API
    =================================================== */

    const API_BASE_URL = "http://127.0.0.1:8000";


    /* ===================================================
       PASSWORD VISIBILITY
    =================================================== */

    if (passwordToggle && passwordInput) {

        passwordToggle.addEventListener("click", () => {

            const icon =
                passwordToggle.querySelector("i");

            const showingPassword =
                passwordInput.type === "text";

            passwordInput.type =
                showingPassword
                    ? "password"
                    : "text";

            if (icon) {

                icon.classList.toggle(
                    "fa-eye",
                    showingPassword
                );

                icon.classList.toggle(
                    "fa-eye-slash",
                    !showingPassword
                );

            }

            passwordToggle.setAttribute(
                "aria-label",
                showingPassword
                    ? "Show password"
                    : "Hide password"
            );

            passwordInput.focus();

        });

    }


    /* ===================================================
       INPUT INTERACTION
    =================================================== */

    [emailInput, passwordInput].forEach(input => {

        if (!input) return;

        input.addEventListener("input", () => {

            clearFieldError(input);

            if (loginMessage) {

                loginMessage.textContent = "";

                loginMessage.className =
                    "login-message";

            }

        });

    });


    /* ===================================================
       FORM SUBMISSION
    =================================================== */

    if (loginForm) {

        loginForm.addEventListener("submit", async event => {

            event.preventDefault();


            /* -------------------------------------------
               Reset previous state
            ------------------------------------------- */

            clearMessage();

            clearFieldError(emailInput);
            clearFieldError(passwordInput);


            /* -------------------------------------------
               Get values
            ------------------------------------------- */

            const email =
                emailInput.value.trim();

            const password =
                passwordInput.value;


            /* -------------------------------------------
               Validate email
            ------------------------------------------- */

            if (!email) {

                showFieldError(
                    emailInput,
                    "Work email is required."
                );

                emailInput.focus();

                return;

            }

            if (!isValidEmail(email)) {

                showFieldError(
                    emailInput,
                    "Enter a valid work email address."
                );

                emailInput.focus();

                return;

            }


            /* -------------------------------------------
               Validate password
            ------------------------------------------- */

            if (!password) {

                showFieldError(
                    passwordInput,
                    "Password is required."
                );

                passwordInput.focus();

                return;

            }

            if (password.length < 6) {

                showFieldError(
                    passwordInput,
                    "Password must contain at least 6 characters."
                );

                passwordInput.focus();

                return;

            }


            /* -------------------------------------------
               Loading state
            ------------------------------------------- */

            setLoadingState(true);


            /* -------------------------------------------
               REAL BACKEND LOGIN
            ------------------------------------------- */

            try {

                const response = await fetch(
                    `${API_BASE_URL}/api/auth/login`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            email: email,
                            password: password
                        })
                    }
                );


                /* ---------------------------------------
                   Parse backend response
                --------------------------------------- */

                const data = await response.json();


                /* ---------------------------------------
                   Backend error
                --------------------------------------- */

                if (!response.ok) {

                    let errorMessage =
                        "Login failed. Please check your credentials.";

                    if (data.detail) {

                        errorMessage =
                            typeof data.detail === "string"
                                ? data.detail
                                : "Invalid login details.";

                    }

                    showMessage(
                        errorMessage,
                        "error"
                    );

                    setLoadingState(false);

                    return;

                }


                /* ---------------------------------------
                   Verify recruiter role
                --------------------------------------- */

                if (
                    !data.user ||
                    data.user.role !== "recruiter"
                ) {

                    showMessage(
                        "This account is not registered as a recruiter.",
                        "error"
                    );

                    setLoadingState(false);

                    return;

                }


                /* ---------------------------------------
                   Store authentication information
                --------------------------------------- */

                localStorage.setItem(
                    "access_token",
                    data.access_token
                );

                localStorage.setItem(
                    "token_type",
                    data.token_type || "bearer"
                );

                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );

                localStorage.setItem(
                    "user_id",
                    String(data.user.id)
                );

                localStorage.setItem(
                    "user_role",
                    data.user.role
                );

                localStorage.setItem(
                    "user_name",
                    data.user.full_name
                );

                localStorage.setItem(
                    "user_email",
                    data.user.email
                );


                /* ---------------------------------------
                   Success
                --------------------------------------- */

                showMessage(
                    "Login successful. Redirecting...",
                    "success"
                );


                /* ---------------------------------------
                   Redirect to recruiter dashboard
                --------------------------------------- */

                setTimeout(() => {

                    window.location.href =
                        "../dashboard/index.html";

                }, 500);


            } catch (error) {

                console.error(
                    "Recruiter login error:",
                    error
                );

                showMessage(
                    "Unable to connect to the backend. Make sure FastAPI is running on port 8000.",
                    "error"
                );

                setLoadingState(false);

            }

        });

    }


    /* ===================================================
       FORGOT PASSWORD
    =================================================== */

    if (forgotPassword) {

        forgotPassword.addEventListener("click", event => {

            event.preventDefault();

            clearMessage();

            showMessage(
                "Password recovery will be connected to the secure reset-password flow.",
                "success"
            );

        });

    }


    /* ===================================================
       EMAIL VALIDATION
    =================================================== */

    function isValidEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    }


    /* ===================================================
       FIELD ERROR
    =================================================== */

    function showFieldError(input, message) {

        if (!input) return;

        input.classList.add("input-error");

        const wrapper =
            input.closest(".input-wrapper");

        if (wrapper) {

            let error =
                wrapper.parentElement
                    .querySelector(".field-error");

            if (!error) {

                error =
                    document.createElement("small");

                error.className =
                    "field-error";

                wrapper.parentElement
                    .appendChild(error);

            }

            error.textContent = message;

        }

    }


    /* ===================================================
       CLEAR FIELD ERROR
    =================================================== */

    function clearFieldError(input) {

        if (!input) return;

        input.classList.remove("input-error");

        const parent =
            input.closest(".form-group");

        if (!parent) return;

        const error =
            parent.querySelector(".field-error");

        if (error) {

            error.remove();

        }

    }


    /* ===================================================
       MESSAGE
    =================================================== */

    function showMessage(message, type) {

        if (!loginMessage) return;

        loginMessage.textContent =
            message;

        loginMessage.className =
            `login-message ${type}`;

    }


    function clearMessage() {

        if (!loginMessage) return;

        loginMessage.textContent = "";

        loginMessage.className =
            "login-message";

    }


    /* ===================================================
       LOADING STATE
    =================================================== */

    function setLoadingState(isLoading) {

        if (!loginButton) return;

        if (isLoading) {

            loginButton.disabled = true;

            loginButton.dataset.originalText =
                loginButton.innerHTML;

            loginButton.innerHTML = `
                <span>
                    <i class="fa-solid fa-circle-notch fa-spin"></i>
                    Authenticating...
                </span>
            `;

        } else {

            loginButton.disabled = false;

            loginButton.innerHTML =
                loginButton.dataset.originalText ||
                `
                    <span>Sign In</span>
                    <i class="fa-solid fa-arrow-right"></i>
                `;

        }

    }

});