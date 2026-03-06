import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
            unique: true,
        },

        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        provider: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true,
        },

        comment: {
            type: String,
            trim: true,
        },

        // ⭐ NEW (moderation)
        isFlagged: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const reviewModel = mongoose.model("Review", reviewSchema);
export default reviewModel;
