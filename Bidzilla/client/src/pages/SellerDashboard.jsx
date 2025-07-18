import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const SellerDashboard = () => {
  const { token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/products/seller", {
        headers: authHeaders,
      });
      if (!res.ok) throw new Error("Failed to fetch your products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      if (!res.ok) throw new Error("Failed to delete product");
      fetchProducts(); // refresh list
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Products</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {products.length === 0 ? (
        <p>No products found. You can add some!</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Starting Price</th>
              <th>Current Price</th>
              <th>End Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>{p.title}</td>
                <td>{p.description}</td>
                <td>Rs. {p.startingPrice}</td>
                <td>Rs. {p.currentPrice || "-"}</td>
                <td>{new Date(p.endTime).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleDeleteProduct(p._id)} style={btnStyleDelete}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const btnStyleDelete = {
  backgroundColor: "#dc3545",
  border: "none",
  color: "white",
  padding: "6px 12px",
  borderRadius: "4px",
  cursor: "pointer",
};

export default SellerDashboard;
