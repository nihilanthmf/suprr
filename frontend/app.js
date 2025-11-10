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
        scrollbar-width: none;
        -ms-overflow-style: none;
      }
      .suprr-chat-messages::-webkit-scrollbar {
        display: none;
      }
      .suprr-chat-greeting {
        padding: 32px;
        position: relative;
        z-index: 50;
        padding-top: 75px;
      }
      .suprr-chat-header p {
        margin: 0;
        font-size: 12px;
        color: #00000080;
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
      .suprr-chat-greeting-email-prompt-container {
        padding: 15px;
        display: flex;
        z-index: 50;
        position: absolute;
        bottom: 0;
        width: 100%;
        box-sizing: border-box;
      }  
      .suprr-chat-greeting-email-prompt {
        width: 100%;
        border: 1px solid #0000001a;
        display: flex;
        flex-direction: column;
        border-radius: 12px;
        gap: 8px;
        padding: 4px;
        background-color: rgba(255, 255, 255, 0.75);
        backdrop-filter: blur(6px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        box-sizing: border-box;
      }
      .suprr-chat-greeting-email-prompt p {
        margin: 4px;
        font-size: 14px;
        color: #00000080;
      }
      .suprr-chat-input {
        padding: 15px;
        display: flex;
        z-index: 50;
        position: absolute;
        bottom: 0;
        width: 100%;
        box-sizing: border-box;
        display: none;
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
        box-sizing: border-box;
        transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
      }
      .suprr-chat-greeting-email-prompt button,
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
      .suprr-chat-greeting-email-prompt button:hover,
      .suprr-chat-input button:hover {
        background-color: #0000001a;
      }
      input {
        flex: 1;
        padding-left: 8px;
        padding-right: 8px;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        background-color: transparent;
      }
      input::placeholder {
        color: #0000003a;
      }
      input:focus {
        outline: none;
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
      }
    `;
  document.head.appendChild(style);

  function setLanguageBasedText() {
    const languageBasedText = {
      en: {
        header: "Customer Support",
        headerGreeting: "Welcome to our Customer Support!",
        greetingDescription:
          "Feel free to ask any questions about the software or give feedback! We will reply as soon as we can!",
        emailPromptText:
          "Please enter your email to receive the reply even if you’re offline",
        messagePlaceholder: "Type your message...",
      },
      es: {
        header: "Atención al Cliente",
        headerGreeting:
          "¡Bienvenido a nuestro servicio de atención al cliente!",
        greetingDescription:
          "No dudes en hacer cualquier pregunta sobre el software o darnos tu opinión. ¡Responderemos lo antes posible!",
        emailPromptText:
          "Por favor, ingresa tu correo electrónico para recibir la respuesta incluso si estás desconectado",
        messagePlaceholder: "Escribe tu mensaje...",
      },
      de: {
        header: "Kundensupport",
        headerGreeting: "Willkommen beim Kundensupport!",
        greetingDescription:
          "Stellen Sie gerne Fragen zur Software oder geben Sie Feedback! Wir antworten so schnell wie möglich.",
        emailPromptText:
          "Bitte geben Sie Ihre E-Mail ein, um die Antwort auch offline zu erhalten",
        messagePlaceholder: "Nachricht eingeben...",
      },
      fr: {
        header: "Support Client",
        headerGreeting: "Bienvenue dans notre support client !",
        greetingDescription:
          "N'hésitez pas à poser vos questions sur le logiciel ou à nous donner votre avis ! Nous vous répondrons dès que possible.",
        emailPromptText:
          "Veuillez entrer votre e-mail pour recevoir la réponse même si vous êtes hors ligne",
        messagePlaceholder: "Tapez votre message...",
      },
      zh: {
        header: "客户支持",
        headerGreeting: "欢迎来到我们的客户支持！",
        greetingDescription:
          "欢迎您咨询关于软件的任何问题或提出反馈！我们会尽快回复您！",
        emailPromptText: "请输入您的邮箱，即使离线也能收到回复",
        messagePlaceholder: "输入您的消息…",
      },
      ar: {
        header: "دعم العملاء",
        headerGreeting: "مرحبًا بك في دعم العملاء!",
        greetingDescription:
          "لا تتردد في طرح أي أسئلة حول البرنامج أو تقديم ملاحظاتك! سنرد عليك في أقرب وقت ممكن.",
        emailPromptText:
          "يرجى إدخال بريدك الإلكتروني لتلقي الرد حتى إذا كنت غير متصل بالإنترنت",
        messagePlaceholder: "اكتب رسالتك...",
      },
      pt: {
        header: "Suporte ao Cliente",
        headerGreeting: "Bem-vindo ao nosso Suporte ao Cliente!",
        greetingDescription:
          "Sinta-se à vontade para fazer perguntas sobre o software ou enviar feedback! Responderemos o mais rápido possível.",
        emailPromptText:
          "Digite seu e-mail para receber a resposta mesmo se estiver offline",
        messagePlaceholder: "Digite sua mensagem...",
      },
      hi: {
        header: "ग्राहक सहायता",
        headerGreeting: "हमारे ग्राहक सहायता में आपका स्वागत है!",
        greetingDescription:
          "सॉफ़्टवेयर से संबंधित कोई भी प्रश्न पूछने या अपनी प्रतिक्रिया देने के लिए स्वतंत्र महसूस करें! हम जल्द से जल्द जवाब देंगे।",
        emailPromptText:
          "कृपया अपना ईमेल दर्ज करें ताकि आप ऑफ़लाइन होने पर भी जवाब प्राप्त कर सकें",
        messagePlaceholder: "अपना संदेश लिखें...",
      },
      ru: {
        header: "Поддержка клиентов",
        headerGreeting: "Добро пожаловать в службу поддержки клиентов!",
        greetingDescription:
          "Не стесняйтесь задавать любые вопросы о программе или оставлять отзывы! Мы ответим как можно скорее.",
        emailPromptText:
          "Пожалуйста, укажите свой email, чтобы получить ответ, даже если вы офлайн",
        messagePlaceholder: "Введите сообщение...",
      },
      sk: {
        header: "Zákaznícka podpora",
        headerGreeting: "Vitajte v našej zákazníckej podpore!",
        greetingDescription:
          "Neváhajte sa opýtať na čokoľvek ohľadom softvéru alebo nám dajte spätnú väzbu! Odpovieme vám čo najskôr.",
        emailPromptText:
          "Zadajte svoj e-mail, aby ste dostali odpoveď aj v prípade, že budete offline",
        messagePlaceholder: "Napíšte svoju správu...",
      },
      cs: {
        header: "Zákaznická podpora",
        headerGreeting: "Vítejte v naší zákaznické podpoře!",
        greetingDescription:
          "Neváhejte se zeptat na cokoli ohledně softwaru nebo nám dejte zpětnou vazbu! Odpovíme vám co nejdříve.",
        emailPromptText:
          "Zadejte svůj e-mail, abyste dostali odpověď i v případě, že budete offline",
        messagePlaceholder: "Napište svou zprávu...",
      },
    };

    let currentLanguageText = languageBasedText["en"];
    for (let i = 0; i < navigator.languages.length; i++) {
      const browserLanguage = navigator.languages[i].slice(0, 2);
      if (browserLanguage in languageBasedText) {
        currentLanguageText = languageBasedText[browserLanguage];
        break;
      }
    }
    return currentLanguageText;
  }
  currentLanguageText = setLanguageBasedText();

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
        <h3>${currentLanguageText.header}</h3>
        <p id="suprrLastSeen"></p>
        <button class="suprr-close-button" id="suprrCloseButton">
          &times;
        </button>
      </div>
      <div class="suprr-chat-greeting" id="suprrChatGreeting">
        <h1>🤗</h1>
        <h2>${currentLanguageText.headerGreeting}</h2>
        <p>${currentLanguageText.greetingDescription}</p>
      </div>
      <div class="suprr-chat-messages" id="suprrChatMessages"></div>

      <!-- Email prompt -->
      <div class="suprr-chat-greeting-email-prompt-container" id="suprrEmailPromptContainer">
        <div class="suprr-chat-greeting-email-prompt">
          <p>${currentLanguageText.emailPromptText}</p>
          <div class="suprr-chat-input-container">
            <input
              type="text"
              id="suprrEmailInput"
              placeholder="john@gmail.com"
            />
            <button id="suprrEmailButton">
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

      <div class="suprr-chat-input" id="suprrChatInput">
        <div class="suprr-chat-input-container">
          <input
            type="text"
            id="suprrMessageInput"
            placeholder="${currentLanguageText.messagePlaceholder}"
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
    const url = new URL(scripts[0].src);
    return url.searchParams.get("projectKey");
  }

  function getServerUrlFromScript() {
    const scripts = document.getElementsByTagName("script");
    const url = new URL(scripts[0].src);
    return url.searchParams.get("serverUrl");
  }

  const chatButton = document.getElementById("suprrChatButton");
  const chatWindow = document.getElementById("suprrChatWindow");
  const closeButton = document.getElementById("suprrCloseButton");
  const messageInput = document.getElementById("suprrMessageInput");
  const sendButton = document.getElementById("suprrSendButton");
  const emailButton = document.getElementById("suprrEmailButton");
  const emailInput = document.getElementById("suprrEmailInput");
  const chatMessages = document.getElementById("suprrChatMessages");
  const chatGreeting = document.getElementById("suprrChatGreeting");
  const emailPromptContainer = document.getElementById(
    "suprrEmailPromptContainer"
  );
  const chatInput = document.getElementById("suprrChatInput");
  const lastSeen = document.getElementById("suprrLastSeen");

  const defaultInputBackgroundColor =
    emailInput.parentElement.style.backgroundColor;
  const defaultInputBorderColor = emailInput.parentElement.style.borderColor;

  const errorInputBackgroundColor = "#ff000010";
  const errorInputBorderColor = "#ff000020";

  function adjustChatMessagesPadding() {
    if (chatMessages) {
      chatWindow.style.display = "block";
      chatWindow.style.display = "none";
      chatMessages.style.paddingBottom = "66px";
      chatMessages.style.paddingTop = "60px";
    }
  }

  function removeGreetingAddMessageInput() {
    chatGreeting.style.display = "none";
    emailPromptContainer.style.display = "none";
    chatMessages.style.display = "block";
    chatInput.style.display = "block";
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

    if (response.ok) {
      if (data.length !== 0) {
        removeGreetingAddMessageInput();
      }

      for (const message of data) {
        addMessage(message.content, message.sender_role === "admin");
      }

      return data;
    }

    return null;
  }

  async function fetchLastSeen() {
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
    let lastSeenTime = `${lastSeenDate.getHours()}:${lastSeenDate
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

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

  if (chatId) {
    fetchChat(chatId);
    fetchLastSeen();
  } else {
    // ask for user's contact details
  }

  chatButton.addEventListener("click", () => {
    chatWindow.style.display =
      chatWindow.style.display === "flex" ? "none" : "flex";
  });

  closeButton.addEventListener("click", () => {
    chatWindow.style.display = "none";
  });

  function addMessage(content, isAdmin) {
    removeGreetingAddMessageInput();

    const message = document.createElement("div");
    message.className = isAdmin
      ? "suprr-message suprr-bot-message"
      : "suprr-message suprr-user-message";
    message.textContent = content;

    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function initializeSocket(chatId, messageWhenOpen) {
    if (
      !socket ||
      socket.readyState === WebSocket.CLOSED ||
      socket.readyState === WebSocket.CLOSING
    ) {
      socket = new WebSocket(
        `${wsProtocol}${getServerUrlFromScript()}/ws?chatId=${chatId}`
      );

      console.log("Opening ws connection...");

      // When the connection is open
      socket.addEventListener("open", () => {
        console.log("WS connection opened!");
        if (messageWhenOpen) {
          socket.send(messageWhenOpen);
        } else {
          socket.send("Hello from client");
        }
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

  // Base function for sending a message via web sockets
  function sendMessage(message, messageType, sender_email) {
    if (message) {
      addMessage(message, false);

      if (!chatId) {
        chatId = crypto.randomUUID();
        localStorage.setItem("suprrChatId", chatId);
      }

      const socketMessage = JSON.stringify({
        type: messageType,
        message_content: message,
        sender_email,
        chatId,
        project: getAuthKeyFromScript(),
      });

      if (!socket) {
        initializeSocket(chatId, socketMessage);
      } else {
        socket.send(socketMessage);
      }
    }
  }

  // Send a user message via web sockets
  function sendUserMessage() {
    const message = messageInput.value.trim();
    messageInput.value = "";
    sendMessage(message, "message");
  }

  // Send a user email via web sockets
  function sendEmail() {
    const email = emailInput.value.trim();
    if (email && email.includes("@") && email.includes(".")) {
      emailInput.value = "";
      sendMessage(`Email submitted: ${email}`, "email", email);

      removeGreetingAddMessageInput();
    } else {
      emailInput.parentElement.style.backgroundColor =
        errorInputBackgroundColor;
      emailInput.parentElement.style.borderColor = errorInputBorderColor;
    }
  }

  emailButton.addEventListener("click", sendEmail);

  sendButton.addEventListener("click", sendUserMessage);

  // Clearing the error state of the email input
  emailInput.addEventListener("input", () => {
    if (emailInput.value === "") {
      emailInput.parentElement.style.backgroundColor =
        defaultInputBackgroundColor;
      emailInput.parentElement.style.borderColor = defaultInputBorderColor;
    }
  });

  emailInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      emailButton.click();
    }
  });

  chatInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      sendButton.click();
    }
  });

  messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });
})();
