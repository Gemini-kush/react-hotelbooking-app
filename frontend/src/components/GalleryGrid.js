import React from "react";
import "./css/GalleryGrid.css";
import { motion } from "framer-motion";

const GalleryGrid = ({ images }) => {
  return (
    <div className="gallery-grid container my-5">
      <div className="row g-4">
        {images.map((img, index) => (
          <div key={index} className="col-12 col-sm-6 col-md-4">
            <motion.div
              className="gallery-card position-relative overflow-hidden rounded-4 shadow-sm"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <img
                src={img.url}
                alt={img.category}
                className="img-fluid gallery-image"
                style={{ width: "100%", height: "300px" }}
              />
              <div className="gallery-overlay position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-end p-3">
                <h6 className="text-white fw-bold mb-1">
                  {img.title || "Untitled"}
                </h6>
                <p className="text-warning small mb-0">{img.category}</p>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryGrid;
