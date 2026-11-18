
/* =======================================================
   CANDIDATE REGISTRATION
======================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================
       ELEMENTS
    ===================================== */

    const registerForm =
        document.querySelector("#candidateRegisterForm");

    const passwordInput =
        document.querySelector("#registerPassword");

    const confirmPasswordInput =
        document.querySelector("#confirmPassword");

    const passwordToggle =
        document.querySelector("#passwordToggle");

    const registerMessage =
        document.querySelector("#registerMessage");

    const API_BASE = "http://127.0.0.1:8000";


    /* =====================================
       PASSWORD VISIBILITY
    ===================================== */

    if (passwordToggle && passwordInput) {

        passwordToggle.addEventListener("click", () => {

            const icon = passwordToggle.querySelector("i");

            const show = passwordInput.type === "password";

            passwordInput.type = show ? "text" : "password";

            if (icon) {
                icon.classList.toggle("fa-eye", !show);
                icon.classList.toggle("fa-eye-slash", show);
            }

            passwordToggle.setAttribute(
                "aria-label",
                show ? "Hide password" : "Show password"
            );

        });

    }


    /* =====================================
       REGISTRATION FORM
    ===================================== */

    if (registerForm) {

        registerForm.addEventListener("submit", async (event) => {

            event.preventDefault();

            /* Get values */

            const firstName =
                document.querySelector("#firstName").value.trim();

            const lastName =
                document.querySelector("#lastName").value.trim();

            const email =
                document.querySelector("#registerEmail").value.trim();

            const phone =
                document.querySelector("#phone").value.trim();

            const password = passwordInput.value;

            const confirmPassword = confirmPasswordInput.value;

            const terms =
                document.querySelector("#terms").checked;


            /* =====================================
               VALIDATION
            ===================================== */

            if (
                !firstName ||
                !lastName ||
                !email ||
                !phone ||
                !password ||
                !confirmPassword
            ) {

                showMessage(
                    "Please fill in all required fields.",
                    "error"
                );

                return;
            }


            /* Email */

            if (!isValidEmail(email)) {

                showMessage(
                    "Please enter a valid email address.",
                    "error"
                );

                return;
            }


            /* Phone */

            if (!isValidPhone(phone)) {

                showMessage(
                    "Please enter a valid phone number.",
                    "error"
                );

                return;
            }


            /* Password length */

            if (password.length < 6) {

                showMessage(
                    "Password must contain at least 6 characters.",
                    "error"
                );

                return;
            }


            /* Password match */

            if (password !== confirmPassword) {

                showMessage(
                    "Passwords do not match.",
                    "error"
                );

                return;
            }


            /* Terms */

            if (!terms) {

                showMessage(
                    "Please accept the Terms of Service and Privacy Policy.",
                    "error"
                );

                return;
            }


            /* =====================================
               BACKEND REGISTRATION
            ===================================== */

            const submitButton =
                registerForm.querySelector('[type="submit"]');

            const originalButtonText =
                submitButton ? submitButton.textContent : "";

            try {

                if (submitButton) {
                    submitButton.disabled = true;
                    submitButton.textContent = "Creating Account...";
                }

                showMessage(
                    "Creating your account...",
                    "success"
                );

                const response = await fetch(
                    `${API_BASE}/api/auth/register`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            full_name: `${firstName} ${lastName}`,
                            email: email,
                            password: password,
                            role: "candidate"
                        })
                    }
                );

                const data = await response.json().catch(() => ({}));

                if (!response.ok) {

                    const errorMessage =
                        typeof data.detail === "string"
                            ? data.detail
                            : "Registration failed. Please try again.";

                    showMessage(errorMessage, "error");

                    return;
                }

                showMessage(
                    "Account created successfully! Redirecting to login...",
                    "success"
                );

                setTimeout(() => {
                    window.location.href = "../login/index.html";
                }, 1200);

            } catch (error) {

                console.error("Candidate registration error:", error);

                showMessage(
                    "Cannot connect to the backend. Please try again.",
                    "error"
                );

            } finally {

                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                }

            }

        });

    }


    /* =====================================
       EMAIL VALIDATION
    ===================================== */

    function isValidEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    }


    /* =====================================
       PHONE VALIDATION
    ===================================== */

    function isValidPhone(phone) {

        const digitsOnly = phone.replace(/\D/g, "");

        return digitsOnly.length >= 10;

    }


    /* =====================================
       MESSAGE
    ===================================== */

    function showMessage(message, type) {

        if (!registerMessage) return;

        registerMessage.textContent = message;

        registerMessage.className =
            `register-message ${type}`;

    }

});
