import mongoose from "mongoose"; // Importing the mongoose library to interact with MongoDB

// Async function to establish a connection to MongoDB
const connectDB = async () => {
    try {
        // Attempt to connect to MongoDB using the connection string from environment variables
        await mongoose.connect(process.env.MONGO_URI);

        // If connection is successful, log the success message
        console.log('mongodb connected successfully.');
    } catch (error) {
        // If an error occurs, catch it and log it
        console.log(error);
    }
}

// Export the function to be used in other parts of the application
export default connectDB;
