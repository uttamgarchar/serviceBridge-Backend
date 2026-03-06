import providerProfileModel from "../models/providerProfile.js";
import cloudinary from "../config/cloudinary.js";

/* ======================================================
   PROVIDER UPLOAD DOCUMENTS
====================================================== */
export const uploadDocuments = async (req, res, next) => {
    try {
        const { documents } = req.body;

        if (!Array.isArray(documents) || documents.length === 0) {
            res.status(400);
            throw new Error("documents must be a non-empty array");
        }

        const profile = await providerProfileModel.findOne({
            user: req.user._id,
        });

        if (!profile) {
            res.status(404);
            throw new Error("Provider profile not found");
        }

        const uploadedDocs = [];

        for (const doc of documents) {
            if (!doc.type || !doc.base64) {
                res.status(400);
                throw new Error("Each document must have type and base64");
            }

            const uploadRes = await cloudinary.uploader.upload(doc.base64, {
                folder: "provider_documents",
            });

            uploadedDocs.push({
                type: doc.type,
                url: uploadRes.secure_url,
            });
        }

        profile.documents = uploadedDocs;
        profile.documentStatus = "pending";
        profile.documentRejectReason = undefined;

        await profile.save();

        res.json({
            success: true,
            message: "Documents uploaded successfully, pending verification",
        });
    } catch (error) {
        next(error);
    }
};


/* ======================================================
   VERIFICATION MANAGER REVIEWS DOCUMENTS ONLY
====================================================== */
export const reviewDocuments = async (req, res, next) => {
    try {
        const { action, reason } = req.body;
        const profile = await providerProfileModel.findById(req.params.providerId);

        if (!profile) {
            res.status(404);
            throw new Error("Provider not found");
        }

        if (action === "approve") {
            profile.documentStatus = "approved";
            profile.documentRejectReason = undefined;
        } else if (action === "reject") {
            profile.documentStatus = "rejected";
            profile.documentRejectReason = reason || "Documents rejected";
        } else {
            res.status(400);
            throw new Error("Invalid action");
        }

        await profile.save();

        res.json({
            success: true,
            message: `Documents ${action}d successfully`,
        });
    } catch (error) {
        next(error);
    }
};
