import React, { useState } from "react";
import { useAuth } from "../context/AuthContext"; // Ensure correct import
import { useNavigate } from "react-router-dom";
import { FaEyeSlash,FaEye } from "react-icons/fa";
import "./Signin.css";

const Signin = () => {
  const { login } = useAuth(); // Get login function from AuthContext
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Default role: user
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  // Handling form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, role);

    if (role === "municipal") {
      navigate("/municipal-dashboard");
    } else if (role === "ngo") {
      navigate("/ngo-dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"} 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          {/* Role Selection */}
          <label>Select Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">Regular User</option>
            <option value="municipal">Municipal Authority</option>
            <option value="ngo">NGO Representative</option>
          </select>

          <button type="submit" className="auth-btn">Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default Signin;