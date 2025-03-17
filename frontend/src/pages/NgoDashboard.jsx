import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./NgoDashboard.css"

const NgoDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role !== "ngo") {
      navigate("/signin");
    }
  }, [user, navigate]);

  if (!user) {
    return <p>Loading...</p>; // Optional: Add loader or skeleton UI
  }

  return (
    <div className="ngo-dashboard-container">
      <h1>👥 Welcome to NGO Dashboard</h1>
      <p>Hello {user.email}, you are logged in as an NGO.</p>
      <div className="ngo-actions">
        <button>View Conservation Projects</button>
        <button>Collaborate with Municipal</button>
        <button>Submit New Project</button>
      </div>
    </div>
  );
  
};

export default NgoDashboard;
