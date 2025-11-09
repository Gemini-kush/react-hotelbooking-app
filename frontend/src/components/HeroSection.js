import React from "react";
import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // ✨ Add animation support
import "./css/HeroSection.css";

function HeroSection() {
  const navigate = useNavigate();

  return (
    <div className="hero-wrapper">
      {/* Background Image */}
      <img
        src="https://res.cloudinary.com/dynx8bauw/image/upload/v1761815376/heroImage_rtoqhj.jpg"
        alt="Maheshwari Nivas Varanasi"
        className="hero-bg"
        loading="lazy"
      />

      {/* Overlay + Animated Content */}
      <div className="hero-overlay d-flex align-items-center justify-content-center text-center text-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h5 className="fw-bold mb-2 hero-subtitle">महेश्वरी निवास</h5>
            <h1 className="mb-3 hero-title">Maheshwari Nivas</h1>
            <p className="lead mb-4 hero-text">
              Experience the divine essence of Banaras with world-class
              hospitality
            </p>
          </motion.div>

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
          >
            <Button
              variant="danger"
              className="book-now-btn me-3 px-4 py-2 fw-semibold"
              onClick={() => navigate("/booking")}
            >
              <i className="bi bi-calendar-check me-2"></i>Book Now
            </Button>

            <Button
              variant="light"
              className="explore-btn px-4 py-2 fw-semibold"
              onClick={() => navigate("/rooms")}
            >
              Explore Rooms <i className="bi bi-arrow-right-short ms-2"></i>
            </Button>
          </motion.div>
        </Container>
      </div>
    </div>
  );
}

export default HeroSection;
