# syntax=docker/dockerfile:1

FROM node:20

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3000

CMD ["node", "index.js"]
