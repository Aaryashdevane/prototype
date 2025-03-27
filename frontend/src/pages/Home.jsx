import React from "react";
import { motion } from "framer-motion";
import "./Home.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Testimonials from "../components/Testimonials";
import waterDrop from "../assets/images/water-drop.png"; // Importing video


const Home = () => {
  return (
    <div className="home">
      <Navbar />

      {/* Hero Section with Video */}
      <section className="hero">
        <video autoPlay loop muted className="hero-video">
          <source src={waterDrop} type="video/mp4" />
        </video>
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1>Save Every Drop, Secure the Future</h1>
          <p>Join our mission to conserve water and prevent wastage.</p>
          <div className="hero-buttons">
            <motion.button whileHover={{ scale: 1.1 }} className="btn-primary">Learn More</motion.button>
            <motion.button whileHover={{ scale: 1.1 }} className="btn-outline">Report Wastage</motion.button>
          </div>
        </motion.div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
