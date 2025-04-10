import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import stateData from "../../states-and-districts.json";
import "./Auth.css";

const SignupMunicipal = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    address: "",
    state: "",
    district: "",
    role: "municipal",
  });

  const [districts, setDistricts] = useState([]);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const selected = stateData.states.find(s => s.state === formData.state);
    setDistricts(selected ? selected.districts : []);
  }, [formData.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === "password" || name === "confirmPassword") {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, confirmPassword: undefined }),
    });

    const data = await res.json();
    if (res.ok) {
      login(formData.role);
      navigate("/signin");
    } else {
      alert(data.message || "Registration failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Municipal Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Corporation Name" required />
          <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="Official Email" required />
          <input name="password" value={formData.password} onChange={handleChange} type="password" placeholder="Password" required />
          <input name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} type="password" placeholder="Re-enter Password" required />
          {passwordError && <div className="error-message">{passwordError}</div>}
          <input name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Contact Number" required />
          <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Office Address" required />

          <select name="state" value={formData.state} onChange={handleChange} required>
            <option value="">Select State</option>
            {stateData.states.map(s => (
              <option key={s.state} value={s.state}>{s.state}</option>
            ))}
          </select>

          <select name="district" value={formData.district} onChange={handleChange} required disabled={!formData.state}>
            <option value="">Select District</option>
            {districts.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <button type="submit" className="auth-btn">Register</button>
        </form>
      </div>
    </div>
  );
};

export default SignupMunicipal;
