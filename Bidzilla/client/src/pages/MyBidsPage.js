import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const MyBidsPage = () => {
  const { token } = useContext(AuthContext);
  const [bids, setBids] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyBids = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/bids/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch your bids");
        const data = await res.json();
        setBids(data);
      } catch (err) {
        setError(err.message || "Error fetching bids");
      } finally {
        setLoading(false);
      }
    };

    fetchMyBids();
  }, [token]);

  return (
    <div style={container}>
      <h2 style={heading}>My Bids</h2>
      {loading ? (
        <p>Loading your bids...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : bids.length === 0 ? (
        <p>You haven't placed any bids yet.</p>
      ) : (
        <div style={cardGrid}>
          {bids.map((bid) => (
            <div key={bid._id} style={card}>
              <h3>{bid.listing?.title}</h3>
              <p><strong>Your Bid:</strong> Rs. {bid.amount}</p>
              <p><strong>Current Highest Bid:</strong> Rs. {bid.listing?.currentBid || bid.listing?.startingBid}</p>
              <p><strong>Status:</strong> {
                bid.amount >= (bid.listing?.currentBid || bid.listing?.startingBid)
                  ? "You are leading"
                  : "Outbid"
              }</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Inline styles
const container = {
  padding: "40px",
  backgroundColor: "#f8f9fa",
  minHeight: "100vh",
  fontFamily: "'Segoe UI', sans-serif",
};

const heading = {
  textAlign: "center",
  marginBottom: "30px",
  fontSize: "2rem",
  color: "#343a40",
};

const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "20px",
};

const card = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
};

export default MyBidsPage;
