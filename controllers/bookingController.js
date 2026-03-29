import bookingModel from "../models/bookingModel.js";
import review from "../models/reviewModel.js";

/**
 * ======================================================
 * USER CREATES BOOKING
 * ======================================================
 */
export const createBooking = async (req, res, next) => {
    try {
        const booking = await bookingModel.create({
            customer: req.user._id,
            service: req.body.service,
            provider: req.body.provider,
            priceAtBooking: req.body.priceAtBooking,
            serviceOtp: req.body.serviceOtp,
            status: "pending",
            paymentStatus: "pending",
        });

        res.status(201).json({
            success: true,
            booking,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * ======================================================
 * PROVIDER ACCEPTS BOOKING
 * (kept for backward compatibility)
 * ======================================================
 */
export const acceptBooking = async (req, res, next) => {
    try {
        const booking = await bookingModel.findById(req.params.bookingId);

        if (!booking) {
            res.status(404);
            throw new Error("Booking not found");
        }

        if (booking.status !== "pending") {
            res.status(400);
            throw new Error("Booking cannot be accepted");
        }

        booking.status = "accepted";
        await booking.save();

        res.json({
            success: true,
            message: "Booking accepted",
        });
    } catch (error) {
        next(error);
    }
};

/**
 * ======================================================
 * VERIFY OTP & COMPLETE SERVICE
 * ======================================================
 */
export const completeBooking = async (req, res, next) => {
    try {
        const { otp } = req.body;
        const booking = await bookingModel.findById(req.params.bookingId);

        if (!booking) {
            res.status(404);
            throw new Error("Booking not found");
        }

        if (booking.paymentStatus !== "paid") {
            res.status(400);
            throw new Error("Payment not completed");
        }



        if (booking.serviceOtp !== otp) {
            res.status(400);
            throw new Error("Invalid OTP");
        }

        booking.otpStatus = "verified";
        booking.status = "completed";
        await booking.save();

        res.json({
            success: true,
            message: "Service completed successfully",
            booking,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * ======================================================
 * USER CANCELS BOOKING
 * ======================================================
 */
export const cancelBooking = async (req, res, next) => {
    try {
        const booking = await bookingModel.findById(req.params.bookingId);

        if (!booking) {
            res.status(404);
            throw new Error("Booking not found");
        }

        if (booking.status === "completed") {
            res.status(400);
            throw new Error("Completed booking cannot be cancelled");
        }

        booking.status = "cancelled";
        await booking.save();

        res.json({
            success: true,
            message: "Booking cancelled successfully",
        });
    } catch (error) {
        next(error);
    }
};

/**
 * ======================================================
 * GET USER BOOKINGS
 * ======================================================
 */
export const getUserBookings = async (req, res, next) => {
    try {
        const bookings = await bookingModel.find({
            customer: req.user._id,
        });

        res.json({
            success: true,
            bookings,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * ======================================================
 * GET PROVIDER BOOKINGS
 * ======================================================
 */
export const getProviderBookings = async (req, res, next) => {
    try {
        const bookings = await bookingModel.find({
            provider: req.user._id,
        });

        res.json({
            success: true,
            bookings,
        });
    } catch (error) {
        next(error);
    }
};
export const startService = async (req, res, next) => {
    try {
        const booking = await bookingModel.findById(req.params.bookingId);

        if (!booking) {
            res.status(404);
            throw new Error("Booking not found");
        }

        if (booking.status !== "accepted") {
            res.status(400);
            throw new Error("Service cannot be started");
        }

        booking.status = "in_progress";
        await booking.save();

        res.json({
            success: true,
            message: "Service started successfully",
        });
    } catch (error) {
        next(error);
    }
};


export const getMyCompletedBookings = async (req, res, next) => {
    try {
        // ✅ FIRST: get bookings
        const bookings = await bookingModel.find({
            customer: req.user._id,
            status: "completed",
        }).populate("provider", "name");

        // ✅ THEN: get reviewed bookings
        const reviewedBookings = await review.find({
            customer: req.user._id,
        }).select("booking");

        const reviewedIds = reviewedBookings.map(r =>
            r.booking.toString()
        );

        // ✅ THEN: filter
        const filteredBookings = bookings.filter(
            b => !reviewedIds.includes(b._id.toString())
        );

        res.json({
            success: true,
            bookings: filteredBookings,
        });
    } catch (error) {
        next(error);
    }
};