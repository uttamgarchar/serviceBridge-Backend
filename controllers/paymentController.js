import Razorpay from "razorpay";
import crypto from "crypto";

import bookingModel from "../models/bookingModel.js";
import paymentModel from "../models/paymentModel.js";
import walletModel from "../models/walletModel.js";

/* ======================================================
   RAZORPAY INSTANCE (TEST MODE)
====================================================== */
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* ======================================================
   CREATE RAZORPAY ORDER (USER)
====================================================== */
export const createRazorpayOrder = async (req, res, next) => {
    try {
        const { bookingId } = req.body;

        const booking = await bookingModel.findById(bookingId);
        if (!booking) {
            res.status(404);
            throw new Error("Booking not found");
        }

        if (booking.paymentStatus === "paid") {
            res.status(400);
            throw new Error("Booking already paid");
        }

        const order = await razorpay.orders.create({
            amount: booking.priceAtBooking * 100, // INR → paisa
            currency: "INR",
            receipt: `booking_${bookingId}`,
        });

        res.json({
            success: true,
            order,
        });
    } catch (error) {
        next(error);
    }
};

/* ======================================================
   VERIFY RAZORPAY PAYMENT (MOST IMPORTANT)
====================================================== */
export const verifyRazorpayPayment = async (req, res, next) => {
    try {
        const {
            bookingId,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        // Signature verification
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            res.status(400);
            throw new Error("Invalid payment signature");
        }

        const booking = await bookingModel.findById(bookingId);
        if (!booking) {
            res.status(404);
            throw new Error("Booking not found");
        }

        // Prevent duplicate payment
        if (booking.paymentStatus === "paid") {
            res.status(400);
            throw new Error("Payment already completed");
        }

        // Save payment
        const payment = await paymentModel.create({
            booking: booking._id,
            amount: booking.priceAtBooking,
            paymentMode: "UPI", // demo
            status: "success",
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
        });

        // Update booking
        booking.paymentStatus = "paid";
        await booking.save();

        // Credit provider wallet
        await walletModel.findOneAndUpdate(
            { provider: booking.provider },
            { $inc: { balance: booking.priceAtBooking } },
            { new: true, upsert: true }
        );

        res.json({
            success: true,
            message: "Payment successful",
            payment,
        });
    } catch (error) {
        next(error);
    }
};

/* ======================================================
   REFUND PAYMENT (DEMO ONLY)
====================================================== */
export const refundPayment = async (req, res, next) => {
    try {
        const { paymentId } = req.params;

        const payment = await paymentModel.findById(paymentId);
        if (!payment) {
            res.status(404);
            throw new Error("Payment not found");
        }

        if (payment.status === "refunded") {
            res.status(400);
            throw new Error("Payment already refunded");
        }

        payment.status = "refunded";
        await payment.save();

        res.json({
            success: true,
            message: "Payment refunded successfully (demo)",
        });
    } catch (error) {
        next(error);
    }
};
