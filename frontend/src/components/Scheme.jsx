import React, { useState, useEffect, useRef } from "react";
import "./Scheme.css";

const Scheme = ({ schemes = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef(null);

  const defaultSchemes = [
    {
      id: 1,
      title: "Jal Shakti Abhiyan",
      description:
        "A campaign for water conservation and water resource management across India.",
      imageUrl: "https://www.eawater.com/wp-content/uploads/2024/02/Aritkal-nation-1.png",
      learnMoreUrl: "https://jalshakti-ddws.gov.in/",
    },
    {
      id: 2,
      title: "Atal Bhujal Yojana",
      description:
        "Promotes sustainable groundwater management through community participation.",
      imageUrl: "https://ataljal.mowr.gov.in/WriteReadData/HeaderLogo/atal-jal-logo.png",
      learnMoreUrl: "https://jalshakti-dowr.gov.in/atal-bhujal-yojana",
    },
    {
      id: 3,
      title: "National Water Mission",
      description:
        "Focuses on water conservation, minimizing wastage, and equitable distribution.",
      imageUrl: "https://www.godigit.com/content/dam/godigit/directportal/en/contenthm/national-water-mission.jpg",
      learnMoreUrl: "https://nwm.gov.in/",
    },
    {
      id: 4,
      title: "Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA)",
      description:
        "Includes water conservation works like check dams, ponds, and watershed management.",
      imageUrl: "https://drishtiias.com/images/uploads/1666001871_Mgnreg_Drishti_IAS_English.png",
      learnMoreUrl: "https://nrega.nic.in/MGNREGA_new/Nrega_home.aspx",
    },
    {
      id: 5,
      title: "Jal Jeevan Mission",
      description:
        "Aims to provide functional tap water connections to every rural household.",
      imageUrl: "https://www.presentations.gov.in/wp-content/uploads/2021/01/jal-jeevan-mission-jjm-mainimg-jaljeevanmission-logo.jpg",
      learnMoreUrl: "https://jaljeevanmission.gov.in/",
    },
  ];

  const displaySchemes = schemes.length > 0 ? schemes : defaultSchemes;

  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === displaySchemes.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, displaySchemes.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? displaySchemes.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === displaySchemes.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  return (
    <div
      className="scheme-slider scheme-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="gov-scheme-slider">
        <div className="gov-scheme-slider-container">
          {displaySchemes.map((scheme, index) => (
            <div
              key={scheme.id}
              className={`gov-scheme-slide ${
                index === currentIndex ? "active" : ""
              }`}
              style={{
                transform: `translateX(${100 * (index - currentIndex)}%)`,
              }}
            >
              <div className="gov-scheme-slide-content">
                <div className="gov-scheme-slide-image">
                  <img src={scheme.imageUrl} alt={scheme.title} />
                </div>
                <div className="gov-scheme-slide-info">
                  <h2>{scheme.title}</h2>
                  <p>{scheme.description}</p>
                  <a
                    href={scheme.learnMoreUrl}
                    className="gov-scheme-learn-more"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="gov-scheme-slider-controls">
          <button
            className="gov-scheme-slider-arrow prev"
            onClick={goToPrevious}
            aria-label="Previous scheme"
          >
            &lt;
          </button>

          <div className="gov-scheme-slider-dots">
            {displaySchemes.map((_, index) => (
              <button
                key={index}
                className={`gov-scheme-slider-dot ${
                  index === currentIndex ? "active" : ""
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to scheme ${index + 1}`}
              />
            ))}
          </div>

          <button
            className="gov-scheme-slider-arrow next"
            onClick={goToNext}
            aria-label="Next scheme"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Scheme;
