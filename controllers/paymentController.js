import Razorpay from "razorpay";
import crypto from "crypto";

import bookingModel from "../models/bookingModel.js";
import paymentModel from "../models/paymentModel.js";
import walletModel from "../models/walletModel.js";

/* ======================================================
   RAZORPAY INSTANCE
====================================================== */
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* ======================================================
   CREATE ORDER
====================================================== */
export const createRazorpayOrder = async (req, res, next) => {
    try {
        const { bookingId } = req.body;

        const booking = await bookingModel.findById(bookingId);

        if (!booking) throw new Error("Booking not found");

        if (booking.status !== "accepted")
            throw new Error("Payment allowed only after acceptance");

        if (booking.paymentStatus === "paid")
            throw new Error("Already paid");

        const order = await razorpay.orders.create({
            amount: booking.priceAtBooking * 100,
            currency: "INR",
            receipt: `booking_${bookingId}`,
        });

        res.json({ success: true, order });
    } catch (err) {
        next(err);
    }
};

/* ======================================================
   VERIFY PAYMENT
====================================================== */
export const verifyRazorpayPayment = async (req, res, next) => {
    try {
        const {
            bookingId,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        /* 🔐 VERIFY SIGNATURE */
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expected = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expected !== razorpay_signature) {
            throw new Error("Invalid payment signature");
        }

        const booking = await bookingModel.findById(bookingId);
        if (!booking) throw new Error("Booking not found");

        if (booking.paymentStatus === "paid")
            throw new Error("Already paid");

        /* 💰 COMMISSION LOGIC */
        const ADMIN_PERCENT = 20;
        const total = booking.priceAtBooking;

        const adminAmount = (total * ADMIN_PERCENT) / 100;
        const providerAmount = total - adminAmount;

        /* 💾 SAVE PAYMENT */
        const payment = await paymentModel.create({
            booking: booking._id,
            amount: total,
            paymentMode: "online",
            paymentGateway: "razorpay",
            status: "success",
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
        });

        /* 📦 UPDATE BOOKING */
        booking.paymentStatus = "paid";
        await booking.save();

        /* 💰 UPDATE PROVIDER WALLET + TRANSACTION */
        await walletModel.findOneAndUpdate(
            { provider: booking.provider },
            {
                $inc: { balance: providerAmount },

                $push: {
                    transactions: {
                        booking: booking._id,
                        type: "credit",
                        amount: providerAmount,
                        description: "Service payment received",
                    },
                },
            },
            { new: true, upsert: true }
        );

        res.json({
            success: true,
            message: "Payment successful",
            payment,
        });

    } catch (err) {
        next(err);
    }
};

/* ======================================================
   REFUND PAYMENT
====================================================== */
export const refundPayment = async (req, res, next) => {
    try {
        const { paymentId } = req.params;

        const payment = await paymentModel.findById(paymentId);
        if (!payment) throw new Error("Payment not found");

        if (payment.status === "refunded")
            throw new Error("Already refunded");

        const booking = await bookingModel.findById(payment.booking);
        if (!booking) throw new Error("Booking not found");

        /* 💰 SAME COMMISSION LOGIC */
        const ADMIN_PERCENT = 20;
        const total = booking.priceAtBooking;

        const providerAmount = total - (total * ADMIN_PERCENT) / 100;

        /* 🔁 UPDATE PAYMENT */
        payment.status = "refunded";
        await payment.save();

        booking.paymentStatus = "refunded";
        await booking.save();

        /* 💸 REVERSE WALLET + TRANSACTION */
        await walletModel.findOneAndUpdate(
            { provider: booking.provider },
            {
                $inc: { balance: -providerAmount },

                $push: {
                    transactions: {
                        booking: booking._id,
                        type: "debit",
                        amount: providerAmount,
                        description: "Refund processed",
                    },
                },
            }
        );

        res.json({
            success: true,
            message: "Refund processed successfully",
        });

    } catch (err) {
        next(err);
    }
};