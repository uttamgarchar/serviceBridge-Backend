import withdrawalModel from "../models/withdrawalModel.js";
import walletModel from "../models/walletModel.js";
import { getCommission } from "../config/commission.js";

/**
 * ======================================================
 * PROVIDER REQUESTS WITHDRAWAL
 * ======================================================
 */
export const requestWithdrawal = async (req, res, next) => {
    try {
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            res.status(400);
            throw new Error("Invalid withdrawal amount");
        }

        const wallet = await walletModel.findOne({
            provider: req.user._id,
        });

        if (!wallet || wallet.balance < amount) {
            res.status(400);
            throw new Error("Insufficient wallet balance");
        }

        const withdrawal = await withdrawalModel.create({
            provider: req.user._id,
            amount, // gross amount
            status: "pending",
        });

        res.status(201).json({
            success: true,
            message: "Withdrawal request submitted",
            withdrawal,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * ======================================================
 * ADMIN APPROVES / REJECTS WITHDRAWAL
 * ======================================================
 */
export const updateWithdrawalStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        const withdrawal = await withdrawalModel.findById(req.params.id);

        if (!withdrawal) {
            res.status(404);
            throw new Error("Withdrawal not found");
        }

        if (withdrawal.status !== "pending") {
            res.status(400);
            throw new Error("Withdrawal already processed");
        }

        if (!["approved", "rejected"].includes(status)) {
            res.status(400);
            throw new Error("Invalid status");
        }

        if (status === "approved") {
            const wallet = await walletModel.findOne({
                provider: withdrawal.provider,
            });

            if (!wallet || wallet.balance < withdrawal.amount) {
                res.status(400);
                throw new Error("Insufficient wallet balance");
            }

            // Commission calculation
            const { commission, providerAmount } = getCommission(
                withdrawal.amount
            );

            // Wallet debit
            wallet.balance -= withdrawal.amount;

            wallet.transactions.push({
                type: "debit",
                amount: withdrawal.amount,
                description: "Withdrawal approved",
            });

            await wallet.save();

            withdrawal.commission = commission;
            withdrawal.netAmount = providerAmount;
        }

        withdrawal.status = status;
        await withdrawal.save();

        res.json({
            success: true,
            message: `Withdrawal ${status}`,
            withdrawal,
        });
    } catch (error) {
        next(error);
    }
};
