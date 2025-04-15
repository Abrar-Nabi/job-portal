import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/Resgister.css"; // optional if you want to style the toggle

const Register = () => {
  const [role, setRole] = useState("seeker");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    location: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = role === "seeker" ? "/register/seeker" : "/register/employer";
      const data =
        role === "seeker"
          ? {
              name: formData.name,
              email: formData.email,
              password: formData.password,
            }
          : {
              companyName: formData.companyName,
              email: formData.email,
              password: formData.password,
              location: formData.location,
            };

      await axios.post(`http://localhost:5000/api/auth${endpoint}`, data);
      alert("Registered successfully");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>

      {/* Role Switch */}
      <div className="role-switch">
        <button
          type="button"
          onClick={() => setRole("seeker")}
          className={role === "seeker" ? "active" : ""}
        >
          Job Seeker
        </button>
        <button
          type="button"
          onClick={() => setRole("employer")}
          className={role === "employer" ? "active" : ""}
        >
          Employer
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {role === "seeker" ? (
          <>
            <input
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </>
        ) : (
          <>
            <input
              name="companyName"
              placeholder="Company Name"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
            <input
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </>
        )}

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Register</button>
      </form>

      <p style={{ marginTop: "1rem", textAlign: "center" }}>
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
};

export default Register;
