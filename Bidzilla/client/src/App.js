import React, { useContext } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";

import Admin from "./pages/Admin";
import HomePage from "./pages/HomePage";
import SellerPage from "./pages/SellerPage";
import MyBidsPage from "./pages/MyBidsPage";
import BidderPage from "./pages/BidderPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import { AuthContext } from "./context/AuthContext";
import ProductDetail from "./pages/ProductDetail";
import BidHistoryPage from "./pages/BidHistoryPage.jsx";


function App() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // Determine whether to show navbar
  const hideNavbar = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {/* Show Navbar only if user is logged in and not on login/register page */}
      {!hideNavbar && user && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/HomePage" element={<HomePage />} />
        <Route path="/admin" element={<Admin />} />

        <Route
          path="/seller"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <SellerPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bidder"
          element={
            <ProtectedRoute allowedRoles={["bidder"]}>
              <BidderPage />
            </ProtectedRoute>
          }
        />

        <Route path="/my-bids" element={<MyBidsPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/my-bids" element={<BidHistoryPage />} />

      </Routes>
    </>
  );
}

export default App;
