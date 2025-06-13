import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TypingText from '../components/animations/TypingText';

const PreloaderPage = ({ onFinish }) => {
  const [currentProgress, setCurrentProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [zoomActive, setZoomActive] = useState(false);
  
  const isMounted = useRef(true);
  const progressMilestones = useRef({
    25: false,
    50: false,
    75: false,
    100: false
  });

  // Calculate expected loading duration (approx. 2 seconds with current settings)
  const loadingDuration = 2000; // 2 seconds for full loading
  
  // Initialize loading simulation - speed increased
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProgress((prev) => {
        const newProgress = Math.min(prev + 2, 100); // Increased speed (2 instead of 1)
        
        // Check milestones for triggering events
        Object.keys(progressMilestones.current).forEach(milestone => {
          const milestoneValue = parseInt(milestone);
          if (!progressMilestones.current[milestone] && newProgress >= milestoneValue) {
            progressMilestones.current[milestone] = true;
            
            // Check if we've hit 100%
            if (milestoneValue === 100) {
              handleLoadingComplete();
            }
          }
        });

        return newProgress;
      });
    }, 40); // Reduced interval for faster loading
    
    return () => {
      clearInterval(interval);
      isMounted.current = false;
    };
  }, []);
  
  // Handle loading complete animation sequence - synchronized transition
  const handleLoadingComplete = async () => {
    if (loadingComplete) return;
    
    // Trigger everything at once when 100% is reached
    setLoadingComplete(true);
    setZoomActive(true);
    
    // Complete transition to main page immediately, no delay
      onFinish();
  };
  
  // Safety fallback to ensure the loader doesn't hang indefinitely
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      if (isMounted.current && !loadingComplete) {
        console.log("Safety timeout: forcing loader completion");
        handleLoadingComplete();
      }
    }, 10000); // 10 seconds max loading time
    
    return () => clearTimeout(safetyTimer);
  }, [loadingComplete]);
  
  // Common exit animation properties for all elements
  const exitAnimation = {
    opacity: 0,
    transition: { 
      duration: 0.3, // Faster exit
      ease: "easeOut"
    }
  };
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed inset-0 z-50 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={exitAnimation}
        key="preloader"
        style={{
          background: 'linear-gradient(180deg, #0a0a0a, #012a1a)'
        }}
      >
        {/* Logo at top left */}
        <motion.div 
          className="absolute top-8 left-8 z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={loadingComplete ? 
            { opacity: 0, transition: { duration: 0.5 } } : 
            { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2 } }
          }
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
        >
          <img 
            src="/assets/Logo.png" 
            alt="Logo" 
            className="h-12 w-auto"
          />
        </motion.div>
        
        {/* Typing text at top right - adjusted typing speed to match loader */}
        <motion.div 
          className="absolute top-8 right-8 z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={loadingComplete ? 
            { opacity: 0, transition: { duration: 0.5 } } : 
            { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.4 } }
          }
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
        >
          <TypingText 
            words={["Hello World"]} 
            typingSpeed={20} // Even faster typing speed to complete before 100%
            deleteSpeed={20}
            delayBetweenWords={9999} // Make it never delete the text
            className="tracking-wider text-base font-mono"
            noLoop={true} // Ensure it only shows once
          />
        </motion.div>

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
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
          >
            CREATIVE TECHNOLOGIST CREATIVE DESIGNER CREATIVE TECHNOLOGIST
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
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
          >
            UI/UX DESIGNER • AI ENTHUSIAST • UI/UX DESIGNER
          </motion.div>
        </div>

        {/* Cinematic transition - background fade */}
        <motion.div 
          className="absolute inset-0 bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: zoomActive ? 0.7 : 0 }}
          transition={{ duration: 0.5 }}
        />

        {/* Central container with zoom effect - updated for synchronized transition */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          animate={zoomActive ? {
            scale: [1, 20],
            filter: ["blur(0px)", "blur(10px)"],
            opacity: [1, 0]
          } : {}}
          transition={{
            duration: 0.7, // Faster zoom transition
            ease: "easeInOut"
          }}
        >
          {/* Orb container */}
          <motion.div className="relative">
            {/* Glowing base orb */}
            <motion.div 
              className="w-44 h-44 rounded-full relative flex items-center justify-center bg-black"
              style={{
                boxShadow: '0 0 40px 5px rgba(20, 184, 156, 0.3)'
              }}
              animate={{ 
                boxShadow: loadingComplete 
                  ? '0 0 60px 15px rgba(20, 184, 156, 0.8)' // Increased glow intensity at 100%
                  : '0 0 40px 5px rgba(20, 184, 156, 0.3)'
              }}
              transition={{ duration: 0.4 }}
            >
              {/* Glass shell effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-900/20 to-transparent backdrop-blur-sm" />
              
              {/* Rim light effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-transparent to-emerald-400/20" />
              
              {/* Progress percentage */}
              <motion.div 
                className="absolute z-20 text-white text-xl font-bold"
                animate={{ 
                  opacity: zoomActive ? 0 : [0.7, 1, 0.7],
                  scale: loadingComplete ? [1, 1.2] : 1, // Pulse effect at 100%
                }}
                transition={{ 
                  opacity: zoomActive ? { duration: 0.3 } : { repeat: Infinity, duration: 2 },
                  scale: { duration: 0.3 }
                }}
              >
                {currentProgress}%
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PreloaderPage; 