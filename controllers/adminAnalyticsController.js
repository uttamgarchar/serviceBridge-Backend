import userModel from "../models/userModel.js";
import bookingModel from "../models/bookingModel.js";
import paymentModel from "../models/paymentModel.js";
import withdrawalModel from "../models/withdrawalModel.js";
import walletModel from "../models/walletModel.js";
import reviewModel from "../models/reviewModel.js";
import reportModel from "../models/reportModel.js";
import providerProfileModel from "../models/providerProfile.js";
import couponModel from "../models/couponModel.js";
import serviceModel from "../models/serviceModel.js";

/* ======================================================
   🧠 ULTRA ADMIN CONTROLLER (ALL-IN-ONE INTELLIGENCE)
====================================================== */
export const getAdminDashboardAnalytics = async (req, res, next) => {
    try {
        const now = new Date();

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const startOfLastMonth = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            1
        );

        const startOfWeek = new Date();
        startOfWeek.setDate(now.getDate() - 6);

        /* =========================
           USERS + GROWTH
        ========================= */
        const [
            totalUsers,
            totalProviders,
            newUsersThisMonth,
            newUsersLastMonth,
        ] = await Promise.all([
            userModel.countDocuments({ role: "User" }),
            userModel.countDocuments({ role: "ServiceProvider" }),
            userModel.countDocuments({
                role: "User",
                createdAt: { $gte: startOfMonth },
            }),
            userModel.countDocuments({
                role: "User",
                createdAt: {
                    $gte: startOfLastMonth,
                    $lt: startOfMonth,
                },
            }),
        ]);

        const userGrowthRate =
            newUsersLastMonth === 0
                ? 100
                : ((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100;

        /* =========================
           BOOKINGS (FULL ANALYTICS)
        ========================= */
        const bookingStats = await bookingModel.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);

        let stats = {
            total: 0,
            completed: 0,
            cancelled: 0,
            pending: 0,
            accepted: 0,
            in_progress: 0,
        };

        bookingStats.forEach((b) => {
            stats[b._id] = b.count;
            stats.total += b.count;
        });

        const completionRate =
            stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

        /* =========================
           REVENUE + GROWTH
        ========================= */
        const revenueAgg = await paymentModel.aggregate([
            { $match: { status: "success" } },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" },
                    avg: { $avg: "$amount" },
                },
            },
        ]);

        const monthlyRevenueAgg = await paymentModel.aggregate([
            {
                $match: {
                    status: "success",
                    createdAt: { $gte: startOfMonth },
                },
            },
            {
                $group: { _id: null, total: { $sum: "$amount" } },
            },
        ]);

        const lastMonthRevenueAgg = await paymentModel.aggregate([
            {
                $match: {
                    status: "success",
                    createdAt: {
                        $gte: startOfLastMonth,
                        $lt: startOfMonth,
                    },
                },
            },
            {
                $group: { _id: null, total: { $sum: "$amount" } },
            },
        ]);

        const revenueGrowth =
            ((monthlyRevenueAgg[0]?.total || 0) -
                (lastMonthRevenueAgg[0]?.total || 0)) /
            ((lastMonthRevenueAgg[0]?.total || 1));

        /* =========================
           CONVERSION FUNNEL
        ========================= */
        const usersWithBookings = await bookingModel.distinct("customer");

        const conversionRate =
            totalUsers > 0
                ? (usersWithBookings.length / totalUsers) * 100
                : 0;

        /* =========================
           TOP SERVICES
        ========================= */
        const topServices = await bookingModel.aggregate([
            {
                $group: {
                    _id: "$service",
                    totalBookings: { $sum: 1 },
                },
            },
            { $sort: { totalBookings: -1 } },
            { $limit: 5 },
        ]);

        /* =========================
           CATEGORY DISTRIBUTION
        ========================= */
        const categoryStats = await serviceModel.aggregate([
            {
                $group: {
                    _id: "$category",
                    total: { $sum: 1 },
                },
            },
        ]);

        /* =========================
           PROVIDER PERFORMANCE
        ========================= */
        const providerPerformance = await bookingModel.aggregate([
            {
                $group: {
                    _id: "$provider",
                    totalBookings: { $sum: 1 },
                    completed: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
                        },
                    },
                },
            },
            {
                $addFields: {
                    completionRate: {
                        $multiply: [
                            { $divide: ["$completed", "$totalBookings"] },
                            100,
                        ],
                    },
                },
            },
            { $sort: { completionRate: -1 } },
            { $limit: 5 },
        ]);

        /* =========================
           FRAUD DETECTION
        ========================= */
        const suspiciousUsers = await bookingModel.aggregate([
            {
                $group: {
                    _id: "$customer",
                    totalBookings: { $sum: 1 },
                },
            },
            {
                $match: {
                    totalBookings: { $gt: 20 },
                },
            },
        ]);

        /* =========================
           PAYMENT HEALTH
        ========================= */
        const failedPayments = await paymentModel.countDocuments({
            status: "failed",
        });

        const refundedPayments = await paymentModel.countDocuments({
            status: "refunded",
        });

        /* =========================
           REVIEWS ANALYTICS
        ========================= */
        const reviewStats = await reviewModel.aggregate([
            {
                $group: {
                    _id: null,
                    avgRating: { $avg: "$rating" },
                    total: { $sum: 1 },
                },
            },
        ]);

        const lowRatedProviders = await providerProfileModel.find({
            averageRating: { $lt: 3 },
        });

        /* =========================
           REPORTS
        ========================= */
        const reportStats = await reportModel.aggregate([
            {
                $group: {
                    _id: "$status",
                    total: { $sum: 1 },
                },
            },
        ]);

        /* =========================
           WALLET SYSTEM
        ========================= */
        const walletAgg = await walletModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalBalance: { $sum: "$balance" },
                },
            },
        ]);

        /* =========================
           WITHDRAWALS
        ========================= */
        const pendingWithdrawals = await withdrawalModel.countDocuments({
            status: "pending",
        });

        /* =========================
           COUPONS
        ========================= */
        const expiredCoupons = await couponModel.countDocuments({
            expiryDate: { $lt: now },
        });

        /* =========================
           ALERT ENGINE
        ========================= */
        const alerts = [];

        if (stats.cancelled > 30)
            alerts.push("🚨 High cancellation spike detected");

        if (failedPayments > 20)
            alerts.push("🚨 Payment failures critical");

        if (suspiciousUsers.length > 0)
            alerts.push("🚨 Suspicious user activity");

        if (lowRatedProviders.length > 5)
            alerts.push("⚠️ Many low-rated providers");

        /* =========================
           FINAL RESPONSE
        ========================= */
        res.json({
            success: true,
            dashboard: {
                users: {
                    totalUsers,
                    totalProviders,
                    growthRate: userGrowthRate,
                },

                bookings: {
                    ...stats,
                    completionRate,
                },

                revenue: {
                    total: revenueAgg[0]?.total || 0,
                    avgBooking: revenueAgg[0]?.avg || 0,
                    monthly: monthlyRevenueAgg[0]?.total || 0,
                    growth: revenueGrowth,
                },

                conversion: {
                    conversionRate,
                },

                services: {
                    topServices,
                    categoryStats,
                },

                providers: {
                    providerPerformance,
                    lowRatedProviders,
                },

                fraud: {
                    suspiciousUsers,
                },

                payments: {
                    failedPayments,
                    refundedPayments,
                },

                reviews: {
                    avgRating: reviewStats[0]?.avgRating || 0,
                    total: reviewStats[0]?.total || 0,
                },

                reports: reportStats,

                wallet: {
                    totalBalance: walletAgg[0]?.totalBalance || 0,
                },

                withdrawals: {
                    pendingWithdrawals,
                },

                coupons: {
                    expiredCoupons,
                },

                alerts,
            },
        });
    } catch (error) {
        next(error);
    }
};