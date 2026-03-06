import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

const seedUsers = async () => {
    try {
        await User.deleteMany();

        const hashedPassword = await bcrypt.hash("123456", 10);

        const users = [
            {
                name: "System Admin",
                email: "admin@test.com",
                password: hashedPassword,
                role: "Admin",
                isAccountVerified: true,
            },
            {
                name: "Verification Manager",
                email: "verify@test.com",
                password: hashedPassword,
                role: "VerificationManager",
                isAccountVerified: true,
            },
            {
                name: "Provider Manager",
                email: "manager@test.com",
                password: hashedPassword,
                role: "ProviderManager",
                isAccountVerified: true,
            },
        ];

        for (let i = 1; i <= 5; i++) {
            users.push({
                name: `User ${i}`,
                email: `user${i}@test.com`,
                password: hashedPassword,
                role: "User",
                isAccountVerified: true,
            });
        }

        for (let i = 1; i <= 3; i++) {
            users.push({
                name: `Provider ${i}`,
                email: `provider${i}@test.com`,
                password: hashedPassword,
                role: "ServiceProvider",
                providerStatus: "approved",
                isAccountVerified: true,
            });
        }

        await User.insertMany(users);

        console.log("✅ Users Seeded Successfully");
    } catch (error) {
        console.error(error);
    }
};

export default seedUsers;