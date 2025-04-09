import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import stateData from "../states-and-districts.json";

const Signup = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    address: "",
    aadhaar: "",
    pincode: "",
    state: "",
    district: "",
    role: "user",
  });
  
  const [agreeToPolicy, setAgreeToPolicy] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [districts, setDistricts] = useState([]);

  // Extract states from the JSON data
  const states = stateData.states.map(stateObj => stateObj.state);

  // Get districts for selected state
  useEffect(() => {
    if (formData.state) {
      const selectedStateObj = stateData.states.find(s => s.state === formData.state);
      const stateDistricts = selectedStateObj ? selectedStateObj.districts : [];
      setDistricts(stateDistricts);
    } else {
      setDistricts([]);
    }
  }, [formData.state]);

 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === "password" || name === "confirmPassword") {
      setPasswordError("");
    }
  };

  const handleStateChange = (e) => {
    const state = e.target.value;
    setFormData(prev => ({ ...prev, state, district: ""}));
  };

  const handleDistrictChange = (e) => {
    const district = e.target.value;
    setFormData(prev => ({ ...prev, district}));
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

    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        confirmPassword: undefined
      }),
    });

    const data = await response.json();
    if (response.ok) {
      login(formData.role);
      navigate("/signin");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Sign Up</h2>
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
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Re-enter Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {passwordError && <div className="error-message">{passwordError}</div>}
          
          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
            required
          />
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
                onChange={handleStateChange}
                required
              >
                <option value="">Select State</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
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
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>
          </div>

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
            Sign Up
          </button>
        </form>
        <p>
          Already have an account? <a href="/signin">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;