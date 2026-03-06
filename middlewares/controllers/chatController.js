import chatModel from "../models/chatModel.js";

/* ======================================================
   CREATE OR GET CHAT
====================================================== */
export const getOrCreateChat = async (req, res, next) => {
    try {
        const booking = req.booking;

        let chat = await chatModel.findOne({ booking: booking._id });

        if (!chat) {
            chat = await chatModel.create({
                booking: booking._id,
                user: booking.customer,
                provider: booking.provider,
                messages: [],
            });
        }

        res.json({
            success: true,
            chat,
        });
    } catch (error) {
        next(error);
    }
};

/* ======================================================
   SEND MESSAGE
====================================================== */
export const sendMessage = async (req, res, next) => {
    try {
        const { message } = req.body;
        const booking = req.booking;

        if (!message) {
            res.status(400);
            throw new Error("Message is required");
        }

        const chat = await chatModel.findOne({ booking: booking._id });

        if (!chat) {
            res.status(404);
            throw new Error("Chat not found");
        }

        chat.messages.push({
            sender: req.user._id,
            message,
        });

        await chat.save();

        res.json({
            success: true,
            message: "Message sent",
        });
    } catch (error) {
        next(error);
    }
};
