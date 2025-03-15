import React from "react";
import ComplaintForm from "../components/ComplaintForm";
import StatusTracker from "../components/StatusTracker";
import "./RegisterComplaint.css";

const RegisterComplaint = () => {
  return (
    <div className="register-complaint">
      {/* Hero Section */}
      <div className="hero-section">
        <h1>🌊 Report Water Wastage</h1>
        <p>Help us conserve water by reporting leaks and wastage.</p>
      </div>

      {/* Complaint Form & Status Tracker */}
      <div className="content-container">
        <div className="form-section">
          <h2>Submit Your Complaint</h2>
          <ComplaintForm />
        </div>
        
        <div className="status-section">
          <h2>Track Your Complaint</h2>
          <StatusTracker />
        </div>
      </div>
    </div>
  );
};

export default RegisterComplaint;
