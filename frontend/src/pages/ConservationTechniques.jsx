import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ConservationTechniques.css";

const ConservationTechniques = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [allTechniques, setAllTechniques] = useState([]);
  const [selectedTechnique, setSelectedTechnique] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/techniques")
      .then((res) => {
        if (res.data && Array.isArray(res.data.techniques)) {
          setAllTechniques(res.data.techniques);
        } else {
          console.error("Unexpected API response:", res.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching techniques:", error);
      });
  }, []);

  // Filter based on search query (case-insensitive match on title)
  const filteredTechniques = allTechniques.filter((tech) =>
    tech.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Renders each technique row
  const renderTechniqueRows = () =>
    filteredTechniques.map((technique, idx) => (
      <div className="myscheme-row" key={idx}>
        <div className="myscheme-row-left">
          <h3 className="myscheme-row-title">{technique.title}</h3>
          <p className="myscheme-row-snippet">
            {technique.detailed_description
              ? technique.detailed_description.slice(0, 120)
              : "No description"}...
          </p>
          {technique.tags && technique.tags.length > 0 && (
            <div className="myscheme-tag-container">
              {technique.tags.map((tag, tIdx) => (
                <span className="myscheme-tag" key={tIdx}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="myscheme-row-right">
          {/* “View Details” triggers modal */}
          <button
            className="myscheme-details-button"
            onClick={() => setSelectedTechnique(technique)}
          >
            View Details
          </button>
        </div>
      </div>
    ));

  return (
    <div className="myscheme-container">
      {/* Header with search */}
      <div className="myscheme-header">
        <h1>Water Conservation Techniques</h1>
        <div className="myscheme-search-bar">
          <input
            type="text"
            placeholder="Search techniques..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="myscheme-body">
        {/* Sidebar Filters */}
        <aside className="myscheme-sidebar">
          <h2>Filter By</h2>
          <label>
            Region
            <select>
              <option>All</option>
              <option>Uttarakhand</option>
              <option>Rajasthan</option>
              <option>Tamil Nadu</option>
            </select>
          </label>
          <label>
            Category
            <select>
              <option>All</option>
              <option>Rainwater Harvesting</option>
              <option>Groundwater Recharge</option>
              <option>Afforestation</option>
            </select>
          </label>
          {/* Add more filters as needed */}
        </aside>

        {/* Main Content: Single-Column List */}
        <main className="myscheme-content">
          {renderTechniqueRows()}

          {filteredTechniques.length === 0 && (
            <p className="myscheme-no-results">No techniques found.</p>
          )}
        </main>
      </div>

      {/* Fullscreen Modal for Technique Details */}
      {selectedTechnique && (
        <div
          className="myscheme-modal-overlay"
          onClick={() => setSelectedTechnique(null)}
        >
          <div
            className="myscheme-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="myscheme-modal-close"
              onClick={() => setSelectedTechnique(null)}
            >
              ✖
            </button>

            <h2>{selectedTechnique.title}</h2>

            {/* If multiple images, show them all */}
            {selectedTechnique.media_url?.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`media-${i}`}
                className="myscheme-modal-image"
              />
            ))}

            <div className="myscheme-modal-description">
              <p>
                <strong>Description:</strong>
              </p>
              <p>
                {selectedTechnique.detailed_description ||
                  "No description available."}
              </p>
            </div>

            {/* Extra Info */}
            {selectedTechnique.extra_info && (
              <p>
                <strong>Extra Info:</strong> {selectedTechnique.extra_info}
              </p>
            )}

            {/* Location */}
            {selectedTechnique.location && (
              <p>
                <strong>Location:</strong> {selectedTechnique.location}
              </p>
            )}

            {/* Tags */}
            {selectedTechnique.tags && selectedTechnique.tags.length > 0 && (
              <>
                <strong>Tags: </strong>
                {selectedTechnique.tags.join(", ")}
              </>
            )}

            {/* Source */}
            {selectedTechnique.source && (
              <p>
                <strong>Source:</strong> {selectedTechnique.source}
              </p>
            )}

            {/* If there's a URL */}
            {selectedTechnique.url && (
              <a
                href={selectedTechnique.url}
                target="_blank"
                rel="noopener noreferrer"
                className="myscheme-modal-link"
              >
                More Info
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConservationTechniques;
