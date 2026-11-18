"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#candidateLoginForm");
    const emailInput = document.querySelector("#candidateEmail");
    const passwordInput = document.querySelector("#candidatePassword");
    const passwordToggle = document.querySelector("#passwordToggle");
    const message = document.querySelector("#loginMessage");
    const API_BASE = "http://127.0.0.1:8000";

    function showMessage(text, type = "error") {
        if (!message) return;
        message.textContent = text;
        message.className = `login-message ${type}`;
    }

    function setLoading(loading) {
        const button = form?.querySelector(
            'button[type="submit"], input[type="submit"]'
        );
        if (button) button.disabled = loading;
    }

    passwordToggle?.addEventListener("click", () => {
        if (!passwordInput) return;
        const show = passwordInput.type === "password";
        passwordInput.type = show ? "text" : "password";

        const icon = passwordToggle.querySelector("i");
        if (icon) {
            icon.classList.toggle("fa-eye", !show);
            icon.classList.toggle("fa-eye-slash", show);
        }
        passwordToggle.setAttribute(
            "aria-label",
            show ? "Hide password" : "Show password"
        );
    });

    form?.addEventListener("submit", async event => {
        event.preventDefault();

        const email = emailInput?.value.trim() || "";
        const password = passwordInput?.value || "";

        if (!email || !password) {
            showMessage("Enter your email and password.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showMessage("Enter a valid email address.");
            return;
        }

        setLoading(true);
        showMessage("Signing in securely...", "success");

        try {
            const response = await fetch(`${API_BASE}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                showMessage(
                    typeof data.detail === "string"
                        ? data.detail
                        : "Login failed. Check your credentials."
                );
                return;
            }

            if (!data.access_token || !data.user) {
                showMessage("The backend did not return a valid login token.");
                return;
            }

            if (String(data.user.role || "").toLowerCase() !== "candidate") {
                showMessage("This login is for candidate accounts only.");
                return;
            }

            // Save the real JWT token for authenticated API requests.
            sessionStorage.setItem(
                "devrecruit_candidate_token",
                data.access_token
            );
            sessionStorage.setItem("access_token", data.access_token);
            sessionStorage.setItem(
                "devrecruit_candidate_user",
                JSON.stringify(data.user)
            );

            showMessage("Login successful. Opening your dashboard...", "success");
            window.location.href = "../dashboard/index.html";

        } catch (error) {
            console.error("Candidate login error:", error);
            showMessage(
                "Cannot reach the backend. Make sure FastAPI is running on port 8000."
            );
        } finally {
            setLoading(false);
        }
    });
});