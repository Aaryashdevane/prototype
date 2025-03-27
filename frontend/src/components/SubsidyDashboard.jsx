import React, { useEffect, useState } from "react";
import "./SubsidyDashboard.css";
import axios from "axios";

const SubsidyDashboard = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    axios
      .get("/subsidy-requests")
      .then((res) => setRequests(res.data))
      .catch((error) => console.error("Error fetching requests:", error));
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`/update-subsidy/${id}`, { status });
      setRequests((prev) =>
        prev.map((req) => (req._id === id ? { ...req, status } : req))
      );
    } catch (error) {
      console.error("Error updating subsidy status:", error);
    }
  };

  return (
    <div>
      <h2>Government Subsidy Requests</h2>
      {requests.map((req) => (
        <div key={req._id}>
          <p>{req.name} - {req.status}</p>
          <a href={`/${req.document}`} target="_blank" rel="noopener noreferrer">
            View Document
          </a>
          {req.status === "pending" && (
            <>
              <button onClick={() => handleStatusChange(req._id, "approved")}>Approve</button>
              <button onClick={() => handleStatusChange(req._id, "rejected")}>Reject</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default SubsidyDashboard;
