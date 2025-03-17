import React, { useState, useEffect } from "react";
import "./MunicipalDashboard.css";

const MunicipalDashboard = () => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/complaints/all");
      const data = await res.json();
      setComplaints(data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/complaints/update-status/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchComplaints(); // Refresh the list
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="municipal-dashboard">
      <h2>🏢 Municipal Complaint Management</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Location</th>
            <th>Description</th>
            <th>Status</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((complaint, index) => (
            <tr key={complaint._id}>
              <td>{index + 1}</td>
              <td>{complaint.location}</td>
              <td>{complaint.description}</td>
              <td>{complaint.status}</td>
              <td>
                <select
                  value={complaint.status}
                  onChange={(e) => updateStatus(complaint._id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MunicipalDashboard;
