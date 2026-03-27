// models/settingsModel.js

import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
    {
        commissionPercentage: {
            type: Number,
            default: 10,
        },
    },
    { timestamps: true }
);

const settingsModel = mongoose.model("Settings", settingsSchema);

export default settingsModel;