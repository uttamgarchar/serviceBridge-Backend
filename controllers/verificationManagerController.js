import providerProfileModel from "../models/providerProfile.js";
import userModel from "../models/userModel.js";

/* ======================================================
   GET ALL PENDING PROVIDER APPLICATIONS
====================================================== */
export const getPendingProviders = async (req, res, next) => {
    try {
        const providers = await providerProfileModel
            .find({ verificationStatus: "pending" })
            .populate("user", "name email role providerStatus")
            .sort({ createdAt: -1 });

        res.json({ success: true, providers });
    } catch (error) {
        next(error);
    }
};

/* ======================================================
   GET SINGLE PROVIDER FULL DETAILS (INSPECTION)
====================================================== */
export const getProviderDetails = async (req, res, next) => {
    try {
        const provider = await providerProfileModel
            .findById(req.params.providerId)
            .populate("user", "name email role providerStatus");

        if (!provider) {
            res.status(404);
            throw new Error("Provider not found");
        }

        res.json({ success: true, provider });
    } catch (error) {
        next(error);
    }
};

/* ======================================================
   APPROVE PROVIDER (FINAL STEP)
====================================================== */
export const approveProvider = async (req, res, next) => {
    try {
        const provider = await providerProfileModel.findById(req.params.providerId);

        if (!provider) {
            res.status(404);
            throw new Error("Provider not found");
        }

        if (provider.verificationStatus === "approved") {
            res.status(400);
            throw new Error("Provider already approved");
        }

        provider.verificationStatus = "approved";
        await provider.save();

        await userModel.findByIdAndUpdate(provider.user, {
            providerStatus: "approved",
        });

        res.json({
            success: true,
            message: "Provider approved successfully",
        });
    } catch (error) {
        next(error);
    }
};

/* ======================================================
   REJECT PROVIDER
====================================================== */
export const rejectProvider = async (req, res, next) => {
    try {
        const { reason } = req.body;

        const provider = await providerProfileModel.findById(req.params.providerId);

        if (!provider) {
            res.status(404);
            throw new Error("Provider not found");
        }

        provider.verificationStatus = "rejected";
        provider.rejectionReason = reason || "Application rejected";
        await provider.save();

        await userModel.findByIdAndUpdate(provider.user, {
            providerStatus: "rejected",
        });

        res.json({
            success: true,
            message: "Provider rejected successfully",
        });
    } catch (error) {
        next(error);
    }
};

/* ======================================================
   PROVIDER ANALYTICS (COUNTS)
====================================================== */
export const providerAnalytics = async (req, res, next) => {
    try {
        const [pending, approved, rejected] = await Promise.all([
            providerProfileModel.countDocuments({ verificationStatus: "pending" }),
            providerProfileModel.countDocuments({ verificationStatus: "approved" }),
            providerProfileModel.countDocuments({ verificationStatus: "rejected" }),
        ]);

        res.json({
            success: true,
            analytics: {
                pending,
                approved,
                rejected,
                total: pending + approved + rejected,
            },
        });
    } catch (error) {
        next(error);
    }
};
