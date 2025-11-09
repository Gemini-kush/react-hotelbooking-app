import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import {
  addRoom,
  getAllRooms,
  updateRoom,
  deleteRoom,
} from "../controllers/roomController.js";

// ✅ Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "rooms", // Folder name in your Cloudinary account
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage });

const router = express.Router();

// ✅ Add Room (with Cloudinary image upload)
router.post("/add", upload.single("image"), addRoom);

// ✅ Get all rooms
router.get("/", getAllRooms);

// ✅ Update room (with optional image replacement)
router.put("/update/:id", upload.single("image"), updateRoom);

// ✅ Delete room
router.delete("/delete/:id", deleteRoom);

export default router;
