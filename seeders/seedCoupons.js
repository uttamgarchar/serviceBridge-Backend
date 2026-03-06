import Coupon from "../models/couponModel.js";

const seedCoupons = async () => {
    try {
        await Coupon.deleteMany();

        const coupons = [
            {
                code: "WELCOME10",
                discountType: "percentage",
                discountValue: 10,
                minAmount: 100,
                expiryDate: new Date("2026-12-31"),
            },
            {
                code: "FLAT50",
                discountType: "flat",
                discountValue: 50,
                minAmount: 200,
                expiryDate: new Date("2026-12-31"),
            },
        ];

        await Coupon.insertMany(coupons);

        console.log("Coupons seeded");
    } catch (error) {
        console.error(error);
    }
};

export default seedCoupons;