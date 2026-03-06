import mongoose from "mongoose";

const providerProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        serviceType: {
            type: String,
            required: true,
        },

        address: {
            type: String,
            required: true,
        },

        city: {
            type: String,
            required: true,
        },

        pincode: {
            type: String,
            required: true,
        },

        verificationStatus: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },

        /* ===============================
           DOCUMENT VERIFICATION
        =============================== */

        documents: [
            {
                type: {
                    type: String, // Aadhaar, PAN, License, etc.
                    required: true,
                },
                url: {
                    type: String,
                    required: true,
                },
            },
        ],

        documentStatus: {
            type: String,
            enum: ["not_uploaded", "pending", "approved", "rejected"],
            default: "not_uploaded",
        },

        documentRejectReason: {
            type: String,
        },

        /* ===============================
           REVIEW METRICS (FROM MODULE 2)
        =============================== */

        averageRating: {
            type: Number,
            default: 0,
        },

        totalReviews: {
            type: Number,
            default: 0,
        },

        completedJobs: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

const providerProfileModel = mongoose.model(
    "ProviderProfile",
    providerProfileSchema
);

export default providerProfileModel;
