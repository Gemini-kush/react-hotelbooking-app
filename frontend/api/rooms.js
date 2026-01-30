import mongoose from "mongoose";
import { connectDB } from "../lib/mongodb";

const RoomSchema = new mongoose.Schema({
  type: String,
  price: Number,
  guests: Number,
  size: Number,
  image: String,
  amenities: [String],
  description: String,
});

const Room = mongoose.models.Room || mongoose.model("Room", RoomSchema);

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    const rooms = await Room.find({});
    return res.status(200).json(rooms);
  }

  res.status(405).json({ message: "Method not allowed" });
}
