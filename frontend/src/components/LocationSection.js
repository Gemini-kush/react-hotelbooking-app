import React, { useState, useEffect, useRef } from "react";
import { Container, Button } from "react-bootstrap";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./css//LocationSection.css";

function LocationSection() {
  const [showMap, setShowMap] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setShowMap(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className="py-5 text-center"
      style={{ backgroundColor: "#fffaf6" }}
    >
      <Container>
        <div
          className="d-flex flex-column align-items-center justify-content-center"
          style={{ maxWidth: "700px", margin: "0 auto" }}
        >
          <div
            className="mb-3"
            style={{
              fontSize: "2.5rem",
              color: "#F54900",
            }}
          >
            <i className="fa-solid fa-location-dot"></i>
          </div>

          <h4 className="fw-semibold mb-3">Find Us</h4>
          <p className="text-muted mb-4">
            Near <strong>Dashashwamedh Ghat, Varanasi</strong> <br />
            Visit us in the spiritual heart of the city.
          </p>

          {/* Get Directions Button */}
          <Button
            style={{
              backgroundColor: "#F54900",
              border: "none",
              borderRadius: "10px",
              padding: "10px 25px",
              fontWeight: "500",
            }}
            onClick={() => setShowMap(!showMap)}
          >
            <i className="fa-solid fa-map-location-dot me-2"></i>
            {showMap ? "Hide Map" : "Get Directions"}
          </Button>

          {/* Map container */}
          <div
            className={`map-container mt-4 ${
              showMap ? "map-show" : "map-hide"
            }`}
          >
            <iframe
              title="Maheshwari Nivas Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14530.244188153363!2d83.004346!3d25.308837!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398e2d42747b7f77%3A0xcda8f2f91575b9c3!2sDashashwamedh%20Ghat!5e0!3m2!1sen!2sin!4v1698658099007!5m2!1sen!2sin"
              width="100%"
              height="400"
              style={{ border: 0, borderRadius: "15px" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default LocationSection;
