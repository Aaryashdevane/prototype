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
  const [geoError, setGeoError] = useState("");

  // Reverse geocoding to fetch human-readable address using Nominatim
  const fetchAddress = async (lat, lon) => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1&zoom=18&email=your-email@example.com`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Reverse geocoding failed");
      const data = await res.json();
      return data.display_name || "";
    } catch (error) {
      console.error("Error in reverse geocoding:", error);
      return "";
    }
  };

  // Request user's location and then fetch the corresponding address
  // In ComplaintForm.jsx
useEffect(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setCoordinates({ lat, lon });
        // Call your reverse geocoding (as before) to get the full address
        const address = await fetchAddress(lat, lon);
        setComplaint((prev) => ({
          ...prev,
          location: address || `${lat}, ${lon}`,
        }));
      },
      (error) => { /* handle error */ }
    );
  }
}, []);


  // useEffect(() => {
  //   fetchLocation();
  // }, []);

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

    // Prepare form data with human-readable address and raw coordinates.
    const formData = new FormData();
    formData.append("location", complaint.location);
    formData.append("description", complaint.description);
    formData.append("file", complaint.file);
    formData.append("user", user?.email);
    // Send coordinates as a JSON string (or you could use separate fields)
    formData.append("coordinates", JSON.stringify(coordinates));

    try {
      const response = await fetch("http://localhost:8000/process-image/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        alert(`✅ Complaint submitted!\nCategory: ${data.category}`);
        // Reset while keeping the auto-populated location
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
          placeholder="Auto-detected address or enter manually"
          required
        />

        {geoError && (
          <div className="geo-error">
            <p>{geoError}</p>
            <button type="button" onClick={fetchLocation}>
              Try Again
            </button>
          </div>
        )}

        <label>Upload Image/Video:</label>
        <input type="file" accept="image/*,video/*" onChange={handleFileChange} required />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default ComplaintForm;
