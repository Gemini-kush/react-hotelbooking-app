import React from "react";
import { Container } from "react-bootstrap";
import "../pages/Gallery.css";

function GalleryHero() {
  return (
    <section className="gallery-hero d-flex flex-column justify-content-center align-items-center text-center text-white">
      <Container>
        <h2 className="fw-bold mb-3">Gallery</h2>
        <p className="lead">
          Explore the beauty of Maheshwari Nivas and the enchanting city of
          Varanasi
        </p>
      </Container>
    </section>
  );
}

export default GalleryHero;
