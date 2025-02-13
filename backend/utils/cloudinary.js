import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config({});

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,  // Cloud name from Cloudinary account
    api_key: process.env.API_KEY,        // API key for Cloudinary API
    api_secret: process.env.API_SECRET   // API secret for Cloudinary API
});

export default cloudinary;
