import userModel from "../models/userModel.js";
import providerProfileModel from "../models/providerProfile.js";
import bookingModel from "../models/bookingModel.js";
import paymentModel from "../models/paymentModel.js";
import withdrawalModel from "../models/withdrawalModel.js";
import settingsModel from "../models/settingsModel.js";

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
 * ======================================================
 * ADMIN - GET BOOKINGS (FRONTEND FORMAT)
 * ======================================================
 */
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await bookingModel
            .find()
            .populate("customer", "name email")
            .populate("provider", "name")
            .populate("service", "title price")
            .sort({ createdAt: -1 });

        // 🔥 Transform data for frontend
        const formattedBookings = bookings.map((b) => ({
            _id: b._id,

            // ✅ match frontend: user
            user: {
                name: b.customer?.name || "",
                email: b.customer?.email || "",
            },

            // ✅ match frontend: provider.user.name
            provider: {
                user: {
                    name: b.provider?.name || "",
                },
            },

            // ✅ match frontend: service.name
            service: {
                name: b.service?.title || "",
            },

            // ✅ match frontend fields
            status: b.status,
            price: b.priceAtBooking,
            createdAt: b.createdAt,
        }));

        res.status(200).json({
            success: true,
            bookings: formattedBookings,
        });
    } catch (error) {
        console.error("Get Bookings Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch bookings",
        });
    }
};





/**
 * ======================================================
 * ADMIN - GET ALL TRANSACTIONS (WITH DUMMY FALLBACK)
 * ======================================================
 */
export const getAllTransactions = async (req, res) => {
    try {
        const payments = await paymentModel
            .find()
            .populate({
                path: "booking",
                populate: {
                    path: "customer",
                    select: "name email",
                },
            })
            .sort({ createdAt: -1 });

        let transactions = payments.map((p) => ({
            _id: p._id,

            user: {
                name: p.booking?.customer?.name || "Unknown User",
                email: p.booking?.customer?.email || "no-email",
            },

            amount: p.amount,
            type: "payment",
            status: p.status,
            commission: Math.floor(p.amount * 0.1),
            createdAt: p.createdAt,
            paymentId: p._id.toString(),
        }));

        // 🔥 DUMMY FALLBACK
        if (transactions.length === 0) {
            transactions = [
                {
                    _id: "dummy1",
                    user: {
                        name: "Demo User",
                        email: "demo@example.com",
                    },
                    amount: 499,
                    type: "payment",
                    status: "success",
                    commission: 50,
                    createdAt: new Date(),
                    paymentId: "PAY1234567890",
                },
                {
                    _id: "dummy2",
                    user: {
                        name: "Test User",
                        email: "test@example.com",
                    },
                    amount: 999,
                    type: "payment",
                    status: "refunded",
                    commission: 100,
                    createdAt: new Date(),
                    paymentId: "PAY0987654321",
                },
            ];
        }

        res.status(200).json({
            success: true,
            transactions,
        });
    } catch (error) {
        console.error("Get Transactions Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch transactions",
        });
    }
};



/**
 * ======================================================
 * ADMIN - GET ALL WITHDRAWALS (FRONTEND FORMAT + DUMMY)
 * ======================================================
 */
export const getAllWithdrawals = async (req, res) => {
    try {
        const withdrawals = await withdrawalModel
            .find()
            .populate("provider", "name email")
            .sort({ createdAt: -1 });

        let formatted = withdrawals.map((w) => ({
            _id: w._id,

            // ✅ match frontend structure
            provider: {
                user: {
                    name: w.provider?.name || "Unknown",
                    email: w.provider?.email || "no-email",
                },
            },

            amount: w.amount,

            commission: w.commission ?? Math.floor(w.amount * 0.1),

            netAmount:
                w.netAmount ??
                w.amount - (w.commission ?? Math.floor(w.amount * 0.1)),

            status: w.status,

            createdAt: w.createdAt,
        }));

        // 🔥 DUMMY FALLBACK
        if (formatted.length === 0) {
            formatted = [
                {
                    _id: "dummy1",
                    provider: {
                        user: {
                            name: "Demo Provider",
                            email: "provider@example.com",
                        },
                    },
                    amount: 2000,
                    commission: 200,
                    netAmount: 1800,
                    status: "pending",
                    createdAt: new Date(),
                },
                {
                    _id: "dummy2",
                    provider: {
                        user: {
                            name: "Test Provider",
                            email: "test@provider.com",
                        },
                    },
                    amount: 5000,
                    commission: 500,
                    netAmount: 4500,
                    status: "approved",
                    createdAt: new Date(),
                },
            ];
        }

        res.status(200).json({
            success: true,
            withdrawals: formatted,
        });
    } catch (error) {
        console.error("Get Withdrawals Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch withdrawals",
        });
    }
};


/**
 * ======================================================
 * ADMIN - GET SETTINGS
 * ======================================================
 */
export const getSettings = async (req, res) => {
    try {
        let settings = await settingsModel.findOne();

        // 🔥 If no settings → create default
        if (!settings) {
            settings = await settingsModel.create({
                commissionPercentage: 10,
            });
        }

        res.status(200).json({
            success: true,
            settings,
        });
    } catch (error) {
        console.error("Get Settings Error:", error);

        // 🔥 fallback dummy
        res.status(200).json({
            success: true,
            settings: {
                commissionPercentage: 10,
            },
        });
    }
};



/**
 * ======================================================
 * ADMIN - UPDATE SETTINGS
 * ======================================================
 */
export const updateSettings = async (req, res) => {
    try {
        const { commissionPercentage } = req.body;

        let settings = await settingsModel.findOne();

        if (!settings) {
            settings = await settingsModel.create({
                commissionPercentage,
            });
        } else {
            settings.commissionPercentage = commissionPercentage;
            await settings.save();
        }

        res.status(200).json({
            success: true,
            message: "Settings updated successfully",
            settings,
        });
    } catch (error) {
        console.error("Update Settings Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update settings",
        });
    }
};