import express from "express";
import userAuth from "../middlewares/userAuth.js";
import allowRoles from "../middlewares/role.middleware.js";

import {
    createCoupon,
    getAllCoupons,
    validateCoupon,
} from "../controllers/couponController.js";

const router = express.Router();

/* ======================================================
   ADMIN COUPON ROUTES
====================================================== */

// Create coupon
router.post(
    "/",
    userAuth,
    allowRoles("Admin"),
    createCoupon
);

// Get all coupons
router.get(
    "/",
    userAuth,
    allowRoles("Admin", "User"),
    getAllCoupons
);

/* ======================================================
   USER COUPON ROUTES
====================================================== */

// Validate coupon (before payment)
router.post(
    "/validate",
    userAuth,
    allowRoles("User"),
    validateCoupon
);

export default router;
