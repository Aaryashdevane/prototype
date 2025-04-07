import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./Testimonials.css";

const testimonials = [
  {
    name: "Aaryash",
    review: "This platform helped me reduce my water usage by 30% with simple home tips. Amazing!",
    img: "https://randomuser.me/api/portraits/men/1.jpg",
    location: "Bangalore"
  },
  {
    name: "Riya Sharma",
    review: "The leak reporting feature helped our society save thousands of liters. Essential tool!",
    img: "https://randomuser.me/api/portraits/women/2.jpg",
    location: "Delhi"
  },
  {
    name: "Kabir Das",
    review: "Finally a platform that makes water conservation accessible to everyone. Brilliant!",
    img: "https://randomuser.me/api/portraits/men/3.jpg",
    location: "Mumbai"
  },
  {
    name: "Ananya Verma",
    review: "The rainwater harvesting guides transformed our apartment complex. 5 stars!",
    img: "https://randomuser.me/api/portraits/women/4.jpg",
    location: "Chennai"
  },
  {
    name: "Rohan Mehta",
    review: "As a farmer, the irrigation techniques saved my crops during drought season.",
    img: "https://randomuser.me/api/portraits/men/5.jpg",
    location: "Pune"
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
    }, 5000);

    return () => clearInterval(autoScroll);
  }, []);

  const visibleTestimonials =
    window.innerWidth <= 768
      ? [testimonials[currentIndex]]
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
      <div className="water-wave"></div>
      <h2>
        Voices for Change
      </h2>
      
      <div className="testimonial-container">
        {window.innerWidth > 768 && (
          <button className="nav-button left" onClick={handlePrev}>
            <WaterDropIcon direction="left" />
          </button>
        )}

        {visibleTestimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            className={`testimonial-card ${
              index === 1 && window.innerWidth > 768 ? "active" : ""
            }`}
            whileHover={{ scale: 1.05 }}
          >
            <div className="card-wave"></div>
            <img src={testimonial.img} alt={testimonial.name} />
            <h3>{testimonial.name}</h3>
            <p className="location">{testimonial.location}</p>
            <p className="testimonial-content">"{testimonial.review}"</p>
          </motion.div>
        ))}

        {window.innerWidth > 768 && (
          <button className="nav-button right" onClick={handleNext}>
            <WaterDropIcon direction="right" />
          </button>
        )}
      </div>

      <div className="indicators">
        {testimonials.map((_, index) => (
          <div 
            key={index}
            className={`indicator ${currentIndex === index ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </motion.div>
  );
};

const WaterDropIcon = ({ direction }) => (
  <motion.div
    animate={{ x: direction === 'left' ? [-2, 0, -2] : [2, 0, 2] }}
    transition={{ repeat: Infinity, duration: 1.5 }}
  >
    {direction === 'left' ? '<' : '>'}
  </motion.div>
);

export default Testimonials;