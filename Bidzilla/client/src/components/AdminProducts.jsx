// src/components/AdminProducts.jsx
import React, { useEffect, useState } from "react";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/listings");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      console.log("Fetched products:", data);
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/products/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to delete product");
      fetchProducts();
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h2>All Products</h2>

      {loading && <p>Loading products...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && products.length === 0 && <p>No products found.</p>}

      {!loading && !error && products.length > 0 && (
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Starting Price</th>
              <th>Current Price</th>
              <th>End Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>{p.title}</td>
                <td>{p.description}</td>
                <td>Rs. {p.startingBid}</td>
                <td>Rs. {p.currentPrice || "-"}</td>
                <td>{new Date(p.endTime).toLocaleString()}</td>
                <td>
                  <button
                    onClick={() => handleDeleteProduct(p._id)}
                    style={{
                      backgroundColor: "#dc3545",
                      border: "none",
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
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

export default AdminProducts;
