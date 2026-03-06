import express from "express";
import {
    getAllServices,
    getProviderPublicProfile,
} from "../controllers/serviceDiscoveryController.js";

const router = express.Router();

/**
 * PUBLIC SERVICE DISCOVERY ROUTES
 */

// Browse / search services
router.get("/services", getAllServices);

// View provider public profile
router.get("/provider/:providerId", getProviderPublicProfile);

export default router;
