
# Switch to Node.js base image
FROM node:latest

# Set working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the Prisma directory into the container
COPY prisma/ ./prisma/

# Copy the rest of the application files to the container
COPY . .

# Expose the port your app runs on
EXPOSE 8080


# Command to run the application
CMD ["npm", "run","production"]
