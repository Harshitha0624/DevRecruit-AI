/* =======================================================
   DEVRECRUIT AI
   RECRUITER REGISTRATION
======================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* ===================================================
       ELEMENTS
    =================================================== */

    const form =
        document.querySelector("#recruiterRegisterForm");

    const firstName =
        document.querySelector("#firstName");

    const lastName =
        document.querySelector("#lastName");

    const email =
        document.querySelector("#recruiterEmail");

    const phone =
        document.querySelector("#phone");

    const companyName =
        document.querySelector("#companyName");

    const companySize =
        document.querySelector("#companySize");

    const industry =
        document.querySelector("#industry");

    const password =
        document.querySelector("#registerPassword");

    const confirmPassword =
        document.querySelector("#confirmPassword");

    const passwordToggle =
        document.querySelector("#passwordToggle");

    const terms =
        document.querySelector("#terms");

    const submitButton =
        document.querySelector(".register-button");

    const message =
        document.querySelector("#registerMessage");

    const strengthText =
        document.querySelector("#strengthText");

    const strengthProgress =
        document.querySelector("#strengthProgress");


    /* ===================================================
       BACKEND API
    =================================================== */

    const API_BASE_URL = "http://127.0.0.1:8000";


    /* ===================================================
       PASSWORD VISIBILITY
    =================================================== */

    if (passwordToggle && password) {

        passwordToggle.addEventListener("click", () => {

            const icon =
                passwordToggle.querySelector("i");

            const isVisible =
                password.type === "text";

            password.type =
                isVisible
                    ? "password"
                    : "text";

            if (icon) {

                icon.classList.toggle(
                    "fa-eye",
                    isVisible
                );

                icon.classList.toggle(
                    "fa-eye-slash",
                    !isVisible
                );

            }

            passwordToggle.setAttribute(
                "aria-label",
                isVisible
                    ? "Show password"
                    : "Hide password"
            );

            password.focus();

        });

    }


    /* ===================================================
       PASSWORD STRENGTH
    =================================================== */

    if (password) {

        password.addEventListener("input", () => {

            updatePasswordStrength(
                password.value
            );

            clearFieldError(password);
            clearMessage();

        });

    }


    /* ===================================================
       CONFIRM PASSWORD
    =================================================== */

    if (confirmPassword) {

        confirmPassword.addEventListener("input", () => {

            clearFieldError(confirmPassword);
            clearMessage();

            if (
                confirmPassword.value &&
                password.value !== confirmPassword.value
            ) {

                showFieldError(
                    confirmPassword,
                    "Passwords do not match."
                );

            }

        });

    }


    /* ===================================================
       INPUT CLEANUP
    =================================================== */

    [
        firstName,
        lastName,
        email,
        phone,
        companyName
    ].forEach(input => {

        if (!input) return;

        input.addEventListener("input", () => {

            clearFieldError(input);
            clearMessage();

        });

    });


    /* ===================================================
       SELECT CLEANUP
    =================================================== */

    [
        companySize,
        industry
    ].forEach(select => {

        if (!select) return;

        select.addEventListener("change", () => {

            clearFieldError(select);
            clearMessage();

        });

    });


    /* ===================================================
       FORM SUBMISSION
    =================================================== */

    if (form) {

        form.addEventListener("submit", async event => {

            event.preventDefault();


            /* -------------------------------------------
               Clear previous state
            ------------------------------------------- */

            clearMessage();
            clearAllErrors();


            /* -------------------------------------------
               Read values
            ------------------------------------------- */

            const values = {

                firstName:
                    firstName.value.trim(),

                lastName:
                    lastName.value.trim(),

                email:
                    email.value.trim(),

                phone:
                    phone.value.trim(),

                companyName:
                    companyName.value.trim(),

                companySize:
                    companySize.value,

                industry:
                    industry.value,

                password:
                    password.value,

                confirmPassword:
                    confirmPassword.value,

                terms:
                    terms.checked

            };


            /* -------------------------------------------
               Validate recruiter name
            ------------------------------------------- */

            if (!values.firstName) {

                showFieldError(
                    firstName,
                    "First name is required."
                );

                firstName.focus();
                return;
            }

            if (!isValidName(values.firstName)) {

                showFieldError(
                    firstName,
                    "Enter a valid first name."
                );

                firstName.focus();
                return;
            }


            if (!values.lastName) {

                showFieldError(
                    lastName,
                    "Last name is required."
                );

                lastName.focus();
                return;
            }

            if (!isValidName(values.lastName)) {

                showFieldError(
                    lastName,
                    "Enter a valid last name."
                );

                lastName.focus();
                return;
            }


            /* -------------------------------------------
               Validate email
            ------------------------------------------- */

            if (!values.email) {

                showFieldError(
                    email,
                    "Work email is required."
                );

                email.focus();
                return;
            }

            if (!isValidEmail(values.email)) {

                showFieldError(
                    email,
                    "Enter a valid work email address."
                );

                email.focus();
                return;
            }


            /* -------------------------------------------
               Validate phone
            ------------------------------------------- */

            if (!values.phone) {

                showFieldError(
                    phone,
                    "Phone number is required."
                );

                phone.focus();
                return;
            }

            if (!isValidPhone(values.phone)) {

                showFieldError(
                    phone,
                    "Enter a valid phone number."
                );

                phone.focus();
                return;
            }


            /* -------------------------------------------
               Validate company
            ------------------------------------------- */

            if (!values.companyName) {

                showFieldError(
                    companyName,
                    "Company name is required."
                );

                companyName.focus();
                return;
            }

            if (values.companyName.length < 2) {

                showFieldError(
                    companyName,
                    "Company name is too short."
                );

                companyName.focus();
                return;
            }


            /* -------------------------------------------
               Validate company size
            ------------------------------------------- */

            if (!values.companySize) {

                showFieldError(
                    companySize,
                    "Please select company size."
                );

                companySize.focus();
                return;
            }


            /* -------------------------------------------
               Validate industry
            ------------------------------------------- */

            if (!values.industry) {

                showFieldError(
                    industry,
                    "Please select an industry."
                );

                industry.focus();
                return;
            }


            /* -------------------------------------------
               Validate password
            ------------------------------------------- */

            const passwordResult =
                getPasswordStrength(values.password);

            if (passwordResult.score < 3) {

                showFieldError(
                    password,
                    "Create a stronger password."
                );

                password.focus();
                return;
            }


            /* -------------------------------------------
               Confirm password
            ------------------------------------------- */

            if (
                values.password !==
                values.confirmPassword
            ) {

                showFieldError(
                    confirmPassword,
                    "Passwords do not match."
                );

                confirmPassword.focus();
                return;
            }


            /* -------------------------------------------
               Terms
            ------------------------------------------- */

            if (!values.terms) {

                showMessage(
                    "Please accept the Terms of Service and Privacy Policy.",
                    "error"
                );

                terms.focus();
                return;
            }


            /* -------------------------------------------
               Loading state
            ------------------------------------------- */

            setLoadingState(true);


            /* -------------------------------------------
               REAL BACKEND REGISTRATION
            ------------------------------------------- */

            try {

                const fullName =
                    `${values.firstName} ${values.lastName}`.trim();


                const response = await fetch(
                    `${API_BASE_URL}/api/auth/register`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({

                            email: values.email,

                            password: values.password,

                            full_name: fullName,

                            role: "recruiter"

                        })
                    }
                );


                /* ---------------------------------------
                   Parse response
                --------------------------------------- */

                const data = await response.json();


                /* ---------------------------------------
                   Registration error
                --------------------------------------- */

                if (!response.ok) {

                    let errorMessage =
                        "Registration failed. Please try again.";

                    if (data.detail) {

                        if (typeof data.detail === "string") {

                            errorMessage =
                                data.detail;

                        } else if (Array.isArray(data.detail)) {

                            errorMessage =
                                data.detail
                                    .map(error => error.msg)
                                    .join(", ");

                        }

                    }

                    showMessage(
                        errorMessage,
                        "error"
                    );

                    setLoadingState(false);

                    return;
                }


                /* ---------------------------------------
                   Success
                --------------------------------------- */

                showMessage(
                    "Recruiter account created successfully. Redirecting to login...",
                    "success"
                );


                /* ---------------------------------------
                   Redirect to recruiter login
                --------------------------------------- */

                setTimeout(() => {

                    window.location.href =
                        "../login/index.html";

                }, 1000);


            } catch (error) {

                console.error(
                    "Recruiter registration error:",
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
       PASSWORD STRENGTH CALCULATION
    =================================================== */

    function getPasswordStrength(value) {

        let score = 0;

        if (!value) {

            return {
                score: 0,
                label: "Not entered"
            };

        }


        /* Length */

        if (value.length >= 8) {
            score++;
        }

        if (value.length >= 12) {
            score++;
        }


        /* Lowercase */

        if (/[a-z]/.test(value)) {
            score++;
        }


        /* Uppercase */

        if (/[A-Z]/.test(value)) {
            score++;
        }


        /* Number */

        if (/[0-9]/.test(value)) {
            score++;
        }


        /* Special character */

        if (/[^A-Za-z0-9]/.test(value)) {
            score++;
        }


        let label = "Very Weak";

        if (score >= 6) {

            label = "Very Strong";

        } else if (score >= 5) {

            label = "Strong";

        } else if (score >= 4) {

            label = "Good";

        } else if (score >= 3) {

            label = "Moderate";

        } else if (score >= 1) {

            label = "Weak";
        }


        return {
            score,
            label
        };

    }


    function updatePasswordStrength(value) {

        if (!strengthText ||
            !strengthProgress) {
            return;
        }


        const result =
            getPasswordStrength(value);


        if (!value) {

            strengthText.textContent =
                "Not entered";

            strengthProgress.style.width =
                "0%";

            strengthProgress.style.background =
                "#CBD5E1";

            return;

        }


        const percentage =
            Math.min(
                (result.score / 6) * 100,
                100
            );


        strengthText.textContent =
            result.label;

        strengthProgress.style.width =
            `${percentage}%`;


        if (result.score <= 2) {

            strengthProgress.style.background =
                "#EF4444";

        } else if (result.score === 3) {

            strengthProgress.style.background =
                "#F59E0B";

        } else if (result.score <= 4) {

            strengthProgress.style.background =
                "#EAB308";

        } else {

            strengthProgress.style.background =
                "#10B981";

        }

    }


    /* ===================================================
       VALIDATION HELPERS
    =================================================== */

    function isValidName(value) {

        return /^[A-Za-zÀ-ÿ\s'-]{2,50}$/.test(
            value
        );

    }


    function isValidEmail(value) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            value
        );

    }


    function isValidPhone(value) {

        const digits =
            value.replace(/\D/g, "");

        return digits.length >= 10 &&
               digits.length <= 15;

    }


    /* ===================================================
       FIELD ERROR
    =================================================== */

    function showFieldError(
        input,
        errorMessage
    ) {

        if (!input) return;


        input.classList.add(
            "input-error"
        );


        const parent =
            input.closest(
                ".form-group"
            );


        if (!parent) return;


        let error =
            parent.querySelector(
                ".field-error"
            );


        if (!error) {

            error =
                document.createElement(
                    "small"
                );

            error.className =
                "field-error";

            parent.appendChild(error);

        }


        error.textContent =
            errorMessage;

    }


    /* ===================================================
       CLEAR FIELD ERROR
    =================================================== */

    function clearFieldError(input) {

        if (!input) return;


        input.classList.remove(
            "input-error"
        );


        const parent =
            input.closest(
                ".form-group"
            );


        if (!parent) return;


        const error =
            parent.querySelector(
                ".field-error"
            );


        if (error) {

            error.remove();

        }

    }


    /* ===================================================
       CLEAR ALL ERRORS
    =================================================== */

    function clearAllErrors() {

        const fields = [

            firstName,
            lastName,
            email,
            phone,
            companyName,
            companySize,
            industry,
            password,
            confirmPassword

        ];


        fields.forEach(
            clearFieldError
        );

    }


    /* ===================================================
       MESSAGE
    =================================================== */

    function showMessage(
        text,
        type
    ) {

        if (!message) return;


        message.textContent =
            text;

        message.className =
            `register-message ${type}`;

    }


    function clearMessage() {

        if (!message) return;


        message.textContent = "";

        message.className =
            "register-message";

    }


    /* ===================================================
       LOADING STATE
    =================================================== */

    function setLoadingState(
        loading
    ) {

        if (!submitButton) return;


        if (loading) {

            submitButton.disabled =
                true;

            submitButton.dataset.originalContent =
                submitButton.innerHTML;

            submitButton.innerHTML = `
                <span>
                    <i class="fa-solid fa-circle-notch fa-spin"></i>
                    Creating Account...
                </span>
            `;

        } else {

            submitButton.disabled =
                false;

            submitButton.innerHTML =
                submitButton.dataset.originalContent ||
                `
                    <span>
                        Create Recruiter Account
                    </span>

                    <i class="fa-solid fa-arrow-right"></i>
                `;

        }

    }

});