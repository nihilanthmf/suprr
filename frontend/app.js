(function () {
  const httpProtocol = "https://";
  const wsProtocol = "wss://";

  const style = document.createElement("style");
  style.textContent = `
    .suprr-chat-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        background-color: rgb(243, 242, 242);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        z-index: 1000000000000000;
        transition: transform 0.3s ease;
        border: 1px solid #0000001a;
        backdrop-filter: blur(6px);
      }

      .suprr-chat-button:hover {
        transform: scale(1.05);
      }

      .suprr-chat-button svg {
        color: rgba(0, 0, 0, 0.45);
        z-index: 50;
      }

      .suprr-chat-window {
        font-family: Arial, sans-serif;
        position: fixed;
        bottom: 90px;
        right: 20px;
        height: 75%;
        aspect-ratio: 9/12;
        min-width: 400px;
        background-color: white;
        border-radius: 10px;
        border: 1px solid #0000001a;
        box-shadow: -2px 2px 10px 2px rgba(0, 0, 0, 0.025);
        display: none;
        flex-direction: column;
        z-index: 1000000000000000;
      }

      .suprr-chat-blur {
        width: 100%;
        height: 100%;
        background-color: #ffffff1a;
        backdrop-filter: blur(100px);
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        border-radius: 10px;
      }

      .suprr-chat-header {
        padding-left: 16px;
        padding-right: 16px;
        padding-top: 12px;
        padding-bottom: 12px;
        background-color: rgba(255, 255, 255, 0.25);
        backdrop-filter: blur(6px);
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 2px;
        z-index: 510;
        border-radius: 10px 10px 0 0;
        border-bottom: 1px solid #0000001a;
        position: absolute;
        width: calc(100% - 32px);
      }

      .suprr-chat-header h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 500;
      }

      .suprr-chat-header p {
        margin: 0;
        font-size: 12px;
        color: #00000080;
      }

      .suprr-close-button {
        background: none;
        border: none;
        color: #00000080;
        cursor: pointer;
        font-size: 20px;
        position: absolute;
        right: 8px;
        top: 8px;
        transition: color 0.3s ease;
      }

      .suprr-close-button:hover {
        color: #000000;
      }

      .suprr-chat-messages {
        flex: 1;
        padding: 12px;
        overflow-y: auto;
        z-index: 50;
        display: none;
      }

      .suprr-chat-greeting {
        padding: 32px;
        z-index: 50;
        padding-top: 75px;
      }

      .suprr-chat-greeting h1 {
        text-align: center;
        font-size: 32px;
      }

      .suprr-chat-greeting h2 {
        text-align: center;
        font-size: 24px;
        font-weight: 500;
      }

      .suprr-chat-greeting p {
        text-align: center;
        font-size: 14px;
        color: #00000080;
      }

      .suprr-chat-input {
        padding: 15px;
        /* border-top: 1px solid #eee; */
        display: flex;
        z-index: 50;
        position: absolute;
        bottom: 0;
        width: calc(100% - 30px);
      }

      .suprr-chat-input-container {
        border: 1px solid #0000001a;
        display: flex;
        flex-direction: row;
        border-radius: 12px;
        gap: 8px;
        padding: 4px;
        background-color: rgba(255, 255, 255, 0.75);
        backdrop-filter: blur(6px);
        width: 100%;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      }

      .suprr-chat-input input {
        flex: 1;
        padding-left: 8px;
        padding-right: 8px;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        background-color: transparent;
      }

      .suprr-chat-input input:focus {
        outline: none;
      }

      .suprr-chat-input button {
        padding: 6px;
        border: 1px solid #0000001a;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        color: black;
      }

      .suprr-chat-input button:hover {
        background-color: #0000001a;
      }

      .suprr-message {
        margin-top: 10px;
        padding: 8px 12px;
        border-radius: 8px;
        max-width: 80%;
        border: 1px solid #0000001a;
        color: black;
      }

      .suprr-user-message {
        background-color: rgba(144, 144, 144, 0.1);
        margin-left: auto;
      }

      .suprr-bot-message {
        background-color: rgba(255, 255, 255, 0.75);
        margin-right: auto;
      }

      .suprr-color-background-1 {
        position: absolute;
        top: 0;
        left: 0;
        width: 60%;
        aspect-ratio: 1;
        background-color: rgba(0, 157, 255, 0.05);
        border-radius: 100%;
        z-index: 0;
      }

      .suprr-color-background-2 {
        position: absolute;
        top: 0;
        right: 0;
        margin-top: 30%;
        width: 80%;
        aspect-ratio: 1;
        background-color: rgba(0, 153, 255, 0.05);
        border-radius: 100%;
        z-index: 0;
      }`;
  document.head.appendChild(style);

  const chatHTML = `
    <div class="suprr-chat-button" id="suprrChatButton">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.75"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-message-circle-icon lucide-message-circle"
      >
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
      </svg>
    </div>

    <div class="suprr-chat-window" id="suprrChatWindow">
      <div class="suprr-color-background-1"></div>
      <div class="suprr-color-background-2"></div>
      <div class="suprr-chat-blur"></div>
      <div class="suprr-chat-header" id="suprrChatHeader">
        <h3>Stayn Support</h3>
        <p id="suprrLastSeen"></p>
        <button class="suprr-close-button" id="suprrCloseButton">&times;</button>
      </div>
      <div class="suprr-chat-greeting" id="suprrChatGreeting">
        <h1>🤗</h1>
        <h2>Hello! This is Stayn’s Customer support</h2>
        <p>
          Feel free to ask any question about the software or give feedback!
          We’re most active on 7am - 17pm (EST+5)
        </p>
      </div>
      <div class="suprr-chat-messages" id="suprrChatMessages">
      </div>
      <div class="suprr-chat-input" id="suprrChatInput">
        <div class="suprr-chat-input-container">
          <input
            type="text"
            id="suprrMessageInput"
            placeholder="Type your message..."
          />
          <button id="suprrSendButton">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-send-horizontal-icon lucide-send-horizontal"
            >
              <path
                d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z"
              />
              <path d="M6 12h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    `;
  const container = document.createElement("div");
  container.innerHTML = chatHTML;
  document.body.appendChild(container);

  function getAuthKeyFromScript() {
    const scripts = document.getElementsByTagName("script");
    for (let script of scripts) {
      if (script.src && script.src.includes("app.js")) {
        const url = new URL(script.src, window.location.origin);
        return url.searchParams.get("projectKey");
      }
    }
    return null;
  }

  function getServerUrlFromScript() {
    const scripts = document.getElementsByTagName("script");
    for (let script of scripts) {
      if (script.src && script.src.includes("app.js")) {
        const url = new URL(script.src, window.location.origin);
        return url.searchParams.get("serverUrl");
      }
    }
    return null;
  }

  const chatButton = document.getElementById("suprrChatButton");
  const chatWindow = document.getElementById("suprrChatWindow");
  const closeButton = document.getElementById("suprrCloseButton");
  const messageInput = document.getElementById("suprrMessageInput");
  const sendButton = document.getElementById("suprrSendButton");
  const chatMessages = document.getElementById("suprrChatMessages");
  const chatGreeting = document.getElementById("suprrChatGreeting");
  const chatInput = document.getElementById("suprrChatInput");
  const chatHeader = document.getElementById("suprrChatHeader");
  const lastSeen = document.getElementById("suprrLastSeen");

  function adjustChatMessagesPadding() {
    if (chatInput && chatMessages) {
      chatWindow.style.display = "block";
      const inputHeight = chatInput.offsetHeight;
      const chatHeaderHeight = chatHeader.offsetHeight;
      chatWindow.style.display = "none";
      chatMessages.style.paddingBottom = inputHeight + "px";
      chatMessages.style.paddingTop = chatHeaderHeight + 12 + "px";
    }
  }

  window.addEventListener("DOMContentLoaded", adjustChatMessagesPadding);

  window.addEventListener("resize", adjustChatMessagesPadding);

  let socket = null;

  async function fetchChat(chatId) {
    const response = await fetch(
      `${httpProtocol}${getServerUrlFromScript()}/fetch-chat-messages/${chatId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "GET",
      }
    );
    const data = await response.json();

    console.log(data);

    if (response.ok) {
      if (data.length !== 0) {
        chatGreeting.style.display = "none";
        chatMessages.style.display = "block";
      }

      for (const message of data) {
        addMessage(message.content, message.sender_role === "admin");
      }

      return data;
    }

    return null;
  }

  async function fetchLastSeen() {
    console.log("fetch last seen");
    const response = await fetch(
      `${httpProtocol}${getServerUrlFromScript()}/fetch-last-seen/${getAuthKeyFromScript()}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "GET",
      }
    );
    const lastSeenData = await response.json();

    const lastSeenDate = new Date(lastSeenData);

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    let lastSeenText = "";
    let lastSeenTime = `${lastSeenDate.getHours()}:${lastSeenDate.getMinutes()}`;

    if (lastSeenDate.toDateString() === today.toDateString()) {
      lastSeenText = `Last seen today at ${lastSeenTime}`;
    } else if (lastSeenDate.toDateString() === yesterday.toDateString()) {
      lastSeenText = `Last seen yesterday at ${lastSeenTime}`;
    } else {
      lastSeenText = `Last seen on ${lastSeenDate.toLocaleString("en-US", {
        month: "long",
      })} ${lastSeenDate.getDate()} at ${lastSeenTime}`;
    }

    lastSeen.textContent = lastSeenText;
  }

  let chatId = localStorage.getItem("suprrChatId");

  fetchChat(chatId);
  fetchLastSeen();

  chatButton.addEventListener("click", () => {
    chatWindow.style.display =
      chatWindow.style.display === "flex" ? "none" : "flex";
  });

  closeButton.addEventListener("click", () => {
    chatWindow.style.display = "none";
  });

  function addMessage(content, isAdmin) {
    chatGreeting.style.display = "none";
    chatMessages.style.display = "block";

    const message = document.createElement("div");
    message.className = isAdmin
      ? "suprr-message suprr-bot-message"
      : "suprr-message suprr-user-message";
    message.textContent = content;

    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function initializeSocket(chatId) {
    if (
      !socket ||
      socket.readyState === WebSocket.CLOSED ||
      socket.readyState === WebSocket.CLOSING
    ) {
      socket = new WebSocket(
        `${wsProtocol}${getServerUrlFromScript()}/ws?chatId=${chatId}`
      );

      // When the connection is open
      socket.addEventListener("open", () => {
        socket.send("Hello from client");
      });

      // When a message is received
      socket.addEventListener("message", (event) => {
        const data = JSON.parse(event.data);

        if (data.data.chat_id === chatId) {
          addMessage(data.data.text, true);
        }
      });
    }
  }

  function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
      addMessage(message, false);

      messageInput.value = "";

      if (!chatId) {
        const chatId = crypto.randomUUID();
        localStorage.setItem("suprrChatId", chatId);
      }

      fetch(`${httpProtocol}${getServerUrlFromScript()}/message`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          message,
          chatId,
          project: getAuthKeyFromScript(),
        }),
      });

      initializeSocket(chatId);
    }
  }

  sendButton.addEventListener("click", sendMessage);

  messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });
})();
