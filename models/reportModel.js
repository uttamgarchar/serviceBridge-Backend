import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
    {
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
        },

        raisedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        against: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        role: {
            type: String,
            enum: ["User", "ServiceProvider"],
            required: true,
        },

        reason: {
            type: String,
            required: true,
        },

        description: {
            type: String,
        },

        status: {
            type: String,
            enum: ["open", "in_review", "resolved", "rejected"],
            default: "open",
        },

        handledBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        adminRemark: {
            type: String,
        },
    },
    { timestamps: true }
);

const reportModel = mongoose.model("Report", reportSchema);
export default reportModel;
