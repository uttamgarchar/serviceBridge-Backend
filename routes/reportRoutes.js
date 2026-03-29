import express from "express";
import userAuth from "../middlewares/userAuth.js";
import allowRoles from "../middlewares/role.middleware.js";

import {
    createReport,
    getMyReports,
    getAllReports,
    getReportById,
    updateReportStatus,
    deleteReport,
} from "../controllers/reportController.js";

const router = express.Router();

/* ======================================================
   USER / SERVICE PROVIDER ROUTES
====================================================== */

/**
 * Create Report
 * POST /api/reports
 */
router.post(
    "/",
    userAuth,
    allowRoles("User", "ServiceProvider"),
    createReport
);

/**
 * Get My Reports
 * GET /api/reports/my
 */
router.get(
    "/my",
    userAuth,
    allowRoles("User", "ServiceProvider"),
    getMyReports
);

/**
 * Get Single Report
 * GET /api/reports/:id
 */
router.get(
    "/:id",
    userAuth,
    allowRoles("User", "ServiceProvider", "Admin", "ProviderManager"),
    getReportById
);

/* ======================================================
   ADMIN / PROVIDER MANAGER ROUTES
====================================================== */

/**
 * Get All Reports (with filters)
 * GET /api/reports?status=pending&reason=payment
 */
router.get(
    "/",
    userAuth,
    allowRoles("Admin", "ProviderManager"),
    getAllReports
);

/**
 * Update Report Status
 * PUT /api/reports/:id
 */
router.put(
    "/:id",
    userAuth,
    allowRoles("Admin", "ProviderManager"),
    updateReportStatus
);

/**
 * Delete Report (Admin only)
 * DELETE /api/reports/:id
 */
router.delete(
    "/:id",
    userAuth,
    allowRoles("Admin"),
    deleteReport
);

export default router;