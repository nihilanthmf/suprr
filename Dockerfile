# syntax=docker/dockerfile:1

# Use an official Node.js runtime as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

#Copy the rest of the application source code
COPY . .

RUN npm install

#Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "index.js"]
