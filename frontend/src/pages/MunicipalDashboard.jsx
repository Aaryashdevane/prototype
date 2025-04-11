import React, { useState, useEffect } from "react";
import MapView from "../components/MapView";
import DirectionPopup from "../components/DirectionPopup";
import "./MunicipalDashboard.css";

const MunicipalDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [officerLocation, setOfficerLocation] = useState([18.5204, 73.8567]);

  useEffect(() => {
    fetchComplaints();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setOfficerLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => console.warn("Unable to fetch officer location, using default.", error)
      );
    }
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

  const validateCoordinates = (coords) => {
    if (Array.isArray(coords) && coords.length === 2) {
      const [lat, lon] = coords;
      if (!isNaN(lat) && !isNaN(lon)) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className="municipal-dashboard">
      <h2>🏢 Municipal Complaint Management</h2>
      {loading ? (
        <p>Loading complaints...</p>
      ) : (
        <div className="complaint-container">
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
                <th>Directions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint, index) => {
                let coords = null;
                console.log("Checking complaint:", complaint);

                // Handle coordinates object format
                if (complaint.coordinates) {
                  try {
                    const coordObject = JSON.parse(complaint.coordinates);
                    if (coordObject.lat && coordObject.lon) {
                      coords = [coordObject.lat, coordObject.lon];
                      console.log("Parsed coordinates:", coords);
                    } else {
                      console.warn("Invalid coordinates structure in complaint.coordinates");
                    }
                  } catch (e) {
                    console.error("Error parsing coordinates:", e);
                    coords = null;
                  }
                }

                // Fallback to parsing the location string as coordinates
                if (!coords && complaint.location && complaint.location.includes(",")) {
                  const parts = complaint.location.split(",").map((c) => parseFloat(c.trim()));
                  if (parts.length === 2 && !parts.some((val) => isNaN(val))) {
                    coords = parts;
                    console.log("Parsed location to coordinates:", coords);
                  }
                }

                return (
                  <tr key={complaint._id || index}>
                    <td>{index + 1}</td>
                    <td>{complaint.location || "Not provided"}</td>
                    <td>{complaint.description}</td>
                    <td>{complaint.category}</td>
                    <td>
                      {complaint.image_url && (
                        <img
                          src={complaint.image_url}
                          alt="Complaint"
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
                        onChange={(e) => updateStatus(complaint._id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>
                    <td>
                      {coords ? (
                        <button onClick={() => setSelectedComplaint({ ...complaint, parsedCoords: coords })}>
                          Get Directions
                        </button>
                      ) : (
                        <span style={{ color: "gray", fontSize: "0.9rem" }}>No valid coords</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <MapView complaints={complaints} />

          {selectedComplaint && selectedComplaint.parsedCoords && (
            <DirectionPopup
              from={officerLocation}
              to={selectedComplaint.parsedCoords}
              onClose={() => setSelectedComplaint(null)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default MunicipalDashboard;
