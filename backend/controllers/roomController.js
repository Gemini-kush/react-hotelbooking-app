import db from "../config/db.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

// ✅ Helper function to upload image to Cloudinary
export const uploadToCloudinary = async (filePath, folder) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, { folder });
    if (filePath && !filePath.startsWith("http")) {
      fs.unlinkSync(filePath);
    }
    return {
      secure_url: result.secure_url,
      public_id: result.public_id, // ✅ add this
    };
  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", error);
    throw error;
  }
};

// ✅ Add Room
export const addRoom = async (req, res) => {
  try {
    const {
      name,
      type,
      guests,
      size,
      price,
      amenities,
      description,
      status,
      current_guest,
    } = req.body;

    if (!name || !type || !guests || !size || !price) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    let imageUrl = null;
    let imageId = null;

    if (req.file) {
      const upload = await uploadToCloudinary(req.file.path);
      imageUrl = upload.secure_url;
      imageId = upload.public_id;
    }

    const sql = `
        INSERT INTO rooms (name, type, guests, size, price, amenities, description, status, current_guest, image, image_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

    db.query(
      sql,
      [
        name,
        type,
        guests,
        size,
        price,
        JSON.stringify(amenities || []),
        description || "",
        status || "Available",
        current_guest || null,
        imageUrl,
        imageId,
      ],
      (err, result) => {
        if (err) {
          console.error("❌ DB Error:", err);
          return res
            .status(500)
            .json({ success: false, message: "Database error" });
        }

        res.status(201).json({
          success: true,
          message: "Room added successfully!",
          roomId: result.insertId,
          image: imageUrl,
        });
      }
    );
  } catch (error) {
    console.error("❌ Upload Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get All Rooms
export const getAllRooms = (req, res) => {
  const sql = "SELECT * FROM rooms ORDER BY id DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Fetch Error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    }

    const parsedRooms = results.map((room) => ({
      ...room,
      amenities: (() => {
        try {
          return JSON.parse(room.amenities || "[]");
        } catch {
          return [];
        }
      })(),
    }));

    res.status(200).json({ success: true, data: parsedRooms });
  });
};

// ✅ Update Room
export const updateRoom = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    type,
    guests,
    size,
    price,
    amenities,
    description,
    status,
    current_guest,
  } = req.body;

  let newImageUrl = null;
  let newImageId = null;

  try {
    // fetch current image_id
    const [existing] = await new Promise((resolve, reject) => {
      db.query("SELECT image_id FROM rooms WHERE id=?", [id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    if (req.file) {
      const upload = await uploadToCloudinary(req.file.path);
      newImageUrl = upload.secure_url;
      newImageId = upload.public_id;

      // delete old image if present
      if (existing?.image_id) {
        await cloudinary.uploader.destroy(existing.image_id);
      }
    }

    const sql = `
        UPDATE rooms
        SET name=?, type=?, guests=?, size=?, price=?, amenities=?, description=?, status=?, current_guest=?, 
            image=IFNULL(?, image), image_id=IFNULL(?, image_id)
        WHERE id=?
      `;

    db.query(
      sql,
      [
        name,
        type,
        guests,
        size,
        price,
        JSON.stringify(amenities || []),
        description,
        status,
        current_guest,
        newImageUrl,
        newImageId,
        id,
      ],
      (err) => {
        if (err) {
          console.error("❌ Update Error:", err);
          return res
            .status(500)
            .json({ success: false, message: "Update failed" });
        }

        res
          .status(200)
          .json({ success: true, message: "Room updated successfully!" });
      }
    );
  } catch (error) {
    console.error("❌ Cloudinary Update Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Delete Room
export const deleteRoom = async (req, res) => {
  const { id } = req.params;

  try {
    const [room] = await new Promise((resolve, reject) => {
      db.query("SELECT image_id FROM rooms WHERE id=?", [id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    if (!room) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }

    // delete from Cloudinary
    if (room.image_id) {
      await cloudinary.uploader.destroy(room.image_id);
    }

    db.query("DELETE FROM rooms WHERE id=?", [id], (err2) => {
      if (err2) {
        console.error("❌ Delete Error:", err2);
        return res
          .status(500)
          .json({ success: false, message: "Failed to delete" });
      }
      res
        .status(200)
        .json({ success: true, message: "Room deleted successfully!" });
    });
  } catch (error) {
    console.error("❌ Delete Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
