import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * SectionTransitionManager
 * 
 * A component that manages transitions between different sections with cinematic effects.
 * Controls scroll behavior to allow internal scrolling within each section and 
 * handles transitions between sections when the user reaches the end of a section.
 */
const SectionTransitionManager = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sectionRefs = useRef([]);
  const sections = Array.isArray(children) ? children : [children];
  
  // Handle section end and trigger transition to next section
  const handleSectionEnd = (index) => {
    if (isTransitioning) return;
    if (index < sections.length - 1) {
      triggerTransition(index + 1);
    }
  };
  
  // Trigger transition to a specific section
  const triggerTransition = (targetIndex) => {
    setIsTransitioning(true);
    document.body.style.overflow = 'hidden'; // Lock scroll during transition
    
    // Add a small delay to allow animation to start
    setTimeout(() => {
      setActiveIndex(targetIndex);
      
      // After transition completes, unlock scroll
      setTimeout(() => {
        setIsTransitioning(false);
        document.body.style.overflow = 'auto';
      }, 1000); // Match transition duration
    }, 50);
  };

  // Add keyboard navigation
  useEffect(() => {
    const handleKeydown = (e) => {
      if (isTransitioning) return;
      
      if (e.key === 'ArrowDown' && activeIndex < sections.length - 1) {
        triggerTransition(activeIndex + 1);
      } else if (e.key === 'ArrowUp' && activeIndex > 0) {
        triggerTransition(activeIndex - 1);
      }
    };
    
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [activeIndex, sections.length, isTransitioning]);

  // Render sections with transition animations
  return (
    <div className="relative">
      {/* Section transition indicator dots */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50">
        <div className="flex flex-col space-y-4">
          {sections.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeIndex 
                  ? 'bg-blue-400 scale-125' 
                  : 'bg-gray-500 hover:bg-gray-400'
              }`}
              onClick={() => !isTransitioning && triggerTransition(index)}
              aria-label={`Go to section ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      {/* Animated sections */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="min-h-screen relative"
        >
          {/* Clone the active section and pass required props */}
          {React.cloneElement(sections[activeIndex], {
            ref: (el) => (sectionRefs.current[activeIndex] = el),
            onSectionEnd: handleSectionEnd,
            sectionIndex: activeIndex
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SectionTransitionManager; 