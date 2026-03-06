import bookingModel from "../models/bookingModel.js";

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

/**
 * ======================================================
 * PROVIDER ACCEPTS BOOKING
 * ======================================================
 */
export const acceptBooking = async (req, res, next) => {
    try {
        const booking = await bookingModel.findOne({
            _id: req.params.bookingId,
            provider: req.user._id,
        });

        if (!booking) {
            res.status(404);
            throw new Error("Booking not found");
        }

        if (booking.status !== "pending") {
            res.status(400);
            throw new Error("Only pending bookings can be accepted");
        }

        booking.status = "accepted";
        await booking.save();

        res.json({
            success: true,
            message: "Booking accepted successfully",
            booking,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * ======================================================
 * PROVIDER REJECTS BOOKING
 * ======================================================
 */
export const rejectBooking = async (req, res, next) => {
    try {
        const booking = await bookingModel.findOne({
            _id: req.params.bookingId,
            provider: req.user._id,
        });

        if (!booking) {
            res.status(404);
            throw new Error("Booking not found");
        }

        if (booking.status !== "pending") {
            res.status(400);
            throw new Error("Only pending bookings can be rejected");
        }

        booking.status = "cancelled";
        await booking.save();

        res.json({
            success: true,
            message: "Booking rejected successfully",
            booking,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * ======================================================
 * PROVIDER STARTS SERVICE
 * ======================================================
 */
export const startService = async (req, res, next) => {
    try {
        const booking = await bookingModel.findOne({
            _id: req.params.bookingId,
            provider: req.user._id,
        });

        if (!booking) {
            res.status(404);
            throw new Error("Booking not found");
        }

        if (booking.status !== "accepted") {
            res.status(400);
            throw new Error("Service can be started only after acceptance");
        }

        if (booking.paymentStatus !== "paid") {
            res.status(400);
            throw new Error("Payment must be completed before starting service");
        }

        booking.status = "in_progress";
        await booking.save();

        res.json({
            success: true,
            message: "Service started",
            booking,
        });
    } catch (error) {
        next(error);
    }
};
