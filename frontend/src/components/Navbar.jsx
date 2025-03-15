import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <h1 className="logo">💧 WaterSave</h1>
        <div className={`nav-links ${isOpen ? "open" : ""}`}>
          <Link to="/">Home</Link>
          <Link to="/techniques">Conservation Techniques</Link>
          <Link to="/register-complaint">Report Complaint</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="auth-buttons">
          <Link to="/signin" className="btn-login">Sign In</Link>
          <Link to="/signup" className="btn-signup">Sign Up</Link>
        </div>

        <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>☰</button>
      </div>
    </nav>
  );
};

export default Navbar;
