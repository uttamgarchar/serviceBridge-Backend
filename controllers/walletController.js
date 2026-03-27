import walletModel from "../models/walletModel.js";

/**
 * ======================================================
 * GET PROVIDER WALLET (BALANCE + HISTORY)
 * ======================================================
 */
export const getWallet = async (req, res, next) => {
    try {
        let wallet = await walletModel.findOne({
            provider: req.user._id, // using user id directly
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

/**
 * ======================================================
 * GET WALLET TRANSACTIONS
 * ======================================================
 */
export const getWalletTransactions = async (req, res, next) => {
    try {
        const wallet = await walletModel.findOne({
            provider: req.user._id,
        });

        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: "Wallet not found",
            });
        }

        res.json({
            success: true,
            transactions: wallet.transactions,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * ======================================================
 * REQUEST WITHDRAWAL
 * ======================================================
 */
export const requestWithdraw = async (req, res, next) => {
    try {
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid amount",
            });
        }

        const wallet = await walletModel.findOne({
            provider: req.user._id,
        });

        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: "Wallet not found",
            });
        }

        if (amount > wallet.balance) {
            return res.status(400).json({
                success: false,
                message: "Insufficient balance",
            });
        }

        // Deduct balance
        wallet.balance -= amount;

        // Add transaction
        wallet.transactions.push({
            type: "withdraw",
            amount,
            status: "pending",
            date: new Date(),
        });

        await wallet.save();

        res.json({
            success: true,
            message: "Withdraw request submitted",
            balance: wallet.balance,
        });
    } catch (error) {
        next(error);
    }
};