import User from "../model/userModel.js";
import Review from "../model/reviewModel.js";
import Booking from "../model/bookingModel.js";

/* ======================================================
   GET ALL PROVIDERS
====================================================== */
export const getAllProviders = async (req, res) => {
    try {
        const providers = await User.find({
            providerStatus: { $in: ["approved", "suspended"] }
        }).select("-password");

        res.json({
            success: true,
            providers
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/* ======================================================
   SUSPEND PROVIDER
====================================================== */
export const suspendProvider = async (req, res) => {
    try {
        const provider = await User.findById(req.params.id);

        if (!provider) {
            return res.status(404).json({
                success: false,
                message: "Provider not found"
            });
        }

        if (provider.providerStatus !== "approved") {
            return res.status(400).json({
                success: false,
                message: "Provider is not active"
            });
        }

        provider.providerStatus = "suspended";
        provider.suspendedAt = new Date();
        provider.suspendedBy = req.user.id;

        await provider.save();

        res.json({
            success: true,
            message: "Provider suspended successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/* ======================================================
   REACTIVATE PROVIDER
====================================================== */
export const reactivateProvider = async (req, res) => {
    try {
        const provider = await User.findById(req.params.id);

        if (!provider) {
            return res.status(404).json({
                success: false,
                message: "Provider not found"
            });
        }

        if (provider.providerStatus !== "suspended") {
            return res.status(400).json({
                success: false,
                message: "Provider is not suspended"
            });
        }

        provider.providerStatus = "approved";
        provider.reactivatedAt = new Date();
        provider.reactivatedBy = req.user.id;

        await provider.save();

        res.json({
            success: true,
            message: "Provider reactivated successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/* ======================================================
   FLAG FAKE REVIEW (DEMO)
====================================================== */
export const flagFakeReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.reviewId);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        review.isFlagged = true;
        review.flaggedBy = req.user.id;
        review.flaggedAt = new Date();

        await review.save();

        res.json({
            success: true,
            message: "Review flagged as fake"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/* ======================================================
   PROVIDER ACTIVITY SUMMARY
====================================================== */
export const getProviderActivity = async (req, res) => {
    try {
        const providerId = req.params.id;

        const totalBookings = await Booking.countDocuments({
            provider: providerId
        });

        const completedBookings = await Booking.countDocuments({
            provider: providerId,
            bookingStatus: "completed"
        });

        const reviewsCount = await Review.countDocuments({
            provider: providerId
        });

        res.json({
            success: true,
            activity: {
                totalBookings,
                completedBookings,
                reviewsCount
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
