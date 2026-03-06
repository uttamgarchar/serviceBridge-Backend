import express from "express";
import userAuth from "../middlewares/userAuth.js";
import allowRoles from "../middlewares/role.middleware.js";
import verifiedUser from "../middlewares/verified.middleware.js";
import providerApproved from "../middlewares/providerApprovedMiddleware.js";

import {
    applyProvider,
} from "../controllers/providerApplyController.js";

import {
    getProviderBookings,
} from "../controllers/providerBookingController.js";

import {
    addService,
    updateService,
    getMyServices,
} from "../controllers/providerServiceController.js";
import { requestWithdrawal } from "../controllers/withdrawalController.js";

const router = express.Router();

/**
 * PROVIDER APPLY
 */
router.post(
    "/apply",
    userAuth,
    verifiedUser,
    allowRoles("User"),
    applyProvider
);

/**
 * PROVIDER SERVICES
 */
router.post(
    "/service",
    userAuth,
    allowRoles("ServiceProvider"),
    providerApproved,
    addService
);

router.put(
    "/service/:serviceId",
    userAuth,
    allowRoles("ServiceProvider"),
    providerApproved,
    updateService
);

router.get(
    "/providerServices",
    userAuth,
    allowRoles("ServiceProvider"),
    providerApproved,
    getMyServices
);

/**
 * PROVIDER BOOKINGS
 */
router.get(
    "/bookings",
    userAuth,
    allowRoles("ServiceProvider"),
    providerApproved,
    getProviderBookings
);


router.post(
    "/withdraw",
    userAuth,
    allowRoles("ServiceProvider"),
    requestWithdrawal
);


export default router;
