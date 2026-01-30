import mongoose from "mongoose";
import { connectDB } from "../lib/mongodb";
import nodemailer from "nodemailer";

const BookingSchema = new mongoose.Schema({
  roomId: mongoose.Schema.Types.ObjectId,
  name: String,
  email: String,
  phone: String,
  checkIn: Date,
  checkOut: Date,
  createdAt: { type: Date, default: Date.now },
});

const Booking =
  mongoose.models.Booking || mongoose.model("Booking", BookingSchema);

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { roomId, name, email, phone, checkIn, checkOut } = req.body;

  // ❌ availability check again (important)
  const conflict = await Booking.findOne({
    roomId,
    checkIn: { $lt: new Date(checkOut) },
    checkOut: { $gt: new Date(checkIn) },
  });

  if (conflict) {
    return res.status(409).json({ message: "Room not available" });
  }

  // ✅ Save booking
  await Booking.create({
    roomId,
    name,
    email,
    phone,
    checkIn,
    checkOut,
  });

  // 📧 Optional email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    to: email,
    subject: "Booking Confirmed – Maheshwari Nivas",
    text: `Your booking from ${checkIn} to ${checkOut} is confirmed.`,
  });

  res.status(201).json({ success: true });
}
