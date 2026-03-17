let chats = JSON.parse(localStorage.getItem("chats")) || [];
let currentChat = JSON.parse(localStorage.getItem("currentChat")) || [];

/* ---------------- NEW CHAT ---------------- */
function newChat() {
    if (currentChat.length > 0) {
        chats.push(currentChat);
        localStorage.setItem("chats", JSON.stringify(chats));
    }

    currentChat = [];
    localStorage.removeItem("currentChat");

    renderSidebar();
    showWelcome();
}

/* ---------------- SHOW WELCOME ---------------- */
function showWelcome() {
    const chatBox = document.getElementById("chat-box");

    chatBox.innerHTML = `
        <div id="welcome" class="welcome-screen">
            <h2>👋 Hi Vishal</h2>
            <p>How can I help you today?</p>
            <div class="quick-actions">
                <button onclick="quickMsg('Explain AI')">Explain AI</button>
                <button onclick="quickMsg('Project Idea')">Project Idea</button>
                <button onclick="quickMsg('Learn ML')">Learn ML</button>
            </div>
        </div>
    `;
}

/* ---------------- QUICK MESSAGE ---------------- */
function quickMsg(text) {
    document.getElementById("user-input").value = text;
    sendMessage();
}

/* ---------------- TYPING EFFECT ---------------- */
function typeText(element, text, speed = 15) {
    let i = 0;
    element.innerHTML = "";

    function typing() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(typing, speed);
        }
    }

    typing();
}

/* ---------------- SEND MESSAGE ---------------- */
async function sendMessage() {
    const input = document.getElementById("user-input");
    const message = input.value.trim();
    if (!message) return;

    const chatBox = document.getElementById("chat-box");

    const welcome = document.getElementById("welcome");
    if (welcome) welcome.remove();

    chatBox.innerHTML += `<div class="message user">${message}</div>`;
    currentChat.push({ role: "user", text: message });

    input.value = "";

    chatBox.scrollTo({
        top: chatBox.scrollHeight,
        behavior: "smooth"
    });

    const typing = document.createElement("div");
    typing.className = "message bot";
    typing.innerHTML = " <span class='loader'></span>";
    chatBox.appendChild(typing);

    try {
        const res = await fetch("http://127.0.0.1:5000/chat", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ message })
        });

        const data = await res.json();

        typing.remove();

        const botMsg = document.createElement("div");
        botMsg.className = "message bot";
        chatBox.appendChild(botMsg);

        typeText(botMsg, data.reply);

        currentChat.push({ role: "bot", text: data.reply });

        localStorage.setItem("currentChat", JSON.stringify(currentChat));

        chatBox.scrollTo({
            top: chatBox.scrollHeight,
            behavior: "smooth"
        });

        renderSidebar(); // update sidebar

    } catch {
        typing.innerText = "Error...";
    }
}

/* ---------------- RENDER CHAT ---------------- */
function renderChat() {
    const chatBox = document.getElementById("chat-box");
    chatBox.innerHTML = "";

    currentChat.forEach(msg => {
        chatBox.innerHTML += `
            <div class="message ${msg.role}">
                ${msg.role === "user" ? "🧑" : "🤖"} ${msg.text}
            </div>
        `;
    });
}

/* ---------------- LOAD CHAT (FIX ADDED) ---------------- */
function loadChat(index) {
    currentChat = chats[index];

    localStorage.setItem("currentChat", JSON.stringify(currentChat));

    renderChat();

    const chatBox = document.getElementById("chat-box");
    chatBox.scrollTop = chatBox.scrollHeight;
}

/* ---------------- SIDEBAR ---------------- */
function renderSidebar() {
    const historyDiv = document.getElementById("chat-history");
    historyDiv.innerHTML = "";

    chats.forEach((chat, index) => {
        if (!chat.length) return;

        const title = chat[0].text.slice(0, 20) + "...";

        const div = document.createElement("div");
        div.className = "chat-item";
        div.onclick = () => loadChat(index);

        const text = document.createElement("span");
        text.innerText = title;

        const delBtn = document.createElement("button");
        delBtn.innerText = "🗑";
        delBtn.className = "delete-btn";

        delBtn.onclick = (e) => {
            e.stopPropagation();
            deleteChat(index);
        };

        div.appendChild(text);
        div.appendChild(delBtn);

        historyDiv.appendChild(div);
    });
}

/* ---------------- DELETE CHAT ---------------- */
function deleteChat(index) {
    chats.splice(index, 1);
    localStorage.setItem("chats", JSON.stringify(chats));

    renderSidebar();

    currentChat = [];
    localStorage.removeItem("currentChat");
    showWelcome();
}

/* ---------------- ENTER KEY ---------------- */
document.getElementById("user-input").addEventListener("keypress", function(e) {
    if (e.key === "Enter") sendMessage();
});

/* ---------------- LOAD ON REFRESH ---------------- */
window.onload = () => {
    renderSidebar();

    if (currentChat && currentChat.length > 0) {
        renderChat();
    } else {
        showWelcome();
    }
};

/* ---------------- BUTTON ---------------- */
document.querySelector(".new-chat").addEventListener("click", newChat);
