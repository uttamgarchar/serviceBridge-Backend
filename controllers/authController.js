import userModel from "../models/userModel.js";
import { generateToken } from "../config/jwt.js";
import { sendEmail } from "../config/nodeMailer.js";
import crypto from "crypto";

/**
 * Generate OTP
 */
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await userModel.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error("User already exists");
        }

        const otp = generateOtp();

        const user = await userModel.create({
            name,
            email,
            password,
            verifyOtp: otp,
            verifyOtpExpireAt: Date.now() + 5 * 60 * 1000,
            isAccountVerified: false,
        });

        // 🔹 Send OTP email (NON-BLOCKING)
        try {
            await sendEmail({
                to: email,
                subject: "Verify your account",
                html: `<p>Your OTP is <b>${otp}</b>. It is valid for 5 minutes.</p>`,
            });
        } catch (mailError) {
            console.error("❌ OTP EMAIL FAILED:", mailError.message);
            // Do NOT throw — user already created
        }

        res.status(201).json({
            success: true,
            message: "User registered. OTP generated.",
            // 🔥 DEV ONLY (REMOVE IN PROD)
            otp: process.env.NODE_ENV === "development" ? otp : undefined,
        });
    } catch (error) {
        next(error);
    }
};

// ===================verifyaccountotp===================

export const verifyAccountOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            res.status(400);
            throw new Error("Email and OTP are required");
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            res.status(404);
            throw new Error("User not found");
        }

        // 🔥 Force string comparison
        if (user.verifyOtp !== String(otp)) {
            res.status(400);
            throw new Error("Invalid OTP");
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            res.status(400);
            throw new Error("OTP expired");
        }

        user.isAccountVerified = true;
        user.verifyOtp = undefined;
        user.verifyOtpExpireAt = undefined;

        await user.save();

        res.json({
            success: true,
            message: "Account verified successfully",
        });
    } catch (error) {
        next(error);
    }
};


/**
 * RESEND OTP
 */
export const resendOtp = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            res.status(404);
            throw new Error("User not found");
        }

        const otp = generateOtp();

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 5 * 60 * 1000;

        await user.save();

        await sendEmail({
            to: email,
            subject: "Resend OTP",
            html: `<p>Your new OTP is <b>${otp}</b>. It is valid for 5 minutes.</p>`,
        });

        res.json({
            success: true,
            message: "OTP resent successfully",
        });
    } catch (error) {
        next(error);
    }
};

/**
 * LOGIN USER
 */
export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email }).select("+password");

        if (!user) {
            res.status(401);
            throw new Error("Invalid email or password");
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            res.status(401);
            throw new Error("Invalid email or password");
        }

        if (!user.isAccountVerified) {
            res.status(403);
            throw new Error("Please verify your account first");
        }

        const token = generateToken({ id: user._id });

        res
            .cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            })
            .json({
                success: true,
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            });
    } catch (error) {
        next(error);
    }
};




// ==================================log out ============================


export const logoutUser = async (req, res) => {
    res
        .cookie("token", "", {
            httpOnly: true,
            expires: new Date(0),
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        })
        .json({
            success: true,
            message: "Logged out successfully",
        });
};


// =======================forget pass send otp =====================================

export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            res.status(400);
            throw new Error("Email is required");
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            res.status(404);
            throw new Error("User not found");
        }

        const otp = generateOtp();

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000; // 10 min

        await user.save();

        // 🔹 Send reset OTP (non-blocking)
        try {
            await sendEmail({
                to: email,
                subject: "Reset your password",
                html: `
                    <p>Your password reset OTP is <b>${otp}</b></p>
                    <p>It is valid for 10 minutes.</p>
                `,
            });
        } catch (err) {
            console.error("❌ Reset password email failed:", err.message);
        }

        res.json({
            success: true,
            message: "Password reset OTP sent",
            otp: process.env.NODE_ENV === "development" ? otp : undefined,
        });
    } catch (error) {
        next(error);
    }
};


// ====================================================resetpass========================

export const resetPassword = async (req, res, next) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            res.status(400);
            throw new Error("Email, OTP and new password are required");
        }

        const user = await userModel.findOne({ email }).select("+password");

        if (!user) {
            res.status(404);
            throw new Error("User not found");
        }

        if (user.verifyOtp !== String(otp)) {
            res.status(400);
            throw new Error("Invalid OTP");
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            res.status(400);
            throw new Error("OTP expired");
        }

        user.password = newPassword;
        user.resetPasswordOtp = undefined;
        user.resetPasswordOtpExpireAt = undefined;

        await user.save();

        res.json({
            success: true,
            message: "Password reset successfully",
        });
    } catch (error) {
        next(error);
    }
};
