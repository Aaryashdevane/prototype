  import React, { useState } from "react";
  import { useAuth } from "../context/AuthContext"; // Ensure correct import
  import { useNavigate } from "react-router-dom";

  import "./Auth.css"
  console.log("Signin Page Loaded!");  // Check if this appears in Console

  const Signin = () => {
    const { login } = useAuth(); // Get login function from AuthContext
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user"); // Default role: user

    const handleSubmit = (e) => {
      e.preventDefault();
      login(email, role);

      if (role === "municipal") {
        navigate("/municipal-dashboard"); // Redirect municipal users
      } else {
        navigate("/dashboard"); // Redirect normal users
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
            
            {/* Role Selection */}
            <label>Select Role:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">Regular User</option>
              <option value="municipal">Municipal Authority</option>
            </select>

            <button type="submit" className="auth-btn">Sign In</button>
          </form>
        </div>
      </div>
    );
  };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
    
  //   try {
  //     const res = await fetch("http://localhost:5000/api/auth/login", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email, password })
  //     });

  //     const data = await res.json();
      
  //     if (res.ok) {
  //       login(data.user.email, data.user.role); // Set user in context
  //       navigate(data.user.role === "municipal" ? "/municipal-dashboard" : "/dashboard");
  //     } else {
  //       alert(data.message || "Login failed");
  //     }
  //   } catch (error) {
  //     console.error("Login error:", error);
  //   }
  // };


  export default Signin;
