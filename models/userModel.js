import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false,
        },

        role: {
            type: String,
            enum: ["User", "Admin", "ServiceProvider", "VerificationManager", "ProviderManager"],
            default: "User",
        },

        providerStatus: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: null,
        },

        isAccountVerified: {
            type: Boolean,
            default: false,
        },

        verifyOtp: {
            type: String,
        },

        verifyOtpExpireAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

/**
 * Hash password before save
 */
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

/**
 * Compare password
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const userModel = mongoose.model("User", userSchema);

export default userModel;
