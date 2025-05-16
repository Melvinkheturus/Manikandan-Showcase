import { useState, useEffect, useCallback } from 'react';
import { Howl } from 'howler';

// Sound categories
export const SOUND_CATEGORIES = {
  UI: "ui",
  TRANSITION: "transition",
  WELCOME: "welcome",
  SECTION: "section",
  PROJECT: "project",
};

/**
 * Custom hook to manage sound effects without background ambient sounds
 * Simplified version that only handles SFX
 */
const useSoundEffects = () => {
  const [sounds, setSounds] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize sounds
  useEffect(() => {
    if (!isInitialized) {
      // Define sound effects
      const soundEffects = {
        // UI sounds
        [`${SOUND_CATEGORIES.UI}_click`]: {
          src: '/sounds/click.mp3',
          volume: 0.5,
        },
        [`${SOUND_CATEGORIES.UI}_hover`]: {
          src: '/sounds/hover.mp3',
          volume: 0.3,
        },
        [`${SOUND_CATEGORIES.UI}_success`]: {
          src: '/sounds/success.mp3',
          volume: 0.5,
        },
        
        // Transition sounds
        [`${SOUND_CATEGORIES.TRANSITION}_default`]: {
          src: '/sounds/transition.mp3',
          volume: 0.4,
        },
        [`${SOUND_CATEGORIES.WELCOME}_hero`]: {
          src: '/sounds/welcome-hero.mp3',
          volume: 0.5,
        },

        // Section transition sounds
        [`${SOUND_CATEGORIES.SECTION}_about`]: {
          src: '/sounds/section-about.mp3',
          volume: 0.4,
        },
        [`${SOUND_CATEGORIES.SECTION}_skills`]: {
          src: '/sounds/section-skills.mp3',
          volume: 0.4,
        },
        [`${SOUND_CATEGORIES.SECTION}_projects`]: {
          src: '/sounds/section-projects.mp3',
          volume: 0.4,
        },
        [`${SOUND_CATEGORIES.SECTION}_contact`]: {
          src: '/sounds/section-contact.mp3',
          volume: 0.4,
        },

        // Project sounds
        [`${SOUND_CATEGORIES.PROJECT}_reveal`]: {
          src: '/sounds/project-reveal.mp3',
          volume: 0.5,
        },
      };
      
      // Initialize Howl instances
      const soundInstances = {};
      
      Object.entries(soundEffects).forEach(([key, config]) => {
        try {
          // Skip if no source provided
          if (!config.src) return;
          
          // Create Howl instance
          soundInstances[key] = new Howl({
            src: [config.src],
            volume: config.volume || 0.5,
            preload: true,
          });
          
          console.log(`Sound effect initialized: ${key}`);
        } catch (error) {
          console.error(`Failed to initialize sound: ${key}`, error);
        }
      });
      
      setSounds(soundInstances);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Play a specific sound
  const playSound = useCallback((soundKey) => {
    if (sounds[soundKey]) {
      sounds[soundKey].play();
    }
  }, [sounds]);

  // UI sound helpers
  const playClickSound = useCallback(() => playSound(`${SOUND_CATEGORIES.UI}_click`), [playSound]);
  const playHoverSound = useCallback(() => playSound(`${SOUND_CATEGORIES.UI}_hover`), [playSound]);
  const playSuccessSound = useCallback(() => playSound(`${SOUND_CATEGORIES.UI}_success`), [playSound]);
  
  // Transition sound helpers
  const playTransitionSound = useCallback(() => playSound(`${SOUND_CATEGORIES.TRANSITION}_default`), [playSound]);
  const playWelcomeToHeroTransition = useCallback(() => playSound(`${SOUND_CATEGORIES.WELCOME}_hero`), [playSound]);
  
  // Section transition sounds
  const playSectionTransition = useCallback((sectionName) => {
    const soundKey = `${SOUND_CATEGORIES.SECTION}_${sectionName.toLowerCase()}`;
    playSound(soundKey);
  }, [playSound]);
  
  // Project sounds
  const playProjectReveal = useCallback(() => playSound(`${SOUND_CATEGORIES.PROJECT}_reveal`), [playSound]);

  return {
    // Direct access
    playSound,
    
    // UI Sounds
    playClickSound,
    playHoverSound,
    playSuccessSound,
    
    // Transition Sounds
    playTransitionSound,
    playWelcomeToHeroTransition,
    
    // Section Sounds
    playSectionTransition,
    
    // Project Sounds
    playProjectReveal
  };
};

export default useSoundEffects; 