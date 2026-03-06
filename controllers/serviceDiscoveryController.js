import serviceModel from "../models/serviceModel.js";
import providerProfileModel from "../models/providerProfile.js";
import userModel from "../models/userModel.js";

/**
 * GET ALL SERVICES (Search + Filters)
 * Public API
 */
export const getAllServices = async (req, res, next) => {
    try {
        const { keyword, category, minPrice, maxPrice, city } = req.query;

        let query = { isActive: true };

        if (keyword) {
            query.title = { $regex: keyword, $options: "i" };
        }

        if (category) {
            query.category = category;
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        let services = await serviceModel
            .find(query)
            .populate("provider", "name");

        // Filter by city (provider city)
        if (city) {
            const providerProfiles = await providerProfileModel.find({ city });
            const providerIds = providerProfiles.map(p => p.user.toString());
            services = services.filter(s =>
                providerIds.includes(s.provider._id.toString())
            );
        }

        res.json({
            success: true,
            count: services.length,
            services,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET PUBLIC PROVIDER PROFILE
 */
export const getProviderPublicProfile = async (req, res, next) => {
    try {
        const { providerId } = req.params;

        const provider = await userModel
            .findById(providerId)
            .select("name role");

        if (!provider || provider.role !== "ServiceProvider") {
            res.status(404);
            throw new Error("Provider not found");
        }

        const profile = await providerProfileModel.findOne({
            user: providerId,
            verificationStatus: "approved",
        });

        const services = await serviceModel.find({
            provider: providerId,
            isActive: true,
        });

        res.json({
            success: true,
            provider,
            profile,
            services,
        });
    } catch (error) {
        next(error);
    }
};
