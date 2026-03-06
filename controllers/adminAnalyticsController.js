import userModel from "../models/userModel.js";
import bookingModel from "../models/bookingModel.js";
import paymentModel from "../models/paymentModel.js";
import withdrawalModel from "../models/withdrawalModel.js";

/* ======================================================
   ADMIN: FULL DASHBOARD ANALYTICS (SINGLE API)
   Role Required: Admin
====================================================== */
export const getAdminDashboardAnalytics = async (req, res, next) => {
    try {
        /* =========================
           BASIC COUNTS
        ========================= */
        const totalUsers = await userModel.countDocuments({ role: "User" });
        const totalProviders = await userModel.countDocuments({
            role: "ServiceProvider",
        });
        const totalBookings = await bookingModel.countDocuments();

        /* =========================
           BOOKING STATUS ANALYTICS
        ========================= */
        const bookingStats = {
            completed: await bookingModel.countDocuments({
                status: "completed",
            }),
            cancelled: await bookingModel.countDocuments({
                status: "cancelled",
            }),
            accepted: await bookingModel.countDocuments({
                status: "accepted",
            }),
            pending: await bookingModel.countDocuments({
                status: "pending",
            }),
        };

        /* =========================
           REVENUE ANALYTICS
        ========================= */
        const revenueResult = await paymentModel.aggregate([
            { $match: { status: "success" } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$amount" },
                },
            },
        ]);
        const totalRevenue =
            revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

        /* =========================
           PROFIT & PAYOUT ANALYTICS
        ========================= */
        const withdrawalAgg = await withdrawalModel.aggregate([
            { $match: { status: "approved" } },
            {
                $group: {
                    _id: null,
                    totalProfit: { $sum: "$commission" },
                    totalPayouts: { $sum: "$netAmount" },
                },
            },
        ]);

        const totalProfit =
            withdrawalAgg.length > 0 ? withdrawalAgg[0].totalProfit : 0;

        const totalPayouts =
            withdrawalAgg.length > 0 ? withdrawalAgg[0].totalPayouts : 0;

        /* =========================
           PROVIDER PERFORMANCE
        ========================= */
        const providers = await userModel
            .find({ role: "ServiceProvider" })
            .select("_id name email");

        const providerPerformance = [];

        for (const provider of providers) {
            const total = await bookingModel.countDocuments({
                provider: provider._id,
            });

            const completed = await bookingModel.countDocuments({
                provider: provider._id,
                status: "completed",
            });

            const cancelled = await bookingModel.countDocuments({
                provider: provider._id,
                status: "cancelled",
            });

            const completionRate =
                total > 0
                    ? ((completed / total) * 100).toFixed(2)
                    : 0;

            providerPerformance.push({
                providerId: provider._id,
                name: provider.name,
                email: provider.email,
                totalBookings: total,
                completedBookings: completed,
                cancelledBookings: cancelled,
                completionRate: `${completionRate}%`,
            });
        }

        /* =========================
           USER GROWTH ANALYTICS (FEATURE 9)
        ========================= */

        // Today
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const usersToday = await userModel.countDocuments({
            role: "User",
            createdAt: { $gte: startOfToday },
        });

        // This month
        const startOfMonth = new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1
        );

        const usersThisMonth = await userModel.countDocuments({
            role: "User",
            createdAt: { $gte: startOfMonth },
        });

        // Last 7 days growth
        const last7DaysGrowth = await userModel.aggregate([
            {
                $match: {
                    role: "User",
                    createdAt: {
                        $gte: new Date(
                            new Date().setDate(new Date().getDate() - 6)
                        ),
                    },
                },
            },
            {
                $group: {
                    _id: {
                        day: { $dayOfMonth: "$createdAt" },
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
        ]);

        // Last 6 months growth
        const last6MonthsGrowth = await userModel.aggregate([
            {
                $match: {
                    role: "User",
                    createdAt: {
                        $gte: new Date(
                            new Date().setMonth(new Date().getMonth() - 5)
                        ),
                    },
                },
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        /* =========================
           FINAL RESPONSE (SINGLE JSON)
        ========================= */
        res.status(200).json({
            success: true,
            dashboard: {
                users: {
                    totalUsers,
                    totalProviders,
                    usersToday,
                    usersThisMonth,
                    last7DaysGrowth,
                    last6MonthsGrowth,
                },
                bookings: {
                    totalBookings,
                    ...bookingStats,
                },
                finance: {
                    totalRevenue,
                    totalProfit,
                    totalPayouts,
                },
                providers: providerPerformance,
            },
        });
    } catch (error) {
        next(error);
    }
};