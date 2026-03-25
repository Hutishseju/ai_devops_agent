let chats = [];
let currentChat = [];

document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("input");

    // ✅ ENTER KEY FIX
    input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    });
});

function addMessage(content, type) {
    const chatBox = document.getElementById("chat-box");
    chatBox.innerHTML += `<div class="message ${type}">${content}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
}

function newChat() {
    if (currentChat.length > 0) {
        chats.push([...currentChat]);
    }
    currentChat = [];
    document.getElementById("chat-box").innerHTML = "";
    renderSidebar();
}

function renderSidebar() {
    const historyDiv = document.getElementById("history");
    historyDiv.innerHTML = "";

    chats.forEach((chat, index) => {
        const item = document.createElement("div");
        item.className = "chat-item";
        item.innerText = "Chat " + (index + 1);
        item.onclick = () => loadChat(index);
        historyDiv.appendChild(item);
    });
}

function loadChat(index) {
    const chatBox = document.getElementById("chat-box");
    chatBox.innerHTML = "";

    currentChat = chats[index];

    currentChat.forEach(msg => {
        addMessage(msg.text, msg.type);
    });
}

async function sendMessage() {
    const input = document.getElementById("input");
    const message = input.value.trim();

    if (!message) return;

    addMessage(`<b>You:</b> ${message}`, "user");
    currentChat.push({ text: message, type: "user" });

    input.value = "";

    const res = await fetch("/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
    });

    const data = await res.json();

    addMessage(`<b>AI:</b> ${data.response}`, "ai");
    currentChat.push({ text: data.response, type: "ai" });
}