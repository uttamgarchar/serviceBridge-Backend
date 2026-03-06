import Booking from "../models/bookingModel.js";
import User from "../models/userModel.js";
import Service from "../models/serviceModel.js";
import ProviderProfile from "../models/providerProfile.js";

const seedBookings = async () => {
    try {
        await Booking.deleteMany();

        const users = await User.find({ role: "user" });
        const services = await Service.find();
        const providers = await ProviderProfile.find();

        if (!users.length || !services.length || !providers.length) {
            console.log("Need users, providers, and services before creating bookings");
            return;
        }

        const bookings = [];

        for (let i = 0; i < 10; i++) {
            const user = users[Math.floor(Math.random() * users.length)];
            const service = services[Math.floor(Math.random() * services.length)];
            const provider = providers[Math.floor(Math.random() * providers.length)];

            bookings.push({
                user: user._id,
                service: service._id,
                provider: provider._id,
                status: "completed",
                totalAmount: service.price,
            });
        }

        await Booking.insertMany(bookings);

        console.log("Bookings seeded");
    } catch (error) {
        console.error(error);
    }
};

export default seedBookings;