import providerProfileModel from "../models/providerProfile.js";
import cloudinary from "../config/cloudinary.js";

/* ======================================================
   PROVIDER UPLOAD DOCUMENTS
====================================================== */
export const uploadDocuments = async (req, res, next) => {
    try {
        console.log("📥 Upload request received");

        const { documents } = req.body;

        // ✅ Validate input
        if (!Array.isArray(documents) || documents.length === 0) {
            res.status(400);
            throw new Error("documents must be a non-empty array");
        }

        // ✅ Find profile
        const profile = await providerProfileModel.findOne({
            user: req.user._id,
        });

        if (!profile) {
            res.status(404);
            throw new Error("Provider profile not found");
        }

        const uploadedDocs = [];

        // ✅ Upload documents
        for (const doc of documents) {
            if (!doc.type || !doc.base64) {
                res.status(400);
                throw new Error("Each document must have type and base64");
            }

            // ✅ Validate base64 format
            if (!doc.base64.startsWith("data:image")) {
                res.status(400);
                throw new Error("Invalid base64 format");
            }

            console.log("⬆ Uploading:", doc.type);

            const uploadRes = await cloudinary.uploader.upload(doc.base64, {
                folder: "provider_documents",
                resource_type: "image",
                timeout: 60000, // ✅ prevent hanging
            });

            console.log("✅ Uploaded:", uploadRes.secure_url);

            uploadedDocs.push({
                type: doc.type,
                url: uploadRes.secure_url,
            });
        }

        // ✅ Merge with existing (NO overwrite)
        const existingDocs = profile.documents || [];

        const docMap = new Map();

        [...existingDocs, ...uploadedDocs].forEach((doc) => {
            docMap.set(doc.type, doc); // replaces same type
        });

        profile.documents = Array.from(docMap.values());

        // ✅ Update status
        profile.documentStatus = "pending";
        profile.documentRejectReason = undefined;

        console.log("💾 Saving profile...");

        await profile.save();

        console.log("✅ Upload complete");

        res.status(200).json({
            success: true,
            message: "Documents uploaded successfully, pending verification",
            documents: profile.documents,
        });

    } catch (error) {
        console.log("❌ ERROR:", error.message);
        console.log("❌ BODY SIZE:", JSON.stringify(req.body)?.length);

        res.status(res.statusCode || 500).json({
            success: false,
            message: error.message || "Server Error",
        });
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
