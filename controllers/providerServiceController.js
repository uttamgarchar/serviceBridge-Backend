import serviceModel from "../models/serviceModel.js";

/**
 * ======================================================
 * ADD SERVICE (Provider)
 * ======================================================
 */
export const addService = async (req, res, next) => {
    try {
        const {
            title,
            description,
            category,
            price,
            images = [],
            availability = [],
        } = req.body;

        const service = await serviceModel.create({
            provider: req.user._id,
            title,
            description,
            category,
            price,
            images,
            availability,
            isActive: true,
        });

        res.status(201).json({
            success: true,
            message: "Service added successfully",
            service,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * ======================================================
 * UPDATE SERVICE (Provider)
 * ======================================================
 */
export const updateService = async (req, res, next) => {
    try {
        const service = await serviceModel.findOne({
            _id: req.params.serviceId,
            provider: req.user._id,
        });

        if (!service) {
            res.status(404);
            throw new Error("Service not found");
        }

        const {
            title,
            description,
            category,
            price,
            images,
            availability,
            isActive,
        } = req.body;

        if (title !== undefined) service.title = title;
        if (description !== undefined) service.description = description;
        if (category !== undefined) service.category = category;
        if (price !== undefined) service.price = price;
        if (images !== undefined) service.images = images;
        if (availability !== undefined) service.availability = availability;
        if (isActive !== undefined) service.isActive = isActive;

        await service.save();

        res.json({
            success: true,
            message: "Service updated successfully",
            service,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * ======================================================
 * GET MY SERVICES (Provider)
 * ======================================================
 */
export const getMyServices = async (req, res, next) => {
    try {
        const services = await serviceModel.find({
            provider: req.user._id,
        });

        res.json({
            success: true,
            services,
        });
    } catch (error) {
        next(error);
    }
};
