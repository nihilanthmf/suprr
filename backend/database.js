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

export async function fetchChatMessages(chatId) {
  try {
    const res = await pool.query("SELECT * FROM messages WHERE chat_id = $1", [
      chatId,
    ]);

    return res.rows;
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

export async function fetchProjectIdAndCompanyNameByTelegramChatId(
  telegram_chat_id
) {
  try {
    const res = await pool.query(
      `SELECT id, company_name FROM projects WHERE telegram_chat_id = $1`,
      [telegram_chat_id]
    );

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
      "SELECT * FROM chats WHERE project_id = $1 AND message_thread_id = $2",
      [projectId, messageThreadId]
    );

    return res.rows[0];
  } catch (error) {
    console.error(
      "Error fetching project by project and message_thread_id:",
      error
    );
    return null;
  }
}

export async function updateLastSeen(project) {
  const lastSeen = new Date().toISOString();

  try {
    const res = await pool.query(
      "UPDATE projects SET last_seen = $1 WHERE id = $2",
      [lastSeen, project]
    );

    return res.rows[0];
  } catch (error) {
    console.error("Error updating last seen:", error);
    return null;
  }
}

export async function fetchLastSeen(projectId) {
  try {
    const res = await pool.query(
      "SELECT last_seen FROM projects WHERE id = $1",
      [projectId]
    );

    return res.rows[0];
  } catch (error) {
    console.error("Error fetching last seen:", error);
    return null;
  }
}

export async function createChat(
  chatId,
  project,
  sender_email,
  messageThreadId
) {
  const created_at = new Date();
  const res = await pool.query(
    "INSERT INTO chats (id, project_id, sender_email, message_thread_id, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [chatId, project, sender_email, messageThreadId, created_at]
  );

  return res.rows[0];
}

export async function updateChatEmail(chatId, sender_email) {
  const res = await pool.query(
    "UPDATE chats SET sender_email = $1 WHERE id = $2",
    [sender_email, chatId]
  );

  return res.rows[0];
}

export async function writeMessages(chatId, messageText, isUser) {
  const res = await pool.query(
    "INSERT INTO messages (chat_id, content, sender_role) VALUES ($1, $2, $3) RETURNING *",
    [chatId, messageText, isUser ? "user" : "admin"]
  );

  return res.rows[0];
}
