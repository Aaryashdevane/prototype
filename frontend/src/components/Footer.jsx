import React from "react";
import { motion } from "framer-motion";
import "./Footer.css";

const Footer = () => {
  return (
    <motion.footer 
      className="footer"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="footer-content">
        <h2>Water Conservation</h2>
        <p>Saving water, saving life. Join our mission!</p>
        <div className="footer-links">
          <a href="/">Home</a>
          <a href="/techniques">Techniques</a>
          <a href="/report">Report</a>
          <a href="/contact">Contact</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Water Conservation. All rights reserved.</p>
      </div>
    </motion.footer>
  );
};

export default Footer;
