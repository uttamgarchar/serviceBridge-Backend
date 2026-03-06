import bookingModel from "../models/bookingModel.js";

const chatAccessMiddleware = async (req, res, next) => {
    try {
        const bookingId = req.params.bookingId || req.body.bookingId;

        if (!bookingId) {
            res.status(400);
            throw new Error("Booking ID required");
        }

        const booking = await bookingModel.findById(bookingId);

        if (!booking) {
            res.status(404);
            throw new Error("Booking not found");
        }

        if (booking.paymentStatus !== "paid") {
            res.status(403);
            throw new Error("Chat allowed only after payment");
        }

        if (
            booking.customer.toString() !== req.user._id.toString() &&
            booking.provider.toString() !== req.user._id.toString()
        ) {
            res.status(403);
            throw new Error("Unauthorized chat access");
        }

        req.booking = booking;
        next();
    } catch (error) {
        next(error);
    }
};

export default chatAccessMiddleware;
