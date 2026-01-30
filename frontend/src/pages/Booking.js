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
import "./Booking.css";

const Booking = () => {
  const location = useLocation();
  const backendURL = "http://localhost:5000";

  // ✅ State
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    roomType: "",
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

  // ✅ Handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Set today's date for date picker min value
  const today = new Date().toISOString().split("T")[0];

  // ✅ Fetch all rooms from backend
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch(`${backendURL}/api/rooms`);
        const data = await res.json();
        if (data.success) {
          setRooms(data.data);
        }
      } catch (err) {
        console.error("❌ Failed to fetch rooms:", err);
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchRooms();
  }, []);

  // ✅ Prefill room if navigated from Rooms page
  useEffect(() => {
    if (location.state?.selectedRoom && rooms.length > 0) {
      const selected = rooms.find(
        (r) => r.type === location.state.selectedRoom
      );

      if (selected) {
        setFormData((prev) => ({
          ...prev,
          roomType: `${
            selected.type
          } - ₹${selected.price.toLocaleString()}/night`,
          guests: `${selected.guests} Guests`,
        }));

        setSummary((prev) => ({
          ...prev,
          roomPrice: selected.price,
        }));
      }
    }
  }, [location.state, rooms]);

  // ✅ Calculate price dynamically
  useEffect(() => {
    if (!formData.roomType) return;

    // Match by room type (not name)
    const selectedType = formData.roomType.split("-")[0].trim();
    const matchedRoom = rooms.find((r) => r.type === selectedType);
    const roomPrice = matchedRoom ? matchedRoom.price : 0;

    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    const diffTime = checkOutDate - checkInDate;
    const nights = diffTime > 0 ? diffTime / (1000 * 3600 * 24) : 0;

    const roomCharges = nights * roomPrice;
    const tax = roomCharges * 0.12;
    const total = roomCharges + tax;

    setSummary({ nights, roomPrice, roomCharges, tax, total });
  }, [formData.checkIn, formData.checkOut, formData.roomType, rooms]);

  // ✅ Payment flow
  const handlePayment = async () => {
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.checkIn ||
      !formData.checkOut
    ) {
      alert("Please fill all required fields before proceeding.");
      return;
    }

    if (!summary.total || summary.total <= 0) {
      alert("Please select a valid room type and date range before payment.");
      return;
    }

    console.log("🧾 Payment amount before request:", summary.total);

    try {
      const orderRes = await fetch(`${backendURL}/api/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: summary.total,
          receipt: "receipt_" + Date.now(),
        }),
      });

      if (!orderRes.ok) {
        const text = await orderRes.text();
        console.error("Create order failed:", text);
        alert("Order creation failed — check server logs.");
        return;
      }

      const order = await orderRes.json();
      if (!order || !order.id) {
        alert("Unable to create order. Please try again.");
        return;
      }

      const options = {
        key: "rzp_test_Rcmx6BM6gABBYb",
        amount: order.amount,
        currency: order.currency,
        name: "Maheshwari Nivas",
        description: "Room Booking Payment",
        order_id: order.id,
        handler: async (response) => {
          const verifyRes = await fetch(`${backendURL}/api/payment/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...response,
              bookingData: { ...formData, totalAmount: summary.total }, // ✅ FIXED
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            setShowSuccessModal(true);
            setShowToast(true);
            setTimeout(() => {
              setShowSuccessModal(false);
              window.location.href = "/booking";
            }, 4000);
          } else {
            alert("Payment verification failed: " + verifyData.message);
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: "#E54C19" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("❌ Payment error:", err);
      alert("Something went wrong with payment. Please try again.");
    }
  };

  return (
    <>
      <section className="booking-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold">Book Your Stay</h2>
            <p className="text-muted">
              Fill in the details below to reserve your room at Maheshwari Nivas
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
                  <h5 className="fw-bold mb-4">Booking Details</h5>
                  <Form>
                    {/* Personal Info */}
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="fullName"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group controlId="email">
                          <Form.Label>Email *</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            placeholder="info@gmail.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="phone">
                          <Form.Label>Phone *</Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            placeholder="1234567890"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* Dates */}
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group controlId="checkIn">
                          <Form.Label>Check-in *</Form.Label>
                          <Form.Control
                            type="date"
                            name="checkIn"
                            min={today}
                            value={formData.checkIn}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="checkOut">
                          <Form.Label>Check-out *</Form.Label>
                          <Form.Control
                            type="date"
                            name="checkOut"
                            min={formData.checkIn || today}
                            value={formData.checkOut}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* Room Type + Guests */}
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group controlId="roomType">
                          <Form.Label>Room Type *</Form.Label>
                          <Form.Select
                            name="roomType"
                            value={formData.roomType}
                            onChange={handleChange}
                          >
                            {rooms.length > 0 ? (
                              rooms.map((r) => (
                                <option key={r.id}>
                                  {r.type} - ₹{r.price.toLocaleString()}/night
                                </option>
                              ))
                            ) : (
                              <option>Loading rooms...</option>
                            )}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="guests">
                          <Form.Label>Guests *</Form.Label>
                          <Form.Select
                            name="guests"
                            value={formData.guests}
                            onChange={handleChange}
                          >
                            <option>1 Guest</option>
                            <option>2 Guests</option>
                            <option>3 Guests</option>
                            <option>4 Guests</option>
                            <option>5 Guests</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group controlId="requests" className="mb-4">
                      <Form.Label>Special Requests</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="requests"
                        rows={2}
                        placeholder="Any special requirements or requests..."
                        value={formData.requests}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Button
                      onClick={handlePayment}
                      className="w-100 fw-semibold py-2 payment-btn"
                    >
                      Proceed to Payment
                    </Button>
                  </Form>
                </Card>
              </Col>

              {/* Booking Summary */}
              <Col lg={4}>
                <Card className="shadow-sm border-0 rounded-4 p-4 sticky-top summary-card">
                  <h5 className="fw-bold mb-3">Booking Summary</h5>
                  <p className="fw-semibold">
                    {formData.roomType.split("-")[0] || "Select Room"}
                  </p>
                  <hr />
                  <div className="d-flex justify-content-between">
                    <span>Room Charges</span>
                    <span>₹{summary.roomCharges.toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Taxes & Fees (12%)</span>
                    <span>₹{summary.tax.toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between fw-bold text-orange border-top pt-2">
                    <span>Total Amount</span>
                    <span>₹{summary.total.toLocaleString()}</span>
                  </div>
                </Card>
              </Col>
            </Row>
          )}
        </Container>
      </section>

      {/* ✅ Success Modal */}
      <Modal show={showSuccessModal} centered>
        <div className="text-center p-4">
          <div
            className="rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center mb-3"
            style={{ width: "70px", height: "70px", fontSize: "32px" }}
          >
            ✓
          </div>
          <h4 className="fw-bold">Payment Successful!</h4>
          <p className="text-muted mb-1">
            Your booking has been confirmed successfully.
          </p>
        </div>
      </Modal>

      {/* ✅ Toast Notification */}
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={5000}
        autohide
        className="position-fixed bottom-0 end-0 m-4 bg-success text-white"
      >
        <Toast.Body>
          ✅ Payment Successful! <br /> Confirmation mail has been sent to your
          email.
        </Toast.Body>
      </Toast>
    </>
  );
};

export default Booking;
