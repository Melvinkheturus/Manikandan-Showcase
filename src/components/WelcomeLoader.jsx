import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Howl } from 'howler';
import { useProgress } from '@react-three/drei';

// Sound effects - removed ambient sound, kept only SFX
const sounds = {
  tick: new Howl({
    src: ['/sounds/progress_chime.mp3'],
    volume: 0.3,
  }),
  complete: new Howl({
    src: ['/sounds/progress_chime.mp3'], // Ideally a different, more distinct sound
    volume: 0.5,
  }),
  whoosh: new Howl({
    src: ['/sounds/ambient_whoosh.mp3'], // Ideally a different whoosh sound
    volume: 0.4,
  })
};

// Main WelcomeLoader component
const WelcomeLoader = ({ onFinish }) => {
  const { progress } = useProgress();
  const [currentProgress, setCurrentProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [zoomActive, setZoomActive] = useState(false);
  const controls = useAnimation();
  
  // Using a ref to track if the component is mounted
  const isMounted = useRef(true);
  const progressMilestones = useRef({
    25: false,
    50: false,
    75: false,
    100: false
  });

  // Initialize loading simulation - removed ambient sound playing
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProgress((prev) => {
        const newProgress = Math.min(prev + 1, 100);
        
        // Check milestones for sound effects
    Object.keys(progressMilestones.current).forEach(milestone => {
      const milestoneValue = parseInt(milestone);
          if (!progressMilestones.current[milestone] && newProgress >= milestoneValue) {
        progressMilestones.current[milestone] = true;
            if (milestoneValue < 100) {
              sounds.tick.play();
            } else {
              sounds.complete.play();
              handleLoadingComplete();
      }
    }
  });

        return newProgress;
      });
    }, 60);
    
    return () => {
      clearInterval(interval);
      isMounted.current = false;
      sounds.tick.stop();
      sounds.complete.stop();
      sounds.whoosh.stop();
    };
  }, []);
  
  // Handle loading complete animation sequence - removed ambient sound fade out
  const handleLoadingComplete = async () => {
    if (loadingComplete) return;
    
    setLoadingComplete(true);
    
    // Wait for pulse animation (handled in JSX)
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Trigger zoom effect
    setZoomActive(true);
    sounds.whoosh.play();
    
    // Wait for zoom animation to complete
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Complete transition to hero section
        if (isMounted.current) {
          onFinish();
        }
      };
  
  // Safety fallback to ensure the loader doesn't hang indefinitely
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      if (isMounted.current && !loadingComplete) {
        console.log("Safety timeout: forcing loader completion");
        handleLoadingComplete();
      }
    }, 12000); // Force complete after 12 seconds
    
    return () => clearTimeout(safetyTimer);
  }, [loadingComplete]);
  
  // Generate a random set of particles for the orb
  const generateParticles = (count) => {
    return Array.from({ length: count }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.2 + Math.random() * 0.6; // Keeps particles inside the orb
      return {
        id: i,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        size: 1 + Math.random() * 2,
        speed: 0.2 + Math.random() * 0.8,
        opacity: 0.4 + Math.random() * 0.6,
        hue: Math.random() > 0.7 ? 160 : 140 // Mostly emerald with some teal
      };
    });
  };
  
  const innerParticles = useRef(generateParticles(40));
  
  return (
    <AnimatePresence>
    <motion.div
      className="fixed inset-0 z-50 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
        style={{
          background: 'linear-gradient(180deg, #0a0a0a, #012a1a)'
        }}
      >
        {/* Scrolling background text */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute whitespace-nowrap text-[15vw] font-bold text-emerald-900/10 select-none"
            style={{ y: '30vh' }}
            animate={{ 
              x: [0, -2000], 
            }}
            transition={{ 
              x: { repeat: Infinity, duration: 20, ease: "linear" },
            }}
          >
            CREATIVE DEVELOPER CREATIVE DESIGNER CREATIVE DEVELOPER
          </motion.div>
          
          <motion.div 
            className="absolute whitespace-nowrap text-[15vw] font-bold text-emerald-800/5 select-none"
            style={{ y: '60vh' }}
            animate={{ 
              x: [-500, -2500], 
            }}
            transition={{ 
              x: { repeat: Infinity, duration: 25, ease: "linear" },
            }}
          >
            UI/UX ENTHUSIAST FRONTEND DEVELOPER UI/UX ENTHUSIAST
          </motion.div>
        </div>

        {/* Central container with zoom effect */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          animate={zoomActive ? {
            scale: [1, 30],
            opacity: [1, 0]
          } : {}}
          transition={{
            duration: 1.2,
            ease: "easeInOut"
          }}
        >
          {/* Orb container */}
          <motion.div 
            className="relative"
            animate={loadingComplete && !zoomActive ? {
              scale: [1, 1.3, 1]
            } : {}}
            transition={{
              duration: 0.4,
              ease: "easeInOut"
            }}
          >
            {/* Glowing base orb */}
            <motion.div 
              className="w-44 h-44 rounded-full relative flex items-center justify-center bg-black"
              style={{
                boxShadow: '0 0 40px 5px rgba(20, 184, 156, 0.3)'
              }}
              animate={{ 
                boxShadow: loadingComplete 
                  ? '0 0 60px 10px rgba(20, 184, 156, 0.6)' 
                  : '0 0 40px 5px rgba(20, 184, 156, 0.3)'
              }}
              transition={{ duration: 0.4 }}
            >
              {/* Glass shell effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-900/20 to-transparent backdrop-blur-sm" />
              
              {/* Rim light effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-transparent to-emerald-400/20" />
              
              {/* Swirling particles container - clipped to orb */}
              <div className="absolute inset-2 rounded-full overflow-hidden flex items-center justify-center">
                <motion.div 
                  className="absolute inset-0"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                >
                  {/* Radial mask that reveals based on progress */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-b from-emerald-500/30 to-teal-700/20"
                    style={{
                      clipPath: `circle(${currentProgress}% at center)`
                    }}
                  />
                  
                  {/* Inner particles */}
                  {innerParticles.current.map((particle) => (
                    <motion.div
                      key={particle.id}
                      className="absolute rounded-full"
                      style={{
                        left: `calc(50% + ${particle.x * 100}%)`,
                        top: `calc(50% + ${particle.y * 100}%)`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        backgroundColor: `hsla(${particle.hue}, 80%, 60%, ${particle.opacity})`,
                        opacity: currentProgress / 100
                      }}
                      animate={{
                        x: [0, Math.random() * 20 - 10],
                        y: [0, Math.random() * 20 - 10]
                      }}
                      transition={{
                        repeat: Infinity,
                        repeatType: "reverse",
                        duration: particle.speed * 2,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </motion.div>
      </div>
    </motion.div>
            
            {/* Orbital particle halo */}
            <motion.div
              className="absolute inset-0 -z-10"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            >
              {Array.from({ length: 24 }).map((_, i) => {
                const isEven = i % 2 === 0;
                const angle = (i / 24) * Math.PI * 2;
                const x = Math.cos(angle) * 140;
                const y = Math.sin(angle) * 140;
                
                return (
                  <motion.div
                    key={i}
                    className={`absolute rounded-full ${isEven ? 'bg-emerald-400' : 'bg-teal-400'}`}
                    style={{
                      left: 'calc(50%)',
                      top: 'calc(50%)',
                      width: '4px',
                      height: '4px',
                      x: x,
                      y: y,
                      opacity: 0.1 + (currentProgress / 100) * 0.9 // Brightness increases with progress
                    }}
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [
                        0.1 + (currentProgress / 100) * 0.7,
                        0.1 + (currentProgress / 100) * 0.9,
                        0.1 + (currentProgress / 100) * 0.7
                      ]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      delay: i * 0.1,
                      ease: "easeInOut"
                    }}
                  />
                );
              })}
            </motion.div>
          </motion.div>
          
          {/* Progress percentage - Outside the zooming orb container */}
          <motion.div 
            className="absolute z-20 text-white text-xl font-bold"
            animate={{ 
              opacity: zoomActive ? 0 : [0.7, 1, 0.7]
            }}
            transition={{ 
              opacity: zoomActive ? { duration: 0.3 } : { repeat: Infinity, duration: 2 }
            }}
          >
            {currentProgress}%
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WelcomeLoader; 