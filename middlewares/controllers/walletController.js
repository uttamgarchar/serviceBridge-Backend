import walletModel from "../models/walletModel.js";

/**
 * ======================================================
 * GET PROVIDER WALLET (BALANCE + HISTORY)
 * ======================================================
 */
export const getWallet = async (req, res, next) => {
    try {
        let wallet = await walletModel.findOne({
            provider: req.user._id,
        });

        // Auto-create wallet if not exists
        if (!wallet) {
            wallet = await walletModel.create({
                provider: req.user._id,
                balance: 0,
                transactions: [],
            });
        }

        res.json({
            success: true,
            wallet: {
                balance: wallet.balance,
                transactions: wallet.transactions,
            },
        });
    } catch (error) {
        next(error);
    }
};
