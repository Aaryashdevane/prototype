import React from "react";
import "./ComplaintStatusList.css";

const ComplaintStatusList = ({ complaints }) => {
  const statusIcons = {
    Pending: "🟡",
    "In Progress": "🟠",
    Resolved: "🟢",
  };

  return (
    <div className="complaint-status-list">
      {complaints.length === 0 ? (
        <p>No complaints registered yet.</p>
      ) : (
        complaints.map((complaint, index) => (
          <div key={index} className="complaint-card">
            <h4>{complaint.description}</h4>
            <p>Location: {complaint.location}</p>
            <p>Status: {complaint.status} {statusIcons[complaint.status]}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ComplaintStatusList;
