import React from "react";
import ComplaintForm from "../components/ComplaintForm";
import StatusTracker from "../components/StatusTracker";
import "./RegisterComplaint.css";

const RegisterComplaint = () => {
  return (
    <div className="register-complaint">
      {/* Hero */}
      <div className="hero-section">
        <h1>🌊 Report Water-Related Issue</h1>
        <p>Help conserve water by reporting leaks and wastage in your area.</p>
      </div>

      <div className="content-container">
  <div className="section">
    <h2>📝 Register Complaint</h2>
    <ComplaintForm />
  </div>

  <div className="section">
    <h2>📋 See Your Complaint Status</h2>
    <StatusTracker />
  </div>
</div>

    </div>
  );
};

export default RegisterComplaint;
