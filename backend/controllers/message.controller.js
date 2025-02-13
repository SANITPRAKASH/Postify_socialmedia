import { Conversation } from "../models/conversation.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import { Message } from "../models/message.model.js";

// Send a new message
export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id; // Authenticated user's ID
        const receiverId = req.params.id; // Receiver's ID from URL params
        const { textMessage: message } = req.body; // Destructure message from request body

        // Validate the message content
        if (!message || !receiverId) {
            return res.status(400).json({ success: false, message: "Message or receiver ID is missing." });
        }

        // Check if a conversation exists between the participants
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        // Create a new conversation if it doesn't exist
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        // Create a new message
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message,
        });

        // Link the message to the conversation
        conversation.messages.push(newMessage._id);

        // Save conversation and message
        await Promise.all([conversation.save(), newMessage.save()]);

        // Emit the message to the receiver if they are online
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId && io) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        // Send response
        return res.status(201).json({
            success: true,
            newMessage,
        });
    } catch (error) {
        console.error("Error in sendMessage:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to send message. Please try again later.",
        });
    }
};

// Get messages between two users
export const getMessage = async (req, res) => {
    try {
        const senderId = req.id; // Authenticated user's ID
        const receiverId = req.params.id; // Receiver's ID from URL params

        // Fetch the conversation between the participants
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        }).populate("messages");

        // If no conversation exists, return an empty array
        if (!conversation) {
            return res.status(200).json({ success: true, messages: [] });
        }

        // Send the messages in the conversation
        return res.status(200).json({
            success: true,
            messages: conversation.messages,
        });
    } catch (error) {
        console.error("Error in getMessage:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve messages. Please try again later.",
        });
    }
};
