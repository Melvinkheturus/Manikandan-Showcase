import React, { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import useSound from '../hooks/useSound';

/**
 * Component that plays a sound when a section comes into view
 * Can be wrapped around sections to trigger section-specific sounds
 */
const SectionSoundEffect = ({ 
  children, 
  sectionName = 'default',
  threshold = 0.3,
  triggerOnce = true,
  playOnExit = false
}) => {
  const { playSectionTransition, isMuted } = useSound();
  const hasPlayed = useRef(false);
  
  const { ref, inView } = useInView({
    threshold,
    triggerOnce
  });
  
  // Play sound when section comes into view
  useEffect(() => {
    if (inView && !hasPlayed.current && !isMuted) {
      playSectionTransition(sectionName);
      hasPlayed.current = triggerOnce ? true : false;
    } else if (!inView && playOnExit && hasPlayed.current && !isMuted) {
      // Play a different sound when exiting if needed
      // This could be implemented as needed
      hasPlayed.current = false;
    }
  }, [inView, sectionName, playSectionTransition, isMuted, triggerOnce, playOnExit]);
  
  return (
    <div ref={ref}>
      {children}
    </div>
  );
};

export default SectionSoundEffect; 