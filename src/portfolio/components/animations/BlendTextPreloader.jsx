import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import SplitText from 'gsap/SplitText';

// Register SplitText plugin
gsap.registerPlugin(SplitText);

const BlendTextPreloader = ({ text = "Project Showcase", onComplete }) => {
  const textRef = useRef(null);
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (textRef.current) {
      // Initialize SplitText
      const splitText = new SplitText(textRef.current, { type: "chars" });
      const chars = splitText.chars;
      
      // Initial state - huge low-contrast text
      gsap.set(chars, { 
        x: "100vw",
        opacity: 0.6, 
        scale: 3,
        mixBlendMode: "screen",
        color: "#555555" 
      });
      
      // Timeline for text animation
      const tl = gsap.timeline({
        onComplete: () => onComplete && onComplete()
      });
      
      // Slide in from right
      tl.to(chars, {
        x: 0,
        duration: 1.2,
        stagger: 0.05,
        ease: "power3.out"
      });
      
      // Zoom out and change color
      tl.to(chars, {
        scale: 1,
        opacity: 1,
        color: "#ffffff",
        stagger: 0.03,
        duration: 0.8,
        ease: "power2.inOut"
      }, "-=0.5");
      
      // Clean up on unmount
      return () => {
        tl.kill();
        splitText.revert();
      };
    }
  }, [onComplete]);
  
  return (
    <motion.div 
      ref={containerRef}
      className="relative overflow-hidden w-full py-16 flex justify-center items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h2 
        ref={textRef}
        className="text-5xl md:text-7xl font-bold whitespace-nowrap"
      >
        {text}
      </h2>
    </motion.div>
  );
};

export default BlendTextPreloader; 