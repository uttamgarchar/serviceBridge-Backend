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

router.post(
    "/add",
    userAuth,
    allowRoles("User"),
    addReview
);

router.delete(
    "/:id",
    userAuth,
    allowRoles("User"),
    deleteReview
);

/* ======================================================
   PUBLIC ROUTES
====================================================== */

router.get(
    "/provider/:providerId",
    allowRoles("serviceProvider", "ProviderManager", "Admin"),
    getProviderReviews
);

/* ======================================================
   ADMIN / MANAGER ROUTES
====================================================== */

router.put(
    "/flag/:id",
    userAuth,
    allowRoles("Admin", "ProviderManager"),
    flagReview
);

export default router;