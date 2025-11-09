import React, { useState } from "react";
import { Form, Button, Card, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify"; // ✅ Import Toast
import "react-toastify/dist/ReactToastify.css";
import "./AdminLogin.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Login successful!", {
          position: "bottom-right",
          autoClose: 2000,
          theme: "light",
        });
        setTimeout(() => navigate("/admin/dashboard"), 2000);
      } else {
        toast.error(data.message || "Invalid username or password", {
          position: "bottom-right",
          autoClose: 3000,
          theme: "light",
        });
      }
    } catch (error) {
      toast.error("Server error, please try again later", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "light",
      });
      console.error("Login Error:", error);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 shadow-sm rounded-4" style={{ width: "400px" }}>
        <div className="text-center mb-3">
          <i className="bi bi-lock fs-1 text-orange"></i>
          <h5 className="fw-bold mt-2">Admin Login</h5>
          <p className="text-muted small">
            Enter your credentials to access the admin panel
          </p>
        </div>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              placeholder="admin"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="••••••"
              required
            />
          </Form.Group>

          <Button
            type="submit"
            variant="warning"
            className="w-100 text-white fw-bold"
            style={{ backgroundColor: "#f15a24", border: "none" }}
          >
            Login
          </Button>
        </Form>

        <p className="text-center mt-3 small text-muted">
          Demo credentials: <b>admin / admin123</b>
        </p>
      </Card>

      {/* ✅ Toast Container for showing notifications */}
      <ToastContainer />
    </Container>
  );
};

export default AdminLogin;
