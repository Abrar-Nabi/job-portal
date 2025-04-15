import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { saveToken } from "../../utils/auth";
import "../../styles/AuthForm.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      const { token, role, name, email } = res.data;
      saveToken(token, role, name, email);
      
      // Redirect based on role
      if (role === "seeker") navigate("/home");
      else if (role === "employer") navigate("/employer/dashboard");
      else if (role === "admin") navigate("/admin/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
      
      <p style={{ marginTop: "1rem", textAlign: "center" }}>
        Don't have an account? <a href="/register">Register here</a>
      </p>
    </div>
  );
};

export default Login;
