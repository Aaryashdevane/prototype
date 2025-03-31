import React from "react";
import "./Subsidy.css";

const subsidies = [
  {
    id: 1,
    name: "Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)",
    description: "A scheme to improve water conservation and irrigation efficiency for farmers.",
    url: "https://pmksy.gov.in/",
  },
  {
    id: 2,
    name: "Jal Jeevan Mission",
    description: "A mission to provide safe and adequate drinking water to all rural households.",
    url: "https://jaljeevanmission.gov.in/",
  },
  {
    id: 3,
    name: "Atal Mission for Rejuvenation and Urban Transformation (AMRUT)",
    description: "A mission to ensure water supply and improve urban infrastructure.",
    url: "https://amrut.gov.in/",
  },
];

const SubsidyPage = () => {
  return (
    <div className="subsidy-container">
      <h1 className="subsidy-title">Government Water Conservation Subsidies</h1>
      <div className="subsidy-list">
        {subsidies.map((subsidy) => (
          <div key={subsidy.id} className="subsidy-card">
            <h2>{subsidy.name}</h2>
            <p>{subsidy.description}</p>
            <a href={subsidy.url} target="_blank" rel="noopener noreferrer" className="learn-more">
              Learn More
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubsidyPage;
