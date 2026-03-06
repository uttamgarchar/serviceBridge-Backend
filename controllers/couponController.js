import couponModel from "../models/couponModel.js";

/* ======================================================
   ADMIN: CREATE COUPON
====================================================== */
export const createCoupon = async (req, res, next) => {
    try {
        const {
            code,
            discountType,
            discountValue,
            minAmount,
            expiryDate,
            isActive
        } = req.body;

        // Validate required fields
        if (!code || !discountType || !discountValue || !expiryDate) {
            return res.status(400).json({
                success: false,
                message: "code, discountType, discountValue and expiryDate are required"
            });
        }

        // Check if coupon already exists
        const existingCoupon = await couponModel.findOne({
            code: code.toUpperCase()
        });

        if (existingCoupon) {
            return res.status(400).json({
                success: false,
                message: "Coupon already exists"
            });
        }

        const coupon = await couponModel.create({
            code: code.toUpperCase(),
            discountType,
            discountValue,
            minAmount: minAmount || 0,
            expiryDate,
            isActive: isActive ?? true
        });

        res.status(201).json({
            success: true,
            message: "Coupon created successfully",
            coupon
        });

    } catch (error) {
        console.error("Create Coupon Error:", error);
        next(error);
    }
};

/* ======================================================
   ADMIN: GET ALL COUPONS
====================================================== */
export const getAllCoupons = async (req, res, next) => {
    try {

        const coupons = await couponModel
            .find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: coupons.length,
            coupons
        });

    } catch (error) {
        next(error);
    }
};

/* ======================================================
   VALIDATE COUPON (USER)
====================================================== */
export const validateCoupon = async (req, res, next) => {
    try {
        const { code, amount } = req.body;

        if (!code || !amount) {
            return res.status(400).json({
                success: false,
                message: "Coupon code and amount are required"
            });
        }

        const coupon = await couponModel.findOne({
            code: code.toUpperCase(),
            isActive: true
        });

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found"
            });
        }

        if (coupon.expiryDate < new Date()) {
            return res.status(400).json({
                success: false,
                message: "Coupon expired"
            });
        }

        if (amount < coupon.minAmount) {
            return res.status(400).json({
                success: false,
                message: `Minimum amount should be ₹${coupon.minAmount}`
            });
        }

        let discount =
            coupon.discountType === "flat"
                ? coupon.discountValue
                : (amount * coupon.discountValue) / 100;

        res.status(200).json({
            success: true,
            discount,
            finalAmount: amount - discount
        });

    } catch (error) {
        next(error);
    }
};