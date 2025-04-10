import React, { useState } from "react";
import SignupUser from "./SignupUser";
import SignupMunicipal from "./SignupMunicipal";
import SignupNGO from "./SignupNGO";
import "./Auth.css";

const SignupSelector = () => {
  const [role, setRole] = useState("");

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
  };

  if (role === "user") return <SignupUser />;
  if (role === "municipal") return <SignupMunicipal />;
  if (role === "ngo") return <SignupNGO />;

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Select Account Type</h2>
        <div className="role-selection-buttons">
          <button className="auth-btn" onClick={() => handleRoleSelect("user")}>
            👤 Regular User
          </button>
          <button className="auth-btn" onClick={() => handleRoleSelect("municipal")}>
            🏢 Municipal Corporation
          </button>
          <button className="auth-btn" onClick={() => handleRoleSelect("ngo")}>
            👐 NGO Representative
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupSelector;
