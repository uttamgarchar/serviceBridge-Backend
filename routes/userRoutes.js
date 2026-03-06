import express from "express";
import userAuth from "../middlewares/userAuth.js";
import verifiedUser from "../middlewares/verified.middleware.js";

import {
    getUserProfile,
    updateUserProfile,
} from "../controllers/userController.js";

const router = express.Router();

/**
 * USER ROUTES
 */

// Get logged-in user profile
router.get(
    "/profile",
    userAuth,
    verifiedUser,
    getUserProfile
);

// Update user profile
router.put(
    "/profile",
    userAuth,
    verifiedUser,
    updateUserProfile
);

export default router;
