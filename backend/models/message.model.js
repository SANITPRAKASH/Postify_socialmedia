import mongoose from "mongoose";

// Define the schema for the Message model
const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model, indicating the sender of the message
      required: true
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model, indicating the receiver of the message
      required: true
    },
    message: {
      type: String,
      required: true // The message content, required field
    }
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create and export the Message model
export const Message = mongoose.model('Message', messageSchema);
