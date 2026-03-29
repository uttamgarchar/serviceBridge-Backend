import Report from "../models/reportModel.js";
import Booking from "../models/bookingModel.js";

/* ======================================================
   CREATE REPORT
====================================================== */
export const createReport = async (req, res, next) => {
    try {
        const { bookingId, reason, description } = req.body;

        if (!bookingId || !reason) {
            res.status(400);
            throw new Error("Booking and reason are required");
        }

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            res.status(404);
            throw new Error("Booking not found");
        }

        // 🚫 Allow only after completion
        if (booking.status !== "completed") {
            res.status(400);
            throw new Error("Report can only be raised after service completion");
        }

        // 🚫 Prevent duplicate report
        const existing = await Report.findOne({
            booking: bookingId,
            raisedBy: req.user._id,
        });

        if (existing) {
            res.status(400);
            throw new Error("Report already submitted for this booking");
        }

        let againstUser;
        let role;

        if (req.user.role === "User") {
            if (booking.customer.toString() !== req.user._id.toString()) {
                res.status(403);
                throw new Error("Unauthorized");
            }
            againstUser = booking.provider;
            role = "User";
        } else if (req.user.role === "ServiceProvider") {
            if (booking.provider.toString() !== req.user._id.toString()) {
                res.status(403);
                throw new Error("Unauthorized");
            }
            againstUser = booking.customer;
            role = "ServiceProvider";
        } else {
            res.status(403);
            throw new Error("Not allowed");
        }

        const report = await Report.create({
            booking: bookingId,
            raisedBy: req.user._id,
            against: againstUser,
            role,
            reason,
            description,
            status: "pending",
        });

        res.status(201).json({
            success: true,
            message: "Report raised successfully",
            report,
        });
    } catch (error) {
        next(error);
    }
};

/* ======================================================
   GET MY REPORTS
====================================================== */
export const getMyReports = async (req, res, next) => {
    try {
        const reports = await Report.find({ raisedBy: req.user._id })
            .populate("against", "name role")
            .populate("booking", "status totalPrice")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: reports.length,
            reports,
        });
    } catch (error) {
        next(error);
    }
};

/* ======================================================
   GET SINGLE REPORT
====================================================== */
export const getReportById = async (req, res, next) => {
    try {
        const report = await Report.findById(req.params.id)
            .populate("raisedBy", "name role")
            .populate("against", "name role")
            .populate("booking");

        if (!report) {
            res.status(404);
            throw new Error("Report not found");
        }

        // 🔐 Ownership or admin check
        if (
            report.raisedBy._id.toString() !== req.user._id.toString() &&
            !["Admin", "ProviderManager"].includes(req.user.role)
        ) {
            res.status(403);
            throw new Error("Unauthorized");
        }

        res.json({
            success: true,
            report,
        });
    } catch (error) {
        next(error);
    }
};

/* ======================================================
   GET ALL REPORTS (ADMIN / PROVIDER MANAGER)
====================================================== */
export const getAllReports = async (req, res, next) => {
    try {
        const { status, reason } = req.query;

        const filter = {};
        if (status) filter.status = status;
        if (reason) filter.reason = reason;

        const reports = await Report.find(filter)
            .populate("raisedBy", "name role")
            .populate("against", "name role")
            .populate("booking", "status totalPrice")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: reports.length,
            reports,
        });
    } catch (error) {
        next(error);
    }
};

/* ======================================================
   UPDATE REPORT STATUS
====================================================== */
export const updateReportStatus = async (req, res, next) => {
    try {
        const { status, adminRemark } = req.body;

        const allowedStatus = ["pending", "in_review", "resolved", "rejected"];

        if (!allowedStatus.includes(status)) {
            res.status(400);
            throw new Error("Invalid status");
        }

        const report = await Report.findById(req.params.id);

        if (!report) {
            res.status(404);
            throw new Error("Report not found");
        }

        // 🚫 Prevent updating closed reports
        if (["resolved", "rejected"].includes(report.status)) {
            res.status(400);
            throw new Error("Report already closed");
        }

        report.status = status;
        report.adminRemark = adminRemark || "";
        report.handledBy = req.user._id;

        await report.save();

        res.json({
            success: true,
            message: "Report status updated successfully",
            report,
        });
    } catch (error) {
        next(error);
    }
};

/* ======================================================
   DELETE REPORT (ADMIN ONLY)
====================================================== */
export const deleteReport = async (req, res, next) => {
    try {
        const report = await Report.findById(req.params.id);

        if (!report) {
            res.status(404);
            throw new Error("Report not found");
        }

        await report.deleteOne();

        res.json({
            success: true,
            message: "Report deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};