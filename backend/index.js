import express, { urlencoded } from "express"; // Import express and urlencoded middleware
import cors from "cors"; // Import CORS (Cross-Origin Resource Sharing) middleware
import cookieParser from "cookie-parser"; // Middleware for parsing cookies
import dotenv from "dotenv"; // To load environment variables from the .env file
import connectDB from "./utils/db.js"; // MongoDB connection utility
import userRoute from "./routes/user.route.js"; // Routes for user management
import postRoute from "./routes/post.route.js"; // Routes for posts
import messageRoute from "./routes/message.route.js"; // Routes for messages
import { app, server } from "./socket/socket.js"; // Socket.io integration
import path from "path"; // Module to handle file and directory paths

dotenv.config(); // Load environment variables from the .env file

const PORT = process.env.PORT || 8000; // Set the port from the environment variables or default to 3000
// Catch-all route to serve the frontend for any unmatched request
// app.get("/", (_, res) => {
//     return res.status(200).json({
//         message:"im coming from backend server",
//         success:true,
//     })
// });
// const __dirname = path.resolve(); // Resolve the directory path for static files

// Middlewares
app.use(express.json()); // Middleware to parse JSON requests
app.use(cookieParser()); // Middleware to parse cookies
app.use(urlencoded({ extended: true })); // Middleware to parse URL-encoded data

// CORS configuration
const corsOptions = {
    origin: 'http://localhost:5173', // Allow only requests from the specified origin
    credentials: true, // Allow credentials (cookies) to be sent with the request
};
app.use(cors(corsOptions)); // Apply CORS middleware with the specified options

// API Routes
app.use("/api/v1/user", userRoute); // User-related routes
app.use("/api/v1/post", postRoute); // Post-related routes
app.use("/api/v1/message", messageRoute); // Message-related routes

// Serving static files from frontend
// app.use(express.static(path.join(__dirname, "/frontend/dist")));



// Start the server and connect to the database
server.listen(PORT, () => {
    connectDB(); // Connect to MongoDB
    console.log(`Server is listening on port ${PORT}`); // Log the success message
});
