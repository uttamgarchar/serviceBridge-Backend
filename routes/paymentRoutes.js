import express from "express";
import userAuth from "../middlewares/userAuth.js";
import allowRoles from "../middlewares/role.middleware.js";

import {
    createRazorpayOrder,
    verifyRazorpayPayment,
    refundPayment,
} from "../controllers/paymentController.js";

const router = express.Router();

/* USER */
router.post("/create-order", userAuth, createRazorpayOrder);
router.post("/verify", userAuth, verifyRazorpayPayment);

/* ADMIN */
router.put("/refund/:paymentId", userAuth, refundPayment);

export default router;