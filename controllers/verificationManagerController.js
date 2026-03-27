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
   ADVANCED PROVIDER VERIFICATION ANALYTICS
====================================================== */
export const verificationAnalytics = async (req, res, next) => {
    try {
        const now = new Date();

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const weekStart = new Date();
        weekStart.setDate(now.getDate() - 7);

        const monthStart = new Date();
        monthStart.setDate(now.getDate() - 30);

        const [
            statusCounts,
            todayCount,
            weekCount,
            monthCount,
            recentProviders,
            dailyTrend
        ] = await Promise.all([

            // 🔹 Status Counts (Aggregation)
            providerProfileModel.aggregate([
                {
                    $group: {
                        _id: "$verificationStatus",
                        count: { $sum: 1 }
                    }
                }
            ]),

            // 🔹 Today Registrations
            providerProfileModel.countDocuments({
                createdAt: { $gte: todayStart }
            }),

            // 🔹 Last 7 Days
            providerProfileModel.countDocuments({
                createdAt: { $gte: weekStart }
            }),

            // 🔹 Last 30 Days
            providerProfileModel.countDocuments({
                createdAt: { $gte: monthStart }
            }),

            // 🔹 Recent Providers
            providerProfileModel
                .find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select("name email verificationStatus createdAt"),

            // 🔹 Daily Trend (Last 7 days)
            providerProfileModel.aggregate([
                {
                    $match: {
                        createdAt: { $gte: weekStart }
                    }
                },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: "$createdAt"
                            }
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ])
        ]);

        // 🔹 Convert aggregation to object
        const counts = {
            pending: 0,
            approved: 0,
            rejected: 0
        };

        statusCounts.forEach(item => {
            counts[item._id] = item.count;
        });

        const total = counts.pending + counts.approved + counts.rejected;

        // 🔹 Rates
        const approvalRate = total ? ((counts.approved / total) * 100).toFixed(2) : 0;
        const rejectionRate = total ? ((counts.rejected / total) * 100).toFixed(2) : 0;

        res.json({
            success: true,
            analytics: {
                overview: {
                    ...counts,
                    total,
                    approvalRate: `${approvalRate}%`,
                    rejectionRate: `${rejectionRate}%`
                },

                growth: {
                    today: todayCount,
                    last7Days: weekCount,
                    last30Days: monthCount
                },

                trends: {
                    daily: dailyTrend
                },

                recentActivity: recentProviders
            }
        });

    } catch (error) {
        next(error);
    }
};
