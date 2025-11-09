import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";
import nodemailer from "nodemailer";

dotenv.config();
const router = express.Router();

// ✅ MySQL Connection
const db = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// ✅ Razorpay Setup
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Create Order
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || isNaN(amount) || amount <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid amount" });
    }

    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error("❌ Razorpay Order Error:", err.message);
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
});

// ✅ Verify Payment and Save Booking + Email
router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingData,
    } = req.body;

    // 🔐 Signature validation
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const digest = hmac.digest("hex");

    if (digest !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    // 💰 Get amount correctly
    const finalAmount = Number(
      bookingData.amount || bookingData.totalAmount || 0
    );
    if (isNaN(finalAmount) || finalAmount <= 0) {
      console.warn("⚠️ Invalid amount in bookingData:", bookingData);
    }

    // ✅ Insert into bookings (using 'amount' column)
    const sql = `
      INSERT INTO bookings
      (full_name, email, phone, check_in, check_out, room_type, guests, requests, amount, payment_id, payment_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      bookingData.fullName,
      bookingData.email,
      bookingData.phone,
      bookingData.checkIn,
      bookingData.checkOut,
      bookingData.roomType,
      bookingData.guests,
      bookingData.requests || "",
      finalAmount,
      razorpay_payment_id,
      "Paid",
    ]);

    console.log("✅ Booking saved for:", bookingData.email);

    // ✅ Email Setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // ✅ Email to Customer
    const customerMail = {
      from: `"Maheshwari Nivas" <${process.env.SMTP_USER}>`,
      to: bookingData.email,
      subject: "Booking Confirmation - Maheshwari Nivas",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;">
          <h2 style="color:#2e7d32;">Payment Successful ✅</h2>
          <p>Dear <b>${bookingData.fullName}</b>,</p>
          <p>Your booking has been confirmed successfully.</p>
          <h4>📅 Booking Details</h4>
          <ul>
            <li><b>Room Type:</b> ${bookingData.roomType}</li>
            <li><b>Guests:</b> ${bookingData.guests}</li>
            <li><b>Check-in:</b> ${bookingData.checkIn}</li>
            <li><b>Check-out:</b> ${bookingData.checkOut}</li>
            <li><b>Amount Paid:</b> ₹${finalAmount.toLocaleString("en-IN")}</li>
          </ul>
          <p><b>Payment ID:</b> ${razorpay_payment_id}</p>
          <p>Thank you for booking with <b>Maheshwari Nivas</b>!</p>
        </div>
      `,
    };

    await transporter.sendMail(customerMail);
    console.log("📧 Confirmation email sent to customer:", bookingData.email);

    // ✅ Email to Admin
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
    const adminMail = {
      from: `"Maheshwari Nivas" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: "📩 New Booking Received - Maheshwari Nivas",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;">
          <h2 style="color:#1565c0;">📩 New Booking Received</h2>
          <p>A new booking has been made:</p>
          <ul>
            <li><b>Name:</b> ${bookingData.fullName}</li>
            <li><b>Email:</b> ${bookingData.email}</li>
            <li><b>Phone:</b> ${bookingData.phone}</li>
            <li><b>Room Type:</b> ${bookingData.roomType}</li>
            <li><b>Guests:</b> ${bookingData.guests}</li>
            <li><b>Check-in:</b> ${bookingData.checkIn}</li>
            <li><b>Check-out:</b> ${bookingData.checkOut}</li>
            <li><b>Amount Paid:</b> ₹${finalAmount.toLocaleString("en-IN")}</li>
            <li><b>Payment ID:</b> ${razorpay_payment_id}</li>
          </ul>
        </div>
      `,
    };

    await transporter.sendMail(adminMail);
    console.log("📨 Notification email sent to admin:", adminEmail);

    res.json({
      success: true,
      message: "Payment verified, booking saved, and emails sent",
      bookingId: result.insertId,
    });
  } catch (err) {
    console.error("❌ Verify Error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Error verifying payment" });
  }
});

// ✅ Get All Bookings
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM bookings ORDER BY id DESC");
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
