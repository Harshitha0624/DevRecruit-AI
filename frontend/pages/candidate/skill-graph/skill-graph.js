/* =======================================================
   DEVRECRUIT AI
   PERSONALIZED SKILL GRAPH
======================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* ===================================================
       ELEMENTS
    =================================================== */

    const sidebar =
        document.querySelector("#candidateSidebar");

    const sidebarOverlay =
        document.querySelector("#sidebarOverlay");

    const mobileMenuButton =
        document.querySelector("#mobileMenuButton");

    const sidebarClose =
        document.querySelector("#sidebarClose");

    const logoutButton =
        document.querySelector("#logoutButton");

    const skillNodes =
        document.querySelectorAll(".skill-node");

    const graphCanvas =
        document.querySelector("#skillGraphCanvas");

    const graphConnections =
        document.querySelector("#graphConnections");

    const selectedSkillCard =
        document.querySelector("#selectedSkillCard");

    const resetGraphButton =
        document.querySelector("#resetGraphButton");

    const expandGraphButton =
        document.querySelector("#expandGraphButton");


    /* ===================================================
       SIDEBAR
    =================================================== */

    function openSidebar() {

        if (!sidebar) return;

        sidebar.classList.add("open");

        if (sidebarOverlay) {
            sidebarOverlay.classList.add("active");
        }

        document.body.style.overflow = "hidden";

    }


    function closeSidebar() {

        if (!sidebar) return;

        sidebar.classList.remove("open");

        if (sidebarOverlay) {
            sidebarOverlay.classList.remove("active");
        }

        document.body.style.overflow = "";

    }


    if (mobileMenuButton) {

        mobileMenuButton.addEventListener(
            "click",
            openSidebar
        );

    }


    if (sidebarClose) {

        sidebarClose.addEventListener(
            "click",
            closeSidebar
        );

    }


    if (sidebarOverlay) {

        sidebarOverlay.addEventListener(
            "click",
            closeSidebar
        );

    }


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                sidebar &&
                sidebar.classList.contains("open")
            ) {

                closeSidebar();

            }

        }
    );


    /* ===================================================
       LOGOUT
    =================================================== */

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            () => {

                const confirmed =
                    window.confirm(
                        "Are you sure you want to sign out?"
                    );

                if (!confirmed) return;

                window.location.href =
                    "../../auth/role-selection/index.html";

            }
        );

    }


    /* ===================================================
       GRAPH DATA
    =================================================== */

    const graphData = {

        "Python": {
            score: 94,
            level: "Core Skill",
            description:
                "Python is currently the central technical skill in your profile and connects strongly with your AI, data and backend capabilities.",
            related: [
                "Machine Learning",
                "Data Science"
            ]
        },

        "Machine Learning": {
            score: 88,
            level: "Strong Skill",
            description:
                "Your machine learning capability connects Python with data science, NLP and deep learning.",
            related: [
                "Python",
                "NLP",
                "Deep Learning"
            ]
        },

        "Data Science": {
            score: 84,
            level: "Strong Skill",
            description:
                "Your data science knowledge connects programming, machine learning and database skills.",
            related: [
                "Python",
                "SQL"
            ]
        },

        "NLP": {
            score: 76,
            level: "Developing Skill",
            description:
                "NLP is a growing capability that can strengthen your AI engineering and intelligent application development profile.",
            related: [
                "Machine Learning"
            ]
        },

        "Deep Learning": {
            score: 82,
            level: "Strong Skill",
            description:
                "Deep learning extends your machine learning foundation and provides a pathway toward advanced AI systems.",
            related: [
                "Machine Learning"
            ]
        },

        "SQL": {
            score: 91,
            level: "Strong Skill",
            description:
                "SQL is one of your strongest supporting skills and connects your data capabilities with database technologies.",
            related: [
                "Data Science",
                "PostgreSQL"
            ]
        },

        "PostgreSQL": {
            score: 82,
            level: "Developing Skill",
            description:
                "PostgreSQL strengthens your database engineering foundation and supports production application development.",
            related: [
                "SQL"
            ]
        },

        "Cloud": {
            score: 76,
            level: "Developing Skill",
            description:
                "Cloud knowledge is an important growth area for moving your technical profile toward production-scale engineering.",
            related: [
                "Python",
                "Docker"
            ]
        },

        "Docker": {
            score: 72,
            level: "Developing Skill",
            description:
                "Docker is a developing DevOps capability that can strengthen your deployment and cloud engineering skills.",
            related: [
                "Cloud"
            ]
        }

    };


    /* ===================================================
       GRAPH CONNECTION DEFINITIONS
    =================================================== */

    const connections = [

        ["Python", "Machine Learning", "linePythonML"],

        ["Python", "Data Science", "linePythonData"],

        ["Machine Learning", "NLP", "lineMLNLP"],

        ["Machine Learning", "Deep Learning", "lineMLDL"],

        ["Data Science", "SQL", "lineDataSQL"],

        ["SQL", "PostgreSQL", "lineSQLPostgres"],

        ["Python", "Cloud", "lineMLCloud"],

        ["Cloud", "Docker", "lineCloudDocker"]

    ];


    /* ===================================================
       GET NODE
    =================================================== */

    function getNode(skillName) {

        return document.querySelector(
            `.skill-node[data-skill="${skillName}"]`
        );

    }


    /* ===================================================
       POSITION SVG CONNECTION
    =================================================== */

    function positionConnection(
        fromSkill,
        toSkill,
        lineId
    ) {

        const fromNode =
            getNode(fromSkill);

        const toNode =
            getNode(toSkill);

        const line =
            document.querySelector(`#${lineId}`);


        if (
            !fromNode ||
            !toNode ||
            !line ||
            !graphCanvas
        ) {

            return;

        }


        const canvasRect =
            graphCanvas.getBoundingClientRect();

        const fromRect =
            fromNode.getBoundingClientRect();

        const toRect =
            toNode.getBoundingClientRect();


        const x1 =
            fromRect.left +
            fromRect.width / 2 -
            canvasRect.left;

        const y1 =
            fromRect.top +
            fromRect.height / 2 -
            canvasRect.top;

        const x2 =
            toRect.left +
            toRect.width / 2 -
            canvasRect.left;

        const y2 =
            toRect.top +
            toRect.height / 2 -
            canvasRect.top;


        line.setAttribute(
            "x1",
            x1
        );

        line.setAttribute(
            "y1",
            y1
        );

        line.setAttribute(
            "x2",
            x2
        );

        line.setAttribute(
            "y2",
            y2
        );

    }


    /* ===================================================
       DRAW ALL CONNECTIONS
    =================================================== */

    function drawConnections() {

        if (!graphConnections) return;


        const rect =
            graphCanvas.getBoundingClientRect();


        graphConnections.setAttribute(
            "viewBox",
            `0 0 ${rect.width} ${rect.height}`
        );


        connections.forEach(connection => {

            positionConnection(
                connection[0],
                connection[1],
                connection[2]
            );

        });

    }


    /* ===================================================
       INITIAL GRAPH DRAW
    =================================================== */

    requestAnimationFrame(() => {

        drawConnections();

    });


    window.addEventListener(
        "resize",
        () => {

            requestAnimationFrame(
                drawConnections
            );

        }
    );


    /* ===================================================
       CONNECTION LOOKUP
    =================================================== */

    function getConnectionLines(skill) {

        const lines = [];

        connections.forEach(connection => {

            const from = connection[0];

            const to = connection[1];

            const lineId = connection[2];


            if (
                from === skill ||
                to === skill
            ) {

                const line =
                    document.querySelector(
                        `#${lineId}`
                    );

                if (line) {
                    lines.push(line);
                }

            }

        });

        return lines;

    }


    /* ===================================================
       CLEAR GRAPH HIGHLIGHTS
    =================================================== */

    function clearGraphSelection() {

        skillNodes.forEach(node => {

            node.classList.remove(
                "selected"
            );

        });


        document
            .querySelectorAll(
                ".graph-connections line"
            )
            .forEach(line => {

                line.classList.remove(
                    "highlight"
                );

            });

    }


    /* ===================================================
       SHOW DEFAULT SELECTED CARD
    =================================================== */

    function showPlaceholder() {

        if (!selectedSkillCard) return;

        selectedSkillCard.classList.remove(
            "active"
        );


        selectedSkillCard.innerHTML = `

            <div class="selected-skill-placeholder">

                <div class="selected-icon">

                    <i class="fa-solid fa-hand-pointer"></i>

                </div>

                <div>

                    <strong>
                        Select a skill node
                    </strong>

                    <span>
                        Click any skill in the graph to
                        view its relationships and AI insights.
                    </span>

                </div>

            </div>

        `;

    }


    /* ===================================================
       SHOW SELECTED SKILL
    =================================================== */

    function showSkillDetails(skill) {

        const data =
            graphData[skill];

        if (!data || !selectedSkillCard) {
            return;
        }


        selectedSkillCard.classList.add(
            "active"
        );


        selectedSkillCard.innerHTML = `

            <div class="selected-skill-details">

                <div class="selected-skill-main">

                    <div class="selected-icon">

                        <i class="fa-solid fa-brain"></i>

                    </div>

                    <div>

                        <strong>
                            ${skill}
                        </strong>

                        <span>
                            ${data.level}
                        </span>

                    </div>

                </div>


                <div class="selected-skill-description">

                    ${data.description}

                    <br><br>

                    <strong>
                        Connected with:
                    </strong>

                    ${data.related.join(" • ")}

                </div>


                <div class="selected-skill-score">

                    <strong>
                        ${data.score}%
                    </strong>

                    <span>
                        AI proficiency
                    </span>

                </div>

            </div>

        `;

    }


    /* ===================================================
       NODE SELECTION
    =================================================== */

    skillNodes.forEach(node => {

        node.addEventListener(
            "click",
            () => {

                const skill =
                    node.dataset.skill;


                clearGraphSelection();


                node.classList.add(
                    "selected"
                );


                const relatedLines =
                    getConnectionLines(
                        skill
                    );


                relatedLines.forEach(line => {

                    line.classList.add(
                        "highlight"
                    );

                });


                showSkillDetails(
                    skill
                );


                /*
                 * Scroll the information
                 * card into view on mobile.
                 */

                if (
                    window.innerWidth <= 700 &&
                    selectedSkillCard
                ) {

                    selectedSkillCard.scrollIntoView({
                        behavior:"smooth",
                        block:"nearest"
                    });

                }

            }
        );

    });


    /* ===================================================
       RESET GRAPH
    =================================================== */

    if (resetGraphButton) {

        resetGraphButton.addEventListener(
            "click",
            () => {

                clearGraphSelection();

                showPlaceholder();

                drawConnections();

            }
        );

    }


    /* ===================================================
       FULLSCREEN GRAPH
    =================================================== */

    if (expandGraphButton) {

        expandGraphButton.addEventListener(
            "click",
            async () => {

                if (!graphCanvas) return;


                try {

                    if (!document.fullscreenElement) {

                        await graphCanvas.requestFullscreen();

                        expandGraphButton.innerHTML = `
                            <i class="fa-solid fa-compress"></i>
                            Exit Graph
                        `;

                    } else {

                        await document.exitFullscreen();

                    }

                } catch (error) {

                    console.warn(
                        "Fullscreen mode unavailable.",
                        error
                    );

                }

            }
        );

    }


    /* ===================================================
       FULLSCREEN STATE
    =================================================== */

    document.addEventListener(
        "fullscreenchange",
        () => {

            if (!expandGraphButton) {
                return;
            }


            if (document.fullscreenElement) {

                expandGraphButton.innerHTML = `
                    <i class="fa-solid fa-compress"></i>
                    Exit Graph
                `;

            } else {

                expandGraphButton.innerHTML = `
                    <i class="fa-solid fa-expand"></i>
                    Expand Graph
                `;

                setTimeout(
                    drawConnections,
                    100
                );

            }

        }
    );


    /* ===================================================
       NODE ENTRY ANIMATION
    =================================================== */

    skillNodes.forEach(
        (node, index) => {

            node.animate(

                [
                    {
                        opacity:0,
                        transform:
                            "translate(-50%,-50%) scale(.7)"
                    },

                    {
                        opacity:1,
                        transform:
                            "translate(-50%,-50%) scale(1)"
                    }

                ],

                {
                    duration:600,

                    delay:250 + index * 80,

                    easing:
                        "cubic-bezier(.22,1,.36,1)",

                    fill:"forwards"

                }

            );

        }
    );


    /* ===================================================
       GRAPH CONNECTION ENTRY
    =================================================== */

    document
        .querySelectorAll(
            ".graph-connections line"
        )
        .forEach(
            (line, index) => {

                line.style.opacity = "0";

                setTimeout(() => {

                    line.animate(

                        [
                            {
                                opacity:0
                            },

                            {
                                opacity:.85
                            }

                        ],

                        {
                            duration:500,

                            fill:"forwards"
                        }

                    );

                }, 500 + index * 100);

            }
        );


    /* ===================================================
       KEYBOARD ACCESSIBILITY
    =================================================== */

    skillNodes.forEach(node => {

        node.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    node.click();

                }

            }
        );

    });


    /* ===================================================
       REDUCED MOTION
    =================================================== */

    if (
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {

        skillNodes.forEach(node => {

            node.getAnimations()
                .forEach(animation => {
                    animation.cancel();
                });

        });

    }


    /* ===================================================
       FINAL GRAPH REFRESH
    =================================================== */

    setTimeout(
        drawConnections,
        400
    );

});