import bookingModel from "../models/bookingModel.js";

const otpVerified = async (req, res, next) => {
    try {
        const bookingId = req.params.bookingId || req.body.bookingId;
        const { otp } = req.body;

        const booking = await bookingModel.findById(bookingId);

        if (!booking) {
            res.status(404);
            throw new Error("Booking not found");
        }

        if (!otp) {
            res.status(400);
            throw new Error("Service OTP is required");
        }

        // ✅ FIXED LINE
        if (String(booking.serviceOtp) !== String(otp)) {
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