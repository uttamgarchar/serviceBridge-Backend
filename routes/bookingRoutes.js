import express from "express";
import userAuth from "../middlewares/userAuth.js";
import allowRoles from "../middlewares/role.middleware.js";

import paymentVerified from "../middlewares/paymentVerifiedMiddleware.js";
import otpVerified from "../middlewares/otpVerifiedMiddleware.js";
import providerApproved from "../middlewares/providerApprovedMiddleware.js";
import bookingAccess from "../middlewares/bookingAccessMiddleware.js";

import {
    createBooking,
    acceptBooking,
    completeBooking,
    cancelBooking,
    getUserBookings,
    getProviderBookings,
} from "../controllers/bookingController.js";

const router = express.Router();

/**
 * USER creates booking
 */
router.post(
    "/",
    userAuth,
    allowRoles("User"),
    createBooking
);

/**
 * USER bookings
 */
router.get(
    "/user",
    userAuth,
    allowRoles("User", "verificationManager"),
    getUserBookings
);

/**
 * PROVIDER bookings
 */
router.get(
    "/provider",
    userAuth,
    allowRoles("ServiceProvider"),
    providerApproved,
    getProviderBookings
);

/**
 * PROVIDER accepts booking (payment required)
 */
router.put(
    "/accept/:bookingId",
    userAuth,
    allowRoles("ServiceProvider"),
    providerApproved,
    bookingAccess,
    acceptBooking
);

/**
 * PROVIDER completes booking (payment + OTP required)
 */
router.put(
    "/complete/:bookingId",
    userAuth,
    allowRoles("ServiceProvider"),
    providerApproved,
    paymentVerified,
    otpVerified,
    bookingAccess,
    completeBooking
);

/**
 * USER cancels booking
 */
router.put(
    "/cancel/:bookingId",
    userAuth,
    allowRoles("User"),
    bookingAccess,
    cancelBooking
);

export default router;
