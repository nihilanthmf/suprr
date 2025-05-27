import { Pool } from "pg";
import "dotenv/config";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function fetchChat(chatId) {
  try {
    const res = await pool.query("SELECT * FROM chats WHERE id = $1", [chatId]);

    return res.rows[0];
  } catch (error) {
    console.error("Error fetching chat:", error);
    return null;
  }
}

export async function fetchProject(projectId) {
  try {
    const res = await pool.query("SELECT * FROM projects WHERE id = $1", [
      projectId,
    ]);

    return res.rows[0];
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
}

export async function fetchProjectByChatid(chatId) {
  try {
    const res = await pool.query("SELECT * FROM projects WHERE chatid = $1", [
      chatId,
    ]);

    return res.rows[0];
  } catch (error) {
    console.error("Error fetching project by chatId:", error);
    return null;
  }
}

export async function fetchChatByProjectAndMessageThreadId(
  projectId,
  messageThreadId
) {
  try {
    const res = await pool.query(
      "SELECT * FROM chats WHERE project = $1 AND messagethreadid = $2",
      [projectId, messageThreadId]
    );

    return res.rows[0];
  } catch (error) {
    console.error("Error fetching project by chatId:", error);
    return null;
  }
}

export async function writeMessages(
  chat,
  chatId,
  project,
  messageThreadId,
  messageText,
  isUser
) {
  const chatExists = !!chat;

  // create a new chat if it doesn't exist
  if (!chatExists) {
    await pool.query(
      "INSERT INTO chats (id, project, messagethreadid) VALUES ($1, $2, $3)",
      [chatId, project, messageThreadId]
    );
  }

  const message = {
    role: isUser ? "user" : "admin",
    content: messageText,
  };

  try {
    const res = await pool.query(
      "UPDATE chats SET messages = $1 WHERE id = $2",
      [chatExists ? [...chat.messages, message] : [message], chatId]
    );

    return res.rows[0];
  } catch (error) {
    console.error("Error fetching project by chatId:", error);
    return null;
  }
}
