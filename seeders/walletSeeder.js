import Wallet from "../models/walletModel.js";
import User from "../models/userModel.js";

const seedWallets = async () => {
    try {
        await Wallet.deleteMany();

        const providers = await User.find({ role: "provider" });

        const wallets = providers.map((provider) => ({
            user: provider._id,
            balance: Math.floor(Math.random() * 5000),
        }));

        await Wallet.insertMany(wallets);

        console.log("Wallets seeded");
    } catch (error) {
        console.error(error);
    }
};

export default seedWallets;