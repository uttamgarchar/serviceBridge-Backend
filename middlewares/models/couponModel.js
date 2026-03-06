import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
        },

        discountType: {
            type: String,
            enum: ["flat", "percentage"],
            required: true,
        },

        discountValue: {
            type: Number,
            required: true,
        },

        minAmount: {
            type: Number,
            default: 0,
        },

        expiryDate: {
            type: Date,
            required: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const couponModel = mongoose.model("Coupon", couponSchema);
export default couponModel;
