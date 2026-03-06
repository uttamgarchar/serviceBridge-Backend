import userModel from "../models/userModel.js";
import providerProfileModel from "../models/providerProfile.js";
import bookingModel from "../models/bookingModel.js";

/**
 * =========================
 * ADMIN CONTROLLER
 * =========================
 * Role required: Admin
 */

/**
 * GET ALL USERS (Admin)
 */
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await userModel.find().select("-password");

        res.status(200).json({
            success: true,
            users,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * SEARCH USER BY EMAIL (Admin)
 * GET /api/admin/users/search?email=
 */
export const searchUserByEmail = async (req, res, next) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const user = await userModel
            .findOne({ email })
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * ASSIGN / CHANGE USER ROLE (Admin)
 * Allowed roles:
 * User | Admin | VerificationManager | ProviderManager
 */
export const assignUserRole = async (req, res, next) => {
    try {
        const { userId, role } = req.body;

        const allowedRoles = [
            "User",
            "Admin",
            "VerificationManager",
            "ProviderManager",
        ];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role",
            });
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Prevent admin from demoting themselves
        if (
            user._id.toString() === req.user._id.toString() &&
            role !== "Admin"
        ) {
            return res.status(400).json({
                success: false,
                message: "Admin cannot change their own role",
            });
        }

        user.role = role;
        await user.save();

        res.status(200).json({
            success: true,
            message: `User role updated to ${role}`,
            user,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET ALL PROVIDERS (Admin - Read Only)
 */
export const getAllProviders = async (req, res, next) => {
    try {
        const providers = await providerProfileModel
            .find()
            .populate("user", "name email role");

        res.status(200).json({
            success: true,
            providers,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * PLATFORM STATS (Admin)
 */
export const getPlatformStats = async (req, res, next) => {
    try {
        const totalUsers = await userModel.countDocuments();
        const totalProviders = await providerProfileModel.countDocuments();
        const totalBookings = await bookingModel.countDocuments();

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalProviders,
                totalBookings,
            },
        });
    } catch (error) {
        next(error);
    }
};
