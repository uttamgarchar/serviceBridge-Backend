import express from "express";
import userAuth from "../middlewares/userAuth.js";
import allowRoles from "../middlewares/role.middleware.js";

import {
    createReport,
    getMyReports,
    getAllReports,
    updateReportStatus,
} from "../controllers/reportController.js";

const router = express.Router();

/* ======================================================
   USER / PROVIDER ROUTES
====================================================== */

/**
 * Raise a complaint / report
 * User → Provider
 * Provider → User
 */
router.post(
    "/reports",
    userAuth,
    allowRoles("User", "ServiceProvider"),
    createReport
);

/**
 * Get my own complaints
 */
router.get(
    "/my",
    userAuth,
    allowRoles("User", "ServiceProvider"),
    getMyReports
);

/* ======================================================
   ADMIN / PROVIDER MANAGER ROUTES
====================================================== */

/**
 * Get all complaints
 */
router.get(
    "/",
    userAuth,
    allowRoles("Admin", "ProviderManager"),
    getAllReports
);

/**
 * Update complaint status (in_review / resolved / rejected)
 */
router.put(
    "/:id",
    userAuth,
    allowRoles("Admin", "ProviderManager"),
    updateReportStatus
);

export default router;
