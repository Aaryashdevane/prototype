import React, { useState } from "react";

const StatusTracker = () => {
  const [status, setStatus] = useState("Pending");

  return (
    <div className="status-tracker">
      <h3>Complaint Status: {status} 🟡</h3>
    </div>
  );
};

export default StatusTracker;
