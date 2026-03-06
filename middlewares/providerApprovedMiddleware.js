import providerProfileModel from "../models/providerProfile.js";

const providerApproved = async (req, res, next) => {
    try {
        const providerProfile = await providerProfileModel.findOne({
            user: req.user._id,
        });

        if (!providerProfile) {
            res.status(404);
            throw new Error("Provider profile not found");
        }

        if (providerProfile.verificationStatus !== "approved") {
            res.status(403);
            throw new Error("Provider is not approved yet");
        }

        next();
    } catch (error) {
        next(error);
    }
};

export default providerApproved;
