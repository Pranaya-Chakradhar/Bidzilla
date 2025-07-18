// src/components/AdminBids.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const AdminBids = () => {
  const { token } = useContext(AuthContext);
  const [bids, setBids] = useState([]);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const res = await axios.get("/api/admin/bids", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBids(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBids();
  }, [token]);

  const handleDelete = async (bidId) => {
    try {
      await axios.delete(`/api/admin/bids/${bidId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBids((prev) => prev.filter((b) => b._id !== bidId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h3>All Bids</h3>
      {bids.length === 0 ? (
        <p>No bids found</p>
      ) : (
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>Bidder</th>
              <th>Product</th>
              <th>Amount (Rs)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bids.map((b) => (
              <tr key={b._id}>
                <td>{b.bidder?.name}</td>
                <td>{b.product?.title}</td>
                <td>{b.amount}</td>
                <td>
                  <button onClick={() => handleDelete(b._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminBids;
