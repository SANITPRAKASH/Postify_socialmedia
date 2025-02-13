import mongoose from "mongoose";

// Define the schema for the Post model
const postSchema = new mongoose.Schema(
  {
    caption: { type: String, default: '' }, // Caption for the post, default is an empty string
    image: { type: String, required: true }, // URL or path to the post image, required
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User who created the post
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of User references for users who liked the post
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }] // Array of Comment references for comments on the post
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Create and export the Post model
export const Post = mongoose.model('Post', postSchema);
