import bookingModel from "../models/bookingModel.js";

const bookingAccess = async (req, res, next) => {
    try {
        const bookingId = req.params.bookingId;

        const booking = await bookingModel.findById(bookingId);

        if (!booking) {
            res.status(404);
            throw new Error("Booking not found");
        }

        const userId = req.user._id.toString();

        const isCustomer = booking.customer.toString() === userId;
        const isProvider =
            booking.provider && booking.provider.toString() === userId;

        if (!isCustomer && !isProvider) {
            res.status(403);
            throw new Error("You are not allowed to access this booking");
        }

        req.booking = booking; // attach booking if needed later
        next();
    } catch (error) {
        next(error);
    }
};

export default bookingAccess;
