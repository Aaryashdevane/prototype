import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../context/AuthContext"; // ✅ Correct import

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, login } = useAuth(); // ✅ Using the hook
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload(); // simple reload for logout
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <h1 className="logo">💧 WaterWise</h1>

        <div className={`nav-links ${isOpen ? "open" : ""}`}>
          <Link to="/">Home</Link>
          <Link to="/techniques">Conservation Techniques</Link>
          <Link to="/register-complaint">Report Complaint</Link>
        
        </div>

        <div className="auth-buttons">
          {user ? (
            <div className="profile-container">
              <img
                src="/src/assets/images/profile-icon.png"
                alt="Profile"
                className="profile-icon"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <button onClick={() => navigate("/profile")}>Profile</button>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/signin" className="btn-login">Sign In</Link>
              <Link to="/signup" className="btn-signup">Sign Up</Link>
            </>
          )}
        </div>

        <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>☰</button>
      </div>
    </nav>
  );
};

export default Navbar;
