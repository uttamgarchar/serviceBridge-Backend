import ProviderProfile from "../models/providerProfile.js";
import User from "../models/userModel.js";

const seedProviders = async () => {
    try {
        await ProviderProfile.deleteMany();

        const providers = await User.find({ role: "provider" });

        if (!providers.length) {
            console.log("No provider users found.");
            return;
        }

        const profiles = providers.map((provider) => ({
            user: provider._id,
            businessName: `Service Provider ${provider.name}`,
            experience: Math.floor(Math.random() * 10) + 1,
            isVerified: true,
            rating: 4.5,
        }));

        await ProviderProfile.insertMany(profiles);

        console.log("Provider profiles seeded");
    } catch (error) {
        console.error(error);
    }
};

export default seedProviders;