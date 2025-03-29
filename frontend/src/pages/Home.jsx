import React from "react";
import { motion } from "framer-motion";
import "./Home.css";
import Testimonials from "../components/Testimonials";

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section with Parallax Effect */}
      <section className="hero">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1>Save Every Drop, Secure the Future</h1>
          <p>Join our mission to conserve water and prevent wastage.</p>
          <div className="hero-buttons">
            <motion.button whileHover={{ scale: 1.1 }} className="btn-primary">
              Learn More
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} className="btn-primary">
              Report Wastage
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Testimonials */}
      <Testimonials />
    </div>
  );
};

export default Home;