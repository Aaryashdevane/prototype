import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./Testimonials.css";

const testimonials = [
  {
    name: "Aaryash",
    review: "This platform helped me find new ways to conserve water at home. Highly recommended!",
    img: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    name: "Riya Sharma",
    review: "An amazing initiative! Water conservation is crucial, and this website makes it easy.",
    img: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    name: "Kabir Das",
    review: "Very informative and well-designed. The reporting feature is a game-changer!",
    img: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    name: "Ananya Verma",
    review: "A great platform to spread awareness about water conservation. Loved it!",
    img: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    name: "Rohan Mehta",
    review: "The tips and techniques shared here are very practical and easy to follow.",
    img: "https://randomuser.me/api/portraits/men/5.jpg",
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const autoScroll = setInterval(() => {
      handleNext();
    }, 5000); // Auto-scroll every 5 seconds

    return () => clearInterval(autoScroll); // Cleanup interval on unmount
  }, []);

  const visibleTestimonials =
    window.innerWidth <= 480 // Check if the screen width is mobile size
      ? [testimonials[currentIndex]] // Show only one testimonial on mobile
      : [
          testimonials[(currentIndex - 1 + testimonials.length) % testimonials.length],
          testimonials[currentIndex],
          testimonials[(currentIndex + 1) % testimonials.length],
        ];

  return (
    <motion.div
      className="testimonials"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <h2 >What Our Users Say</h2>
      <div className="testimonial-container">
        {window.innerWidth > 480 && (
          <button className="nav-button left" onClick={handlePrev}>
            &#8249;
          </button>
        )}
        {visibleTestimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            className={`testimonial-card ${
              index === 1 && window.innerWidth > 480 ? "active" : "" /* Highlight the middle card */
            }`}
            whileHover={{ scale: 1.05 }}
          >
            <img src={testimonial.img} alt={testimonial.name} />
            <h3>{testimonial.name}</h3>
            <p className="testimonial-content">"{testimonial.review}"</p>
          </motion.div>
        ))}
        {window.innerWidth > 480 && (
          <button className="nav-button right" onClick={handleNext}>
            &#8250;
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default Testimonials;