import Payment from "../models/paymentModel.js";
import Booking from "../models/bookingModel.js";

const seedPayments = async () => {
    try {
        await Payment.deleteMany();

        const bookings = await Booking.find();

        if (!bookings.length) {
            console.log("No bookings found. Seed bookings first.");
            return;
        }

        const payments = bookings.map((booking) => ({
            booking: booking._id,
            amount: booking.totalAmount,
            status: "paid",
            method: "razorpay",
        }));

        await Payment.insertMany(payments);

        console.log("Payments seeded");
    } catch (error) {
        console.error(error);
    }
};

export default seedPayments;