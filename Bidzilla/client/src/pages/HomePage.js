import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchListings = async () => {
    setLoading(true);
    setError("");
    try {
   const res = await fetch("http://localhost:5000/api/listings");

      if (!res.ok) throw new Error("Failed to fetch listings");
      const data = await res.json();
      setListings(data);
    } catch (err) {
      setError(err.message || "Error fetching listings");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <div style={container}>
      <h2 style={heading}>Available Listings</h2>
      {loading ? (
        <p>Loading listings...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : listings.length === 0 ? (
        <p>No listings found.</p>
      ) : (
        <div style={cardGrid}>
          {listings.map((item) => (
            <div key={item._id} style={card}>
              <img src={item.image} alt={item.title} style={image} />
              <div style={cardContent}>
                <h3 style={title}>{item.title}</h3>
                <p style={desc}>{item.description}</p>
                <div style={meta}>
                  <span>
                    <strong>Category:</strong> {item.category}
                  </span>
                  <span style={bid}>
                    Current Bid: <strong>Rs. {item.currentBid || item.startingBid}</strong>
                  </span>
                </div>
                <Link to={`/product/${item._id}`}>
                  <button style={viewBtn}>View / Bid Now</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Styles
const container = {
  padding: "40px",
  fontFamily: "'Segoe UI', sans-serif",
  backgroundColor: "#f1f4f9",
  minHeight: "100vh",
};
const heading = {
  marginBottom: "30px",
  textAlign: "center",
  fontSize: "2rem",
  color: "#2c3e50",
};
const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "25px",
};
const card = {
  backgroundColor: "#fff",
  borderRadius: "10px",
  boxShadow: "0 8px 18px rgba(0,0,0,0.12)",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
};
const image = {
  width: "100%",
  height: "200px",
  objectFit: "cover",
};
const cardContent = {
  padding: "16px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};
const title = {
  fontSize: "1.2rem",
  marginBottom: "4px",
  color: "#333",
};
const desc = {
  fontSize: "0.95rem",
  color: "#555",
};
const meta = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: "0.9rem",
  marginTop: "8px",
  color: "#555",
};
const bid = {
  backgroundColor: "#fff3cd",
  padding: "3px 8px",
  borderRadius: "6px",
  color: "#856404",
  fontWeight: "500",
};
const viewBtn = {
  marginTop: "12px",
  padding: "8px 12px",
  backgroundColor: "#0d6efd",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  fontWeight: "bold",
  cursor: "pointer",
};

export default HomePage;
