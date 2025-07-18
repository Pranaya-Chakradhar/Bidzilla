// src/pages/Register.jsx
import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "bidder",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    console.log("Register data being sent:", formData);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", formData);
      setMessage(res.data.message || "Registered successfully!");
      setFormData({ name: "", email: "", password: "", role: "bidder" });
    } catch (err) {
  console.error("Registration error:", err.response?.data || err.message || err);
  setError(err.response?.data?.error || "Registration failed");
}

  };

  return (
    <div style={styles.container}>
      <h2>Register</h2>

      {message && <div style={{ color: "green", marginBottom: "15px" }}>{message}</div>}
      {error && <div style={{ color: "red", marginBottom: "15px" }}>{error}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <select name="role" value={formData.role} onChange={handleChange} style={styles.input}>
          <option value="bidder">Bidder</option>
          <option value="seller">Seller</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit" style={styles.button}>Register</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "40px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    backgroundColor: "#0d6efd",
    color: "white",
    fontWeight: "bold",
    fontSize: "1rem",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default Register;
