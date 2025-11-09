import db from "../config/db.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

// ✅ Razorpay setup
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Nodemailer setup
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ✅ Utility mail sender
const sendMail = async (to, subject, html) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
};

// ✅ Create booking + Razorpay order
export const createBooking = async (req, res) => {
  try {
    const {
      full_name,
      email,
      phone,
      check_in,
      check_out,
      room_type,
      guests,
      total_amount,
    } = req.body;

    if (
      !full_name ||
      !email ||
      !check_in ||
      !check_out ||
      !room_type ||
      !total_amount
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // 🧾 Create Razorpay order
    const options = {
      amount: Math.round(total_amount * 100), // in paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // 💾 Store booking in DB
    const sql = `
      INSERT INTO bookings 
      (full_name, email, phone, check_in, check_out, room_type, guests, total_amount, payment_order_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        full_name,
        email,
        phone,
        check_in,
        check_out,
        room_type,
        guests,
        total_amount,
        order.id,
      ],
      (err, result) => {
        if (err) {
          console.error("❌ DB Error:", err);
          return res
            .status(500)
            .json({ success: false, message: "Database error" });
        }

        // 📧 Send booking created email
        sendMail(
          email,
          "Booking Created - Payment Pending",
          `
            <h3>Hi ${full_name},</h3>
            <p>Your booking for <b>${room_type}</b> has been created.</p>
            <p>Please complete your payment of ₹${total_amount} to confirm your booking.</p>
          `
        ).catch(console.warn);

        res.status(200).json({
          success: true,
          orderId: order.id,
          bookingId: result.insertId,
          amount: total_amount,
          key: process.env.RAZORPAY_KEY_ID,
        });
      }
    );
  } catch (error) {
    console.error("❌ createBooking Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Verify Razorpay payment
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      db.query(
        "UPDATE bookings SET payment_id=?, payment_status='paid', booking_status='confirmed' WHERE payment_order_id=?",
        [razorpay_payment_id, razorpay_order_id],
        (err) => {
          if (err) console.error(err);
        }
      );

      // 📧 Send confirmation email
      db.query(
        "SELECT * FROM bookings WHERE payment_order_id=?",
        [razorpay_order_id],
        async (err, rows) => {
          if (!err && rows.length > 0) {
            const booking = rows[0];
            await sendMail(
              booking.email,
              "Booking Confirmed - Nilanjana Group",
              `
                <h3>Payment Successful!</h3>
                <p>Your booking for <b>${booking.room_type}</b> has been confirmed.</p>
                <p>Payment ID: ${razorpay_payment_id}</p>
                <p>Booking ID: ${booking.id}</p>
              `
            );
          }
        }
      );

      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error("verifyPayment Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Fetch all bookings
export const getAllBookings = (req, res) => {
  db.query("SELECT * FROM bookings ORDER BY id DESC", (err, results) => {
    if (err)
      return res.status(500).json({ success: false, message: "DB error" });
    res.json({ success: true, data: results });
  });
};
