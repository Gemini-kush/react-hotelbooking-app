import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Tabs,
  Tab,
  Form,
  Table,
  Modal,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./AdminDashboard.css";
import axios from "axios";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    guests: "",
    size: "",
    price: "",
    amenities: [],
    description: "",
    status: "Available",
    current_guest: "",
  });

  const [rooms, setRooms] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch rooms on mount
  useEffect(() => {
    fetch("http://localhost:5000/api/rooms")
      .then((res) => res.json())
      .then((data) => {
        console.log("Rooms API response:", data);
        setRooms(Array.isArray(data.data) ? data.data : []);
      })
      .catch((err) => console.error("Error fetching rooms:", err));
  }, []);

  // ✅ Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/bookings");
        console.log("📦 Bookings API response:", res.data);

        if (res.data.success && Array.isArray(res.data.data)) {
          setBookings(res.data.data);
        } else {
          console.warn("⚠️ Unexpected bookings API response:", res.data);
          setBookings([]);
        }
      } catch (err) {
        console.error("❌ Error fetching bookings:", err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Show login success toast on mount
  useEffect(() => {
    toast.success("Login Successful", {
      position: "bottom-right",
      autoClose: 3000,
      theme: "light",
    });
  }, []);

  // Handle logout
  const handleLogout = () => {
    toast.info("Logged out successfully", {
      position: "bottom-right",
      autoClose: 2000,
      theme: "light",
    });
    setTimeout(() => navigate("/admin"), 1000);
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle checkbox (amenities)
  const handleAmenityChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      if (checked) return { ...prev, amenities: [...prev.amenities, value] };
      else
        return {
          ...prev,
          amenities: prev.amenities.filter((a) => a !== value),
        };
    });
  };

  // Submit form to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/rooms/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Room added successfully!", {
          position: "bottom-right",
          autoClose: 2000,
        });
        setFormData({
          name: "",
          type: "",
          guests: "",
          size: "",
          price: "",
          amenities: [],
          description: "",
        });
      } else {
        toast.error("Failed to add room");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Server error, please try again");
    }
  };

  // Booking Stats
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    confirmed: 0,
    revenue: 0,
  });

  // Fetch stats on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/bookings/stats");
        if (res.data.success) {
          setStats(res.data);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();
  }, []);

  //  Fetch Rooms
  const fetchRooms = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/rooms");
      const data = await res.json();
      setRooms(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    }
  };

  //  Fetch Bookings
  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/bookings");
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  //  Fetch Stats
  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/bookings/stats");
      if (res.data.success) setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  // Handle Room Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/rooms/delete/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        toast.success("🗑️ Room deleted successfully!");
        setRooms((prev) => prev.filter((room) => room.id !== id)); // remove from UI
      } else {
        toast.error("Failed to delete room");
      }
    } catch (err) {
      console.error("Delete Error:", err);
      toast.error("Server error during deletion");
    }
  };

  // Handle Room Edit (Open Modal)
  const [editRoom, setEditRoom] = useState(null);
  const [roomToDelete, setRoomToDelete] = useState(null);

  const handleEdit = (room) => {
    setEditRoom(room);
  };

  const [isAddingRoom, setIsAddingRoom] = useState(false);

  // Booking Cancellation
  const [bookingToCancel, setBookingToCancel] = useState(null);

  return (
    <div className="admin-dashboard bg-light min-vh-100 py-4">
      <Container>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold text-orange mb-1">Admin Panel</h3>
            <p className="text-muted small mb-0">Maheshwari Nivas Management</p>
          </div>

          <Button
            variant="outline-danger"
            className="rounded-3 px-3 fw-semibold"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right me-2"></i> Logout
          </Button>
        </div>

        <hr />

        {/* Refresh Button */}
        <div className="d-flex justify-content-end align-items-center mb-4">
          <Button
            variant="outline-secondary"
            className="rounded-3 px-3 fw-semibold"
            onClick={() => {
              fetchRooms();
              fetchBookings();
              fetchStats();
              toast.success("Data refreshed!", {
                position: "bottom-right",
                autoClose: 2000,
                theme: "light",
              });
            }}
          >
            <i className="bi bi-arrow-clockwise me-2"></i> Refresh
          </Button>
        </div>

        {/* Stats Section */}
        <Row className="g-4 mb-4">
          <Col md={3}>
            <Card className="stat-card p-3 border-0 shadow-sm rounded-4">
              <div className="d-flex align-items-center">
                <div className="icon-box bg-primary-subtle text-primary">
                  <i className="bi bi-calendar3"></i>
                </div>
                <div className="ms-3">
                  <h6>Total Bookings</h6>
                  <h5 className="fw-bold">{stats.total}</h5>
                </div>
              </div>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="stat-card p-3 border-0 shadow-sm rounded-4">
              <div className="d-flex align-items-center">
                <div className="icon-box bg-warning-subtle text-warning">
                  <i className="bi bi-house-door"></i>
                </div>
                <div className="ms-3">
                  <h6>Today's Bookings</h6>
                  <h5 className="fw-bold">{stats.today}</h5>
                </div>
              </div>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="stat-card p-3 border-0 shadow-sm rounded-4">
              <div className="d-flex align-items-center">
                <div className="icon-box bg-success-subtle text-success">
                  <i className="bi bi-person-check"></i>
                </div>
                <div className="ms-3">
                  <h6>Confirmed</h6>
                  <h5 className="fw-bold">{stats.confirmed}</h5>
                </div>
              </div>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="stat-card p-3 border-0 shadow-sm rounded-4">
              <div className="d-flex align-items-center">
                <div className="icon-box bg-purple-subtle text-purple">
                  <i className="bi bi-currency-dollar"></i>
                </div>
                <div className="ms-3">
                  <h6>Total Revenue</h6>
                  <h5 className="fw-bold">
                    ₹{Number(stats.revenue).toLocaleString("en-IN")}
                  </h5>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Tabs Section */}
        <Tabs
          defaultActiveKey="bookings"
          id="admin-tabs"
          className="mb-3 equal-tabs rounded-pill bg-white shadow-sm p-2"
        >
          {/* Bookings Tab */}
          <Tab eventKey="bookings" title="Bookings">
            <Card className="p-4 border-0 shadow-sm rounded-4 bg-body-tertiary">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="fw-bold mb-0">All Bookings</h4>
                  <small className="text-secondary">
                    Showing {Array.isArray(bookings) ? bookings.length : 0}{" "}
                    bookings
                  </small>
                </div>
              </div>

              {/* ✅ Loading Spinner */}
              {loading ? (
                <div className="text-center py-5">
                  <div
                    className="spinner-border text-warning"
                    role="status"
                  ></div>
                </div>
              ) : !Array.isArray(bookings) || bookings.length === 0 ? (
                // ✅ Empty State
                <div className="text-center text-muted py-5">
                  <i className="bi bi-calendar2 fs-1 mb-3 d-block"></i>
                  <p>No bookings found</p>
                </div>
              ) : (
                // ✅ Bookings Table
                <div className="table-responsive">
                  <Table
                    bordered
                    hover
                    className="align-middle shadow-sm rounded-3 table-bookings"
                  >
                    <thead
                      style={{
                        backgroundColor: "var(--bs-light-bg-subtle, #fdf6f3)",
                        color: "var(--brand-orange, #f15a24)",
                      }}
                    >
                      <tr>
                        <th>#</th>
                        <th>Guest</th>
                        <th>Room</th>
                        <th>Dates</th>
                        <th>Guests</th>
                        <th>Amount</th>
                        <th>Payment</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {bookings.map((b, i) => (
                        <tr key={b.id || i} className="table-row">
                          <td className="fw-semibold">{i + 1}</td>
                          <td>
                            <div className="d-flex flex-column">
                              <span className="fw-bold">{b.full_name}</span>
                              <small className="text-muted">{b.email}</small>
                              <small className="text-muted">{b.phone}</small>
                            </div>
                          </td>
                          <td className="fw-semibold">{b.room_type}</td>
                          <td>
                            <div>
                              <i className="bi bi-calendar-check text-success me-1"></i>
                              {new Date(b.check_in).toLocaleDateString("en-IN")}
                              <br />
                              <i className="bi bi-calendar-x text-danger me-1"></i>
                              {new Date(b.check_out).toLocaleDateString(
                                "en-IN"
                              )}
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-info-subtle text-info px-2 py-1">
                              {b.guests}
                            </span>
                          </td>
                          <td className="fw-semibold text-success">
                            ₹{Number(b.amount || 0).toLocaleString("en-IN")}
                          </td>
                          <td>
                            <small className="text-muted">
                              {b.payment_id || "-"}
                            </small>
                          </td>
                          <td>
                            <span
                              className={`badge px-3 py-2 rounded-pill ${
                                b.payment_status === "Paid"
                                  ? "bg-success-subtle text-success"
                                  : "bg-warning-subtle text-warning"
                              }`}
                            >
                              {b.payment_status || "Pending"}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex flex-column align-items-start">
                              <span
                                className={`badge px-3 py-2 rounded-pill mb-2 ${
                                  b.booking_status === "Cancelled"
                                    ? "bg-danger-subtle text-danger"
                                    : b.payment_status === "Paid"
                                    ? "bg-success-subtle text-success"
                                    : "bg-warning-subtle text-warning"
                                }`}
                              >
                                {b.booking_status ||
                                  b.payment_status ||
                                  "Pending"}
                              </span>

                              {b.booking_status !== "Cancelled" && (
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  className="fw-semibold rounded-5"
                                  onClick={() => setBookingToCancel(b)}
                                >
                                  <i className="bi bi-x-circle me-1"></i> Cancel
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card>
          </Tab>

          {/* Rooms Status Tab */}
          <Tab eventKey="rooms" title="Rooms Status">
            <Card
              className="p-4 border-0 shadow-sm rounded-4 bg-white"
              style={{ height: "500px" }}
            >
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">Room Status</h5>
              </div>

              {rooms.length === 0 ? (
                <p className="text-center text-muted">No rooms found</p>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Image</th>
                        <th>Room Number</th>
                        <th>Room Type</th>
                        <th>Status</th>
                        <th>Current Guest</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rooms.map((room, index) => (
                        <tr key={index}>
                          <td>
                            {room.image ? (
                              <img
                                src={room.image}
                                alt="Room"
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  objectFit: "cover",
                                  borderRadius: "8px",
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  backgroundColor: "#f1f1f1",
                                  borderRadius: "8px",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  color: "#888",
                                }}
                              >
                                <i className="bi bi-image"></i>
                              </div>
                            )}
                          </td>
                          <td>{room.name}</td>
                          <td>{room.type}</td>
                          <td>
                            <span
                              className={`badge ${
                                room.status === "Available"
                                  ? "bg-success-subtle text-success"
                                  : room.status === "Occupied"
                                  ? "bg-primary-subtle text-primary"
                                  : "bg-warning-subtle text-warning"
                              }`}
                            >
                              {room.status}
                            </span>
                          </td>
                          <td>{room.current_guest || "-"}</td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleEdit(room)}
                              >
                                <i className="bi bi-pencil"></i>
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => setRoomToDelete(room)}
                              >
                                <i className="bi bi-trash"></i>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </Tab>

          {/* Add Room Tab */}
          <Tab eventKey="addroom" title="Add Room">
            <Card className="p-4 border-0 shadow-sm rounded-4 bg-white">
              <h5 className="fw-bold mb-4 text-center">Add New Room</h5>

              <Form
                onSubmit={async (e) => {
                  e.preventDefault();

                  // --- Validation ---
                  if (!formData.name || !formData.type || !formData.price) {
                    toast.error("⚠️ Please fill all required fields!");
                    return;
                  }
                  if (!selectedImage) {
                    toast.error("⚠️ Please upload a room image!");
                    return;
                  }

                  // --- Start Spinner ---
                  setIsAddingRoom(true);

                  // --- Prepare formData with image ---
                  const formDataToSend = new FormData();
                  Object.entries(formData).forEach(([key, value]) => {
                    if (key === "amenities") {
                      formDataToSend.append(key, JSON.stringify(value));
                    } else {
                      formDataToSend.append(key, value);
                    }
                  });
                  formDataToSend.append("image", selectedImage);

                  try {
                    const res = await fetch(
                      "http://localhost:5000/api/rooms/add",
                      {
                        method: "POST",
                        body: formDataToSend,
                      }
                    );
                    const data = await res.json();

                    if (data.success) {
                      toast.success("🎉 Room added successfully!");
                      setFormData({
                        name: "",
                        type: "",
                        guests: "",
                        size: "",
                        price: "",
                        amenities: [],
                        description: "",
                        status: "Available",
                        current_guest: "",
                      });
                      setSelectedImage(null);
                      setImagePreview(null);
                    } else {
                      toast.error("❌ Failed to add room");
                    }
                  } catch (err) {
                    console.error(err);
                    toast.error("⚠️ Server error. Try again later.");
                  } finally {
                    // --- Stop Spinner ---
                    setIsAddingRoom(false);
                  }
                }}
              >
                {/* Room Name */}
                <Form.Group className="mb-3">
                  <Form.Label>Room Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="101"
                    required
                  />
                </Form.Group>

                {/* Room Type */}
                <Form.Group className="mb-3">
                  <Form.Label>Room Type</Form.Label>
                  <Form.Control
                    type="text"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    placeholder="Enter room type (e.g., Deluxe)"
                    required
                  />
                </Form.Group>

                {/* Guests / Size */}
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Guests</Form.Label>
                      <Form.Control
                        type="number"
                        name="guests"
                        value={formData.guests}
                        onChange={handleChange}
                        placeholder="2"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Size (sq ft)</Form.Label>
                      <Form.Control
                        type="number"
                        name="size"
                        value={formData.size}
                        onChange={handleChange}
                        placeholder="300"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Price */}
                <Form.Group className="mb-3">
                  <Form.Label>Price per Night (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="2999"
                    required
                  />
                </Form.Group>

                {/* Amenities */}
                <Form.Group className="mb-3">
                  <Form.Label>Amenities</Form.Label>
                  <div className="d-flex flex-wrap gap-3">
                    {[
                      "WiFi",
                      "TV",
                      "AC",
                      "Mini Bar",
                      "Breakfast",
                      "Sitting Area",
                      "Traditional Decor",
                      "Ganga View",
                      "Room Service",
                      "2 Bedrooms",
                      "Living Area",
                      "Butler Service",
                      "All Meals",
                      "Jacuzzi",
                    ].map((amenity, i) => (
                      <Form.Check
                        key={i}
                        type="checkbox"
                        label={amenity}
                        value={amenity}
                        checked={formData.amenities.includes(amenity)}
                        onChange={handleAmenityChange}
                        className="text-secondary"
                      />
                    ))}
                  </div>
                </Form.Group>

                {/* Description */}
                <Form.Group className="mb-3">
                  <Form.Label>Room Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the room..."
                  />
                </Form.Group>

                {/* ✅ Image Upload + Preview */}
                <Form.Group className="mb-4">
                  <Form.Label>Room Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setSelectedImage(file);
                        setImagePreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                  {imagePreview && (
                    <div className="text-center mt-3">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          width: "200px",
                          height: "150px",
                          objectFit: "cover",
                          borderRadius: "10px",
                          border: "2px solid #f15a24",
                        }}
                      />
                    </div>
                  )}
                </Form.Group>

                {/* Submit */}
                <div className="text-center">
                  <Button
                    type="submit"
                    variant="warning"
                    className="px-5 text-white fw-semibold d-flex align-items-center justify-content-center mx-auto"
                    style={{
                      backgroundColor: "#f15a24",
                      border: "none",
                      minWidth: "160px",
                    }}
                    disabled={isAddingRoom}
                  >
                    {isAddingRoom ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Adding...
                      </>
                    ) : (
                      "Add Room"
                    )}
                  </Button>
                </div>
              </Form>
            </Card>
          </Tab>
        </Tabs>

        {/* Edit Room Modal */}
        {editRoom && (
          <Modal
            show={true}
            onHide={() => setEditRoom(null)}
            centered
            size="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title>Edit Room - {editRoom.name}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Form
                onSubmit={async (e) => {
                  e.preventDefault();

                  try {
                    const formDataToSend = new FormData();
                    Object.entries(editRoom).forEach(([key, value]) => {
                      if (key === "amenities")
                        formDataToSend.append(key, JSON.stringify(value));
                      else formDataToSend.append(key, value);
                    });

                    const res = await fetch(
                      `http://localhost:5000/api/rooms/update/${editRoom.id}`,
                      {
                        method: "PUT",
                        body: formDataToSend,
                      }
                    );
                    const data = await res.json();

                    if (data.success) {
                      toast.success("Room updated successfully!");
                      setEditRoom(null);
                      // Reload rooms
                      const refreshed = await fetch(
                        "http://localhost:5000/api/rooms"
                      );
                      const json = await refreshed.json();
                      setRooms(json.data || []);
                    } else {
                      toast.error("Update failed!");
                    }
                  } catch (err) {
                    console.error(err);
                    toast.error("Server error during update");
                  }
                }}
              >
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Room Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={editRoom.name}
                        onChange={(e) =>
                          setEditRoom({ ...editRoom, name: e.target.value })
                        }
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Room Type</Form.Label>
                      <Form.Control
                        type="text"
                        value={editRoom.type}
                        onChange={(e) =>
                          setEditRoom({ ...editRoom, type: e.target.value })
                        }
                        placeholder="Enter room type (e.g., Deluxe)"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Guests</Form.Label>
                      <Form.Control
                        type="number"
                        value={editRoom.guests}
                        onChange={(e) =>
                          setEditRoom({ ...editRoom, guests: e.target.value })
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Price (₹)</Form.Label>
                      <Form.Control
                        type="number"
                        value={editRoom.price}
                        onChange={(e) =>
                          setEditRoom({ ...editRoom, price: e.target.value })
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        value={editRoom.status}
                        onChange={(e) =>
                          setEditRoom({ ...editRoom, status: e.target.value })
                        }
                      >
                        <option>Available</option>
                        <option>Occupied</option>
                        <option>Maintenance</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Current Guest</Form.Label>
                      <Form.Control
                        type="text"
                        value={editRoom.current_guest || ""}
                        onChange={(e) =>
                          setEditRoom({
                            ...editRoom,
                            current_guest: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Description */}
                <Form.Group className="mb-3">
                  <Form.Label>Room Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={editRoom.description || ""}
                    onChange={(e) =>
                      setEditRoom({
                        ...editRoom,
                        description: e.target.value,
                      })
                    }
                    placeholder="Describe the room..."
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Change Image (optional)</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) setEditRoom({ ...editRoom, image: file });
                    }}
                  />
                </Form.Group>

                <div className="text-end">
                  <Button variant="secondary" onClick={() => setEditRoom(null)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="warning"
                    className="ms-2 text-white"
                    style={{ backgroundColor: "#f15a24" }}
                  >
                    Save Changes
                  </Button>
                </div>
              </Form>
            </Modal.Body>
          </Modal>
        )}

        {/* Delete Confirmation Modal */}
        {roomToDelete && (
          <Modal show={true} onHide={() => setRoomToDelete(null)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Confirm Deletion</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
              <i
                className="bi bi-exclamation-triangle text-danger mb-3"
                style={{ fontSize: "3rem" }}
              ></i>
              <h5 className="fw-bold mb-3">
                Are you sure you want to delete room{" "}
                <span className="text-danger">#{roomToDelete.name}</span>?
              </h5>
              <p className="text-muted">
                This action cannot be undone. The room and its image will be
                permanently removed.
              </p>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-center">
              <Button variant="secondary" onClick={() => setRoomToDelete(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={async () => {
                  try {
                    const res = await fetch(
                      `http://localhost:5000/api/rooms/delete/${roomToDelete.id}`,
                      { method: "DELETE" }
                    );
                    const data = await res.json();

                    if (data.success) {
                      toast.success("🗑️ Room deleted successfully!");
                      setRooms((prev) =>
                        prev.filter((room) => room.id !== roomToDelete.id)
                      );
                    } else {
                      toast.error("Failed to delete room");
                    }
                  } catch (err) {
                    console.error("Delete Error:", err);
                    toast.error("Server error while deleting room");
                  } finally {
                    setRoomToDelete(null); // Close modal
                  }
                }}
              >
                Yes, Delete
              </Button>
            </Modal.Footer>
          </Modal>
        )}

        {/* Cancel Booking Modal */}
        {bookingToCancel && (
          <Modal show={true} onHide={() => setBookingToCancel(null)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Cancel Booking</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
              <i
                className="bi bi-exclamation-circle text-danger mb-3"
                style={{ fontSize: "3rem" }}
              ></i>
              <h5 className="fw-bold mb-3">
                Are you sure you want to cancel the booking for{" "}
                <span className="text-danger">{bookingToCancel.full_name}</span>
                ?
              </h5>
              <p className="text-muted">
                This action cannot be undone. The booking will be marked as
                cancelled in the system.
              </p>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-center">
              <Button
                variant="secondary"
                onClick={() => setBookingToCancel(null)}
              >
                Close
              </Button>
              <Button
                variant="danger"
                onClick={async () => {
                  try {
                    const res = await fetch(
                      `http://localhost:5000/api/bookings/cancel/${bookingToCancel.id}`,
                      { method: "PUT" }
                    );
                    const data = await res.json();

                    if (data.success) {
                      toast.success("🚫 Booking cancelled successfully!");
                      setBookings((prev) =>
                        prev.map((b) =>
                          b.id === bookingToCancel.id
                            ? { ...b, booking_status: "Cancelled" }
                            : b
                        )
                      );
                    } else {
                      toast.error("❌ Failed to cancel booking");
                    }
                  } catch (err) {
                    console.error("Cancel Error:", err);
                    toast.error("⚠️ Server error while cancelling booking");
                  } finally {
                    setBookingToCancel(null);
                  }
                }}
              >
                Yes, Cancel
              </Button>
            </Modal.Footer>
          </Modal>
        )}

        {isAddingRoom && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{
              background: "rgba(255,255,255,0.7)",
              zIndex: 2000,
            }}
          >
            <div
              className="spinner-border text-warning"
              role="status"
              style={{ width: "3rem", height: "3rem" }}
            ></div>
          </div>
        )}

        <ToastContainer />
      </Container>
    </div>
  );
};

export default AdminDashboard;
