// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";  // Adjust path if needed

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);  // Get login function from context

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      console.log("Response status:", res.status);
      console.log("Response data:", data);

      if (res.ok) {
        // Update auth context with user and token
        login(data.user, data.token);

        setMessage("Login successful!");

        // Redirect based on role
        if (data.user?.role === "admin") {
          navigate("/admin");
        } else if (data.user?.role === "seller") {
          navigate("/seller");
        } else if (data.user?.role === "bidder") {
          navigate("/bidder");
        } else {
          setMessage("Unknown user role.");
        }
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong.");
    }
  };

  return (
    <div style={containerStyle}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={form.email}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={form.password}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

const containerStyle = {
  maxWidth: "400px",
  margin: "40px auto",
  padding: "20px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  backgroundColor: "#f7f7f7",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

export default Login;
