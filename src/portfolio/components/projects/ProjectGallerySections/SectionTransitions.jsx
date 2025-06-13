import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// New Parallax Transition Component that replaces CameraFocusShiftTransition
export const ParallaxTransition = ({ active, progress, targetSection }) => {
  // Create category-specific parallax elements
  const renderCategorySpecificElements = () => {
    if (!targetSection) return null;
    
    const section = targetSection.toLowerCase();
    
    if (section.includes('visual identity')) {
      return (
        <>
          {/* Visual Identity - Cards scale up from center with diagonal background shift */}
          <motion.div 
            className="fixed inset-0 pointer-events-none z-51"
            style={{
              background: 'radial-gradient(circle at 30% 70%, rgba(255,120,70,0.05), transparent 60%)',
              transform: `translate(${progress * -5}%, ${progress * 5}%)`,
              opacity: Math.sin(progress * Math.PI),
            }}
          />
          <motion.div 
            className="fixed inset-0 pointer-events-none z-51"
            style={{
              backgroundImage: 'linear-gradient(135deg, rgba(255,120,70,0.02) 1px, transparent 1px), linear-gradient(45deg, rgba(255,120,70,0.02) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              transform: `translate(${progress * -10}%, ${progress * 10}%) scale(${1 + progress * 0.1})`,
              opacity: Math.sin(progress * Math.PI),
            }}
          />
        </>
      );
    } else if (section.includes('ui/ux')) {
      return (
        <>
          {/* UI/UX Projects - Grid background with floating title */}
          <motion.div 
            className="fixed inset-0 pointer-events-none z-51"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(74, 222, 128, 0.03) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(74, 222, 128, 0.03) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
              transform: `translateY(${progress * 10}%)`,
              opacity: Math.sin(progress * Math.PI),
            }}
          />
          <motion.div 
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/3 pointer-events-none z-52"
            style={{
              opacity: progress > 0.4 && progress < 0.6 ? 1 : 0,
              filter: 'blur(1px)',
              transform: `translateY(${(progress - 0.5) * 100}px) scale(${1 + (progress - 0.5) * 2})`,
              transition: 'opacity 0.3s, transform 0.3s',
            }}
          >
            <h2 className="text-5xl sm:text-7xl font-bold text-emerald-500/20">UI/UX</h2>
          </motion.div>
        </>
      );
    } else if (section.includes('development')) {
      return (
        <>
          {/* Development - Terminal style with code background */}
          <motion.div 
            className="fixed inset-0 pointer-events-none z-51"
            style={{
              background: 'radial-gradient(circle at 70% 30%, rgba(50,120,255,0.05), transparent 60%)',
              opacity: Math.sin(progress * Math.PI),
            }}
          />
          <motion.div 
            className="fixed inset-0 pointer-events-none z-51 overflow-hidden"
            style={{
              opacity: Math.sin(progress * Math.PI) * 0.3,
            }}
          >
            <pre 
              className="text-xs text-blue-500/10 whitespace-pre leading-tight"
              style={{
                position: 'absolute',
                top: '10%',
                left: '5%',
                right: '5%',
                transform: `translateY(${progress * -150 + 100}px)`,
              }}
            >
              {`
function init() {
  return {
    data: [],
    loading: false,
    error: null
  };
}

const fetchData = async () => {
  setState({ ...state, loading: true });
  try {
    const result = await api.getData();
    setState({ 
      data: result, 
      loading: false,
      error: null
    });
  } catch (err) {
    setState({ 
      ...state, 
      loading: false,
      error: err.message
    });
  }
};
              `}
            </pre>
          </motion.div>
        </>
      );
    } else if (section.includes('ai')) {
      return (
        <>
          {/* AI Projects - Matrix-style falling lines */}
          <motion.div 
            className="fixed inset-0 pointer-events-none z-51 overflow-hidden"
            style={{
              opacity: Math.sin(progress * Math.PI) * 0.5,
            }}
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-purple-400/10 w-px"
                style={{
                  height: `${Math.random() * 30 + 10}%`,
                  left: `${i * 5 + Math.random() * 5}%`,
                  top: `-10%`,
                  transform: `translateY(${progress * 200 - 20}%)`,
                  opacity: Math.random() * 0.5 + 0.2,
                }}
              />
            ))}
          </motion.div>
          <motion.div 
            className="fixed inset-0 pointer-events-none z-51"
            style={{
              background: 'radial-gradient(circle at 30% 70%, rgba(139,92,246,0.05), transparent 60%)',
              opacity: Math.sin(progress * Math.PI),
            }}
          />
        </>
      );
    } else if (section.includes('creative')) {
      return (
        <>
          {/* Creative Lab - Glitch effects and light flickers */}
          <motion.div 
            className="fixed inset-0 pointer-events-none z-51"
            style={{
              background: 'radial-gradient(circle at 70% 30%, rgba(255,70,170,0.07), transparent 60%)',
              opacity: Math.sin(progress * Math.PI),
              filter: progress > 0.45 && progress < 0.55 ? 'hue-rotate(90deg)' : 'none',
              transition: 'filter 0.1s',
            }}
          />
          <motion.div 
            className="fixed inset-0 pointer-events-none z-51"
            style={{
              boxShadow: progress > 0.48 && progress < 0.52 ? 'inset 0 0 100px rgba(255,70,170,0.3)' : 'none',
              opacity: progress > 0.48 && progress < 0.52 ? 0.7 : 0,
              transition: 'opacity 0.05s',
            }}
          />
        </>
      );
    }
    
    return null;
  };

  // Common transition elements
  return (
    <AnimatePresence>
      {active && (
        <>
          {/* Background parallax layer - Slowest movement */}
          <motion.div 
            className="fixed inset-0 pointer-events-none z-50"
            style={{
              opacity: Math.sin(progress * Math.PI) * 0.8,
              background: 'rgba(0, 0, 0, 0.2)',
              transform: `translateY(${progress * -3}%)`,
            }}
            transition={{ duration: 0.4 }}
          />
          
          {/* Category-specific parallax elements */}
          {renderCategorySpecificElements()}
          
          {/* Simple section indicator */}
          {progress > 0.45 && progress < 0.55 && (
            <motion.div
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-54"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <div 
                className="px-6 py-3 rounded-lg"
                style={{
                  background: 'rgba(0, 0, 0, 0.6)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <h3 className="text-xl font-light tracking-wider text-white">
                  {targetSection}
                </h3>
              </div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};

// Simplified Cinematic Camera Focus Shift Transition
export const CameraFocusShiftTransition = ({ active, progress, targetSection }) => {
  // State for subtle dust particles
  const [particles, setParticles] = useState([]);
  
  // Generate minimal dust particles for lens focus effect
  useEffect(() => {
    if (active && progress > 0.4 && progress < 0.6) {
      // Create minimal lens dust particles
      const newParticles = [];
      for (let i = 0; i < 10; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 1, // Smaller particles
          opacity: Math.random() * 0.3 + 0.1 // More subtle opacity
        });
      }
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [active, progress]);
  
  // Calculate blur based on progress - smooth sine curve
  // Maximum blur at midpoint of transition (progress = 0.5)
  const blurAmount = Math.sin(progress * Math.PI) * 15; // 0 -> 15 -> 0
  
  // Calculate subtle brightness change
  const brightness = 100 - Math.sin(progress * Math.PI) * 30; // 100% -> 70% -> 100%
  
  // Section-specific vignette color
  const getVignetteColor = (section) => {
    if (!section) return 'rgba(0, 0, 0, 0.8)';
    
    const sectionName = section.toLowerCase();
    
    if (sectionName.includes('visual')) {
      return 'rgba(30, 15, 10, 0.8)';
    } else if (sectionName.includes('ui') || sectionName.includes('ux')) {
      return 'rgba(10, 15, 25, 0.8)';
    } else if (sectionName.includes('development')) {
      return 'rgba(10, 25, 15, 0.8)';
    } else if (sectionName.includes('ai')) {
      return 'rgba(20, 10, 30, 0.8)';
    } else if (sectionName.includes('creative')) {
      return 'rgba(25, 10, 20, 0.8)';
    }
    
    return 'rgba(0, 0, 0, 0.8)';
  };
  
  return (
    <AnimatePresence>
      {active && (
        <>
          {/* Cinematic blur effect */}
          <motion.div 
            className="fixed inset-0 pointer-events-none z-50"
            style={{
              backdropFilter: `blur(${blurAmount}px)`,
              filter: `brightness(${brightness}%)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Subtle vignette overlay - darkens the edges like a camera lens */}
          <motion.div 
            className="fixed inset-0 pointer-events-none z-50"
            style={{
              background: `radial-gradient(
                circle,
                transparent ${50 - progress * 20}%,
                ${getVignetteColor(targetSection)} 100%
              )`,
              opacity: Math.sin(progress * Math.PI)
            }}
          />
          
          {/* Minimal dust particles for lens effect */}
          {particles.map(particle => (
            <motion.div
              key={particle.id}
              className="fixed pointer-events-none z-50 rounded-full"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                background: 'rgba(255, 255, 255, 0.8)',
                filter: 'blur(1px)',
                opacity: particle.opacity
              }}
            />
          ))}
          
          {/* Simple section indicator */}
          {progress > 0.45 && progress < 0.55 && (
            <motion.div
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-54"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div 
                className="px-6 py-3 rounded-lg"
                style={{
                  background: 'rgba(0, 0, 0, 0.6)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <h3 className="text-xl font-light tracking-wider text-white">
                  {targetSection}
                </h3>
              </div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};

// Fog & Light Beam Reveal transition effect
export const FogLightBeamTransition = ({ active, progress }) => {
  return (
    <AnimatePresence>
      {active && (
        <>
          {/* Fog overlay */}
          <motion.div 
            className="fixed inset-0 pointer-events-none z-50"
            style={{ 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 100%)',
              backdropFilter: `blur(${progress * 8}px)`
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: progress * 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
          
          {/* Light beam */}
          <motion.div 
            className="fixed inset-0 overflow-hidden pointer-events-none z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: progress > 0.3 && progress < 0.8 ? 0.8 : 0 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="absolute -inset-10"
              style={{
                background: 'linear-gradient(135deg, transparent 0%, rgba(16,185,129,0.2) 50%, transparent 100%)',
                transform: `translateX(${-100 + progress * 200}%) translateY(${-100 + progress * 200}%)`,
                height: '200vh',
                width: '200vw'
              }}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Parallax Panel Split transition effect
export const ParallaxPanelSplitTransition = ({ active, progress }) => {
  return (
    <AnimatePresence>
      {active && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-50">
          {/* Left panel */}
          <motion.div 
            className="absolute top-0 bottom-0 left-0 w-1/2 bg-black"
            style={{ 
              transformOrigin: 'right',
              transform: `translateX(${-progress * 100}%)`
            }}
          />
          
          {/* Right panel */}
          <motion.div 
            className="absolute top-0 bottom-0 right-0 w-1/2 bg-black"
            style={{ 
              transformOrigin: 'left',
              transform: `translateX(${progress * 100}%)`
            }}
          />
          
          {/* Center line glow */}
          <motion.div 
            className="absolute top-0 bottom-0 left-1/2 w-px bg-primary"
            style={{ 
              opacity: progress > 0.3 && progress < 0.7 ? 1 : 0,
              boxShadow: '0 0 15px 2px rgba(16, 185, 129, 0.7)',
              transform: 'translateX(-50%)'
            }}
          />
        </div>
      )}
    </AnimatePresence>
  );
};

// Dim to Black + Flash transition effect
export const DimFlashTransition = ({ active, progress }) => {
  return (
    <AnimatePresence>
      {active && (
        <>
          {/* Black fade */}
          <motion.div 
            className="fixed inset-0 bg-black pointer-events-none z-50"
            style={{ 
              opacity: progress < 0.5 ? progress * 2 : 2 - progress * 2
            }}
          />
          
          {/* Flash effect */}
          <motion.div 
            className="fixed inset-0 bg-primary pointer-events-none z-50"
            style={{ 
              opacity: progress > 0.45 && progress < 0.55 ? (progress - 0.45) * 10 * 0.2 : 0
            }}
          />
        </>
      )}
    </AnimatePresence>
  );
}; 