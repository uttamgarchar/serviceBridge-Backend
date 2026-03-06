import Withdrawal from "../models/withdrawalModel.js";
import Wallet from "../models/walletModel.js";

const seedWithdrawals = async () => {
  try {
    await Withdrawal.deleteMany();

    const wallets = await Wallet.find();

    const withdrawals = wallets.map((wallet) => ({
      provider: wallet.user,
      amount: 1000,
      commission: 100,
      netAmount: 900,
      status: "approved",
    }));

    await Withdrawal.insertMany(withdrawals);

    console.log("Withdrawals seeded");
  } catch (error) {
    console.error(error);
  }
};

export default seedWithdrawals;