import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./ConservationTechniques.css";

const ConservationTechniques = () => {
  return (
    <div className="techniques-container">
      <h2>Water Conservation Hub 🌍</h2>

      {/* Navigation Tabs */}
      <div className="tabs-container">
        <NavLink
          to="/techniques/social"
          className={({ isActive }) => (isActive ? "tab-button active" : "tab-button")}
        >
          Social Media Techniques
        </NavLink>
        <NavLink
          to="/techniques/schemes"
          className={({ isActive }) => (isActive ? "tab-button active" : "tab-button")}
        >
          Government Schemes/Projects
        </NavLink>
      </div>

      {/* Render child routes */}
      <Outlet />
    </div>
  );
};

export default ConservationTechniques;