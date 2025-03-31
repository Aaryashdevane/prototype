import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ConservationTechniques.css";

import techniquesData from "../data/techniques_full.json";
import gov_schemes from "../data/gov_schemes.json";
import gov_projects from "../data/gov_projects.json";

const ConservationTechniques = () => {
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [socialPosts, setSocialPosts] = useState([]);

  // Fetch posts from backend
  useEffect(() => {
    axios.get("http://localhost:8000/posts") // Ensure FastAPI is running
      .then((response) => {
        setSocialPosts(response.data);  // ✅ FIXED: API returns a list directly
      })
      .catch((error) => {
        console.error("❌ Error fetching posts:", error);
      });
  }, []);

  // Filter for conservation techniques
  const filteredTechniques = techniquesData.filter((tech) =>
    tech.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="techniques-container">
      <h2>Water Conservation Hub 🌍</h2>

      {/* Search Section */}
      <div className="filter-container">
        <input
          type="text"
          placeholder="🔍 Search techniques..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Conservation Techniques */}
      <h3>🔧 Conservation Techniques</h3>
      <div className="techniques-grid">
        {filteredTechniques.map((technique) => (
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

      {/* Social Media Techniques */}
      <h3>🌐 Techniques from Social Media</h3>
      <div className="social-grid">
        {socialPosts.length > 0 ? (
          socialPosts.map((post, index) => (
            <div key={index} className="social-card">
              {post.type === "image" && post.media && (
                <img src={`/${post.media}`} alt={post.title} />
              )}
              {post.type === "video" && post.url.includes("youtube") && (
                <iframe
                  width="100%"
                  height="200"
                  src={post.url.replace("watch?v=", "embed/")}
                  title={post.title}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              )}
              <h4>{post.title}</h4>
              <p><strong>Source:</strong> {post.source}</p>
              <a href={post.url} target="_blank" rel="noopener noreferrer">View Source</a>
            </div>
          ))
        ) : (
          <p>No social media posts found.</p>
        )}
      </div>

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
    </div>
  );
};

export default ConservationTechniques;
