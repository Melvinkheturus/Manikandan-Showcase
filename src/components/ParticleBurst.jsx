import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

// Optimize the particle burst component with memoization and performance improvements
const ParticleBurst = React.memo(({ 
  children, 
  particleCount = 12, // Reduced particle count
  duration = 1.5 
}) => {
  const controls = useAnimation();
  const containerRef = useRef(null);
  const [isTriggered, setIsTriggered] = useState(false);
  const { theme } = useTheme();
  
  // Setup the intersection observer
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  // Generate random particles - memoized to prevent recreation
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, () => ({
      id: Math.random().toString(36).substr(2, 9),
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 3 + Math.random() * 6,
      duration: 0.6 + Math.random() * 1,
      distance: 50 + Math.random() * 100,
      angle: Math.random() * 360,
      delay: Math.random() * 0.2,
    }));
  }, [particleCount]);
  
  // Trigger animation when in view
  useEffect(() => {
    if (inView && !isTriggered) {
      setIsTriggered(true);
      controls.start('visible');
    }
  }, [inView, isTriggered, controls]);
  
  // Define particle colors based on theme - memoized
  const particleColor = useMemo(() => 
    theme === 'dark' ? '#10b981' : '#10b981'
  , [theme]);
  
  // Memoized particle element factory to improve render performance
  const renderParticles = useMemo(() => {
    if (!isTriggered) return null;
    
    return particles.map((particle) => {
      const angle = particle.angle * (Math.PI / 180);
      const x = Math.cos(angle) * particle.distance;
      const y = Math.sin(angle) * particle.distance;
      
      return (
        <motion.div
          key={particle.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            top: `50%`,
            left: `50%`,
            backgroundColor: particleColor,
            width: particle.size,
            height: particle.size,
            opacity: 0,
            willChange: 'transform, opacity' // Optimize for animations
          }}
          initial={{ 
            opacity: 0,
            x: 0,
            y: 0,
            scale: 0.5,
          }}
          animate={{
            opacity: [0, 1, 0],
            x: [0, x * 0.3, x],
            y: [0, y * 0.3, y],
            scale: [0.5, 1.5, 0.2],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: "easeOut",
          }}
        />
      );
    });
  }, [isTriggered, particles, particleColor]);
  
  // Render burst ring only when triggered - with optimized rendering
  const burstRing = useMemo(() => {
    if (!isTriggered) return null;
    
    return (
      <motion.div
        className="absolute top-1/2 left-1/2 w-0 h-0 rounded-full border-2 pointer-events-none"
        style={{
          borderColor: particleColor,
          transform: 'translate(-50%, -50%)',
          willChange: 'width, height, opacity' // Optimize for animations
        }}
        initial={{ width: 0, height: 0, opacity: 0.7 }}
        animate={{ 
          width: ['0%', '200%'], 
          height: ['0%', '200%'], 
          opacity: [0.7, 0] 
        }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
    );
  }, [isTriggered, particleColor]);
  
  return (
    <div ref={ref} className="relative">
      {/* The main content */}
      <div ref={containerRef}>
        {children}
      </div>
      
      {/* Particles with optimized rendering */}
      <AnimatePresence>
        {renderParticles}
      </AnimatePresence>
      
      {/* The burst ring effect - only render when needed */}
      {burstRing}
    </div>
  );
});

export default ParticleBurst; 