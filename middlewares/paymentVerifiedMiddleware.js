import bookingModel from "../models/bookingModel.js";

const paymentVerified = async (req, res, next) => {
    try {
        const bookingId = req.params.bookingId || req.body.bookingId;

        const booking = await bookingModel.findById(bookingId);

        if (!booking) {
            res.status(404);
            throw new Error("Booking not found");
        }

        if (booking.paymentStatus !== "paid") {
            res.status(403);
            throw new Error("Payment not completed for this booking");
        }

        next();
    } catch (error) {
        next(error);
    }
};

export default paymentVerified;
