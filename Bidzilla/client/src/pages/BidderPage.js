import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const BidderPage = () => {
  const { token } = useContext(AuthContext);
  const [listings, setListings] = useState([]);
  const [bids, setBids] = useState({});
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchListings = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/listings");
      const data = await res.json();
      setListings(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch listings");
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleInputChange = (listingId, value) => {
    setBids({ ...bids, [listingId]: value });
  };

  const handleBidSubmit = async (listing) => {
    setError("");
    setMessage("");

    const listingId = listing._id;
    const bidAmount = parseFloat(bids[listingId]);
    const minNextBid = (listing.currentBid || listing.startingBid) + 10;

    if (isNaN(bidAmount)) {
      return setError("Invalid bid amount.");
    }

    if (bidAmount < minNextBid) {
      return setError(`Minimum bid must be at least Rs. ${minNextBid}`);
    }

    try {
      const res = await fetch(`http://localhost:5000/api/listings/bid/${listingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bidAmount }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to place bid");

      setMessage(data.message || "Bid placed successfully!");
      setBids({ ...bids, [listingId]: "" });
      fetchListings();
    } catch (err) {
      setError(err.message);
    }
  };

  const getTimeRemaining = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = Math.max(0, end - now);
    const minutes = Math.floor(diff / 60000);
    return minutes <= 0 ? "Bidding Ended" : `${minutes} minute(s) left`;
  };

  return (
    <div style={container}>
      <h2 style={heading}>Available Listings</h2>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      {message && <p style={{ color: "green", textAlign: "center" }}>{message}</p>}

      <div style={cardGrid}>
        {listings.map((item) => {
          const isExpired = new Date(item.endTime) < new Date();
          const minNextBid = (item.currentBid || item.startingBid) + 10;

          return (
            <div key={item._id} style={card}>
              <img src={item.image} alt={item.title} style={image} />
              <div style={cardContent}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <p>
                  <strong>Current Bid:</strong> Rs. {item.currentBid || item.startingBid}
                </p>
                <p>
                  <strong>Ends in:</strong> {getTimeRemaining(item.endTime)}
                </p>

                {!isExpired ? (
                  <>
                    <input
                      type="number"
                      placeholder={`Min Rs. ${minNextBid}`}
                      value={bids[item._id] || ""}
                      onChange={(e) => handleInputChange(item._id, e.target.value)}
                      style={input}
                    />
                    <button onClick={() => handleBidSubmit(item)} style={button}>
                      Place Bid
                    </button>
                  </>
                ) : (
                  <p style={{ color: "red", fontWeight: "bold" }}>Bidding Ended</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
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
  textAlign: "center",
  marginBottom: "30px",
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
  padding: "16px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};
const image = {
  width: "100%",
  height: "200px",
  objectFit: "cover",
  borderRadius: "6px",
};
const cardContent = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};
const input = {
  padding: "8px",
  fontSize: "1rem",
  borderRadius: "6px",
  border: "1px solid #ccc",
};
const button = {
  padding: "10px",
  backgroundColor: "#0d6efd",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  fontWeight: "bold",
  cursor: "pointer",
};

export default BidderPage;
