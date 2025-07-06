import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);

// Setup Socket.IO server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173 ",  // Allow connections from a specific URL (set this in your .env file)
        methods: ['GET', 'POST']  // Allow only GET and POST methods for CORS
    }
});

// This map will store socket ids corresponding to each user id.
const userSocketMap = {}; 

// // Utility function to get the receiver's socket id by their userId
export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

io.on("connection", (socket) => {
    // Get the userId from the query parameters during socket connection
    const userId = socket.handshake.query.userId;
    
    if (userId) {
        // Map the userId to the socketId
        userSocketMap[userId] = socket.id;
        // console.log(`User connected: UserId= ${userId}, SocketId= ${socket.id} connected`);
    }

    // Emit the list of online users (userIds) to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Listen for 'disconnect' event when the user disconnects
    socket.on("disconnect", () => {
        if (userId) {
            // Remove the userId from the map when the user disconnects
            delete userSocketMap[userId];
            // console.log(`User disconnected: UserId= ${userId}, SocketId= ${socket.id} disconnected`);
        }
        // Emit updated list of online users to all connected clients
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { app, server, io };
