import React, { useState, useEffect } from "react";
import axios from "axios";
import "./GovernmentSchemes.css";

const GovernmentSchemes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [allTechniques, setAllTechniques] = useState([]);
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [rainfallData, setRainfallData] = useState(null);
  const [suggestedTechniques, setSuggestedTechniques] = useState([]);
  const [userLocation, setUserLocation] = useState({
    latitude: 12.9794048, // Default location (can be updated based on user's choice)
    longitude: 77.594624, // Default location (can be updated based on user's choice)
  });

  const [selectedRegion, setSelectedRegion] = useState("All");

  // Regions with corresponding coordinates (example locations)
  const regions = {
    Uttarakhand: { latitude: 30.0668, longitude: 78.2622 },
    Rajasthan: { latitude: 27.0238, longitude: 74.2179 },
    TamilNadu: { latitude: 11.1271, longitude: 78.6569 },
  };

  // Fetch techniques data from backend
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

  // Fetch rainfall data based on location
  useEffect(() => {
    if (userLocation.latitude && userLocation.longitude) {
      axios
        .get(
          `http://localhost:8000/rainfall?lat=${userLocation.latitude}&lon=${userLocation.longitude}`
        )
        .then((res) => {
          if (res.data && res.data.annual_rainfall) {
            setRainfallData(res.data.annual_rainfall);
            // Fetch suitable techniques based on the rainfall data
            axios
              .get(
                `http://localhost:8000/techniques/suggestions?annual_rainfall=${res.data.annual_rainfall}`
              )
              .then((response) => {
                setSuggestedTechniques(response.data.suggested_techniques);
              })
              .catch((error) => {
                console.error("Error fetching suitable techniques:", error);
              });
          } else {
            console.error("Unexpected API response:", res.data);
            setRainfallData(null);
          }
        })
        .catch((error) => {
          console.error("Error fetching rainfall data:", error);
          setRainfallData(null); // Handle error and reset state
        });
    }
  }, [userLocation]); // Added dependency on userLocation

  // Filter techniques based on search query
  const filteredTechniques = allTechniques.filter((tech) =>
    tech.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render technique rows
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
          {/* View Details triggers modal */}
          <button
            className="myscheme-details-button"
            onClick={() => setSelectedTechnique(technique)}
          >
            View Details
          </button>
        </div>
      </div>
    ));

  const handleRegionChange = (event) => {
    const region = event.target.value;
    setSelectedRegion(region);

    if (region === "All") {
      setUserLocation({
        latitude: 12.9794048,
        longitude: 77.594624,
      });
    } else {
      setUserLocation(regions[region]);
    }
  };

  const handleGetTechniques = () => {
    // Ensure that the effect will trigger if the region is selected
    if (selectedRegion !== "All") {
      const { latitude, longitude } = regions[selectedRegion];
      setUserLocation({ latitude, longitude }); // This triggers the useEffect to fetch data
    }
  };

  return (
    <div className="myscheme-container">
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
        <aside className="myscheme-sidebar">
          <h2>Filter By</h2>
          <label>
            Region
            <select value={selectedRegion} onChange={handleRegionChange}>
              <option>All</option>
              <option>Uttarakhand</option>
              <option>Rajasthan</option>
              <option>Tamil Nadu</option>
            </select>
          </label>
          <button
            className="myscheme-fetch-button"
            onClick={handleGetTechniques}
          >
            Get Location-Based Conservation Techniques
          </button>
        </aside>

        <main className="myscheme-content">
          {renderTechniqueRows()}

          {filteredTechniques.length === 0 && (
            <p className="myscheme-no-results">No techniques found.</p>
          )}

          {/* Display rainfall data if available */}
          {rainfallData !== null && (
            <div className="myscheme-rainfall">
              <h2>Annual Rainfall</h2>
              <p>{`The annual rainfall is ${rainfallData} mm`}</p>
            </div>
          )}

          {rainfallData === null && (
            <p className="myscheme-rainfall-error">Unable to fetch rainfall data.</p>
          )}

          {/* Display suitable techniques */}
          {suggestedTechniques.length > 0 && (
            <div className="myscheme-suggested-techniques">
              <h2>Suggested Conservation Techniques</h2>
              <ul>
                {suggestedTechniques.map((tech, idx) => (
                  <li key={idx}>
                    <strong>{tech.title}</strong> - {tech.description || "No description available"}
                  </li>
                ))}
              </ul>
            </div>
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
                {selectedTechnique.detailed_description || "No description available."}
              </p>
            </div>

            {selectedTechnique.extra_info && (
              <p>
                <strong>Extra Info:</strong> {selectedTechnique.extra_info}
              </p>
            )}

            {selectedTechnique.location && (
              <p>
                <strong>Location:</strong> {selectedTechnique.location}
              </p>
            )}

            {selectedTechnique.tags && selectedTechnique.tags.length > 0 && (
              <>
                <strong>Tags: </strong>
                {selectedTechnique.tags.join(", ")}
              </>
            )}

            {selectedTechnique.source && (
              <p>
                <strong>Source:</strong> {selectedTechnique.source}
              </p>
            )}

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

export default GovernmentSchemes;
