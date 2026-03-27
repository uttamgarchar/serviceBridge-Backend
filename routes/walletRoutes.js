import router from "./authRoutes.js";
import userAuth from "../middlewares/userAuth.js";

import {
    getWallet,
    getWalletTransactions,
} from "../controllers/walletController.js";


router.use(userAuth);

// Get wallet (balance + history)
router.get("/balance", getWallet);
// Get wallet transactions
router.get("/transactions", getWalletTransactions);

export default router;
