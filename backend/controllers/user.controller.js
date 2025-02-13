import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";

// Register User
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(401).json({ message: "All fields are required!", success: false });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(401).json({ message: "Email already in use", success: false });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({ username, email, password: hashedPassword });

        res.status(201).json({ message: "Account created successfully.", success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

// Login User
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(401).json({ message: "All fields are required!", success: false });
        }

        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials", success: false });
        }

        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });

        // Populate posts
        const populatedPosts = await Promise.all(
            user.posts.map(async (postId) => {
                const post = await Post.findById(postId);
                return post?.author.equals(user._id) ? post : null;
            })
        );

        res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 86400000 }).json({
            message: `Welcome back ${user.username}`,
            success: true,
            user: { ...user.toObject(), posts: populatedPosts }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

// Logout User
export const logout = (_, res) => {
    res.cookie("token", "", { maxAge: 0 }).json({ message: "Logged out successfully.", success: true });
};

// Get User Profile
export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).populate("posts").populate("bookmarks");

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        res.status(200).json({ user, success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

// Edit Profile
export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { bio, gender } = req.body;
        const profilePicture = req.file;

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        if (bio) user.bio = bio;
        if (gender) user.gender = gender;

        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            const uploadResponse = await cloudinary.uploader.upload(fileUri);
            user.profilePicture = uploadResponse.secure_url;
        }

        await user.save();
        res.status(200).json({ message: "Profile updated", success: true, user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

// Get Suggested Users
export const getSuggestedUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.id } }).select("-password");

        if (!users.length) {
            return res.status(404).json({ message: "No users found", success: false });
        }

        res.status(200).json({ users, success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

// Follow or Unfollow
export const followOrUnfollow = async (req, res) => {
    try {
        const userId = req.id;
        const targetUserId = req.params.id;

        if (userId === targetUserId) {
            return res.status(400).json({ message: "Cannot follow/unfollow yourself", success: false });
        }

        const user = await User.findById(userId);
        const targetUser = await User.findById(targetUserId);

        if (!user || !targetUser) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        const isFollowing = user.following.includes(targetUserId);

        if (isFollowing) {
            await Promise.all([
                User.updateOne({ _id: userId }, { $pull: { following: targetUserId } }),
                User.updateOne({ _id: targetUserId }, { $pull: { followers: userId } })
            ]);

            return res.status(200).json({ message: "Unfollowed successfully", success: true });
        } else {
            await Promise.all([
                User.updateOne({ _id: userId }, { $push: { following: targetUserId } }),
                User.updateOne({ _id: targetUserId }, { $push: { followers: userId } })
            ]);

            return res.status(200).json({ message: "Followed successfully", success: true });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};
