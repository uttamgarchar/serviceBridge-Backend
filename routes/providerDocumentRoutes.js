import express from "express";
import userAuth from "../middlewares/userAuth.js";
import allowRoles from "../middlewares/role.middleware.js";

import {
    uploadDocuments,
    reviewDocuments,
} from "../controllers/providerDocumentController.js";

const router = express.Router();

/* ======================================================
   PROVIDER ROUTES
====================================================== */

router.post(
    "/upload",
    userAuth,
    allowRoles("ServiceProvider"),
    uploadDocuments
);

/* ======================================================
   VERIFICATION MANAGER ROUTES
====================================================== */

router.put(
    "/review/:providerId",
    userAuth,
    allowRoles("VerificationManager"),
    reviewDocuments
);

export default router;
