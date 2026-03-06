import providerProfileModel from "../models/providerProfile.js";
import userModel from "../models/userModel.js";

/* ======================================================
   APPLY AS PROVIDER
====================================================== */
export const applyProvider = async (req, res, next) => {
    try {
        const existingProfile = await providerProfileModel.findOne({
            user: req.user._id,
        });

        if (existingProfile) {
            res.status(400);
            throw new Error("Provider profile already exists");
        }

        const providerProfile = await providerProfileModel.create({
            user: req.user._id,
            serviceType: req.body.serviceType,
            address: req.body.address,
            city: req.body.city,
            pincode: req.body.pincode,
            verificationStatus: "pending",
            documentStatus: "not_uploaded",
            documents: [],
        });

        await userModel.findByIdAndUpdate(req.user._id, {
            role: "ServiceProvider",
            providerStatus: "pending",
        });

        res.status(201).json({
            success: true,
            message: "Application submitted. Upload documents for verification.",
            providerProfile,
        });
    } catch (error) {
        next(error);
    }
};
