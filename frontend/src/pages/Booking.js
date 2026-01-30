import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Modal,
  Toast,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
import "./Booking.css";

const Booking = () => {
  const location = useLocation();

  // ---------------- STATE ----------------
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    roomId: "",
    guests: "2 Guests",
    requests: "",
  });

  const [summary, setSummary] = useState({
    nights: 0,
    roomPrice: 0,
    roomCharges: 0,
    tax: 0,
    total: 0,
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // ---------------- HELPERS ----------------
  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ---------------- FETCH ROOMS ----------------
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get("/api/rooms");
        setRooms(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch rooms:", err);
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchRooms();
  }, []);

  // ---------------- PREFILL FROM ROOMS PAGE ----------------
  useEffect(() => {
    if (location.state?.roomId && rooms.length > 0) {
      const selected = rooms.find((r) => r._id === location.state.roomId);
      if (selected) {
        setFormData((prev) => ({
          ...prev,
          roomId: selected._id,
          guests: `${selected.guests} Guests`,
        }));
        setSummary((prev) => ({
          ...prev,
          roomPrice: selected.price,
        }));
      }
    }
  }, [location.state, rooms]);

  // ---------------- PRICE CALCULATION ----------------
  useEffect(() => {
    if (!formData.roomId) return;

    const room = rooms.find((r) => r._id === formData.roomId);
    if (!room) return;

    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    const nights =
      checkOutDate > checkInDate
        ? (checkOutDate - checkInDate) / (1000 * 3600 * 24)
        : 0;

    const roomCharges = nights * room.price;
    const tax = roomCharges * 0.12;
    const total = roomCharges + tax;

    setSummary({
      nights,
      roomPrice: room.price,
      roomCharges,
      tax,
      total,
    });
  }, [formData.checkIn, formData.checkOut, formData.roomId, rooms]);

  // ---------------- AVAILABILITY CHECK ----------------
  const checkAvailability = async () => {
    if (!formData.roomId || !formData.checkIn || !formData.checkOut) {
      alert("Please select room and dates");
      return false;
    }

    setCheckingAvailability(true);
    try {
      const res = await axios.get("/api/availability", {
        params: {
          roomId: formData.roomId,
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
        },
      });

      return res.data.available;
    } catch (err) {
      console.error("Availability check failed:", err);
      return false;
    } finally {
      setCheckingAvailability(false);
    }
  };

  // ---------------- BOOKING (NO PAYMENT HERE) ----------------
  const handleBooking = async () => {
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.checkIn ||
      !formData.checkOut
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (summary.total <= 0) {
      alert("Invalid booking amount");
      return;
    }

    const available = await checkAvailability();
    if (!available) {
      alert("❌ Room is not available for selected dates");
      return;
    }

    try {
      await axios.post("/api/booking", {
        roomId: formData.roomId,
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
      });

      setShowSuccessModal(true);
      setShowToast(true);

      setTimeout(() => {
        setShowSuccessModal(false);
        window.location.reload();
      }, 4000);
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Booking failed. Please try again.");
    }
  };

  // ---------------- UI ----------------
  return (
    <>
      <section className="booking-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold">Book Your Stay</h2>
            <p className="text-muted">
              Reserve your room at Maheshwari Nivas
            </p>
          </div>

          {loadingRooms ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="warning" />
            </div>
          ) : (
            <Row className="justify-content-center">
              <Col lg={8}>
                <Card className="shadow-sm border-0 rounded-4 p-4 mb-4">
                  <Form>
                    {/* PERSONAL INFO */}
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name *</Form.Label>
                      <Form.Control
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Control
                          name="email"
                          placeholder="Email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </Col>
                      <Col md={6}>
                        <Form.Control
                          name="phone"
                          placeholder="Phone"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </Col>
                    </Row>

                    {/* DATES */}
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Control
                          type="date"
                          name="checkIn"
                          min={today}
                          value={formData.checkIn}
                          onChange={handleChange}
                        />
                      </Col>
                      <Col md={6}>
                        <Form.Control
                          type="date"
                          name="checkOut"
                          min={formData.checkIn || today}
                          value={formData.checkOut}
                          onChange={handleChange}
                        />
                      </Col>
                    </Row>

                    {/* ROOM */}
                    <Form.Select
                      className="mb-3"
                      name="roomId"
                      value={formData.roomId}
                      onChange={handleChange}
                    >
                      <option value="">Select Room</option>
                      {rooms.map((r) => (
                        <option key={r._id} value={r._id}>
                          {r.type} – ₹{r.price}/night
                        </option>
                      ))}
                    </Form.Select>

                    <Button
                      onClick={handleBooking}
                      disabled={checkingAvailability}
                      className="w-100 fw-semibold"
                      style={{ backgroundColor: "#E54C19", border: "none" }}
                    >
                      {checkingAvailability
                        ? "Checking availability..."
                        : "Confirm Booking"}
                    </Button>
                  </Form>
                </Card>
              </Col>

              {/* SUMMARY */}
              <Col lg={4}>
                <Card className="shadow-sm border-0 rounded-4 p-4">
                  <h5 className="fw-bold mb-3">Booking Summary</h5>
                  <div className="d-flex justify-content-between">
                    <span>Total</span>
                    <span className="fw-bold text-orange">
                      ₹{summary.total.toLocaleString()}
                    </span>
                  </div>
                </Card>
              </Col>
            </Row>
          )}
        </Container>
      </section>

      {/* SUCCESS */}
      <Modal show={showSuccessModal} centered>
        <div className="text-center p-4">
          <h4 className="fw-bold">Booking Confirmed 🎉</h4>
          <p>Confirmation email has been sent.</p>
        </div>
      </Modal>

      <Toast
        show={showToast}
        delay={5000}
        autohide
        className="position-fixed bottom-0 end-0 m-4 bg-success text-white"
      >
        <Toast.Body>✅ Booking successful</Toast.Body>
      </Toast>
    </>
  );
};

export default Booking;
