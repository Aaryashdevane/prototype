import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ConservationTechniques.css";

import techniquesData from "../data/techniques_full.json";
import gov_schemes from "../data/gov_schemes.json";
import gov_projects from "../data/gov_projects.json";

const ConservationTechniques = () => {
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [socialPosts, setSocialPosts] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState(8); // Number of posts to show initially
  const [activeTab, setActiveTab] = useState("social"); // Track active tab

  // Fetch posts from backend
  useEffect(() => {
    axios.get("http://localhost:8000/posts") // Ensure FastAPI is running
      .then((response) => {
        setSocialPosts(response.data.posts); // ✅ Access the `posts` key from the response
      })
      .catch((error) => {
        console.error("❌ Error fetching posts:", error);
      });
  }, []);

  // Function to load more posts
  const loadMorePosts = () => {
    setVisiblePosts((prevVisiblePosts) => prevVisiblePosts + 8); // Show 8 more posts
  };

  return (
    <div className="techniques-container">
      <h2>Water Conservation Hub 🌍</h2>

      {/* Navigation Tabs */}
      <div className="tabs-container">
        <button
          className={`tab-button ${activeTab === "social" ? "active" : ""}`}
          onClick={() => setActiveTab("social")}
        >
          Social Media Techniques
        </button>
        <button
          className={`tab-button ${activeTab === "conservation" ? "active" : ""}`}
          onClick={() => setActiveTab("conservation")}
        >
          Conservation Techniques
        </button>
        <button
          className={`tab-button ${activeTab === "schemes" ? "active" : ""}`}
          onClick={() => setActiveTab("schemes")}
        >
          Government Schemes
        </button>
        <button
          className={`tab-button ${activeTab === "projects" ? "active" : ""}`}
          onClick={() => setActiveTab("projects")}
        >
          Government Projects
        </button>
      </div>

      {/* Render Content Based on Active Tab */}
      {activeTab === "social" && (
        <>
          {/* Social Media Techniques */}
          <h3>🌐 Techniques from Social Media</h3>
          <div className="social-grid">
            {socialPosts.slice(0, visiblePosts).map((post, index) => (
              <div key={index} className="social-card">
                {/* Render image if type is "Image" or "Sidecar" */}
                {(post.type === "Image" || post.type === "Sidecar") && post.media && (
                  <img src={post.media} alt={post.caption} className="social-media-image" />
                )}
                {/* Render video if type is "Video" */}
                {post.type === "Video" && post.media && (
                  <video width="100%" height="200" controls>
                    <source src={post.media} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
                {/* Render fallback for other types */}
                {post.type !== "Image" && post.type !== "Video" && post.type !== "Sidecar" && (
                  <p>Unsupported media type: {post.type}</p>
                )}

                {/* Caption with line clipping */}
                <div className="caption-container">
                  <p className="caption">
                    {post.caption.length > 300
                      ? `${post.caption.substring(0, 300)}...`
                      : post.caption}
                  </p>
                  {post.caption.length > 300 && (
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="see-more"
                    >
                      See More
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Show More Button */}
          {visiblePosts < socialPosts.length && (
            <button className="show-more-button" onClick={loadMorePosts}>
              Show More
            </button>
          )}
        </>
      )}

      {activeTab === "conservation" && (
        <>
          {/* Conservation Techniques */}
          <h3>🔧 Conservation Techniques</h3>
          <div className="techniques-grid">
            {techniquesData.map((technique) => (
              <div
                key={technique.id}
                className="technique-card"
                onClick={() => setSelectedTechnique(technique)}
              >
                <img src={technique.image} alt={technique.name} />
                <h4>{technique.name}</h4>
                <p>{technique.purpose}</p>
              </div>
            ))}
          </div>

          {/* Modal for Technique Details */}
          {selectedTechnique && (
            <div className="technique-modal">
              <div className="modal-content">
                <h2>{selectedTechnique.name}</h2>
                <p>{selectedTechnique.description}</p>
                <h4>Benefits:</h4>
                <ul>
                  {selectedTechnique.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
                <h4>Associated NGO:</h4>
                <p>{selectedTechnique.ngo}</p>
                <button onClick={() => setSelectedTechnique(null)}>Close</button>
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === "schemes" && (
        <>
          {/* Government Schemes */}
          <h3>🏛️ Government Schemes</h3>
          <div className="gov-section">
            {gov_schemes.map((scheme) => (
              <div key={scheme.id} className="gov-card">
                <h4>{scheme.name}</h4>
                <p>{scheme.objective}</p>
                <ul>
                  {scheme.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
                <p><strong>Eligibility:</strong> {scheme.eligibility}</p>
                <a href={scheme.link} target="_blank" rel="noopener noreferrer">More Info</a>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === "projects" && (
        <>
          {/* Government Projects */}
          <h3>🏗️ Government Projects</h3>
          <div className="gov-section">
            {gov_projects.map((project) => (
              <div key={project.id} className="gov-card">
                <h4>{project.name}</h4>
                <p><strong>Region:</strong> {project.region}</p>
                <p>{project.goal}</p>
                <p><strong>Budget:</strong> {project.budget}</p>
                <p><strong>Status:</strong> {project.status}</p>
                <a href={project.link} target="_blank" rel="noopener noreferrer">More Info</a>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ConservationTechniques;
