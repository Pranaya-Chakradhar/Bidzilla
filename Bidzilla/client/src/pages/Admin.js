import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AdminBids from "../components/AdminBids";
import AdminUsers from "../components/AdminUsers";
import AdminProducts from "../components/AdminProducts";

const Admin = () => {
  const { token } = useContext(AuthContext);

  const [stats, setStats] = useState({ userCount: 0, productCount: 0, bidCount: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("stats"); // tabs: stats, users, products, bids

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // Fetch Admin Dashboard stats
  const fetchStats = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/admin/stats", { headers: authHeaders });
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <h1>Admin Dashboard</h1>

      {/* Tab Navigation */}
      <nav style={{ marginBottom: 20 }}>
        {["stats", "users", "products", "bids"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              marginRight: 10,
              padding: "8px 16px",
              backgroundColor: activeTab === tab ? "#0d6efd" : "#eee",
              color: activeTab === tab ? "white" : "black",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Stats Tab */}
      {activeTab === "stats" && !loading && (
        <div>
          <p><strong>Total Users:</strong> {stats.userCount}</p>
          <p><strong>Total Products:</strong> {stats.productCount}</p>
          <p><strong>Total Bids:</strong> {stats.bidCount}</p>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && <AdminUsers token={token} />}

      {/* Products Tab */}
      {activeTab === "products" && !loading && <AdminProducts token={token} />}

      {/* Bids Tab */}
      {activeTab === "bids" && !loading && <AdminBids token={token} />}
    </div>
  );
};

export default Admin;
