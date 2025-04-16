import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./SocialPosts.css";

const SocialPosts = () => {
    return (
        <div className="techniques-container">
            <h3>🌐 Techniques from Social Media</h3>

            {/* Navigation Tabs */}
            <div className="tabs-container">
                <NavLink
                    to="/techniques/social/twitter"
                    className={({ isActive }) => (isActive ? "tab-button active" : "tab-button")}
                >
                    Twitter Tweets
                </NavLink>
                <NavLink
                    to="/techniques/social/insta"
                    className={({ isActive }) => (isActive ? "tab-button active" : "tab-button")}
                >
                    Instagram Posts
                </NavLink>
            </div>

            {/* Render child routes */}
            <Outlet />
        </div>
    );
};

export default SocialPosts;
