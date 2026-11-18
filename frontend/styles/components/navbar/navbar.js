/* ==========================================================
   NAVBAR
========================================================== */

document.addEventListener("DOMContentLoaded",()=>{

    /* =========================================
       Sticky Navbar
    ========================================= */

    const navbar=document.querySelector(".navbar");

    window.addEventListener("scroll",()=>{

        if(window.scrollY>30){

            navbar.classList.add("scrolled");

        }

        else{

            navbar.classList.remove("scrolled");

        }

    });

    /* =========================================
       Smooth Scroll
    ========================================= */

    document.querySelectorAll('.nav-links a').forEach(link=>{

        link.addEventListener("click",function(e){

            const target=this.getAttribute("href");

            if(target.startsWith("#")){

                e.preventDefault();

                document.querySelector(target)?.scrollIntoView({

                    behavior:"smooth"

                });

            }

        });

    });

    /* =========================================
       Active Menu
    ========================================= */

    const links=document.querySelectorAll(".nav-links a");

    links.forEach(link=>{

        link.addEventListener("click",()=>{

            links.forEach(item=>item.classList.remove("active"));

            link.classList.add("active");

        });

    });

    /* =========================================
       Dark Mode Button (UI only)
    ========================================= */

    const themeBtn=document.querySelector(".theme-btn");

    themeBtn?.addEventListener("click",()=>{

        themeBtn.classList.toggle("active");

    });

});