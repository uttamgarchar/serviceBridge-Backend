import express from "express";
import userAuth from "../middlewares/userAuth.js";
import allowRoles from "../middlewares/role.middleware.js";

import { getAdminDashboardAnalytics } from "../controllers/adminAnalyticsController.js";

const router = express.Router();

router.get(
    "/stats",
    userAuth,
    allowRoles("Admin"),
    getAdminDashboardAnalytics
);
router.get(
    "/analytics/dashboard/stats",
    userAuth,
    allowRoles("Admin"),
    getAdminDashboardAnalytics
);

export default router;
