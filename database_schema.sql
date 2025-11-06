CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT
);

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    project_name TEXT,
    private_telegram_chat_id TEXT,
    public_telegram_chat_id TEXT,
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chats (
    id UUID PRIMARY KEY,
    project_id UUID REFERENCES projects(id),
    message_thread_id TEXT,
    sender_email TEXT,
    created_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID REFERENCES chats(id),
    content TEXT,
    sender_role TEXT
);