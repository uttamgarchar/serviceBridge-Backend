import couponModel from "../models/couponModel.js";

/* ======================================================
   ADMIN: CREATE COUPON
====================================================== */
export const createCoupon = async (req, res, next) => {
    try {
        const coupon = await couponModel.create(req.body);

        res.status(201).json({
            success: true,
            message: "Coupon created",
            coupon,
        });
    } catch (error) {
        next(error);
    }
};

/* ======================================================
   ADMIN: GET ALL COUPONS
====================================================== */
export const getAllCoupons = async (req, res, next) => {
    try {
        const coupons = await couponModel.find();
        res.json({ success: true, coupons });
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

        const coupon = await couponModel.findOne({
            code: code.toUpperCase(),
            isActive: true,
        });

        if (!coupon || coupon.expiryDate < new Date()) {
            res.status(400);
            throw new Error("Invalid or expired coupon");
        }

        if (amount < coupon.minAmount) {
            res.status(400);
            throw new Error("Amount too low for this coupon");
        }

        let discount =
            coupon.discountType === "flat"
                ? coupon.discountValue
                : (amount * coupon.discountValue) / 100;

        res.json({
            success: true,
            discount,
        });
    } catch (error) {
        next(error);
    }
};
