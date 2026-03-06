import Chat from "../models/chatModel.js";
import Booking from "../models/bookingModel.js";

const seedChats = async () => {
    try {
        await Chat.deleteMany();

        const bookings = await Booking.find();

        const chats = [];

        bookings.forEach((booking) => {
            chats.push({
                booking: booking._id,
                message: "Hello, I will arrive soon.",
                senderRole: "provider",
            });

            chats.push({
                booking: booking._id,
                message: "Okay, thank you!",
                senderRole: "user",
            });
        });

        await Chat.insertMany(chats);

        console.log("Chats seeded");
    } catch (error) {
        console.error(error);
    }
};

export default seedChats;