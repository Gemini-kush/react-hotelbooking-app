import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./css/WelcomeSection.css"; // hover styles here

function WelcomeSection() {
  const amenities = [
    { icon: "fa-wifi", title: "Free Wi-Fi" },
    { icon: "fa-mug-hot", title: "Breakfast" },
    { icon: "fa-utensils", title: "Restaurant" },
    { icon: "fa-car-side", title: "Parking" },
  ];

  return (
    <div className="py-5 mb-5" style={{ backgroundColor: "#fff4e6" }}>
      <Container className="text-center">
        <h3 className="fw-bold mb-3">Welcome to Maheshwari Nivas</h3>
        <p className="text-muted mx-auto mb-4" style={{ maxWidth: "650px" }}>
          Located in the heart of Varanasi, Maheshwari Nivas offers a perfect
          blend of traditional Indian hospitality and modern amenities.
          Experience the spiritual city of Banaras from the comfort of our
          well-appointed rooms with stunning views of the holy Ganges.
        </p>

        <Row className="g-3 justify-content-center">
          {amenities.map((item, index) => (
            <Col key={index} xs={6} md={3}>
              <Card className="border-1 rounded-4 amenity-card text-center">
                <Card.Body className="p-3">
                  <div className="icon-container mb-3">
                    <i className={`fa-solid ${item.icon} fs-2 mb-3 mt-3`}></i>
                  </div>
                  <h6 className="fw-semibold">{item.title}</h6>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default WelcomeSection;
