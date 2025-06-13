import React, { useEffect, useRef } from 'react';

const WelcomeToHeroSound = ({ isLoading, onTransitionComplete }) => {
  const audioRef = useRef(null);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    // If we're not loading and haven't played the sound yet
    if (!isLoading && !hasPlayedRef.current) {
      // In a real implementation, this would play a sound
      console.log('Playing welcome sound effect');
      hasPlayedRef.current = true;
      
      // Simulate sound playing with a timeout
      const timer = setTimeout(() => {
        if (onTransitionComplete) {
          onTransitionComplete();
        }
      }, 1000); // 1 second delay to simulate sound playing
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, onTransitionComplete]);

  return null; // This component doesn't render anything
};

export default WelcomeToHeroSound; 