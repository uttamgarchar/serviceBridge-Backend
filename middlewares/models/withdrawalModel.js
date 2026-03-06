import mongoose from "mongoose";

const withdrawalSchema = new mongoose.Schema(
    {
        provider: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        amount: {
            type: Number, // GROSS amount
            required: true,
            min: 1,
        },

        commission: {
            type: Number,
            default: 0,
        },

        netAmount: {
            type: Number,
            default: 0,
        },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
    },
    { timestamps: true }
);

const withdrawalModel = mongoose.model("Withdrawal", withdrawalSchema);
export default withdrawalModel;
