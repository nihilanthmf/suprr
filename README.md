### How to self host Suprr

There are two repositories you will need to self host Suprr:
1. Suprr chat bubble (https://github.com/nihilanthmf/suprr-chat)
2. Suprr nodejs backend (this repo: https://github.com/nihilanthmf/suprr)

Here's a step-by-step instruction on how to self-host the backend:

1. Clone this repository (https://github.com/nihilanthmf/suprr)
2. Create a .env file inside the repo directory

## Setting up the database

1. Create a postgress database with the schema that is defined in the schema.sql in the root of the project
2. Host the database using the provider of your choice (Supabase, render.com, AWS, DigitalOcean, etc.)
3. Put your database URL in the DATABASE_URL field in your .env file

## Setting up your telegram bot

1. Create a Telegram Account: If you don't already have one, sign up for a Telegram account. 
2. Find BotFather bot: Search for "@BotFather" in your Telegram contacts and start a chat with it.
3. Create a New Bot: Type "/newbot" in the chat with BotFather.
4. Name and Username: BotFather will prompt you to choose a name and a unique username for your bot. Choose a name and a username you like.
5. Get the Token: Once you've provided the name and username, BotFather will give you a token. This is a unique key for your bot and is essential for accessing the Telegram API. The token grants access to your bot so you must not share it with anyone.
6. Put the Token in the TELEGRAM_BOT_TOKEN in your .env file

## Hosting the server

1. Host the service (you can either use Commit-to-deploy or Docker, Dockerfile and .dockerignore are already configured in the repository)
2. Put the url of your server in the BASE_URL in .env

Congrats! The backend is all set up!

## Creating a project

1. Create a new row in the "projects" table in your database
2. Choose a random id, name, user fields, leave chats as an empty array, lastseen and created_at fields should be automatically set to current time. Enter chatid

## Get your chatid

1. Create a Telegram account (if you don’t have one) at telegram.org
2. Create a Telegram group
3. Go to the group's settings
4. Turn “Topics” on in the Telegram group
5. Add your bot to the group
6. Give your bot full permissions inside the group
7. Go to @raw_data_bot ("https://t.me/raw_data_bot"), start conversation with it, click on a “Chat” button down below and choose your newly created group
8. Copy the outputted Chat id and paste it here into the chatid field in the database row that you created on the previous step

## Self-hosting the frontend

1. Clone the frontend repo (https://github.com/nihilanthmf/suprr-chat)
2. Add your server url (BASE_URL) to the "websiteUrl" variable in the app.js file
3. Add the app.js file to your project directory
4. Get a project key from the database row that you have created
5. Embed the app.js on every page of your website where you want the customer support bubble to show using  <script src="app.js?projectKey=your-project-key"></script>