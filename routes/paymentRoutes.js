import express from "express";
import userAuth from "../middlewares/userAuth.js";
import allowRoles from "../middlewares/role.middleware.js";

import {
    createRazorpayOrder,
    verifyRazorpayPayment,
    refundPayment,
} from "../controllers/paymentController.js";

const router = express.Router();

/* ======================================================
   CREATE RAZORPAY ORDER (USER)
====================================================== */
router.post(
    "/create-order",
    userAuth,
    allowRoles("User"),
    createRazorpayOrder
);

/* ======================================================
   VERIFY RAZORPAY PAYMENT (USER)
====================================================== */
router.post(
    "/verify",
    userAuth,
    allowRoles("User"),
    verifyRazorpayPayment
);

/* ======================================================
   REFUND PAYMENT (DEMO)
   (You can later restrict this to Admin)
====================================================== */
router.post(
    "/refund/:paymentId",
    userAuth,
    refundPayment
);

export default router;
