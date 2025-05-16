import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hidden, setHidden] = useState(true);
  const [clicked, setClicked] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [trail, setTrail] = useState([]);
  const trailLength = 10;
  const { theme } = useTheme();
  
  // Create refs for cursor elements
  const cursorRef = useRef(null);
  
  // Update cursor position on mouse move
  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setHidden(false);
      
      // Update trail positions
      setTrail(prev => {
        const newTrail = [...prev, { x: e.clientX, y: e.clientY }];
        if (newTrail.length > trailLength) {
          return newTrail.slice(newTrail.length - trailLength);
        }
        return newTrail;
      });
    };
    
    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);
    
    const handleMouseEnter = () => {
      setHidden(false);
    };
    
    const handleMouseLeave = () => {
      setHidden(true);
    };
    
    const handleLinkHover = (e) => {
      if (e.target.closest('a, button, [role="button"]')) {
        setHovering(true);
      } else {
        setHovering(false);
      }
    };
    
    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseover', handleLinkHover);
    
    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseover', handleLinkHover);
    };
  }, []);
  
  // Don't render on mobile devices
  if (typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches) {
    return null;
  }
  
  // Define cursor and trail colors based on theme
  const cursorColor = theme === 'dark' ? 'rgba(16, 185, 129, 0.8)' : 'rgba(16, 185, 129, 0.8)';
  const cursorRingColor = theme === 'dark' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.3)';
  const trailColor = theme === 'dark' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.2)';
  
  return (
    <div className={`fixed z-50 pointer-events-none ${hidden ? 'opacity-0' : 'opacity-100'}`}>
      {/* Trail effect */}
      {trail.map((point, i) => {
        const size = 10 * (i / trailLength);
        const opacity = i / trailLength;
        
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: point.x,
              top: point.y,
              width: size,
              height: size,
              backgroundColor: trailColor,
              opacity: opacity,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity }}
            transition={{ duration: 0.1 }}
          />
        );
      })}
      
      {/* Main cursor dot */}
      <motion.div
        ref={cursorRef}
        className="absolute rounded-full pointer-events-none"
        style={{
          left: position.x,
          top: position.y,
          backgroundColor: cursorColor,
          transform: 'translate(-50%, -50%)',
          mixBlendMode: 'screen',
        }}
        animate={{
          width: hovering ? 16 : clicked ? 12 : 8,
          height: hovering ? 16 : clicked ? 12 : 8,
          opacity: hidden ? 0 : 1,
        }}
        transition={{ duration: 0.15 }}
      />
      
      {/* Cursor ring */}
      <motion.div
        className="absolute rounded-full border-2 pointer-events-none"
        style={{
          left: position.x,
          top: position.y,
          borderColor: cursorRingColor,
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          width: hovering ? 40 : 30,
          height: hovering ? 40 : 30,
          opacity: hidden ? 0 : hovering ? 0.8 : 0.4,
        }}
        transition={{ duration: 0.2 }}
      />
    </div>
  );
} 