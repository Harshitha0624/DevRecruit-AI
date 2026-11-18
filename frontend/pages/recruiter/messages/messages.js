/* =======================================================
   DEVRECRUIT — RECRUITER MESSAGES
======================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* ===================================================
       ELEMENTS
    =================================================== */

    const sidebar =
        document.querySelector("#messagesSidebar");

    const sidebarOverlay =
        document.querySelector("#sidebarOverlay");

    const mobileMenuButton =
        document.querySelector("#mobileMenuButton");

    const sidebarClose =
        document.querySelector("#sidebarClose");

    const conversationList =
        document.querySelector("#conversationList");

    const conversations =
        document.querySelectorAll(".conversation-item");

    const messageSearch =
        document.querySelector("#messageSearch");

    const messageTabs =
        document.querySelectorAll(".message-tab");

    const chatBody =
        document.querySelector("#chatBody");

    const messageForm =
        document.querySelector("#messageForm");

    const messageInput =
        document.querySelector("#messageInput");

    const attachmentInput =
        document.querySelector("#messageAttachment");

    const attachmentButton =
        document.querySelector("#attachmentButton");

    const attachmentPreview =
        document.querySelector("#attachmentPreview");

    const attachmentName =
        document.querySelector("#attachmentName");

    const attachmentSize =
        document.querySelector("#attachmentSize");

    const removeAttachment =
        document.querySelector("#removeAttachment");


    /* ===================================================
       SIDEBAR
    =================================================== */

    function openSidebar() {

        sidebar?.classList.add("open");

        sidebarOverlay?.classList.add("active");

    }


    function closeSidebar() {

        sidebar?.classList.remove("open");

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
       CONVERSATION DATA
    =================================================== */

    const candidateData = {

        "Priya Nair": {

            role: "Cloud Engineer · Bengaluru",

            status: "Online",

            avatar: "PN",

            color: "purple",

            email: "priya.nair@example.com",

            phone: "+91 98765 43210"

        },

        "Aarav Sharma": {

            role: "Backend Developer · Bengaluru",

            status: "Online",

            avatar: "AS",

            color: "blue",

            email: "aarav.sharma@example.com",

            phone: "+91 98765 43211"

        },

        "Sneha Reddy": {

            role: "Frontend Developer · Hyderabad",

            status: "Offline",

            avatar: "SR",

            color: "orange",

            email: "sneha.reddy@example.com",

            phone: "+91 98765 43212"

        },

        "Rohan Kumar": {

            role: "Software Engineer · Bengaluru",

            status: "Online",

            avatar: "RK",

            color: "green",

            email: "rohan.kumar@example.com",

            phone: "+91 98765 43213"

        },

        "Vikram Singh": {

            role: "DevOps Engineer · Pune",

            status: "Away",

            avatar: "VS",

            color: "cyan",

            email: "vikram.singh@example.com",

            phone: "+91 98765 43214"

        },

        "Ananya Mehta": {

            role: "Full Stack Developer · Mumbai",

            status: "Offline",

            avatar: "AM",

            color: "pink",

            email: "ananya.mehta@example.com",

            phone: "+91 98765 43215"

        }

    };


    /* ===================================================
       SELECT CONVERSATION
    =================================================== */

    conversations.forEach((conversation) => {

        conversation.addEventListener(
            "click",
            () => {

                conversations.forEach((item) => {

                    item.classList.remove("active");

                });


                conversation.classList.add("active");


                const candidateName =
                    conversation.dataset.name;


                loadCandidate(
                    candidateName
                );


                markConversationRead(
                    conversation
                );

            }
        );

    });


    function loadCandidate(name) {

        const candidate =
            candidateData[name];


        if (!candidate) return;


        setText(
            "#chatCandidateName",
            name
        );


        setText(
            "#chatCandidateRole",
            candidate.role
        );


        setText(
            "#chatOnlineStatus",
            candidate.status
        );


        updateChatAvatar(
            candidate
        );


        updateCandidatePanel(
            name,
            candidate
        );


        updateChatMessages(
            name
        );

    }


    /* ===================================================
       CHAT AVATAR
    =================================================== */

    function updateChatAvatar(candidate) {

        const avatar =
            document.querySelector(
                ".chat-user .chat-avatar"
            );


        if (!avatar) return;


        avatar.className =
            `chat-avatar ${candidate.color}`;


        avatar.innerHTML =
            `${candidate.avatar}
             <span class="online-indicator"></span>`;


        if (candidate.status === "Offline") {

            const indicator =
                avatar.querySelector(
                    ".online-indicator"
                );


            indicator?.remove();

        }

    }


    /* ===================================================
       CANDIDATE PANEL
    =================================================== */

    function updateCandidatePanel(
        name,
        candidate
    ) {

        const largeAvatar =
            document.querySelector(
                ".large-avatar"
            );


        if (largeAvatar) {

            largeAvatar.className =
                `large-avatar ${candidate.color}`;

            largeAvatar.innerHTML =
                `${candidate.avatar}
                 <span class="online-indicator"></span>`;

            if (candidate.status === "Offline") {

                largeAvatar
                    .querySelector(
                        ".online-indicator"
                    )
                    ?.remove();

            }

        }


        setText(
            ".candidate-profile-large h3",
            name
        );


        const profileRole =
            document.querySelector(
                ".candidate-profile-large > span"
            );


        if (profileRole) {

            profileRole.textContent =
                candidate.role.split(" · ")[0];

        }


        const emailLink =
            document.querySelector(
                '.candidate-contact a[href^="mailto"]'
            );


        const phoneLink =
            document.querySelector(
                '.candidate-contact a[href^="tel"]'
            );


        if (emailLink) {

            emailLink.href =
                `mailto:${candidate.email}`;

            emailLink.lastChild.textContent =
                ` ${candidate.email}`;

        }


        if (phoneLink) {

            phoneLink.href =
                `tel:${candidate.phone}`;

            phoneLink.lastChild.textContent =
                ` ${candidate.phone}`;

        }

    }


    /* ===================================================
       DEMO CHAT MESSAGES
    =================================================== */

    const chatMessages = {

        "Priya Nair": [

            {
                type: "received",
                text:
                    "Hi! Thank you for reaching out. I'm very interested in the Cloud Engineer position.",
                time: "10:31 AM"
            },

            {
                type: "sent",
                text:
                    "Hi Priya! Thanks for your response. Your technical assessment score was excellent. We'd like to move forward with the next stage.",
                time: "10:35 AM"
            },

            {
                type: "received",
                text:
                    "That's great to hear! I'm available for an interview this week. Please let me know the preferred time.",
                time: "10:38 AM"
            },

            {
                type: "sent",
                text:
                    "Perfect. I've scheduled a technical interview for Thursday at 11:00 AM. I'll send the meeting details shortly.",
                time: "10:40 AM"
            },

            {
                type: "received",
                text:
                    "Thank you for scheduling the interview. I'll be there. Looking forward to speaking with the team!",
                time: "10:42 AM"
            }

        ],


        "Aarav Sharma": [

            {
                type: "received",
                text:
                    "Hello! I wanted to confirm whether my backend assessment was received.",
                time: "9:12 AM"
            },

            {
                type: "sent",
                text:
                    "Hi Aarav. Yes, your assessment has been received successfully. Our engineering team is reviewing it.",
                time: "9:15 AM"
            },

            {
                type: "received",
                text:
                    "Great, thank you. I have also completed the additional coding challenge.",
                time: "9:18 AM"
            }

        ],


        "Sneha Reddy": [

            {
                type: "received",
                text:
                    "I've attached my updated resume. Please let me know if you need anything else.",
                time: "Yesterday"
            },

            {
                type: "sent",
                text:
                    "Thanks Sneha. We have received your updated resume and will review it shortly.",
                time: "Yesterday"
            }

        ],


        "Rohan Kumar": [

            {
                type: "sent",
                text:
                    "Your technical interview has been confirmed for tomorrow at 3:00 PM.",
                time: "Yesterday"
            },

            {
                type: "received",
                text:
                    "Looking forward to the interview. Thank you for the opportunity!",
                time: "Yesterday"
            }

        ],


        "Vikram Singh": [

            {
                type: "received",
                text:
                    "Could you share the interview details?",
                time: "Monday"
            },

            {
                type: "sent",
                text:
                    "Sure. I'll share the meeting link and interview schedule shortly.",
                time: "Monday"
            }

        ],


        "Ananya Mehta": [

            {
                type: "received",
                text:
                    "Thanks for the opportunity! I'm excited to continue with the process.",
                time: "Sunday"
            }

        ]

    };


    function updateChatMessages(name) {

        if (!chatBody) return;


        const messages =
            chatMessages[name] ||
            [];


        chatBody.innerHTML = "";


        const divider =
            document.createElement("div");


        divider.className =
            "date-divider";


        const dividerText =
            document.createElement("span");


        dividerText.textContent =
            "TODAY";


        divider.appendChild(
            dividerText
        );


        chatBody.appendChild(
            divider
        );


        messages.forEach(
            (message) => {

                addMessageToChat(
                    message.type,
                    message.text,
                    message.time,
                    false,
                    name
                );

            }
        );


        scrollChatToBottom();

    }


    /* ===================================================
       ADD MESSAGE
    =================================================== */

    function addMessageToChat(
        type,
        text,
        time,
        shouldScroll = true,
        candidateName = "Priya Nair"
    ) {

        const row =
            document.createElement("div");


        row.className =
            `message-row ${type}`;


        if (type === "received") {

            const avatar =
                document.createElement("div");


            avatar.className =
                `message-avatar ${
                    candidateData[candidateName]?.color ||
                    "purple"
                }`;


            avatar.textContent =
                candidateData[candidateName]?.avatar ||
                "CN";


            row.appendChild(
                avatar
            );

        }


        const group =
            document.createElement("div");


        group.className =
            "message-bubble-group";


        const bubble =
            document.createElement("div");


        bubble.className =
            "message-bubble";


        bubble.textContent =
            text;


        const messageTime =
            document.createElement("time");


        messageTime.textContent =
            time;


        if (type === "sent") {

            const check =
                document.createElement("i");


            check.className =
                "fa-solid fa-check-double";


            messageTime.appendChild(
                check
            );

        }


        group.appendChild(
            bubble
        );

        group.appendChild(
            messageTime
        );


        row.appendChild(
            group
        );


        chatBody?.appendChild(
            row
        );


        if (shouldScroll) {

            scrollChatToBottom();

        }

    }


    function scrollChatToBottom() {

        if (!chatBody) return;


        requestAnimationFrame(() => {

            chatBody.scrollTop =
                chatBody.scrollHeight;

        });

    }


    /* ===================================================
       SEND MESSAGE
    =================================================== */

    messageForm?.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            const text =
                messageInput?.value.trim();


            if (!text) {

                showToast(
                    "Empty Message",
                    "Please type a message before sending."
                );

                return;

            }


            const activeConversation =
                document.querySelector(
                    ".conversation-item.active"
                );


            const candidateName =
                activeConversation?.dataset.name ||
                "Priya Nair";


            const currentTime =
                getCurrentTime();


            addMessageToChat(
                "sent",
                text,
                currentTime,
                true,
                candidateName
            );


            if (messageInput) {

                messageInput.value =
                    "";

                resizeTextarea();

            }


            showToast(
                "Message Sent",
                `Your message was sent to ${candidateName}.`
            );


            simulateReply(
                candidateName
            );

        }
    );


    /* ===================================================
       DEMO REPLY
    =================================================== */

    function simulateReply(candidateName) {

        const replies = [

            "Thanks for the update! I'll get back to you shortly.",

            "Sounds good. Thank you for letting me know.",

            "Sure, I'll take care of it.",

            "Thank you! I appreciate the quick response."

        ];


        const reply =
            replies[
                Math.floor(
                    Math.random() *
                    replies.length
                )
            ];


        setTimeout(() => {

            addMessageToChat(
                "received",
                reply,
                getCurrentTime(),
                true,
                candidateName
            );

        }, 1400);

    }


    /* ===================================================
       TEXTAREA AUTO RESIZE
    =================================================== */

    function resizeTextarea() {

        if (!messageInput) return;


        messageInput.style.height =
            "31px";


        messageInput.style.height =
            `${Math.min(
                messageInput.scrollHeight,
                100
            )}px`;

    }


    messageInput?.addEventListener(
        "input",
        resizeTextarea
    );


    messageInput?.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                messageForm?.requestSubmit();

            }

        }
    );


    /* ===================================================
       ATTACHMENT
    =================================================== */

    attachmentButton?.addEventListener(
        "click",
        () => {

            attachmentInput?.click();

        }
    );


    attachmentInput?.addEventListener(
        "change",
        () => {

            const file =
                attachmentInput.files?.[0];


            if (!file) return;


            if (file.size > 10 * 1024 * 1024) {

                showToast(
                    "File Too Large",
                    "Please select a file smaller than 10 MB."
                );


                attachmentInput.value =
                    "";

                return;

            }


            if (attachmentName) {

                attachmentName.textContent =
                    file.name;

            }


            if (attachmentSize) {

                attachmentSize.textContent =
                    formatFileSize(
                        file.size
                    );

            }


            attachmentPreview?.classList.add(
                "show"
            );

        }
    );


    removeAttachment?.addEventListener(
        "click",
        () => {

            if (attachmentInput) {

                attachmentInput.value =
                    "";

            }


            attachmentPreview?.classList.remove(
                "show"
            );

        }
    );


    function formatFileSize(bytes) {

        if (bytes < 1024) {

            return `${bytes} B`;

        }


        if (bytes < 1024 * 1024) {

            return `${(
                bytes / 1024
            ).toFixed(1)} KB`;

        }


        return `${(
            bytes / (1024 * 1024)
        ).toFixed(1)} MB`;

    }


    /* ===================================================
       SEARCH CONVERSATIONS
    =================================================== */

    messageSearch?.addEventListener(
        "input",
        () => {

            const search =
                messageSearch.value
                    .trim()
                    .toLowerCase();


            conversations.forEach(
                (conversation) => {

                    const name =
                        (
                            conversation.dataset.name ||
                            ""
                        ).toLowerCase();


                    conversation.style.display =
                        !search ||
                        name.includes(search)
                            ? ""
                            : "none";

                }
            );

        }
    );


    /* ===================================================
       MESSAGE FILTER TABS
    =================================================== */

    messageTabs.forEach(
        (tab) => {

            tab.addEventListener(
                "click",
                () => {

                    messageTabs.forEach(
                        (item) => {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    tab.classList.add(
                        "active"
                    );


                    const filter =
                        tab.dataset.filter ||
                        "all";


                    conversations.forEach(
                        (conversation) => {

                            const status =
                                conversation.dataset.status;

                            const starred =
                                conversation.dataset.starred;


                            let visible = true;


                            if (
                                filter === "unread"
                            ) {

                                visible =
                                    status === "unread";

                            }


                            if (
                                filter === "starred"
                            ) {

                                visible =
                                    starred === "true";

                            }


                            conversation.style.display =
                                visible
                                    ? ""
                                    : "none";

                        }
                    );

                }
            );

        }
    );


    /* ===================================================
       MARK READ
    =================================================== */

    function markConversationRead(
        conversation
    ) {

        if (
            conversation.dataset.status !==
            "unread"
        ) {

            return;

        }


        conversation.dataset.status =
            "read";


        const unreadBadge =
            conversation.querySelector(
                ".conversation-bottom b"
            );


        unreadBadge?.remove();


        updateUnreadCount();

    }


    function updateUnreadCount() {

        const unread =
            document.querySelectorAll(
                '.conversation-item[data-status="unread"]'
            ).length;


        const unreadTab =
            document.querySelector(
                '.message-tab[data-filter="unread"] span'
            );


        if (unreadTab) {

            unreadTab.textContent =
                unread;

        }

    }


    /* ===================================================
       NEW MESSAGE MODAL
    =================================================== */

    const messageModal =
        document.querySelector("#messageModal");

    const newMessageButton =
        document.querySelector("#newMessageButton");

    const composeButton =
        document.querySelector("#composeButton");

    const modalClose =
        document.querySelector("#modalClose");

    const modalBackdrop =
        document.querySelector("#modalBackdrop");

    const cancelNewMessage =
        document.querySelector("#cancelNewMessage");

    const newMessageForm =
        document.querySelector("#newMessageForm");


    function openMessageModal() {

        messageModal?.classList.add(
            "open"
        );

        document.body.style.overflow =
            "hidden";

    }


    function closeMessageModal() {

        messageModal?.classList.remove(
            "open"
        );

        document.body.style.overflow =
            "";

    }


    newMessageButton?.addEventListener(
        "click",
        openMessageModal
    );


    composeButton?.addEventListener(
        "click",
        openMessageModal
    );


    modalClose?.addEventListener(
        "click",
        closeMessageModal
    );


    modalBackdrop?.addEventListener(
        "click",
        closeMessageModal
    );


    cancelNewMessage?.addEventListener(
        "click",
        closeMessageModal
    );


    /* ===================================================
       NEW MESSAGE FORM
    =================================================== */

    newMessageForm?.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            const recipient =
                document.querySelector(
                    "#recipient"
                )?.value;


            const subject =
                document.querySelector(
                    "#messageSubject"
                )?.value.trim();


            const text =
                document.querySelector(
                    "#newMessageText"
                )?.value.trim();


            if (
                !recipient ||
                !subject ||
                !text
            ) {

                showToast(
                    "Missing Information",
                    "Please complete all message fields."
                );

                return;

            }


            closeMessageModal();


            newMessageForm.reset();


            showToast(
                "Message Sent",
                `Your message to ${recipient} has been sent successfully.`
            );

        }
    );


    /* ===================================================
       CANDIDATE PROFILE
    =================================================== */

    const candidateProfileButton =
        document.querySelector(
            "#candidateProfileButton"
        );

    const viewCandidateProfile =
        document.querySelector(
            "#viewCandidateProfile"
        );


    function openCandidateProfile() {

        const active =
            document.querySelector(
                ".conversation-item.active"
            );


        const name =
            active?.dataset.name ||
            "Priya Nair";


        showToast(
            "Candidate Profile",
            `Opening the full profile for ${name}.`
        );

    }


    candidateProfileButton?.addEventListener(
        "click",
        openCandidateProfile
    );


    viewCandidateProfile?.addEventListener(
        "click",
        openCandidateProfile
    );


    /* ===================================================
       SCHEDULE INTERVIEW
    =================================================== */

    const scheduleInterviewButton =
        document.querySelector(
            "#scheduleInterviewButton"
        );


    scheduleInterviewButton?.addEventListener(
        "click",
        () => {

            const active =
                document.querySelector(
                    ".conversation-item.active"
                );


            const name =
                active?.dataset.name ||
                "candidate";


            showToast(
                "Interview Scheduler",
                `Opening interview scheduling for ${name}.`
            );

        }
    );


    /* ===================================================
       MORE OPTIONS
    =================================================== */

    const moreChatButton =
        document.querySelector(
            "#moreChatButton"
        );


    moreChatButton?.addEventListener(
        "click",
        () => {

            showToast(
                "Conversation Options",
                "Archive, mute and report options will be connected here."
            );

        }
    );


    /* ===================================================
       EMOJI
    =================================================== */

    const emojiButton =
        document.querySelector(
            "#emojiButton"
        );


    const emojis = [
        "😊",
        "👍",
        "🎉",
        "👋",
        "🙂"
    ];


    emojiButton?.addEventListener(
        "click",
        () => {

            if (!messageInput) return;


            const emoji =
                emojis[
                    Math.floor(
                        Math.random() *
                        emojis.length
                    )
                ];


            messageInput.value +=
                emoji;


            messageInput.focus();


            resizeTextarea();

        }
    );


    /* ===================================================
       REFRESH
    =================================================== */

    const refreshButton =
        document.querySelector(
            "#refreshMessages"
        );


    refreshButton?.addEventListener(
        "click",
        () => {

            refreshButton.classList.add(
                "refreshing"
            );


            setTimeout(() => {

                refreshButton.classList.remove(
                    "refreshing"
                );


                showToast(
                    "Messages Refreshed",
                    "Your conversations are up to date."
                );

            }, 600);

        }
    );


    /* ===================================================
       CLOSE CANDIDATE PANEL
    =================================================== */

    const closeCandidatePanel =
        document.querySelector(
            "#closeCandidatePanel"
        );


    closeCandidatePanel?.addEventListener(
        "click",
        () => {

            const panel =
                document.querySelector(
                    ".candidate-info-panel"
                );


            if (panel) {

                panel.style.display =
                    "none";

            }

        }
    );


    /* ===================================================
       LOGOUT
    =================================================== */

    const logoutButton =
        document.querySelector(
            "#logoutButton"
        );


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
        document.querySelector(
            "#messagesToast"
        );

    const toastTitle =
        document.querySelector(
            "#toastTitle"
        );

    const toastMessage =
        document.querySelector(
            "#toastMessage"
        );

    const toastClose =
        document.querySelector(
            "#toastClose"
        );


    let toastTimer;


    function showToast(
        title,
        message
    ) {

        if (!toast) return;


        if (toastTitle) {

            toastTitle.textContent =
                title;

        }


        if (toastMessage) {

            toastMessage.textContent =
                message;

        }


        toast.classList.add(
            "show"
        );


        clearTimeout(
            toastTimer
        );


        toastTimer =
            setTimeout(
                hideToast,
                4000
            );

    }


    function hideToast() {

        toast?.classList.remove(
            "show"
        );

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

            if (event.key !== "Escape") {
                return;
            }


            closeSidebar();

            closeMessageModal();

            hideToast();

        }
    );


    /* ===================================================
       HELPER
    =================================================== */

    function setText(
        selector,
        value
    ) {

        const element =
            document.querySelector(
                selector
            );


        if (element) {

            element.textContent =
                value;

        }

    }


    function getCurrentTime() {

        return new Date()
            .toLocaleTimeString(
                [],
                {
                    hour: "numeric",
                    minute: "2-digit"
                }
            );

    }


    /* ===================================================
       INITIALIZE
    =================================================== */

    loadCandidate(
        "Priya Nair"
    );


    scrollChatToBottom();


    console.log(
        "DevRecruit Messages initialized successfully."
    );

});