import React, { useState } from "react";
import { Container, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import GalleryHero from "../components/GalleryHero";
import GalleryFilters from "../components/GalleryFilters";
import GalleryGrid from "../components/GalleryGrid";
import "./Gallery.css";
import { title } from "framer-motion/client";

function GalleryPage() {
  const categories = [
    "All",
    "Location",
    "Interior",
    "Rooms",
    "Restaurant",
    "Amenities",
  ];

  const allImages = [
    {
      url: "https://res.cloudinary.com/dynx8bauw/image/upload/v1762075729/photo-1681797849305-206966d6a5bf_ua6jp5.jpg",
      title: "Varanasi Ghat",
      category: "Location",
    },
    {
      url: "https://res.cloudinary.com/dynx8bauw/image/upload/v1762075728/photo-1728415496148-974267a622c8_czqogi.jpg",
      title: "Evening Aarti",
      category: "Location",
    },
    {
      url: "https://res.cloudinary.com/dynx8bauw/image/upload/v1761822641/deluxeRoom_ysyd2x.jpg",
      title: "Luxury Suite",
      category: "Rooms",
    },
    {
      url: "https://res.cloudinary.com/dynx8bauw/image/upload/v1762075728/photo-1543539571-2d88da875d21_muuhqi.jpg",
      title: "Fine Dining",
      category: "Restaurant",
    },
    {
      url: "https://res.cloudinary.com/dynx8bauw/image/upload/v1762075729/photo-1743061339900-e40775a80524_rquza9.jpg",
      title: "Elegant Lobby",
      category: "Interior",
    },
    {
      url: "https://res.cloudinary.com/demo/image/upload/v1690975673/pool.jpg",
      title: "Beautiful Pool",
      category: "Amenities",
    },
  ];

  const [filtered, setFiltered] = useState(allImages);

  const handleFilterChange = (category) => {
    if (category === "All") {
      setFiltered(allImages);
    } else {
      setFiltered(allImages.filter((img) => img.category === category));
    }
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <>
      {/* ✅ Hero Section */}
      <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
        <GalleryHero />
      </motion.div>

      {/* ✅ Filters */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={fadeInUp}
        viewport={{ once: true }}
      >
        <GalleryFilters
          categories={categories}
          onFilterChange={handleFilterChange}
        />
      </motion.div>

      {/* ✅ Image Grid */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={fadeInUp}
        viewport={{ once: true }}
      >
        <GalleryGrid images={filtered} />
      </motion.div>

      {/* ✅ Experience the Magic Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={fadeInUp}
        viewport={{ once: true }}
      >
        <Container className="my-5">
          <div className="p-5 bg-white border shadow-sm rounded-4 text-center experience-card">
            <h4 className="mb-3">Experience the Magic</h4>
            <p className="text-muted mb-3">
              Our gallery showcases the perfect blend of traditional Banarasi
              architecture and modern luxury. From our elegantly designed rooms
              to the spiritual ambiance of nearby ghats, every moment at
              Maheshwari Nivas is picture-perfect.
            </p>
            <p className="text-muted mb-0">
              Book your stay today and create your own unforgettable memories in
              the heart of Varanasi.
            </p>
          </div>
        </Container>
      </motion.div>

      {/* ✅ Instagram Follow Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={fadeInUp}
        viewport={{ once: true }}
      >
        <Container className="text-center my-5">
          <h5 className="fw-bold mb-3">Follow Us on Instagram</h5>
          <p className="text-muted mb-4">
            Share your experience with <strong>#MaheshwariNivas</strong> and get
            featured on our page
          </p>
          <Button
            className="instagram-btn px-4 py-3 rounded-pill border-0"
            href="https://instagram.com/maheshwarinivas"
            target="_blank"
          >
            <i class="fa-brands fa-instagram"></i> @maheshwarinivas
          </Button>
        </Container>
      </motion.div>
    </>
  );
}

export default GalleryPage;
