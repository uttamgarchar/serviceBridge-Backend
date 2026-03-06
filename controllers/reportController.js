import Report from "../models/reportModel.js";
import Booking from "../models/bookingModel.js";

/* ======================================================
   RAISE COMPLAINT / REPORT
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
            throw new Error("Not allowed to raise complaint");
        }

        const report = await Report.create({
            booking: bookingId,
            raisedBy: req.user._id,
            against: againstUser,
            role,
            reason,
            description,
        });

        res.status(201).json({
            success: true,
            message: "Complaint raised successfully",
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
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            reports,
        });
    } catch (error) {
        next(error);
    }
};

/* ======================================================
   ADMIN / MANAGER: GET ALL REPORTS
====================================================== */
export const getAllReports = async (req, res, next) => {
    try {
        const reports = await Report.find()
            .populate("raisedBy", "name role")
            .populate("against", "name role")
            .populate("booking")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            reports,
        });
    } catch (error) {
        next(error);
    }
};

/* ======================================================
   ADMIN / MANAGER: UPDATE REPORT STATUS
====================================================== */
export const updateReportStatus = async (req, res, next) => {
    try {
        const { status, adminRemark } = req.body;

        const allowedStatus = ["in_review", "resolved", "rejected"];
        if (!allowedStatus.includes(status)) {
            res.status(400);
            throw new Error("Invalid status");
        }

        const report = await Report.findById(req.params.id);
        if (!report) {
            res.status(404);
            throw new Error("Report not found");
        }

        report.status = status;
        report.adminRemark = adminRemark;
        report.handledBy = req.user._id;

        await report.save();

        res.json({
            success: true,
            message: "Report status updated",
            report,
        });
    } catch (error) {
        next(error);
    }
};
