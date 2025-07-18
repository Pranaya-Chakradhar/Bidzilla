import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const ProductDetail = () => {
  const { id } = useParams();
  const { user, token } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("black");

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/listings/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error("Error fetching product", err);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleBid = async () => {
    if (!token) {
      setMessage("You must be logged in to bid.");
      setMessageColor("red");
      return;
    }

    if (
      !bidAmount ||
      isNaN(bidAmount) ||
      Number(bidAmount) <= (product.currentBid || product.startingBid)
    ) {
      setMessage("Bid must be higher than current bid.");
      setMessageColor("red");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:5000/api/listings/bid/${id}`,
        {
          bidAmount: Number(bidAmount),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("✅ Bid placed successfully!");
      setMessageColor("green");
      setBidAmount("");
      fetchProduct(); // Refresh product to show new highest bid
    } catch (err) {
      setMessage(err.response?.data?.message || "Bid failed.");
      setMessageColor("red");
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div style={container}>
      <h2>{product.title}</h2>
      <p><strong>Description:</strong> {product.description}</p>
      <p><strong>Starting Price:</strong> Rs {product.startingBid}</p>
      <p><strong>Highest Bid:</strong> Rs {product.currentBid || "No bids yet"}</p>
      <p><strong>Seller:</strong> {product.seller?.name || "N/A"}</p>

      {user?.role === "bidder" && (
        <>
          <h3>Place Your Bid</h3>
          <input
            type="number"
            placeholder="Enter bid amount"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            style={inputStyle}
          />
          <button onClick={handleBid} style={btnStyle}>Submit Bid</button>
          {message && <p style={{ color: messageColor, marginTop: "10px" }}>{message}</p>}
        </>
      )}
    </div>
  );
};

const container = {
  padding: "30px",
  fontFamily: "Segoe UI",
  maxWidth: "600px",
  margin: "auto",
};

const inputStyle = {
  padding: "10px",
  width: "100%",
  marginBottom: "10px",
  fontSize: "1rem",
};

const btnStyle = {
  padding: "10px 20px",
  backgroundColor: "#0d6efd",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

export default ProductDetail;
