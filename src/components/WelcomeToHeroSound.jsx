import React, { useEffect, useState } from 'react';
import useSoundEffects from '../hooks/useSoundEffects';

/**
 * Component that plays the welcome to hero transition sound
 * It detects when the loader completes and plays the transition sound
 */
const WelcomeToHeroSound = ({ isLoading, onTransitionComplete }) => {
  const { playWelcomeToHeroTransition } = useSoundEffects();
  const [hasPlayed, setHasPlayed] = useState(false);
  
  // Play transition sound when loading completes
  useEffect(() => {
    // If loading just completed and sound hasn't played yet
    if (!isLoading && !hasPlayed) {
      // Small delay to let the animation start
      const timer = setTimeout(() => {
        playWelcomeToHeroTransition();
        setHasPlayed(true);
        
        // Let parent components know the transition completed
        if (onTransitionComplete) {
          // Add a delay matching the sound duration (approximately)
          setTimeout(onTransitionComplete, 1000);
        }
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, hasPlayed, playWelcomeToHeroTransition, onTransitionComplete]);
  
  // This is a utility component that doesn't render anything
  return null;
};

export default WelcomeToHeroSound; 