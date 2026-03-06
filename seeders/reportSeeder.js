import Report from "../models/reportModel.js";
import Booking from "../models/bookingModel.js";

const seedReports = async () => {
    try {
        await Report.deleteMany();

        const bookings = await Booking.find().limit(3);

        const reports = bookings.map((booking) => ({
            booking: booking._id,
            reason: "Service delay",
            status: "pending",
        }));

        await Report.insertMany(reports);

        console.log("Reports seeded");
    } catch (error) {
        console.error(error);
    }
};

export default seedReports;