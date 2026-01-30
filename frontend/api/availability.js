import mongoose from "mongoose";
import { connectDB } from "../lib/mongodb";

const BookingSchema = new mongoose.Schema({
  roomId: mongoose.Schema.Types.ObjectId,
  checkIn: Date,
  checkOut: Date,
});

const Booking =
  mongoose.models.Booking || mongoose.model("Booking", BookingSchema);

export default async function handler(req, res) {
  await connectDB();

  const { roomId, checkIn, checkOut } = req.query;

  if (!roomId || !checkIn || !checkOut) {
    return res.status(400).json({ available: false });
  }

  const overlapping = await Booking.findOne({
    roomId,
    $or: [
      {
        checkIn: { $lt: new Date(checkOut) },
        checkOut: { $gt: new Date(checkIn) },
      },
    ],
  });

  res.status(200).json({ available: !overlapping });
}
