import express from "express";
import userAuth from "../middlewares/userAuth.js";
import chatAccessMiddleware from "../middlewares/chatAccessMiddleware.js";

import {
    getOrCreateChat,
    sendMessage,
} from "../controllers/chatController.js";

const router = express.Router();

/* ======================================================
   CHAT ROUTES (POST-PAYMENT ONLY)
====================================================== */

// Get or create chat for a booking
router.get(
    "/:bookingId",
    userAuth,
    chatAccessMiddleware,
    getOrCreateChat
);

// Send message
router.post(
    "/:bookingId/message",
    userAuth,
    chatAccessMiddleware,
    sendMessage
);

export default router;
