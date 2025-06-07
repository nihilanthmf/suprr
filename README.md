### How to self host Suprr

There are two repositories you will need to self host Suprr:
1. Suprr chat bubble (https://github.com/nihilanthmf/suprr-chat)
2. Suprr nodejs backend (this repo: https://github.com/nihilanthmf/suprr)

Here's a step-by-step instruction on how to self-host the backend:

1. Clone this repository (https://github.com/nihilanthmf/suprr)
2. Create a .env file inside the repo directory with the following values:
   DATABASE_URL=postgresql://your-pg-database-url
   TELEGRAM_BOT_TOKEN=your-telegram-bot-token
   BASE_URL=the-url-of-your-backend

## Setting up the database

1. Create a postgress database with the schema that is defined in the schema.sql in the root of the project
2. Host the database using the provider of your choice (Supabase, render.com, AWS, DigitalOcean, etc.)
3. Put your database URL in the DATABASE_URL field in your .env file

## Setting up your telegram bot

1. Create a Telegram Account: If you don't already have one, sign up for a Telegram account. 
2. Find BotFather: Search for "@BotFather" in your Telegram contacts and start a chat with them. 
3. Create a New Bot: Type "/newbot" in the chat with BotFather. 
4. Name and Username: BotFather will prompt you to choose a name and a unique username for your bot. Choose any name and username you want. 
5. Get the Token: Once you've provided the name and username, BotFather will give you a token. This is a unique key for your bot and is essential for accessing the Telegram API. 
6. Put the Token in the TELEGRAM_BOT_TOKEN in your .env file

## Hosting the service

1. Host the service using (you can either use Commit-to-deploy or Docker, Dockerfile and .dockerignore are already configured in the repository)
2. Put the url of your newly-hosted server in the BASE_URL in .env and re-deploy

Congrats! The backend is deployed!

## Creating a project

1. Create a new row in the "projects" table in your database
2. Choose a random id, name, user fields, leave chats as an empty array, lastseen and created_at fields should be automatically set to current time. Enter chatid
3. Get your chatid

## Self-hosting the frontend
1. Clone the frontend repo (https://github.com/nihilanthmf/suprr-chat)
2. Add your server url (BASE_URL) to the "websiteUrl" variable in the app.js file
3. Add the app.js file to your project directory
4. Embed the app.js on every page of your website where you want the customer support bubble to show using  <script src="app.js?projectKey=d97eedd1-c52a-442d-aada-2a091d46d93f"></script>
