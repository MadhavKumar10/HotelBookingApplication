import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from 'url'; // Add this import
import { v2 as cloudinary } from "cloudinary";
import myHotelRoutes from "./routes/my-hotels.js";
import hotelRoutes from "./routes/hotels.js";
import bookingRoutes from "./routes/my-bookings.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* mongoose.connect(process.env.MONGODB_CONNECTION_STRING); */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};


const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

/* app.use(express.static(path.join(__dirname, "../../frontend/dist"))); */

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/my-hotels", myHotelRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/my-bookings", bookingRoutes);

// Simple health check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Backend is running",
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
  });
});

/* app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
}); */

connectDB().then(() => {
  app.listen(7000, () => {
    console.log("🚀 Server running on http://localhost:7000");
  });
});