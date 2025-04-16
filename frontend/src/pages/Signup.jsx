import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import "./Signup.css";

import stateData from "../states-and-districts.json";
import districtCoordinates from "../lib/districts"; // Import district coordinates

const SignupUser = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    aadhaar: "",
    address: "",
    pincode: "",
    state: "",
    district: "",
    role: "user",
    municipalCoordinates: null, // Add municipalCoordinates to formData
  });

  const [agreeToPolicy, setAgreeToPolicy] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [districts, setDistricts] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Extract states from the JSON data
  const states = stateData.states.map((stateObj) => stateObj.state);

  useEffect(() => {
    if (formData.state) {
      const selectedStateObj = stateData.states.find(
        (s) => s.state === formData.state
      );
      const stateDistricts = selectedStateObj ? selectedStateObj.districts : [];
      setDistricts(stateDistricts);
    } else {
      setDistricts([]);
    }
  }, [formData.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password" || name === "confirmPassword") {
      setPasswordError("");
    }
  };

  const handleDistrictChange = (e) => {
    const district = e.target.value;

    // Find the coordinates for the selected district
    const selectedDistrict = districtCoordinates.find(
      (d) => d.district === district
    );

    setFormData((prev) => ({
      ...prev,
      district,
      municipalCoordinates: selectedDistrict
        ? { lat: selectedDistrict.lat, lon: selectedDistrict.lon }
        : null, // Set municipalCoordinates if found
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (!agreeToPolicy) {
      alert("You must agree to the password policy to proceed");
      return;
    }

    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        confirmPassword: undefined, // Remove confirmPassword from the payload
      }),
    });

    const data = await res.json();
    if (res.ok) {
      navigate("/signin");
    } else {
      alert(data.message || "Registration failed");
    }
  };

  // console.log("Form data:", formData);
  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>User Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"} // Toggle between text and password
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
          <div className="password-field">
            <input
              type={showConfirmPassword ? "text" : "password"} // Toggle between text and password
              name="confirmPassword"
              placeholder="Re-enter Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
          {passwordError && <div className="error-message">{passwordError}</div>}

          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
            required
          />

          {/* Conditional Rendering Based on Role */}
          {formData.role === "municipal" ? (
            <div className="dropdown-group">
              <label>Select District:</label>
              <select
                name="district"
                value={formData.district}
                onChange={handleDistrictChange}
                required
              >
                <option value="">Select District</option>
                {districtCoordinates.map((district) => (
                  <option key={district.district} value={district.district}>
                    {district.district}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <>
              <input
                type="text"
                name="aadhaar"
                placeholder="Aadhaar Card Number"
                value={formData.aadhaar}
                onChange={handleChange}
                required
              />
              <textarea
                name="address"
                placeholder="Full Address"
                value={formData.address}
                onChange={handleChange}
                required
              />
              <div className="address-details">
                <input
                  type="text"
                  name="pincode"
                  placeholder="Pin Code"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                />

                <div className="dropdown-group">
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>

                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleDistrictChange}
                    disabled={!formData.state}
                    required
                  >
                    <option value="">Select District</option>
                    {districts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          <div className="role-select">
            <label>Select Role:</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="user">Regular User</option>
              <option value="municipal">Municipal Corporation</option>
              <option value="ngo">NGO Representative</option>
            </select>
          </div>

          <div className="policy-check">
            <input
              type="checkbox"
              id="policy"
              checked={agreeToPolicy}
              onChange={(e) => setAgreeToPolicy(e.target.checked)}
              required
            />
            <label htmlFor="policy">
              I accept the terms and agree to use this data accordingly.
            </label>
          </div>

          <button type="submit" className="auth-btn">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupUser;