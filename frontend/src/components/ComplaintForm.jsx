import React, { useState, useEffect } from "react";
import { findNearest } from "geolib";
import useAuthStore from "../store/authStore";
import districtCoordinates from "../lib/districts"; // Import district coordinates
import "./ComplaintForm.css";

const getNearestDistrict = (lat, lon) => {
  const nearest = findNearest(
    { latitude: lat, longitude: lon },
    districtCoordinates.map((district) => ({
      latitude: district.lat,
      longitude: district.lon,
      district: district.district,
    }))
  );

  const nearestDistrict = districtCoordinates.find(
    (district) => district.lat === nearest.latitude && district.lon === nearest.longitude
  );

  return nearestDistrict
    ? { district: nearestDistrict.district, coordinates: { lat: nearestDistrict.lat, lon: nearestDistrict.lon } }
    : { district: "Unknown", coordinates: null };
};

const ComplaintForm = () => {
  const loadUser = useAuthStore((state) => state.loadUser);
  const { user } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const [complaint, setComplaint] = useState({
    location: "",
    description: "",
    file: null,
    state: "",
    district: "",
    nearestDistrictCoordinates: null,
  });

  const [coordinates, setCoordinates] = useState({ lat: "", lon: "" });
  const [loading, setLoading] = useState(false);
  const [geoError, setGeoError] = useState("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setCoordinates({ lat, lon });

          // Get the nearest district and its coordinates
          const { district, coordinates } = getNearestDistrict(lat, lon);
          setComplaint((prev) => ({
            ...prev,
            location: `${lat}, ${lon}`,
            district,
            nearestDistrictCoordinates: coordinates, // Store the nearest district's coordinates
          }));
        },
        (error) => {
          console.error("Error fetching location:", error);
          setGeoError("Unable to fetch location. Please try again.");
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
    if (!user) {
      alert("Please Login to register Complaint");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("location", complaint.location);
    formData.append("description", complaint.description);
    formData.append("file", complaint.file);
    formData.append("district", complaint.district);
    formData.append("user", user?.email);
    formData.append("coordinates", JSON.stringify(coordinates));

    // Append nearest district coordinates as an object
    if (complaint.nearestDistrictCoordinates) {
      formData.append(
        "nearestDistrictCoordinates",
        JSON.stringify(complaint.nearestDistrictCoordinates)
      );
    }

    try {
      const response = await fetch("http://localhost:8000/process-image/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        alert(`✅ Complaint submitted!\nCategory: ${data.category}`);
        setComplaint({ location: complaint.location, description: "", file: null, district: "" });
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

        <label>Nearest District:</label>
        <input type="text" name="district" value={complaint.district} readOnly />

        {geoError && (
          <div className="geo-error">
            <p>{geoError}</p>
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
