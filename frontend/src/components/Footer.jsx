import React from "react";
import { motion } from "framer-motion";
import "./Footer.css";

const Footer = () => {
  return (
    <motion.footer 
      className="footer"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
    >
      <div className="footer-content">
        <div className="footer-logo">
          <motion.span 
            animate={{ 
              rotate: [0, 10, -10, 0],
              transition: { duration: 1.5, repeat: Infinity }
            }}
          >
            💧
          </motion.span>
          <h3>WaterSave</h3>
        </div>

        <div className="footer-links">
          <a href="/">Home</a>
          <a href="/techniques">Techniques</a>
          <a href="/report">Report</a>
          <a href="/contact">Contact</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} WaterSave. All rights reserved.</p>
      </div>
    </motion.footer>
  );
};

export default Footer;