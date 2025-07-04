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

       return res.status(201).json({ message: "Account created successfully.", success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

// Login User
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(401).json({ message: "All fields are required!", success: false });
        }

        let user = await User.findOne({ email });
        if (!user ) {
            return res.status(401).json({ message: "Incorrect email or password", success: false });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
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
        user={
            _id:user._id,
            username:user.username,
            email:user.email,
            profilePicture:user.profilePicture,
            bio:user.bio,
            followers:user.followers,
            following:user.following,
            posts:populatedPosts

        }

        res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 86400000 }).json({
            message: `Welcome back ${user.username}`,
            success: true,
            user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

// Logout User
export const logout = (_, res) => {
    try {
        return res.cookie("token", "", { maxAge: 0 }).json({ message: "Logged out successfully.", success: true });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

// Get User Profile
export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId).select("-password").populate("posts").populate("bookmarks");

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

       return  res.status(200).json({ user, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

// Edit Profile
export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender, username } = req.body;
    const profilePicture = req.file;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    // 💡 Update bio & gender
    if (bio) user.bio = bio;
    if (gender) user.gender = gender;

    // 🧠 Check if username is being changed
    if (username && username !== user.username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists && usernameExists._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: "Username already taken", success: false });
      }
      user.username = username;
    }

    // 🌩️ Upload profile photo if provided
    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      const uploadResponse = await cloudinary.uploader.upload(fileUri);
      user.profilePicture = uploadResponse.secure_url;
    }

    await user.save();
    return res.status(200).json({ message: "Profile updated", success: true, user });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};


// Get Suggested Users
export const getSuggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");//$ne means not equal to

        if (!suggestedUsers || suggestedUsers.length === 0) {
            return res.status(404).json({ message: "Currently don not have any suggested users", success: false });
        }

        return res.status(200).json({ suggestedUsers, success: true, users:suggestedUsers });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
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
                //we are pulling the userId from the following array of the targetUser and the userId from the followers array of the targetUser here we using two documents hence use Promise.all
            ]);

            return res.status(200).json({ message: "Unfollowed successfully", success: true });
        } else {
            await Promise.all([
                User.updateOne({ _id: userId }, { $push: { following: targetUserId } }),
                User.updateOne({ _id: targetUserId }, { $push: { followers: userId } })
                //we are pushing the userId to the following array of the targetUser and the userId to the followers array of the targetUser here we using two documents hence use Promise.all
            ]);

            return res.status(200).json({ message: "Followed successfully", success: true });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const userId = req.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Optional: delete all posts created by this user
    await Post.deleteMany({ author: userId });

    // Remove user from followers & following of others
    await User.updateMany(
      { followers: userId },
      { $pull: { followers: userId } }
    );
    await User.updateMany(
      { following: userId },
      { $pull: { following: userId } }
    );

    // Finally delete the user
    await User.findByIdAndDelete(userId);

    return res
      .status(200)
      .clearCookie("token") // clear auth cookie
      .json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

