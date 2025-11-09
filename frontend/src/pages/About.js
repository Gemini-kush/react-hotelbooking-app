// src/pages/About.js
import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "./About.css";

export default function About() {
  return (
    <main>
      {/* HERO */}
      <section className="about-hero text-center d-flex align-items-center">
        <Container>
          <h4 className="hero-title">About Maheshwari Nivas</h4>
          <h5 className="hero-sub">
            Where Ancient Traditions Meet Modern Comfort
          </h5>
        </Container>
      </section>

      {/* OUR STORY */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="align-items-center gy-4">
            <Col lg={6}>
              <h3 className="mb-5">Our Story</h3>
              <p className="lead">
                Maheshwari Nivas was born from a dream to create a sanctuary
                where travelers could experience the spiritual essence of
                Varanasi while enjoying contemporary comforts. Established in
                1995 by the Maheshwari family, our hotel has been a home away
                from home for thousands of guests from around the world.
              </p>
              <p>
                Nestled in the heart of this ancient city, we take pride in
                offering an authentic Banarasi experience. Our property reflects
                the architectural beauty of traditional havelis while
                incorporating modern amenities that today's travelers expect.
              </p>
              <p>
                Over the years we have hosted pilgrims, tourists, business
                travelers, and cultural enthusiasts — each finding their own
                connection to the mystical city of Varanasi through our
                hospitality.
              </p>
            </Col>

            <Col lg={6}>
              <img
                className="img-fluid rounded-3 story-image shadow-sm"
                alt="Maheshwari Nivas - Varanasi"
                src="https://res.cloudinary.com/dynx8bauw/image/upload/v1762070645/aboutStory_aucru0.jpg"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-5 bg-light">
        <Container>
          <h3 className="text-center mb-4">Why Choose Us</h3>
          <p className="text-center text-muted mb-5">
            Discover what makes Maheshwari Nivas the perfect choice for your
            stay in Varanasi
          </p>

          <Row className="g-4">
            {[
              {
                title: "Traditional Hospitality",
                text: "Experience the warmth of Banarasi hospitality blended with modern comfort.",
                icon: "fa-heart",
              },
              {
                title: "Prime Location",
                text: "Located near Dashashwamedh Ghat, in the heart of spiritual Varanasi.",
                icon: "fa-map-pin",
              },
              {
                title: "Award Winning",
                text: "Recognized for excellence in service and authentic cultural experience.",
                icon: "fa-award",
              },
              {
                title: "Premium Amenities",
                text: "Modern facilities with traditional architectural elements.",
                icon: "fa-star",
              },
            ].map((c, i) => (
              <Col md={6} lg={3} key={i}>
                <Card className="text-center h-100 feature-card">
                  <div className="feature-icon mx-auto">
                    <i className={`fa ${c.icon} fa-lg`} />
                  </div>
                  <Card.Body>
                    <Card.Title className="mb-2">{c.title}</Card.Title>
                    <Card.Text className="text-muted small">{c.text}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* OUR VALUES */}
      <section className="py-5 bg-light">
        <Container>
          <div className="bg-white p-4 mb-5 values-card shadow-sm">
            <h5 className="text-center mb-4">Our Values</h5>
            <p className="text-center text-muted mb-5">
              The principles that guide everything we do
            </p>
            <Row className="text-center g-4">
              {[
                {
                  num: "1",
                  title: "Heritage",
                  text: "Preserving the rich cultural heritage of Varanasi in every aspect of our service",
                },
                {
                  num: "2",
                  title: "Excellence",
                  text: "Committed to providing exceptional service and memorable experiences",
                },
                {
                  num: "3",
                  title: "Authenticity",
                  text: "Offering genuine Banarasi culture and traditions to our guests",
                },
                {
                  num: "4",
                  title: "Sustainability",
                  text: "Environmentally conscious practices while maintaining luxury standards",
                },
              ].map((v, i) => (
                <Col md={3} key={i}>
                  <div className="value-item">
                    <div className="value-badge">{v.num}</div>
                    <h6 className="mt-3">{v.title}</h6>
                    <p className="small text-muted">{v.text}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </div>

          {/* LOCATION + GUEST SERVICES */}
          <Row className="g-4">
            <Col md={6}>
              <div className="bg-white rounded-4 border p-4 h-100">
                <h5 className="mb-3">
                  <i className="fa fa-map-pin me-2 text-orange" />
                  Our Location
                </h5>
                <p>
                  Maheshwari Nivas is strategically located in the heart of
                  Varanasi, just minutes away from Dashashwamedh Ghat and Kashi
                  Vishwanath Temple.
                </p>
                <ul className="list-unstyled text-muted mb-0">
                  <li>
                    <i className="fa fa-map-marker text-orange me-2" /> Near
                    Dashashwamedh Ghat, Varanasi, Uttar Pradesh 221001
                  </li>
                  <li className="mt-2">
                    <i className="fa fa-phone text-orange me-2" /> +91 98765
                    43210
                  </li>
                  <li className="mt-2">
                    <i className="fa fa-envelope text-orange me-2" />{" "}
                    info@maheshwarinivas.com
                  </li>
                </ul>
              </div>
            </Col>

            <Col md={6}>
              <div className="bg-white rounded-4 border p-4 h-100">
                <h5 className="mb-3">
                  <i className="fa fa-concierge-bell me-2 text-orange" />
                  Guest Services
                </h5>
                <div className="service-row">
                  <div>Check-in:</div>
                  <div className="text-muted">2:00 PM</div>
                </div>
                <div className="service-row">
                  <div>Check-out:</div>
                  <div className="text-muted">12:00 PM</div>
                </div>
                <div className="service-row">
                  <div>Reception:</div>
                  <div className="text-muted">24/7 Available</div>
                </div>
                <div className="service-row">
                  <div>Restaurant:</div>
                  <div className="text-muted">6:00 AM - 11:00 PM</div>
                </div>
                <div className="service-row">
                  <div>Room Service:</div>
                  <div className="text-muted">24/7 Available</div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* TEAM */}
      <section className="py-5 bg-light">
        <Container>
          <h3 className="text-center mb-4">Meet Our Team</h3>
          <p className="text-center text-muted mb-5">
            Dedicated professionals committed to your comfort
          </p>

          <Row className="g-4">
            {[
              {
                name: "Rajesh Maheshwari",
                role: "Founder & Managing Director",
                desc: "With 25+ years in hospitality, bringing vision to life",
                img: "https://res.cloudinary.com/dynx8bauw/image/upload/v1762071969/Rajesh_rhfo3a.jpg",
              },
              {
                name: "Priya Sharma",
                role: "General Manager",
                desc: "Expert in luxury hotel operations and guest relations",
                img: "https://res.cloudinary.com/dynx8bauw/image/upload/v1762071968/Priya_avnmuw.jpg",
              },
              {
                name: "Amit Verma",
                role: "Head Chef",
                desc: "Master of traditional Banarasi and contemporary cuisine",
                img: "https://res.cloudinary.com/dynx8bauw/image/upload/v1762071968/Amit_khb0ho.jpg",
              },
            ].map((t, i) => (
              <Col md={4} key={i}>
                <Card className="text-center team-card h-100 p-3">
                  <div
                    className="team-photo mx-auto mb-4"
                    style={{ backgroundImage: `url(${t.img})` }}
                  />
                  <p className="mb-3 fw-semibold">{t.name}</p>
                  <p className="text-orange mb-3">{t.role}</p>
                  <p className="text-muted mb-3">{t.desc}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* AWARDS */}
      <section className="py-5 bg-light">
        <Container>
          <div className="awards-card p-4 text-center">
            <p className="mb-5">Awards & Recognition</p>
            <Row className="g-4">
              <Col md={4}>
                <div className="award-item">
                  <div className="award-icon mb-3">
                    <i className="fa fa-certificate" />
                  </div>
                  <h6 className="mb-3">Best Heritage Hotel</h6>
                  <p className="small text-muted">Tourism Award 2023</p>
                </div>
              </Col>
              <Col md={4}>
                <div className="award-item">
                  <div className="award-icon mb-3">
                    <i className="fa fa-star" />
                  </div>
                  <h6 className="mb-3">4.8/5 Rating</h6>
                  <p className="small text-muted">Based on 2000+ reviews</p>
                </div>
              </Col>
              <Col md={4}>
                <div className="award-item">
                  <div className="award-icon mb-3">
                    <i className="fa fa-heart" />
                  </div>
                  <h6 className="mb-3">Guest Favorite</h6>
                  <p className="small text-muted">Trip Advisor 2024</p>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </section>
    </main>
  );
}
