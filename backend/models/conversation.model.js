import mongoose from "mongoose";

// Define the schema for the Conversation model
const conversationSchema = new mongoose.Schema(
  {
    participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model, representing the participants in the conversation
      required: true
    }],
    messages: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message', // Reference to the Message model, representing messages in the conversation
      default: []
    }]
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create and export the Conversation model
export const Conversation = mongoose.model('Conversation', conversationSchema);
