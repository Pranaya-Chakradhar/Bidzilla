// SellerPage.js
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";


const SellerPage = () => {
  const { token } = useContext(AuthContext);
  console.log("Auth token:", token);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newListing, setNewListing] = useState({
    title: "",
    description: "",
    category: "",
    startingBid: "",
    image: "",
  });
  const [editListing, setEditListing] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal open/close handlers
  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);
  const openEditModal = (listing) => {
    setEditListing(listing);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setEditListing(null);
    setIsEditModalOpen(false);
  };

  // Fetch listings
  const fetchListings = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/listings/mine", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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

  // Add Listing form handlers
  const handleAddInputChange = (e) => {
    setNewListing({ ...newListing, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newListing),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to add listing");
      }
      setNewListing({
        title: "",
        description: "",
        category: "",
        startingBid: "",
        image: "",
      });
      closeAddModal();
      fetchListings();
    } catch (err) {
      setError(err.message);
    }
  };

  // Edit Listing form handlers
  const handleEditInputChange = (e) => {
    setEditListing({ ...editListing, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`http://localhost:5000/api/listings/${editListing._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editListing),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update listing");
      }
      closeEditModal();
      fetchListings();
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete listing handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    setError("");
    try {
      const res = await fetch(`http://localhost:5000/api/listings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Delete failed");
      }
      fetchListings();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={container}>
      <h2 style={heading}>Seller Dashboard</h2>

      <div style={buttonBar}>
        <button style={addBtn} onClick={openAddModal}>
          + Add New Listing
        </button>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3>Add New Listing</h3>
            <button style={closeBtn} onClick={closeAddModal}>
              ×
            </button>
            <form onSubmit={handleAddSubmit} style={formStyle}>
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={newListing.title}
                onChange={handleAddInputChange}
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={newListing.description}
                onChange={handleAddInputChange}
                required
                rows={3}
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={newListing.category}
                onChange={handleAddInputChange}
                required
              />
              <input
                type="number"
                name="startingBid"
                placeholder="Starting Bid (number only)"
                value={newListing.startingBid}
                onChange={handleAddInputChange}
                required
                min="0"
              />
              <input
                type="url"
                name="image"
                placeholder="Image URL"
                value={newListing.image}
                onChange={handleAddInputChange}
                required
              />
              <button type="submit" style={submitBtn}>
                Add Listing
              </button>
            </form>
            {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editListing && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3>Edit Listing</h3>
            <button style={closeBtn} onClick={closeEditModal}>
              ×
            </button>
            <form onSubmit={handleEditSubmit} style={formStyle}>
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={editListing.title}
                onChange={handleEditInputChange}
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={editListing.description}
                onChange={handleEditInputChange}
                required
                rows={3}
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={editListing.category}
                onChange={handleEditInputChange}
                required
              />
              <input
                type="number"
                name="startingBid"
                placeholder="Starting Bid (number only)"
                value={editListing.startingBid}
                onChange={handleEditInputChange}
                required
                min="0"
              />
              <input
                type="url"
                name="image"
                placeholder="Image URL"
                value={editListing.image}
                onChange={handleEditInputChange}
                required
              />
              <button type="submit" style={submitBtn}>
                Update Listing
              </button>
            </form>
            {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
          </div>
        </div>
      )}

      {/* Listing Cards */}
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
                <div style={buttonRow}>
  <Link to={`/product/${item._id}`}>
    <button style={viewBtn}>View Details</button>
  </Link>
  <button style={editBtn} onClick={() => openEditModal(item)}>
    Edit
  </button>
  <button style={deleteBtn} onClick={() => handleDelete(item._id)}>
    Delete
  </button>
</div>

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
const buttonBar = {
  display: "flex",
  justifyContent: "flex-end",
  marginBottom: "20px",
};
const addBtn = {
  padding: "10px 18px",
  backgroundColor: "#198754",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  fontWeight: "bold",
  fontSize: "0.95rem",
  cursor: "pointer",
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
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
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
};
const image = {
  width: "100%",
  height: "200px",
  objectFit: "cover",
  transition: "transform 0.3s ease",
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
const buttonRow = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
  marginTop: "12px",
};
const editBtn = {
  padding: "6px 12px",
  backgroundColor: "#0d6efd",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};
const deleteBtn = {
  padding: "6px 12px",
  backgroundColor: "#dc3545",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};
const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};
const modalContent = {
  backgroundColor: "#fff",
  padding: "30px",
  borderRadius: "10px",
  width: "400px",
  position: "relative",
  boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
};
const closeBtn = {
  position: "absolute",
  top: "15px",
  right: "15px",
  background: "none",
  border: "none",
  fontSize: "1.2rem",
  cursor: "pointer",
  fontWeight: "bold",
};
const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  marginTop: "15px",
};
const submitBtn = {
  padding: "10px 15px",
  backgroundColor: "#198754",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "1rem",
};
const viewBtn = {
  padding: "6px 12px",
  backgroundColor: "#6c757d",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};



export default SellerPage;