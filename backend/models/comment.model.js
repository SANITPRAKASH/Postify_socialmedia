import mongoose from "mongoose";

// Define the schema for the Comment model
const commentSchema = new mongoose.Schema(
  {
    text: { 
      type: String, 
      required: true // The comment text is required
    },
    author: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', // Reference to the User model, indicating the author of the comment
      required: true // The comment must have an author
    },
    post: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Post', // Reference to the Post model, indicating the post the comment belongs to
      required: true // The comment must be linked to a post
    }
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create and export the Comment model
export const Comment = mongoose.model('Comment', commentSchema);
