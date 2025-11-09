import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Rooms.css";

const Rooms = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch rooms from backend
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/rooms");
        if (res.data.success && Array.isArray(res.data.data)) {
          const allRooms = res.data.data;

          // ✅ Group rooms by their type (e.g., Deluxe, Standard, etc.)
          const grouped = {};
          allRooms.forEach((room) => {
            if (!grouped[room.type]) grouped[room.type] = room;
          });

          // ✅ Only keep one per type
          setRooms(Object.values(grouped));
        } else {
          console.error("Unexpected API response:", res.data);
        }
      } catch (error) {
        console.error("❌ Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // ✅ Icon Mapper for Amenities
  const getAmenityIcon = (amenity) => {
    if (!amenity) return null;
    switch (amenity.toLowerCase()) {
      case "wifi":
        return <i className="fa-solid fa-wifi me-1 text-orange"></i>;
      case "tv":
        return <i className="fa-solid fa-tv me-1 text-orange"></i>;
      case "ac":
        return <i className="fa-regular fa-snowflake me-1 text-orange"></i>;
      case "breakfast":
        return <i className="fa-solid fa-mug-saucer me-1 text-orange"></i>;
      case "mini bar":
        return <i className="fa-solid fa-wine-glass me-1 text-orange"></i>;
      case "sitting area":
        return <i className="fa-solid fa-couch me-1 text-orange"></i>;
      default:
        return <i className="fa-solid fa-circle-check me-1 text-orange"></i>;
    }
  };

  // ✅ Handle redirect to booking page
  const handleBooking = (room) => {
    navigate("/booking", {
      state: {
        selectedRoom: room.title,
        price: room.price,
        guests: room.guests,
        image: room.img,
        desc: room.desc,
      },
    });
  };

  return (
    <section>
      {/* Header Section */}
      <div
        className="text-center py-5 text-white"
        style={{ backgroundColor: "#E54C19" }}
      >
        <h2 className="fw-bold">Our Rooms & Suites</h2>
        <p>
          Choose from our range of comfortable and luxurious accommodations.
        </p>
      </div>

      {/* Rooms Section */}
      <Container className="my-5">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="warning" />
          </div>
        ) : (
          <Row className="g-4">
            {rooms.map((room, index) => {
              // safely parse amenities (stringified JSON in DB)
              let amenities = [];
              try {
                amenities = Array.isArray(room.amenities)
                  ? room.amenities
                  : JSON.parse(room.amenities || "[]");
              } catch {
                amenities = [];
              }

              return (
                <Col md={4} key={index}>
                  <Card className="shadow-sm h-100 bm border-0 rounded-4 overflow-hidden">
                    <div className="position-relative mb-3">
                      <Card.Img
                        variant="top"
                        src={room.image}
                        alt={room.type}
                        loading="lazy"
                        style={{ height: "220px", objectFit: "cover" }}
                      />
                      {/* Price Tag */}
                      <div
                        className="position-absolute top-0 end-0 d-flex align-items-center rounded-2"
                        style={{
                          background: "#fff",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                          padding: "4px 10px",
                          margin: "8px",
                        }}
                      >
                        <span
                          style={{
                            color: "#E54C19",
                            fontWeight: "600",
                            marginRight: "2px",
                          }}
                        >
                          ₹{room.price}
                        </span>
                        <span
                          style={{
                            color: "#666",
                            fontSize: "0.85rem",
                          }}
                        >
                          /night
                        </span>
                      </div>
                    </div>

                    <Card.Body>
                      <Card.Title className="mb-3">{room.type}</Card.Title>
                      <p className="text-muted mb-3">
                        👥 {room.guests} Guests &nbsp; | &nbsp; 📐 {room.size}{" "}
                        sq ft
                      </p>
                      <Card.Text className="small mb-3">
                        {room.description ||
                          "Spacious room with modern amenities and elegant interiors for a comfortable stay."}
                      </Card.Text>
                      <p className="fw-semibold mb-2">Amenities:</p>
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        {Array.isArray(amenities) && amenities.length > 0 ? (
                          amenities.map((a, i) => (
                            <span
                              key={i}
                              className="badge bg-light text-dark border border-secondary"
                            >
                              {getAmenityIcon(a)}
                              {a}
                            </span>
                          ))
                        ) : (
                          <span className="text-muted small">
                            No amenities listed
                          </span>
                        )}
                      </div>

                      <Button
                        onClick={() =>
                          navigate("/booking", {
                            state: { roomId: room.id }, // ✅ send only ID
                          })
                        }
                        variant="dark"
                        className="w-100 fw-semibold book-btn"
                        style={{ backgroundColor: "#E54C19", border: "none" }}
                      >
                        Book This Room
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Container>
    </section>
  );
};

export default Rooms;
