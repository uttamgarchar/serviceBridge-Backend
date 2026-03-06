import Service from "../models/serviceModel.js";
import ProviderProfile from "../models/providerProfile.js";

const seedServices = async () => {
    try {
        await Service.deleteMany();

        const providers = await ProviderProfile.find();

        if (!providers.length) {
            console.log("No providers found. Seed providers first.");
            return;
        }

        const serviceNames = [
            "Plumbing",
            "Electrician",
            "AC Repair",
            "House Cleaning",
            "Painting",
        ];

        const services = [];

        providers.forEach((provider) => {
            serviceNames.forEach((name) => {
                services.push({
                    provider: provider._id,
                    name,
                    description: `${name} service`,
                    price: Math.floor(Math.random() * 500) + 100,
                });
            });
        });

        await Service.insertMany(services);

        console.log("Services seeded");
    } catch (error) {
        console.error(error);
    }
};

export default seedServices;