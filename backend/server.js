import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/db.js";
import bookingRoutes from "./routes/booking.js";
import adminRoutes from "./routes/admin.js";
import roomRoutes from "./routes/room.js";
import paymentRoutes from "./routes/payment.js";
import path from "path";
import { fileURLToPath } from "url";
import transporter from "./config/email.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ For ESM __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Middleware
app.use(
  cors({
    origin: ["http://localhost:3000"], // allow React frontend
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ ROUTES
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/payment", paymentRoutes);

// ✅ Root Route (Health Check)
app.get("/", (req, res) => {
  res.send("🏨 Maheshwari Nivas Backend is Running...");
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

// ✅ Database Connection Check
db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Database connected successfully!");
  }
});
