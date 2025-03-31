import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./ComplaintForm.css";

const ComplaintForm = () => {
  const { user } = useAuth();
  const [complaint, setComplaint] = useState({
    location: "",
    description: "",
    file: null,
  });

  const [coordinates, setCoordinates] = useState({ lat: "", lon: "" });
  const [loading, setLoading] = useState(false);

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
          console.error("Geolocation error:", error);
          alert("⚠️ Location access denied. Please enter manually.");
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
      alert("❌ Please upload an image or video.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("location", complaint.location);
    formData.append("description", complaint.description);
    formData.append("file", complaint.file);
    formData.append("user", user?.email);

    try {
      const response = await fetch("http://localhost:8000/process-image/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        alert(`✅ Complaint submitted!\nCategory: ${data.category}`);
        setComplaint({ location: complaint.location, description: "", file: null });
      } else {
        alert("❌ Failed to submit complaint.");
      }
    } catch (error) {
      alert("⚠️ Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="complaint-form-container">
      <form onSubmit={handleSubmit} className="complaint-form">
        <label>Issue Type:</label>
        <select name="description" value={complaint.description} onChange={handleChange} required>
          <option value="">Select Issue Type</option>
          <option value="Leakage">Leakage</option>
          <option value="Overflow">Overflow</option>
          <option value="Contamination">Contamination</option>
          <option value="Other">Other</option>
        </select>

        <label>Location (Auto or Manual Entry):</label>
        <input
          type="text"
          name="location"
          value={complaint.location}
          onChange={handleChange}
          placeholder="Auto-detected or enter manually"
          required
        />

        <label>Upload Image/Video:</label>
        <input type="file" accept="image/*,video/*" onChange={handleFileChange} required />

        <button type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit"}</button>
      </form>
    </div>
  );
};

export default ComplaintForm;
