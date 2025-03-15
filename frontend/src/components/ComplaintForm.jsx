import React, { useState, useEffect } from "react";

const ComplaintForm = () => {
  const [complaint, setComplaint] = useState({
    location: "",
    description: "",
    file: null,
  });

  const [coordinates, setCoordinates] = useState({ lat: "", lon: "" });
  const [loading, setLoading] = useState(false);

  // Function to get user's location
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
          alert("Please enable location access to proceed.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  }, []);

  // Handle file input
  const handleFileChange = (e) => {
    setComplaint({ ...complaint, file: e.target.files[0] });
  };

  // Handle text input
  const handleChange = (e) => {
    setComplaint({ ...complaint, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!complaint.file) {
      alert("Please upload an image or video as proof.");
      return;
    }

    setLoading(true);
    
    const formData = new FormData();
    formData.append("location", complaint.location);
    formData.append("description", complaint.description);
    formData.append("file", complaint.file);

    try {
      const response = await fetch("http://localhost:5000/api/complaints/register", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Complaint Registered:", data);
        alert("Complaint submitted successfully!");
        setComplaint({ location: complaint.location, description: "", file: null });
      } else {
        const errorData = await response.json();
        console.error("Failed to register complaint:", errorData);
        alert("Error submitting complaint: " + (errorData.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while submitting the complaint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="complaint-form-container">
      <h2>📢 Register a Water Wastage Complaint</h2>
      <form onSubmit={handleSubmit} className="complaint-form">
        
        {/* Location (Autofilled) */}
        <label>📍 Your Location (Auto-detected)</label>
        <input type="text" name="location" value={complaint.location} readOnly required />

        {/* Description */}
        <label>✍️ Describe the Issue</label>
        <textarea
          name="description"
          placeholder="Briefly explain the water wastage issue..."
          onChange={handleChange}
          value={complaint.description}
          required
        />

        {/* File Upload */}
        <label>📸 Upload an Image/Video</label>
        <input type="file" accept="image/*,video/*" onChange={handleFileChange} required />

        {/* Submit Button */}
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Complaint"}
        </button>
      </form>
    </div>
  );
};

export default ComplaintForm;
