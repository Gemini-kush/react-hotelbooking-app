import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./css/RoomSection.css";

function RoomsSection() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Fetch rooms from database
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/rooms");
        if (res.data.success && Array.isArray(res.data.data)) {
          setRooms(res.data.data);
        } else {
          console.error("Invalid data format:", res.data);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="py-5" style={{ backgroundColor: "#fff" }}>
      <Container>
        <div className="text-center mb-4">
          <h3 className="fw-bold mb-4">Our Rooms</h3>
          <p className="text-muted mb-5">
            Choose from our selection of comfortable and elegant rooms
          </p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="warning" />
          </div>
        ) : (
          <Row className="justify-content-center">
            {rooms.length > 0 ? (
              rooms.map((room, index) => (
                <Col
                  key={index}
                  md={4}
                  className="mb-4 d-flex justify-content-center"
                >
                  <Card className="room-card border-1 shadow-sm rounded-4">
                    <div className="position-relative">
                      <Card.Img
                        variant="top"
                        src={room.image}
                        alt={room.name || "Room"}
                        className="room-image rounded-top-4"
                        loading="lazy"
                      />
                      <div className="price-badge position-absolute top-0 end-0 m-3 px-3 py-1 rounded-3">
                        ₹{room.price}/night
                      </div>
                    </div>

                    <Card.Body className="text-center">
                      <Card.Title className="fw-semibold">
                        {room.type || "Room"}
                      </Card.Title>
                      <Card.Text className="text-muted mb-2">
                        {room.description ||
                          "Comfortable room with modern amenities"}
                      </Card.Text>
                      <div className="text-warning mb-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <i key={i} className="fa-solid fa-star"></i>
                        ))}
                      </div>
                      <Button
                        className="w-100 rounded-3 border-0"
                        style={{
                          backgroundColor: "#F54900",
                          fontWeight: "500",
                        }}
                        onClick={() => navigate("/booking")}
                      >
                        Book Now
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <p className="text-center text-muted">
                No rooms available at the moment.
              </p>
            )}
          </Row>
        )}
      </Container>
    </div>
  );
}

export default RoomsSection;
