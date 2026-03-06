import userModel from "../models/userModel.js";

/**
 * GET LOGGED-IN USER PROFILE
 */
export const getUserProfile = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id).select("-password");

        if (!user) {
            res.status(404);
            throw new Error("User not found");
        }

        res.json({
            success: true,
            user,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * UPDATE USER PROFILE
 */
export const updateUserProfile = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id);

        if (!user) {
            res.status(404);
            throw new Error("User not found");
        }

        const { name, email } = req.body;

        if (name) user.name = name;
        if (email) user.email = email;

        await user.save();

        res.json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
};
