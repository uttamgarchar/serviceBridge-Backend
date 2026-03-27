import express from "express";
import userAuth from "../middlewares/userAuth.js";
import allowRoles from "../middlewares/role.middleware.js";

import {
    getAllUsers,
    searchUserByEmail,
    assignUserRole,
    getAllProviders,
    getAllBookings,
    getAllTransactions,
    getAllWithdrawals,
    getSettings,
    updateSettings,
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
router.use(allowRoles("Admin", "VerificationManager"));

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
router.get("/providers", allowRoles("VerificationManager", "Admin"), getAllProviders);

/**
 * DASHBOARD / STATS
 */

// update with draw status 
router.put(
    "/withdraw/:id",
    userAuth,
    updateWithdrawalStatus
);
export default router;

//booking details
router.get("/bookings", getAllBookings);

//trasection details
router.get("/transactions", getAllTransactions);

//withdraw data
router.get("/withdrawals", getAllWithdrawals);

//settings
router.get("/settings", getSettings);
router.put("/settings", updateSettings);