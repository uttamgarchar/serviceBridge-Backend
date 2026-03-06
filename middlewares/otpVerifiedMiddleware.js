import bookingModel from "../models/bookingModel.js";

const otpVerified = async (req, res, next) => {
    try {
        const bookingId = req.params.bookingId || req.body.bookingId;
        const { serviceOtp } = req.body;

        const booking = await bookingModel.findById(bookingId);

        if (!booking) {
            res.status(404);
            throw new Error("Booking not found");
        }

        if (!serviceOtp) {
            res.status(400);
            throw new Error("Service OTP is required");
        }

        if (booking.serviceOtp !== serviceOtp) {
            res.status(403);
            throw new Error("Invalid service OTP");
        }

        booking.otpStatus = "verified";
        await booking.save();

        next();
    } catch (error) {
        next(error);
    }
};

export default otpVerified;
