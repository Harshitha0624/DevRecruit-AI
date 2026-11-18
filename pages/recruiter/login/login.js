document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#adminLoginForm");
    const emailInput = document.querySelector("#adminEmail");
    const passwordInput = document.querySelector("#adminPassword");
    const securityCodeInput = document.querySelector("#securityCode");
    const passwordToggle = document.querySelector("#adminPasswordToggle");
    const forgotPassword = document.querySelector("#adminForgotPassword");
    const loginButton = document.querySelector(".admin-login-button");
    const message = document.querySelector("#adminLoginMessage");

    const API_BASE = "http://127.0.0.1:8000";

    function showMessage(text, type = "error") {
        message.textContent = text;
        message.className = `admin-login-message ${type}`;
    }

    function setLoading(loading) {
        loginButton.disabled = loading;
        loginButton.innerHTML = loading
            ? '<span>Verifying Access...</span>'
            : '<span>Secure Sign In</span><i class="fa-solid fa-arrow-right"></i>';
    }

    if (passwordToggle) {
        passwordToggle.addEventListener("click", () => {
            const visible = passwordInput.type === "text";
            passwordInput.type = visible ? "password" : "text";

            const icon = passwordToggle.querySelector("i");
            if (icon) {
                icon.classList.toggle("fa-eye", visible);
                icon.classList.toggle("fa-eye-slash", !visible);
            }

            passwordToggle.setAttribute(
                "aria-label",
                visible ? "Show password" : "Hide password"
            );
        });
    }

    [emailInput, passwordInput, securityCodeInput].forEach(input => {
        input.addEventListener("input", () => {
            input.classList.remove("input-error");
            message.textContent = "";
            message.className = "admin-login-message";
        });
    });

    form.addEventListener("submit", async event => {
        event.preventDefault();
        message.textContent = "";

        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const securityCode = securityCodeInput.value.trim();

        if (!email || !password || !securityCode) {
            showMessage("Please complete all required fields.");
            return;
        }

        if (password.length < 8) {
            showMessage("Password must contain at least 8 characters.");
            return;
        }

        if (securityCode.length < 6) {
            showMessage("Security code must contain at least 6 characters.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_BASE}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                showMessage(data.detail || "Login failed. Check your credentials.");
                return;
            }

            if (!data.user || data.user.role !== "admin") {
                showMessage(
                    "Access denied. This account is not an administrator."
                );
                return;
            }

            if (!data.access_token) {
                showMessage("The server did not return an access token.");
                return;
            }

            sessionStorage.setItem("devrecruit_admin_token", data.access_token);
            sessionStorage.setItem(
                "devrecruit_admin_user",
                JSON.stringify(data.user)
            );

            showMessage("Administrator authentication successful.", "success");

            window.location.href = "../../admin/dashboard/index.html";
        } catch (error) {
            console.error("Admin login error:", error);
            showMessage(
                "Cannot connect to the backend. Check that FastAPI is running on port 8000."
            );
        } finally {
            setLoading(false);
        }
    });

    if (forgotPassword) {
        forgotPassword.addEventListener("click", event => {
            event.preventDefault();
            showMessage(
                "Password recovery is not configured yet. Contact your platform administrator."
            );
        });
    }
});