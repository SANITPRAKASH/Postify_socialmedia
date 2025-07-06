import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
import {
  getMessage,
  sendMessage,
  deleteMessage, // 👉 import the new controller
} from "../controllers/message.controller.js";

const router = express.Router();

// Route to send a message to a specific user
router.route('/send/:id').post(isAuthenticated, sendMessage);

// Route to get all messages for a specific user
router.route('/all/:id').get(isAuthenticated, getMessage);

//  Route to delete a specific message by its ID
router.route('/delete/:id').delete(isAuthenticated, deleteMessage);

export default router;
