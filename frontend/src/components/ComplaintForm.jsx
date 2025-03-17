import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // Import AuthContext hook
import "./ComplaintForm.css";

const ComplaintForm = () => {
  const { user } = useAuth(); // Get logged-in user info
  const [complaint, setComplaint] = useState({
    location: "",
    description: "",
    file: null,
  });

  const [coordinates, setCoordinates] = useState({ lat: "", lon: "" });
  const [loading, setLoading] = useState(false);

  // Get user's geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setCoordinates({ lat, lon });
          setComplaint((prev) => ({
            ...prev,
            location: `${lat}, ${lon}`,
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Please enable location access.");
        }
      );
    }
  }, []);

  const handleFileChange = (e) => {
    setComplaint({ ...complaint, file: e.target.files[0] });
  };

  const handleChange = (e) => {
    setComplaint({ ...complaint, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!complaint.file) {
      alert("Please upload an image or video.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("location", complaint.location);
    formData.append("description", complaint.description);
    formData.append("file", complaint.file);
    formData.append("user", user?.email); // ✅ Pass user email or ID here

    try {
      const response = await fetch("http://localhost:5000/api/complaints/register", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Complaint submitted successfully!");
        setComplaint({ location: complaint.location, description: "", file: null });
      } else {
        alert("Failed to submit complaint.");
      }
    } catch (error) {
      alert("An error occurred while submitting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="complaint-form-container">
      <form onSubmit={handleSubmit} className="complaint-form">
        {/* Issue Type */}
        <label>Issue Type:</label>
        <select name="description" value={complaint.description} onChange={handleChange} required>
          <option value="">Select Issue Type</option>
          <option value="Leakage">Leakage</option>
          <option value="Overflow">Overflow</option>
          <option value="Contamination">Contamination</option>
          <option value="Other">Other</option>
        </select>

        {/* Location */}
        <label>Specific Location:</label>
        <input
          type="text"
          name="location"
          value={complaint.location}
          placeholder="Auto-detected location"
          readOnly
          required
        />

        {/* File Upload */}
        <label>Upload relevant images (Optional):</label>
        <div className="upload-container">
          <input type="file" accept="image/*,video/*" onChange={handleFileChange} />
        </div>

        {/* Submit */}
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default ComplaintForm;
