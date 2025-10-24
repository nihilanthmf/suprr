import express from "express";
import cors from "cors";
import axios from "axios";
import {
  writeMessages,
  fetchChat,
  fetchProject,
  fetchChatByProjectAndMessageThreadId,
  fetchProjectIdByTelegramChatId,
  updateLastSeen,
  fetchLastSeen,
  createChat,
} from "./database.js";
import "dotenv/config";
import WebSocket, { WebSocketServer } from "ws";
import http from "http";
import url from "url";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({
  server,
  path: "/ws",
  clientTracking: true,
});

const port = process.env.PORT || 3000;

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const botBaseUrl = `https://api.telegram.org/bot${botToken}`;
app.use(cors());
app.use(express.json());

async function createTopicInTelegram(sender, telegramGroupId) {
  const res = await fetch(`${botBaseUrl}/createForumTopic`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: telegramGroupId,
      name: `Topic for ${sender}`,
      icon_custom_emoji_id: "5237699328843200968",
    }),
  });

  const resJson = res.json();

  return resJson;
}

const clients = new Set();

wss.on("connection", (ws, req) => {
  console.log("WebSocket client connected");

  const parsedUrl = url.parse(req.url, true);
  const chatId = parsedUrl.query.chatId;

  ws.chatId = chatId;

  clients.add(ws);

  ws.on("error", (error) => {
    console.error("WebSocket error", error);
  });

  ws.on("close", () => {
    clients.delete(ws);
    console.log(`Client disconnected with chatId: ${ws.chatId}`);

    console.log("Client disconnected");
  });

  ws.on("message", (message) => {
    console.log("WS received:", message);
  });
});

function broadcast(message) {
  clients.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN && ws.chatId === message.chatId) {
      console.log(JSON.stringify(message));
      ws.send(JSON.stringify(message));
    }
  });
}

async function sendMessageTelegram(telegramGroupId, messageThreadId, message) {
  const sendMessageResponse = await axios.post(`${botBaseUrl}/sendMessage`, {
    chat_id: telegramGroupId,
    message_thread_id: messageThreadId,
    text: message,
    parse_mode: "HTML",
  });

  return sendMessageResponse;
}

async function setWebhook() {
  const telegramApiUrl = `${botBaseUrl}/setWebhook`;

  console.log("Setting webhook...");

  const res = await fetch(telegramApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: `${process.env.BASE_URL}/webhook`,
      pending_update_count: 0,
      max_connections: 4000,
      allowed_updates: ["message", "my_chat_member"],
      drop_pending_updates: true,
    }),
  });
  res.json().then((e) => {
    console.log("set webhook result:", e);
  });
}

app.post("/webhook", async (req, res) => {
  console.log("webhook reached!");
  const request = req.body;
  console.log(request);

  // if the webhook was triggered by adding a bot to a new chat
  if (request.my_chat_member) {
    console.log("my_chat_member");
    const chatId = request.my_chat_member.chat.id;
    try {
      sendMessageTelegram(chatId, null, `👋 Hello! This chat ID is: ${chatId}`);
      return res.status(200).json({ error: null });
    } catch (error) {
      console.error("Error sending message:", error);
      return res.status(400).json({ error });
    }
  }

  // if the webhook was triggered by a new message
  if (
    request.message &&
    request.message.chat !== undefined &&
    request.message.text !== undefined
  ) {
    const message_thread_id = request.message.message_thread_id;
    const telegram_chat_id = request.message.chat.id;
    const text = request.message.text;
    const is_bot = request.message.from.is_bot;

    if (
      message_thread_id !== undefined &&
      telegram_chat_id !== undefined &&
      text !== undefined &&
      !is_bot
    ) {
      const projectId = await fetchProjectIdByTelegramChatId(telegram_chat_id);
      const chat = await fetchChatByProjectAndMessageThreadId(
        projectId,
        message_thread_id
      );

      if (chat) {
        console.log("chat found!");
        await writeMessages(chat.id, text, false);

        await updateLastSeen(projectId);

        console.log("broadcasting...");

        // broadcast the new message to all connected clients
        broadcast({
          type: "new_message",
          data: {
            chat_id: chat.id,
            text,
          },
          chatId: chat.id,
        });
      }
    }
  }

  return res.status(200).json({ error: null });
});

app.post("/message", async (req, res) => {
  try {
    console.log("Message received");
    const { message, chatId, project } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const projectData = await fetchProject(project);

    const telegramGroupId = projectData.telegram_chat_id;

    if (!botToken || !telegramGroupId) {
      return res
        .status(500)
        .json({ error: "Telegram configuration is missing" });
    }

    let messageThreadId = null;

    // if the chat already exists
    if (chatId) {
      const chat = await fetchChat(chatId);

      messageThreadId = chat.message_thread_id;
    } else {
      // if the chat does not exist
      const res = await createChat(
        projectData.id,
        "default_sender",
        messageThreadId
      );

      const createTopicResponse = await createTopicInTelegram(
        res.sender,
        telegramGroupId
      );

      if (!createTopicResponse.ok) {
        throw new Error("Failed to create forum topic");
      }

      messageThreadId = createTopicResponse.result.message_thread_id;

      chatId = res.id;
      console.log("chatId :>> ", chatId);
    }

    await sendMessageTelegram(telegramGroupId, messageThreadId, message);

    await writeMessages(chatId, message, true);

    if (!sendMessageResponse.data.ok) {
      throw new Error("Failed to send message");
    }

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
      topicId: messageThreadId,
      chatId,
    });
  } catch (error) {
    console.error("Telegram API Error:", error);
    res.status(500).json({
      error: "Failed to send message to Telegram",
      details: null,
    });
  }
});

app.get("/fetch-chat/:chatId", async (req, res) => {
  const { chatId } = req.params;
  try {
    const chat = await fetchChat(chatId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }
    res.status(200).json(chat);
  } catch (error) {
    console.error("Error fetching chat:", error);
    res.status(500).json({ error: "Failed to fetch chat data" });
  }
});

app.get("/fetch-last-seen/:projectId", async (req, res) => {
  const { projectId } = req.params;

  try {
    const lastSeenObj = await fetchLastSeen(projectId);
    console.log(lastSeenObj, projectId);

    if (!lastSeenObj || !lastSeenObj.last_seen) {
      return res.status(404).json({ error: "Last seen not found" });
    }

    res.status(200).json(lastSeenObj.last_seen);
  } catch (error) {
    console.error("Error fetching last seen:", error);
    res.status(500).json({ error: "Failed to fetch last seen data" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

setWebhook();

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
