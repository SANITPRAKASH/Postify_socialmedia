import express from "express";
import {
  editProfile,
  followOrUnfollow,
  getProfile,
  getSuggestedUsers,
  login,
  logout,
  register,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js"
import upload from "../middlewares/multer.js";

const router = express.Router();

// Register route for new users
router.route('/register').post(register);

// Login route for existing users
router.route('/login').post(login);

// Logout route to log out users
router.route('/logout').get(logout);

// Profile route for fetching a specific user's profile
router.route('/:id/profile').get(isAuthenticated, getProfile);

// Edit profile route for authenticated users to update their profile information
router.route('/profile/edit').post(isAuthenticated, upload.single('profilePhoto'), editProfile);

// Suggested users route for fetching user recommendations
router.route('/suggested').get(isAuthenticated, getSuggestedUsers);

// Follow/unfollow route for users to follow or unfollow other users
router.route('/followorunfollow/:id').post(isAuthenticated, followOrUnfollow);

export default router;
