// MunicipalDashboard.js
import React, { useState, useEffect } from "react";
import MapView from "../components/MapView";
import "./MunicipalDashboard.css";

const MunicipalDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await fetch("http://localhost:8000/complaints/");
      if (!res.ok) throw new Error("Failed to fetch complaints");

      const data = await res.json();
      setComplaints(data.complaints || []);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:8000/update-status/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      fetchComplaints();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="municipal-dashboard">
      <h2>🏢 Municipal Complaint Management</h2>
      {loading ? (
        <p>Loading complaints...</p>
      ) : (
        <div className="complaint-container">
          {/* Table of complaints */}
          <table className="complaint-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Location</th>
                <th>Description</th>
                <th>Category</th>
                <th>Image</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint, index) => (
                <tr key={complaint._id || index}>
                  <td>{index + 1}</td>
                  <td>{complaint.location || "Not provided"}</td>
                  <td>{complaint.description}</td>
                  <td>{complaint.category}</td>
                  <td>
                    {complaint.image_url && (
                      <img
                        src={complaint.image_url}
                        alt="Complaint Image"
                        style={{ width: "200px", borderRadius: "8px" }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/200?text=Image+Not+Found";
                        }}
                      />
                    )}

                  </td>
                  <td>{complaint.status || "Pending"}</td>
                  <td>
                    <select
                      value={complaint.status || "Pending"}
                      onChange={(e) =>
                        updateStatus(complaint._id, e.target.value)
                      }
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

          {/* Map view to display complaint pins */}
          <MapView complaints={complaints} />
        </div>
      )}
    </div>
  );
};

export default MunicipalDashboard;
