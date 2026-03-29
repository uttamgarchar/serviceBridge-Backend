import Review from "../models/reviewModel.js";
import Booking from "../models/bookingModel.js";
import ProviderProfile from "../models/providerProfile.js";

/* ======================================================
   ADD REVIEW
====================================================== */
export const addReview = async (req, res, next) => {
    try {
        const { bookingId, rating, comment } = req.body;

        if (!bookingId || !rating) {
            res.status(400);
            throw new Error("Booking and rating are required");
        }

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            res.status(404);
            throw new Error("Booking not found");
        }

        if (booking.customer.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error("Unauthorized");
        }

        if (booking.status !== "completed") {
            res.status(400);
            throw new Error("Service not completed yet");
        }

        const existingReview = await Review.findOne({ booking: bookingId });
        if (existingReview) {
            res.status(400);
            throw new Error("Review already submitted");
        }

        const review = await Review.create({
            booking: bookingId,
            customer: req.user._id,
            provider: booking.provider,
            rating,
            comment,
        });

        // ⭐ Update rating
        const profile = await ProviderProfile.findOne({
            user: booking.provider,
        });

        if (profile) {
            const totalRating =
                profile.averageRating * profile.totalReviews + rating;

            profile.totalReviews += 1;
            profile.averageRating = totalRating / profile.totalReviews;

            await profile.save();
        }

        res.status(201).json({
            success: true,
            message: "Review submitted successfully",
            review,
        });
    } catch (error) {
        next(error);
    }
};

/* ======================================================
   DELETE REVIEW (SAFE FIX)
====================================================== */
export const deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            res.status(404);
            throw new Error("Review not found");
        }

        if (review.customer.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error("Unauthorized");
        }

        const profile = await ProviderProfile.findOne({
            user: review.provider,
        });

        if (profile) {
            if (profile.totalReviews <= 1) {
                profile.totalReviews = 0;
                profile.averageRating = 0;
            } else {
                const totalRating =
                    profile.averageRating * profile.totalReviews - review.rating;

                profile.totalReviews -= 1;
                profile.averageRating = totalRating / profile.totalReviews;
            }

            await profile.save();
        }

        await review.deleteOne();

        res.json({
            success: true,
            message: "Review deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

/* ======================================================
   FLAG REVIEW
====================================================== */
export const flagReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            res.status(404);
            throw new Error("Review not found");
        }

        review.isFlagged = true;
        await review.save();

        res.json({
            success: true,
            message: "Review flagged successfully",
        });
    } catch (error) {
        next(error);
    }
};

/* ======================================================
   GET PROVIDER REVIEWS (FIXED)
====================================================== */
export const getProviderReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({
            provider: req.params.providerId,
            isFlagged: false, // hide flagged reviews
        }).populate("customer", "name");

        res.json({
            success: true,
            reviews,
        });
    } catch (error) {
        next(error);
    }
};