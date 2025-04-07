import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import "./Home.css";
import Testimonials from "../components/Testimonials";
import Scheme from "../components/Scheme";
import ChatBot from "../components/ChatBot";

const Home = () => {
  const { scrollYProgress } = useScroll();
  const yPos = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.3]);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const heroRef = useRef(null);

  const springConfig = { damping: 20, stiffness: 100 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);
  
  useEffect(() => {
    const moveCursor = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        cursorX.set(x);
        cursorY.set(y);
      }
    };
  
    const hero = heroRef.current;
    if (hero) {
      hero.addEventListener("mousemove", moveCursor);
    }
    
    return () => {
      if (hero) {
        hero.removeEventListener("mousemove", moveCursor);
      }
    };
  }, [cursorX, cursorY]);
    const dropVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100,
        staggerChildren: 0.2
      }
    }
  };

  const letterVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
  // ... (keep your existing variants and other code)
  const title = "Save Every Drop, Secure the Future";
  const subtitle = "Join our mission to conserve water and prevent wastage.";

  return (
    <div className="home">
      {/* Parallax Hero Section */}
      <motion.section 
        className="hero"
        style={{ y: yPos, opacity }}
        ref={heroRef}
      >
        {/* Mouse Wave Effect */}
        <motion.div
          className="mouse-wave"
          style={{
            x: springX,
            y: springY,
          }}
        />
        <motion.div
          className="hero-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1.5 }}
        >
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { 
                opacity: 1,
                transition: { staggerChildren: 0.05 }
              }
            }}
          >
            {title.split(" ").map((word, i) => (
              <motion.span 
                key={i}
                variants={letterVariants}
                style={{ display: 'inline-block', marginRight: '5px' }}
                whileHover={{ scale: 1.1, color: "#4fc3f7" }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            {subtitle}
          </motion.p>

          <motion.div 
            className="hero-buttons"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <motion.button 
              whileHover={{ 
                scale: 1.1,
                boxShadow: "0 0 15px rgba(79, 195, 247, 0.6)"
              }} 
              whileTap={{ scale: 0.95 }}
              className="btn-primary"
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ delay: 0 }}
            >
              Learn More
            </motion.button>
            <motion.button 
              whileHover={{ 
                scale: 1.1,
                boxShadow: "0 0 15px rgba(100, 221, 23, 0.6)"
              }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary"
              initial={{ x: 20 }}
              animate={{ x: 0 }}
              transition={{ delay: 0 }}
            >
              Report Wastage
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.section>
   
      <ChatBot />
      <Scheme />
      <Testimonials />
        

    </div>
  );
};

export default Home;
