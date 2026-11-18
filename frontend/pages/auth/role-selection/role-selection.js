/* =======================================================
   DEVRECRUIT AI
   ROLE SELECTION
======================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const roleButtons =
        document.querySelectorAll(".role-button");


    roleButtons.forEach(button => {

        button.addEventListener("click", () => {

            const role =
                button.dataset.role;


            if (role === "candidate") {

                window.location.href =
                    "../../candidate/login/index.html";

            }


            else if (role === "recruiter") {

                window.location.href =
                    "../../recruiter/login/index.html";

            }


            else if (role === "admin") {

                window.location.href =
                    "../../admin/login/index.html";

            }

        });

    });

});