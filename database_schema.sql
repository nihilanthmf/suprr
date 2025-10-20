CREATE TABLE chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    messagethreadid TEXT,
    messages JSONB[],
    sender TEXT
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chatid UUID REFERENCES chats(id),
    content TEXT,
    sender_role TEXT
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_ids UUID[],
    email TEXT
);

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chatid UUID REFERENCES chats(id),
    userid UUID REFERENCES users(id),
    lastseen TIMESTAMP WITH TIME ZONE
);