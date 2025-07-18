import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={{ padding: "40px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      {/* Hero Section */}
      <section style={{ textAlign: "center", marginBottom: "60px" }}>
        <h1 style={{ fontSize: "3rem", marginBottom: "10px" }}>Bid Smart. Win Big.</h1>
        <p style={{ fontSize: "1.2rem", color: "#555" }}>
          Auction your electronics, automobiles & furniture at the best price.
        </p>
        <div style={{ marginTop: "30px" }}>
          <Link to="/login">
            <button style={ctaStyle}>Login</button>
          </Link>
          <Link to="/register">
            <button style={{ ...ctaStyle, backgroundColor: "#20c997" }}>Register</button>
          </Link>
        </div>
      </section>

      {/* Category Section */}
      <section style={{ display: "flex", justifyContent: "space-around", marginBottom: "60px" }}>
        {categories.map((cat) => (
          <div key={cat.title} style={categoryCard}>
            <div style={{ fontSize: "2rem" }}>{cat.icon}</div>
            <h3>{cat.title}</h3>
            <p>{cat.description}</p>
          </div>
        ))}
      </section>

      {/* How it Works Section */}
      <section>
        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>How It Works</h2>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {steps.map((step) => (
            <div key={step.title} style={categoryCard}>
              <div style={{ fontSize: "2rem" }}>{step.icon}</div>
              <h4>{step.title}</h4>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const ctaStyle = {
  padding: "10px 25px",
  fontSize: "1rem",
  margin: "0 10px",
  border: "none",
  borderRadius: "5px",
  backgroundColor: "#0d6efd",
  color: "white",
  cursor: "pointer",
};

const categoryCard = {
  padding: "20px",
  border: "1px solid #ccc",
  borderRadius: "10px",
  width: "250px",
  textAlign: "center",
  backgroundColor: "#f9f9f9",
};

const categories = [
  {
    icon: "🚗",
    title: "Automobiles",
    description: "Find used cars, bikes & more at great deals.",
  },
  {
    icon: "🔌",
    title: "Electronics",
    description: "Bid on gadgets, appliances & devices.",
  },
  {
    icon: "🛋️",
    title: "Furniture",
    description: "Buy or sell beds, sofas, chairs, and more.",
  },
];

const steps = [
  {
    icon: "📝",
    title: "1. Register",
    description: "Create your account as a bidder or seller.",
  },
  {
    icon: "💸",
    title: "2. Bid",
    description: "Browse listings & place your bids easily.",
  },
  {
    icon: "🏆",
    title: "3. Win & Buy",
    description: "Highest bid wins — complete your purchase!",
  },
];

export default Home;
