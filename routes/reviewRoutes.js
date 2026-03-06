import express from "express";
import userAuth from "../middlewares/userAuth.js";
import allowRoles from "../middlewares/role.middleware.js";

import {
    addReview,
    deleteReview,
    getProviderReviews,
    flagReview,
} from "../controllers/reviewController.js";

const router = express.Router();

/* ======================================================
   USER ROUTES
====================================================== */

/**
 * Add review (after completed booking)
 */
router.post(
    "/reviews",
    userAuth,
    allowRoles("User"),
    addReview
);

/**
 * Delete my review
 */
router.delete(
    "/:id",
    userAuth,
    allowRoles("User"),
    deleteReview
);

/* ======================================================
   PUBLIC ROUTES
====================================================== */

/**
 * Get provider reviews (public, non-flagged)
 */
router.get(
    "/provider/:providerId",
    getProviderReviews
);

/* ======================================================
   ADMIN / MANAGER ROUTES
====================================================== */

/**
 * Flag fake / abusive review
 */
router.put(
    "/flag/:id",
    userAuth,
    allowRoles("Admin", "ProviderManager"),
    flagReview
);

export default router;
