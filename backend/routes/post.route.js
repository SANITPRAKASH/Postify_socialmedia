import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
import {
  addComment,
  addNewPost,
  bookmarkPost,
  deletePost,
  dislikePost,
  getAllPost,
  getCommentsOfPost,
  getUserPost,
  likePost,
} from "../controllers/post.controller.js";

const router = express.Router();

// Route to add a new post
router.route("/addpost").post(isAuthenticated, upload.single('image'), addNewPost);

// Route to get all posts
router.route("/all").get(isAuthenticated, getAllPost);

// Route to get all posts by a specific user
router.route("/userpost/all").get(isAuthenticated, getUserPost);

// Route to like a post
router.route("/:id/like").get(isAuthenticated, likePost);

// Route to dislike a post
router.route("/:id/dislike").get(isAuthenticated, dislikePost);

// Route to add a comment on a post
router.route("/:id/comment").post(isAuthenticated, addComment);

// Route to get all comments of a post
router.route("/:id/comment/all").post(isAuthenticated, getCommentsOfPost);

// Route to delete a post
router.route("/delete/:id").post(isAuthenticated, deletePost);

// Route to bookmark a post
router.route("/:id/bookmark").post(isAuthenticated, bookmarkPost);

export default router;
