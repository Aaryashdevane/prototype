import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./StatusTracker.css";

const StatusTracker = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchMyComplaints = async () => {
      const res = await fetch(`http://localhost:5000/api/complaints/user/${user?.email}`);
      const data = await res.json();
      setComplaints(data);
    };

    if (user) fetchMyComplaints();
  }, [user]);

  return (
    <div className="status-tracker">
    
      {complaints.length === 0 ? (
        <p>No complaints found!</p>
      ) : (
        <div className="complaint-list">
          {complaints.map((complaint) => (
            <div key={complaint._id} className="complaint-card">
              <p><strong>Description:</strong> {complaint.description}</p>
              <p><strong>Location:</strong> {complaint.location}</p>
              <p><strong>Status:</strong> {complaint.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusTracker;
