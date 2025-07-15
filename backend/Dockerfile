# Use Node 20
FROM node:20

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install deps
RUN npm install

# Copy the rest of the backend files
COPY . .

# Expose backend port
EXPOSE 8000

# Run the server
CMD ["node", "index.js"]
