import React from "react";
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
];

const Testimonials = () => {
  return (
    <motion.div
      className="testimonials"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <h2>What Our Users Say</h2>
      <div className="testimonial-container">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            className="testimonial-card"
            whileHover={{ scale: 1.05 }}
          >
            <img src={testimonial.img} alt={testimonial.name} />
            <h3>{testimonial.name}</h3>
            <p>"{testimonial.review}"</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Testimonials;
