import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
        },

        amount: {
            type: Number,
            required: true,
        },

        // ✅ CLEAN ENUM (NO MORE ERRORS)
        paymentMode: {
            type: String,
            enum: ["online", "cash"],
            required: true,
        },

        paymentGateway: {
            type: String,
            enum: ["razorpay"],
        },

        status: {
            type: String,
            enum: ["pending", "success", "failed", "refunded"],
            default: "pending",
        },

        razorpayOrderId: String,
        razorpayPaymentId: String,
    },
    { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);