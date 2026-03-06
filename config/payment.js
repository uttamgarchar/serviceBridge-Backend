/**
 * Payment status constants
 */
export const PAYMENT_STATUS = {
    PENDING: "pending",
    SUCCESS: "success",
    FAILED: "failed",
    REFUNDED: "refunded",
};

/**
 * Supported payment modes (demo)
 */
export const PAYMENT_MODES = {
    UPI: "UPI",
    CARD: "CARD",
    NET_BANKING: "NET_BANKING",
};

/**
 * Refund rules (demo logic)
 */
export const REFUND_RULES = {
    FULL_REFUND_PERCENT: 100,
    PARTIAL_REFUND_PERCENT: 50,
};
