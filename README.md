### How to self host Suprr

Suprr consists of two components - a backend and a frontend. They are both in this repository under different folders:

1. Suprr chat bubble (/frontend)
2. Suprr nodejs backend (/backend)

Here's the step by step guide to self hosting Suprr. If you encounter any problems while self-hosting Suprr please open an issue or contact https://github.com/nihilanthmf

# Setting up the backend

## Set up

1. Clone this repository (https://github.com/nihilanthmf/suprr)
2. Create a .env file inside the /backend directory

## Setting up the database

1. Create a postgress database with the schema that is defined in the database_schema.sql in the root of the project
2. Host the database using the provider of your choice (Supabase, Neon, Render, AWS, DigitalOcean, etc.)
3. Put your database URL in the DATABASE_URL field in /backend/.env

## Setting up your Telegram bot

1. Create a Telegram Account: If you don't already have one, sign up for a Telegram account.
2. Find BotFather bot: Search for "@BotFather" in your Telegram contacts and start a chat with it.
3. Create a New Bot: Type "/newbot" in the chat with BotFather.
4. Name and Username: BotFather will prompt you to choose a name and a unique username for your bot. Choose a name and a username you like.
5. Get the token: Once you've provided the name and username, BotFather will give you a token. This is a unique key for your bot and is essential for accessing the Telegram API. The token grants full access to your bot so you must not share it with anyone.
6. Put the Token in the TELEGRAM_BOT_TOKEN in /backend/.env

## Get your Telegram group ID

1. Create a Telegram group
2. Go to the group's settings
3. Turn “Topics” on in the Telegram group
4. Add your bot to the group
5. Give your bot full permissions inside the group
6. As soon as you do so the bot should create a new message in the group with your group's ID. You will use it during the next step

## Creating a project

Create a new row in the "projects" table in your database:

1. Choose any value for project_name
2. put your Telegram group's ID that you got during the previous step in telegram_chat_id
3. leave "user_id" empty
4. "id" and "last_seen" should be set automatically

Once you do that copy the "id" - you will need it during the next steps

## Hosting the server

1. Host the service (you can either use Commit-to-deploy or Docker, Dockerfile and .dockerignore are already configured in the repository)
2. Put the url of your server in the BASE_URL in /backend/.env

# Self-hosting the frontend

1. The whole frontend is just one file called app.js. It is located in /frontend folder alongside with an example.html file that provides an example usage
2. Embed the app.js at the top of every page of your website where you want the customer support bubble to show using <script src="app.js?projectKey=your-project-key&serverUrl=your-server-url"></script>. The value for your-server-url must not contain protocol (e.g. domain.com not https://domain.com!)

That's it!

If you're facing any problems please open an issue or contact https://github.com/nihilanthmf
