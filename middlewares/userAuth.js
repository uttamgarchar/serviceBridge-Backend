import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const userAuth = async (req, res, next) => {
    try {
        let token;

        // 1️⃣ Get token from cookie or Authorization header
        if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        } else if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        // 2️⃣ No token found
        if (!token) {
            res.status(401);
            throw new Error("Not authorized, token missing");
        }

        // 3️⃣ Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4️⃣ Get user from database
        const user = await userModel.findById(decoded.id).select("-password");

        if (!user) {
            res.status(401);
            throw new Error("User not found");
        }

        // 5️⃣ Attach user to request
        req.user = user;

        next();
    } catch (error) {
        res.status(401);
        next(error);
    }
};

export default userAuth;
