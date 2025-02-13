import mongoose from "mongoose";

// Define the schema for the User model
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true }, // Unique username
    email: { type: String, required: true, unique: true }, // Unique email
    password: { type: String, required: true }, // Password field
    profilePicture: { type: String, default: '' }, // Default empty string for profile picture
    bio: { type: String, default: '' }, // Default empty string for bio
    gender: { type: String, enum: ['male', 'female'] }, // Gender field with limited options
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of User references for followers
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of User references for following
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }], // Array of Post references for user posts
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }] // Array of Post references for bookmarked posts
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Create and export the User model
export const User = mongoose.model('User', userSchema);
