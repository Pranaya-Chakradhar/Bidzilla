import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const BidHistoryPage = () => {
  const { token } = useContext(AuthContext);
  const [bids, setBids] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBidHistory = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/bids/my", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch bid history");

        console.log("BIDS RESPONSE:", data);
        setBids(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBidHistory();
  }, [token]);

  return (
    <div style={container}>
      <h2 style={heading}>My Bid History</h2>
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      {bids.length === 0 ? (
        <p style={{ textAlign: "center" }}>You haven't placed any bids yet.</p>
      ) : (
        <div style={grid}>
          {bids.map((bid) => {
            const product = bid.product;

            // Defensive check: if product missing, skip or show placeholder
            if (!product) {
              return (
                <div key={bid._id} style={card}>
                  <h3>Unknown Product</h3>
                  <p><strong>Your Bid:</strong> Rs. {bid.amount}</p>
                  <p><strong>Time:</strong> {new Date(bid.createdAt).toLocaleString()}</p>
                  <p><strong>Current Highest Bid:</strong> Rs. N/A</p>
                  <p><strong>Status:</strong> <span style={statusOutbid}>Product Deleted</span></p>
                </div>
              );
            }

            // Ensure currentBid is number, else fallback to 0
            const currentBid = parseInt(product.currentBid) || 0;

            const isOutbid = bid.amount < currentBid;

            return (
              <div key={bid._id} style={card}>
                {product.image && <img src={product.imageUrl} alt={product.title} style={image} />}
                <div style={info}>
                  <h3>{product.title}</h3>
                  <p><strong>Your Bid:</strong> Rs. {bid.amount}</p>
                  <p><strong>Time:</strong> {new Date(bid.createdAt).toLocaleString()}</p>
                  <p><strong>Current Highest Bid:</strong> Rs. {currentBid || "N/A"}</p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span style={isOutbid ? statusOutbid : statusWinning}>
                      {isOutbid ? "Outbid" : "Winning"}
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Styles here (same as before)

const container = {
  padding: "40px",
  fontFamily: "'Segoe UI', sans-serif",
  backgroundColor: "#f8f9fa",
  minHeight: "100vh",
};

const heading = {
  textAlign: "center",
  marginBottom: "30px",
  fontSize: "2rem",
  color: "#2c3e50",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "20px",
};

const card = {
  backgroundColor: "#fff",
  borderRadius: "10px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  padding: "16px",
  display: "flex",
  flexDirection: "column",
};

const image = {
  width: "100%",
  height: "200px",
  objectFit: "cover",
  borderRadius: "6px",
};

const info = {
  marginTop: "10px",
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

const statusOutbid = {
  color: "#fff",
  backgroundColor: "#e74c3c",
  padding: "4px 10px",
  borderRadius: "12px",
  display: "inline-block",
  fontWeight: "bold",
  fontSize: "0.9rem",
};

const statusWinning = {
  color: "#fff",
  backgroundColor: "#2ecc71",
  padding: "4px 10px",
  borderRadius: "12px",
  display: "inline-block",
  fontWeight: "bold",
  fontSize: "0.9rem",
};

export default BidHistoryPage;
