import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, setUser, setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav style={navStyle}>
      <div style={logoStyle}>Bidzilla</div>
      <div style={linkContainerStyle}>
        <Link to="/" style={linkStyle}>Home</Link>
        <Link to="/HomePage" style={linkStyle}>Listings</Link>
        {user?.role === "admin" && <Link to="/admin" style={linkStyle}>Admin</Link>}
        {user?.role === "seller" && <Link to="/seller" style={linkStyle}>Seller</Link>}
        {user?.role === "bidder" && (
          <>
            <Link to="/bidder" style={linkStyle}>Bidder</Link>
            <Link to="/my-bids" style={linkStyle}>My Bids</Link>
          </>
        )}
        <button onClick={handleLogout} style={logoutBtnStyle}>Logout</button>
      </div>
    </nav>
  );
};

// Styles remain unchanged
const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 40px",
  backgroundColor: "#0d6efd",
  color: "white",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const logoStyle = {
  fontWeight: "bold",
  fontSize: "1.7rem",
  letterSpacing: "2px",
  cursor: "default",
  userSelect: "none",
  fontStyle: "italic",
  textShadow: "1px 1px 3px rgba(0,0,0,0.3)",
};

const linkContainerStyle = {
  display: "flex",
  gap: "25px",
  alignItems: "center",
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "500",
  fontSize: "1.05rem",
};

const logoutBtnStyle = {
  backgroundColor: "red",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: "5px",
  cursor: "pointer",
};

export default Navbar;
