import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const { theme } = useTheme();
  const [activeSection, setActiveSection] = useState('');
  
  // Sections to track
  const sections = [
    { id: 'welcome', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' }
  ];

  // Detect which section is in view
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const windowHeight = window.innerHeight;
      
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          if (top <= windowHeight / 2 && bottom >= windowHeight / 2) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to section when clicking on indicator
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Vertical progress bar */}
      <motion.div
        className="fixed left-0 top-0 bottom-0 w-1 bg-gray-300 dark:bg-gray-700 z-50"
        style={{ 
          scaleY,
          originY: 0,
          background: theme === 'dark' 
            ? 'linear-gradient(to bottom, #10b981, #10b98199, #10b98155, #10b98111)' 
            : 'linear-gradient(to bottom, #10b981, #10b98199, #10b98155, #10b98111)'
        }}
      />
      
      {/* Section indicators */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50">
        {sections.map((section) => (
          <motion.button
            key={section.id}
            className={`w-3 h-3 rounded-full relative group ${
              activeSection === section.id 
                ? 'bg-primary' 
                : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
            }`}
            onClick={() => scrollToSection(section.id)}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1 + sections.indexOf(section) * 0.1 }}
          >
            <span className="absolute left-0 -translate-x-full -translate-y-1/4 pr-3 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-xs text-primary font-medium">
              {section.label}
            </span>
            {activeSection === section.id && (
              <motion.div
                className="absolute inset-0 rounded-full bg-primary"
                initial={{ scale: 0 }}
                animate={{ scale: 1.5 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.3 }}
                style={{ opacity: 0.3, zIndex: -1 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </>
  );
};

export default ScrollProgress; 