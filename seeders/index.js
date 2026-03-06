import mongoose from "mongoose";
import dotenv from "dotenv";

import seedUsers from "./userSeeder.js";
import seedProviders from "./providerProfileSeeder.js";
import seedServices from "./serviceSeeder.js";
import seedBookings from "./seedBookings.js";
import seedPayments from "./paymentSeeder.js";
import seedWallets from "./walletSeeder.js";
import seedWithdrawals from "./withdrawalSeeder.js";
import seedReviews from "./reviewSeeder.js";
import seedReports from "./reportSeeder.js";
import seedChats from "./seedChats.js";
import seedCoupons from "./seedCoupons.js";

dotenv.config();

const runSeeders = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("🚀 MongoDB Connected\n");

        console.log("----- USERS -----");
        await seedUsers();

        console.log("----- PROVIDERS -----");
        await seedProviders();

        console.log("----- SERVICES -----");
        await seedServices();

        console.log("----- BOOKINGS -----");
        await seedBookings();

        console.log("----- PAYMENTS -----");
        await seedPayments();

        console.log("----- WALLETS -----");
        await seedWallets();

        console.log("----- WITHDRAWALS -----");
        await seedWithdrawals();

        console.log("----- REVIEWS -----");
        await seedReviews();

        console.log("----- REPORTS -----");
        await seedReports();

        console.log("----- CHATS -----");
        await seedChats();

        console.log("----- COUPONS -----");
        await seedCoupons();

        console.log("\n🎉 ALL SEEDERS EXECUTED SUCCESSFULLY");

        await mongoose.connection.close();
        process.exit(0);

    } catch (error) {
        console.error("Seeder Error:", error);
        await mongoose.connection.close();
        process.exit(1);
    }
};

runSeeders();