import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "bidder" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Registered successfully. Please login.");
        navigate("/login");
      } else {
        setMessage(data.message || "Registration failed.");
      }
    } catch (err) {
      setMessage("Something went wrong.");
    }
  };

  return (
    <div style={containerStyle}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <select name="role" onChange={handleChange} value={form.role}>
          <option value="bidder">Bidder</option>
          <option value="seller">Seller</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Register</button>
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

export default Register;
