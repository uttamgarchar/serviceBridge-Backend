import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
        },

        type: {
            type: String,
            enum: ["credit", "debit"],
            required: true,
        },

        amount: {
            type: Number,
            required: true,
            min: 0,
        },

        description: {
            type: String,
        },
    },
    { timestamps: true }
);

const walletSchema = new mongoose.Schema(
    {
        provider: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        balance: {
            type: Number,
            default: 0,
            min: 0,
        },

        transactions: [transactionSchema],
    },
    { timestamps: true }
);

const walletModel = mongoose.model("Wallet", walletSchema);

export default walletModel;
