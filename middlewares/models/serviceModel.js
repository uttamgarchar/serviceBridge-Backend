import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema(
    {
        day: {
            type: String,
            required: true, // e.g. Monday
        },
        startTime: {
            type: String,
            required: true, // e.g. 09:00
        },
        endTime: {
            type: String,
            required: true, // e.g. 18:00
        },
    },
    { _id: false }
);

const serviceSchema = new mongoose.Schema(
    {
        provider: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
        },

        category: {
            type: String,
            required: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        images: [
            {
                type: String, // Cloudinary URL
            },
        ],

        availability: [availabilitySchema],

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const serviceModel = mongoose.model("Service", serviceSchema);

export default serviceModel;
