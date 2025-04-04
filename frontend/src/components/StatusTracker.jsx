import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./StatusTracker.css";

const StatusTracker = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyComplaints = async () => {
      if (!user?.email) return;

      try {
        setLoading(true);
        setError("");

        const res = await fetch(`http://localhost:8000/complaints/user/${user.email}`);

        if (!res.ok) {
          throw new Error("Failed to fetch complaints.");
        }

        const data = await res.json();

        if (!data.complaints || !Array.isArray(data.complaints)) {
          throw new Error("Invalid response format.");
        }
        

        setComplaints(data.complaints);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyComplaints();
  }, [user]);

  return (
    <div className="status-tracker">
      <h2>My Complaints</h2>

      {loading && <p>Loading complaints...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && complaints.length === 0 && <p>No complaints found!</p>}

      <div className="complaint-list">
        {complaints.map((complaint) => (
          <div key={complaint._id} className={`complaint-card ${complaint.status.toLowerCase()}`}>
            {complaint.image_url && (
              <img src={complaint.image_url} alt="Complaint" className="complaint-image" />
            )}
            <p><strong>Description:</strong> {complaint.description}</p>
            <p><strong>Location:</strong> {complaint.location}</p>
            <p><strong>Status:</strong> <span className="status">{complaint.status}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusTracker;
