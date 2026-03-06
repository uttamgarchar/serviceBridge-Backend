import express from "express";
import userAuth from "../middlewares/userAuth.js";
import allowRoles from "../middlewares/role.middleware.js";

import {
    getAllUsers,
    searchUserByEmail,
    assignUserRole,
    getAllProviders,
    getPlatformStats,
} from "../controllers/adminController.js";
import { updateWithdrawalStatus } from "../controllers/withdrawalController.js";

const router = express.Router();

/**
 * =========================
 * ADMIN ROUTES
 * =========================
 * Role required: Admin
 */
router.use(userAuth);
router.use(allowRoles("Admin"));

/**
 * USER MANAGEMENT
 */

// Get all users
router.get("/users", getAllUsers);

// Search user by email
router.get("/users/search", searchUserByEmail);

// Assign / change role (Admin / Manager / User)
router.put("/users/assign-role", assignUserRole);

/**
 * PROVIDERS (READ-ONLY)
 */

// Get all providers
router.get("/providers", getAllProviders);

/**
 * DASHBOARD / STATS
 */

// Platform stats
router.get("/stats", getPlatformStats);

// update with draw status 
router.put(
    "/withdraw/:id",
    userAuth,
    allowRoles("Admin"),
    updateWithdrawalStatus
);


export default router;
