let chats = JSON.parse(localStorage.getItem("chats")) || [];
let currentChat = [];

document.addEventListener("DOMContentLoaded", () => {
    renderSidebar();
});

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

// function formatResponse(text) {
//     const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;

//     return text.replace(codeBlockRegex, (match, lang, code) => {
//         return `
//         <div class="code-container">
//             <button class="copy-btn" onclick="copyCode(this)">Copy</button>
//             <pre><code class="language-${lang || ''}">${escapeHtml(code.trim())}</code></pre>
//         </div>
//         `;
//     }).replace(/\n/g, "<br>");
// }

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function addMessage(content, type) {
    const chatBox = document.getElementById("chat-box");

    const wrapper = document.createElement("div");
    wrapper.className = "message " + type;

    // ✅ Convert markdown → HTML
    const html = marked.parse(content);

    wrapper.innerHTML = html;

    // ✅ Add copy buttons to code blocks
    wrapper.querySelectorAll("pre code").forEach((block) => {
        const container = document.createElement("div");
        container.className = "code-container";

        const copyBtn = document.createElement("button");
        copyBtn.innerText = "Copy";
        copyBtn.className = "copy-btn";

        copyBtn.onclick = () => {
            navigator.clipboard.writeText(block.innerText);
            copyBtn.innerText = "Copied!";
            setTimeout(() => copyBtn.innerText = "Copy", 1500);
        };

        const pre = block.parentElement;
        pre.parentNode.insertBefore(container, pre);
        container.appendChild(copyBtn);
        container.appendChild(pre);

        hljs.highlightElement(block);
    });

    chatBox.appendChild(wrapper);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function newChat() {
    if (currentChat.length > 0) {
        chats.push([...currentChat]);
        localStorage.setItem("chats", JSON.stringify(chats));
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
        item.innerText = chat[0]?.text?.slice(0, 30) || "New Chat";

        item.onclick = () => {
            loadChat(index);
        };

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
    localStorage.setItem("chats", JSON.stringify(chats));
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

function copyCode(button) {
    const code = button.parentElement.querySelector("code").innerText;

    navigator.clipboard.writeText(code);

    button.innerText = "Copied!";
    setTimeout(() => {
        button.innerText = "Copy";
    }, 1500);
}