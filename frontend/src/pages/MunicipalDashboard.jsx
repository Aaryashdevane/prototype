import React, { useState } from "react";
import "./MunicipalDashboard.css";

const dummyComplaints = [
  { id: 1, location: "New York", issue: "Water leakage", status: "Pending" },
  { id: 2, location: "Los Angeles", issue: "Contaminated water", status: "Resolved" },
  { id: 3, location: "Chicago", issue: "No water supply", status: "In Progress" },
];

const MunicipalDashboard = () => {
  const [complaints, setComplaints] = useState(dummyComplaints);

  const updateStatus = (id, newStatus) => {
    setComplaints((prev) =>
      prev.map((complaint) =>
        complaint.id === id ? { ...complaint, status: newStatus } : complaint
      )
    );
  };

  return (
    <div className="municipal-dashboard">
      <h2>Municipal Complaint Management</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Location</th>
            <th>Issue</th>
            <th>Status</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((complaint) => (
            <tr key={complaint.id}>
              <td>{complaint.id}</td>
              <td>{complaint.location}</td>
              <td>{complaint.issue}</td>
              <td>{complaint.status}</td>
              <td>
                <select
                  value={complaint.status}
                  onChange={(e) => updateStatus(complaint.id, e.target.value)}
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
