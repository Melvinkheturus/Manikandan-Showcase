import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import MainSection from '../../../sections/MainSection';
import ProjectGallery from '../../pages/ProjectGallery';
import SkillsPage from '../../pages/SkillsPage';
import AboutSection from '../../../sections/AboutSection';
import NotFound from '../../pages/NotFound';
import { AnimatePresence, motion } from 'framer-motion';

const PageRouter = () => {
  const location = useLocation();
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Track body scroll position when route changes
  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  // Page transition variants
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, 0.05, 0.01, 0.9],
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.6,
      },
    },
  };
  
  // Handle animation state
  const handleAnimationStart = () => {
    setIsAnimating(true);
  };
  
  const handleAnimationComplete = () => {
    setIsAnimating(false);
  };
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onAnimationStart={handleAnimationStart}
              onAnimationComplete={handleAnimationComplete}
            >
              <MainSection />
            </motion.div>
          }
        />
        <Route
          path="/projects"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onAnimationStart={handleAnimationStart}
              onAnimationComplete={handleAnimationComplete}
            >
              <ProjectGallery />
            </motion.div>
          }
        />
        <Route
          path="/skills"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onAnimationStart={handleAnimationStart}
              onAnimationComplete={handleAnimationComplete}
            >
              <SkillsPage />
            </motion.div>
          }
        />
        <Route
          path="/about"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onAnimationStart={handleAnimationStart}
              onAnimationComplete={handleAnimationComplete}
            >
              <AboutSection />
            </motion.div>
          }
        />
        <Route
          path="*"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onAnimationStart={handleAnimationStart}
              onAnimationComplete={handleAnimationComplete}
            >
              <NotFound />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

export default PageRouter; 