import express from "express";
import userAuth from "../middlewares/userAuth.js";
import allowRoles from "../middlewares/role.middleware.js";

import {
    getPendingProviders,
    getProviderDetails,
    approveProvider,
    rejectProvider,
    verificationAnalytics,
} from "../controllers/verificationManagerController.js";

const router = express.Router();

router.use(userAuth);
router.use(allowRoles("VerificationManager", "Admin"));

router.get("/pending-providers", getPendingProviders);
router.get("/provider/:providerId", getProviderDetails);
router.put("/approve/:providerId", approveProvider);
router.put("/reject/:providerId", rejectProvider);
router.get("/analytics", verificationAnalytics);

export default router;
