import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";



// Database
import connectDB from "./config/mongodb.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import providerRoutes from "./routes/providerRoutes.js";
import verificationRoutes from "./routes/verificationRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import serviceDiscoveryRoutes from "./routes/serviceDiscoveryRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import providerDocumentRoutes from "./routes/providerDocumentRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import adminAnalyticsRoutes from "./routes/adminAnalyticsRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";


// Error middleware
import errorMiddleware from "./middlewares/errorMiddleware.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Connect DB
connectDB();

// Global middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());



app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true
}));
// Health check
app.get("/", (req, res) => {
    res.send("API IS WORKING Good");
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/verification", verificationRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/discovery", serviceDiscoveryRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/provider-documents", providerDocumentRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/admin", adminAnalyticsRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/wallet", walletRoutes);

// Error handler (always last)
app.use(errorMiddleware);

// Start server 
app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});