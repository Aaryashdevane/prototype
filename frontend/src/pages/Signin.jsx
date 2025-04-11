// ======== Updated Signin.jsx =========
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const Signin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        login(data.user.email, data.user.role);
        if (data.user.role === "municipal") {
          navigate("/municipal-dashboard");
        } else if (data.user.role === "ngo") {
          navigate("/ngo-dashboard");
        } else {
          navigate("/");
        }
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
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
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

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
