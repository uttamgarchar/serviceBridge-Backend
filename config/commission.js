let COMMISSION_PERCENT = 10; // default

export const getCommission = (amount) => {
    const commission = (amount * COMMISSION_PERCENT) / 100;
    return {
        commission,
        providerAmount: amount - commission,
    };
};

export const setCommission = (percent) => {
    COMMISSION_PERCENT = percent;
};
