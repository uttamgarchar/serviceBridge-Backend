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

        paymentMode: {
            type: String,
            enum: ["UPI", "CARD", "NET_BANKING"],
            default: "UPI",
        },

        status: {
            type: String,
            enum: ["success", "failed", "refunded"],
            default: "success",
        },
    },
    { timestamps: true }
);

const paymentModel = mongoose.model("Payment", paymentSchema);

export default paymentModel;
