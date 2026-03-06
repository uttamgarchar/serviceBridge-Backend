import express from "express";
import {
    registerUser,
    loginUser,
    verifyAccountOtp,
    resendOtp,
    logoutUser, forgotPassword,
    resetPassword
} from "../controllers/authController.js";

const router = express.Router();

/**
 * AUTH ROUTES
 */

// Register user
router.post("/register", registerUser);

// Verify OTP
router.post("/verify-otp", verifyAccountOtp);

// Resend OTP
router.post("/resend-otp", resendOtp);

// Login
router.post("/login", loginUser);


// log out
router.post("/logout", logoutUser);

//forgetpass otp

router.post("/forgetpassword", forgotPassword);

//reset pass
router.post("/resetpassword", resetPassword);

export default router;