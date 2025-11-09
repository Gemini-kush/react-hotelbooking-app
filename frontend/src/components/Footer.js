import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./css/Footer.css";

function Footer() {
  return (
    <footer
      className="text-white pt-5 pb-3 mt-5"
      style={{ backgroundColor: "#101828" }}
    >
      <Container>
        <Row className="gy-4">
          {/* --- Left Column --- */}
          <Col md={4}>
            <h6 className="fw-bold mb-3" style={{ color: "#FF501C" }}>
              महेश्वरी निवास
            </h6>
            <h5 className="fw-semibold mb-3">Maheshwari Nivas</h5>
            <p className="text-light small pe-3">
              Experience the spiritual essence of Banaras with modern comfort
              and traditional hospitality.
            </p>
          </Col>

          {/* --- Middle Column --- */}
          <Col md={4}>
            <h6 className="fw-semibold mb-3">Contact Us</h6>

            <div className="d-flex align-items-start mb-2">
              <i
                className="fa-solid fa-location-dot me-2 mt-1"
                style={{ color: "#FF501C" }}
              ></i>
              <p className="mb-2" style={{ fontSize: "15px" }}>
                Near Dashashwamedh Ghat, Varanasi, Uttar Pradesh - 221001
              </p>
            </div>

            <div className="d-flex align-items-start mb-3">
              <i
                className="fa-solid fa-phone me-2 mt-1"
                style={{ color: "#FF501C" }}
              ></i>
              <p className="mb-0" style={{ fontSize: "15px" }}>
                +91 98765 43210
              </p>
            </div>

            <div className="d-flex align-items-start">
              <i
                className="fa-solid fa-envelope me-2 mt-1"
                style={{ color: "#FF501C" }}
              ></i>
              <p className="mb-0" style={{ fontSize: "15px" }}>
                info@maheshwarinivas.com
              </p>
            </div>
          </Col>

          {/* --- Right Column --- */}
          <Col md={4}>
            <h6 className="fw-semibold mb-3">Follow Us</h6>
            <div className="d-flex mb-4">
              <a
                href="#"
                className="text-white me-3 px-2 py-1 fs-5 footer-icon"
                style={{
                  transition: "0.3s",
                  backgroundColor: "#1E2939",
                  borderRadius: "50%",
                }}
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="#"
                className="text-white me-3 px-2 py-1 fs-5 footer-icon"
                style={{
                  transition: "0.3s",
                  backgroundColor: "#1E2939",
                  borderRadius: "50%",
                }}
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="#"
                className="text-white me-3 px-2 py-1 fs-5 footer-icon"
                style={{
                  transition: "0.3s",
                  backgroundColor: "#1E2939",
                  borderRadius: "50%",
                }}
              >
                <i className="fab fa-twitter"></i>
              </a>
            </div>
            <p className="small mb-3">Check-in: 12:00 PM</p>
            <p className="small mb-0">Check-out: 11:00 AM</p>
          </Col>
        </Row>

        <hr className="border-light mt-4 mb-3" />

        <p className="text-center text-secondary small mb-0">
          © 2025 <span style={{ color: "#FF501C" }}>Maheshwari Nivas</span>. All
          Rights Reserved.
        </p>
      </Container>
    </footer>
  );
}

export default Footer;
