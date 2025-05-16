import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { navSections } from './NavigationPath';

const RadialMenu = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Toggle menu open/closed
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  // Handle navigation item click
  const handleNavClick = (sectionId) => {
    onNavigate(sectionId);
    setIsOpen(false);
  };
  
  // Calculate position for each menu item in a circle
  const getItemPosition = (index, total) => {
    const angle = (index / total) * 2 * Math.PI; // Distribute items in a circle
    const radius = 80; // Distance from center
    const x = Math.sin(angle) * radius;
    const y = -Math.cos(angle) * radius;
    return { x, y };
  };
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Hamburger/compass button */}
      <motion.button
        className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleMenu}
      >
        {isOpen ? (
          // Close icon
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          // Compass icon
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        )}
      </motion.button>
      
      {/* Radial menu items */}
      <AnimatePresence>
        {isOpen && (
          <div className="absolute bottom-6 right-6">
            {navSections.map((section, index) => {
              const position = getItemPosition(index, navSections.length);
              
              return (
                <motion.button
                  key={section.id}
                  className="absolute w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ 
                    backgroundColor: `${section.color}30`,
                    borderColor: section.color,
                    color: 'white'
                  }}
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                  animate={{ 
                    opacity: 1, 
                    x: position.x, 
                    y: position.y,
                    scale: 1
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ 
                    duration: 0.3,
                    delay: index * 0.05
                  }}
                  onClick={() => handleNavClick(section.id)}
                  className="absolute w-10 h-10 rounded-full flex items-center justify-center 
                             shadow-md backdrop-blur-sm border border-white/30 text-white text-xs
                             hover:scale-110 transition-transform"
                >
                  {/* Show first letter of section as icon */}
                  {section.label.charAt(0)}
                  
                  {/* Tooltip label on hover */}
                  <div className="absolute whitespace-nowrap text-xs px-2 py-1 bg-black/70 rounded-md
                                  opacity-0 group-hover:opacity-100 pointer-events-none
                                  transition-opacity -translate-y-8">
                    {section.label}
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RadialMenu; 