import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import "./Navbar.css";
import { FaUser } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useAuthStore(); // Zustand actions
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">💧 WaterSave</Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          {
            user && user.role === "municipal" ? (
              <Link to="/municipal-dashboard">Municipal Dashboard</Link>
            ) : user && user?.role === "ngo" ? (
              <Link to="/ngo-dashboard">NGO Dashboard</Link>
            ) : null
          }
          <Link to="/techniques">Conservation Techniques</Link>
          <Link to="/register-complaint">Report Complaint</Link>
          <Link to="/subsidy">Subsidy</Link>
        </div>
        <div className="auth-buttons">
          {user ? (
            <div>
              <div className="btn-logout">
                <span><FaUser /></span>
              </div>
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            </div>
          ) : (
            <>
              <Link to="/signin" className="btn-login">Sign In</Link>
              <Link to="/signup" className="btn-signup">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
