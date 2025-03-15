import React, { useState } from "react";
import "./ConservationTechniques.css";

const ConservationTechniques = () => {
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [filterType, setFilterType] = useState(""); // Project or Conservation Technique
  const [filterCategory, setFilterCategory] = useState(""); // Agriculture, Home, etc.
  const [searchQuery, setSearchQuery] = useState("");

  const techniquesData = [
    { id: 1, name: "Rainwater Harvesting", category: "Home", type: "Conservation Technique", description: "Rainwater harvesting collects and stores rainwater for later use, reducing reliance on municipal supply. It involves rooftop catchment systems, storage tanks, and underground recharge pits. This technique is widely used for irrigation, toilet flushing, and even drinking water after filtration.", image: "/images/rainwater-harvesting.jpg" },
    { id: 2, name: "Drip Irrigation", category: "Agriculture", type: "Conservation Technique", description: "Drip irrigation is an efficient watering system that delivers water directly to plant roots. It reduces evaporation, minimizes water runoff, and saves up to 70% more water than traditional irrigation methods. Farmers widely adopt this in dry regions to maximize crop yield.", image: "/images/drip-irrigation.jpg" },
    { id: 3, name: "Smart Irrigation Systems", category: "Agriculture", type: "Project", description: "Smart irrigation uses soil moisture sensors and weather data to automate watering schedules, ensuring optimal water use while maximizing crop yield.", image: "/images/smart-irrigation.jpg" },
    { id: 4, name: "Desalination Plants", category: "Industry", type: "Project", description: "Desalination plants remove salt and impurities from seawater to produce drinking water. These facilities are crucial in water-scarce regions with limited freshwater sources.", image: "/images/desalination.jpg" },
    { id: 5, name: "Artificial Wetlands", category: "Environment", type: "Project", description: "Artificial wetlands are engineered systems that mimic natural wetlands to filter and purify wastewater, removing pollutants through biological and chemical processes.", image: "/images/artificial-wetlands.jpg" },
    { id: 6, name: "Leak Detection Systems", category: "Home", type: "Conservation Technique", description: "Smart leak detection systems use sensors to monitor and detect water leaks in pipelines. Alerts are sent via mobile apps, allowing quick action to prevent water wastage.", image: "/images/leak-detection.jpg" },
    { id: 7, name: "Greywater Recycling", category: "Home", type: "Conservation Technique", description: "Greywater recycling reuses wastewater from sinks, showers, and laundry for irrigation or toilet flushing. It significantly reduces freshwater demand and helps in sustainable water management.", image: "/images/greywater-recycling.jpg" },
    { id: 8, name: "Fog Harvesting", category: "Environment", type: "Project", description: "Fog harvesting captures water droplets from fog using mesh nets. This technique is particularly useful in arid and coastal areas to generate fresh water.", image: "/images/fog-harvesting.jpg" },
    { id: 9, name: "Mulching", category: "Agriculture", type: "Conservation Technique", description: "Mulching involves covering the soil with organic materials like leaves, straw, or wood chips to retain moisture, prevent weed growth, and enhance soil fertility.", image: "/images/mulching.jpg" },
    { id: 10, name: "Low-Flow Showerheads", category: "Home", type: "Conservation Technique", description: "Low-flow showerheads reduce water flow while maintaining strong pressure, saving up to 50% of water compared to traditional showerheads. These devices are cost-effective and easy to install, helping households conserve significant amounts of water.", image: "/images/low-flow-showerhead.jpg" },
    // Add 40 more techniques & projects here...
  ];

  // Filtering the data based on selected filters
  const filteredTechniques = techniquesData.filter((tech) => {
    return (
      (filterType === "" || tech.type === filterType) &&
      (filterCategory === "" || tech.category === filterCategory) &&
      tech.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="techniques-container">
      <h2>Water Conservation Techniques & Projects</h2>

      {/* Search & Filter Section */}
      <div className="filter-container">
        <input
          type="text"
          placeholder="🔍 Search techniques or projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select onChange={(e) => setFilterType(e.target.value)} value={filterType}>
          <option value="">All Types</option>
          <option value="Project">Projects</option>
          <option value="Conservation Technique">Conservation Techniques</option>
        </select>

        <select onChange={(e) => setFilterCategory(e.target.value)} value={filterCategory}>
          <option value="">All Sectors</option>
          <option value="Home">Home</option>
          <option value="Agriculture">Agriculture</option>
          <option value="Industry">Industry</option>
          <option value="Environment">Environment</option>
        </select>
      </div>

      {/* Display Techniques */}
      <div className="techniques-grid">
        {filteredTechniques.map((technique) => (
          <div
            key={technique.id}
            className="technique-card"
            onClick={() => setSelectedTechnique(technique)}
          >
            <img src={technique.image} alt={technique.name} />
            <h3>{technique.name}</h3>
            <p>{technique.description.substring(0, 100)}...</p>
          </div>
        ))}
      </div>

      {/* Modal for Full Details */}
      {selectedTechnique && (
        <div className="technique-modal">
          <div className="modal-content">
            <h2>{selectedTechnique.name}</h2>
            <p>{selectedTechnique.description}</p>
            <button onClick={() => setSelectedTechnique(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConservationTechniques;
