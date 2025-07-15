# Use Node 20
FROM node:20

# Set working dir
WORKDIR /app

# Copy files
COPY package*.json ./

# Install deps
RUN npm install

# Copy everything else
COPY . .

# Build the Vite app
RUN npm run build

# Serve it using Vite's preview server
EXPOSE 5173
CMD ["npm", "run", "preview", "--", "--host"]
