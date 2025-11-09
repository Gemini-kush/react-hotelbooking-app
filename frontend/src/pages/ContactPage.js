import React from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./ContactPage.css";

const ContactPage = () => {
  return (
    <div className="contact-page">
      {/* Top Banner */}
      <section className="contact-banner text-center text-white py-5">
        <h2 className="fw-bold">Contact Us</h2>
        <p className="mb-0">
          We’re here to help you plan your perfect stay in Varanasi
        </p>
      </section>

      {/* Contact Section */}
      <Container className="my-5">
        <Row className="g-4">
          {/* Left Column - Form */}
          <Col lg={8}>
            <Card className="shadow-sm border-0 rounded-4 p-4">
              <h5 className="fw-semibold mb-3">Send us a Message</h5>
              <Form>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Name *</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Your name"
                        className="rounded-3"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        type="tel"
                        placeholder="+91 98765 43210"
                        className="rounded-3"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="your@email.com"
                    className="rounded-3"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Message *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="How can we help you?"
                    className="rounded-3"
                  />
                </Form.Group>

                <Button
                  type="submit"
                  className="w-100 rounded-3 fw-semibold contact-btn"
                >
                  Send Message
                </Button>
              </Form>
            </Card>
          </Col>

          {/* Right Column - Info Cards */}
          <Col lg={4}>
            <Card className="shadow-sm border-0 rounded-4 p-4 mb-3">
              <div className="d-flex align-items-start">
                <div className="icon-box me-3">
                  <i className="bi bi-geo-alt-fill fs-5 text-orange"></i>
                </div>
                <div>
                  <h6 className="fw-semibold mb-1">Address</h6>
                  <p className="mb-0 small">
                    Near Dashashwamedh Ghat <br />
                    Varanasi, Uttar Pradesh <br />
                    PIN - 221001
                  </p>
                </div>
              </div>
            </Card>

            <Card className="shadow-sm border-0 rounded-4 p-4 mb-3">
              <div className="d-flex align-items-start">
                <div className="icon-box me-3">
                  <i className="bi bi-telephone-fill fs-5 text-orange"></i>
                </div>
                <div>
                  <h6 className="fw-semibold mb-1">Phone</h6>
                  <p className="mb-0 small">+91 98765 43210</p>
                  <p className="mb-0 small">+91 98765 43211</p>
                </div>
              </div>
            </Card>

            <Card className="shadow-sm border-0 rounded-4 p-4 mb-3">
              <div className="d-flex align-items-start">
                <div className="icon-box me-3">
                  <i className="bi bi-envelope-fill fs-5 text-orange"></i>
                </div>
                <div>
                  <h6 className="fw-semibold mb-1">Email</h6>
                  <p className="mb-0 small text-break">
                    info@maheshwariniwas.com
                  </p>
                  <p className="mb-0 small text-break">
                    booking@maheshwariniwas.com
                  </p>
                </div>
              </div>
            </Card>

            <Card className="shadow-sm border-0 rounded-4 p-4">
              <div className="d-flex align-items-start">
                <div className="icon-box me-3">
                  <i className="bi bi-clock-fill fs-5 text-orange"></i>
                </div>
                <div>
                  <h6 className="fw-semibold mb-1">Reception Hours</h6>
                  <p className="mb-0 small">24/7 Available</p>
                  <p className="mb-0 small">Check-in: 12:00 PM</p>
                  <p className="mb-0 small">Check-out: 11:00 AM</p>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Static Map Section */}
        {/* Static Map Section */}
        <Row className="mt-5">
          <Col>
            <Card className="shadow-sm border-0 rounded-4 p-4">
              <h5 className="fw-semibold mb-3">Find Us</h5>

              <div className="text-center mb-3">
                <i className="bi bi-geo-alt fs-3 text-secondary mb-2"></i>
                <p className="fw-medium mb-1">
                  Near Dashashwamedh Ghat, Varanasi
                </p>
              </div>

              <div className="map-container rounded-4 overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115408.09799959231!2d82.90870810887782!3d25.32089491860156!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398e2db76febcf4d%3A0x68131710853ff0b5!2sVaranasi%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1762077405303!5m2!1sen!2sin"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Maheshwari Niwas Location Map"
                ></iframe>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ContactPage;
