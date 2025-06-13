import React, { useEffect, createContext, useContext, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Create context for Lenis instance
const SmoothScrollContext = createContext({
  lenis: null,
  scrollTo: () => {}
});

export const useSmoothScroll = () => {
  const context = useContext(SmoothScrollContext);
  if (!context) {
    throw new Error('useSmoothScroll must be used within a SmoothScrollProvider');
  }
  return context;
};

// Optimized easing function
const easeInOutQuad = t => t < 0.5 ? 2 * t * t : 1 - ((--t) * (2 - t));

const SmoothScrollProvider = ({ children }) => {
  const lenisRef = useRef(null);
  const location = useLocation();
  const [scrollController, setScrollController] = useState({
    lenis: null,
    scrollTo: () => {}
  });

  useEffect(() => {
    // Initialize Lenis with premium smooth feel
    const lenis = new Lenis({
      duration: 1.2,
      easing: easeInOutQuad,
      smooth: true,
      smoothTouch: false, // Disable on touch devices for better performance
      touchMultiplier: 2,
      wheelMultiplier: 1,
      orientation: 'vertical',
      lerp: 0.1, // Adjusted for smoother scrolling
    });
    lenisRef.current = lenis;

    // Update the scroll controller state with the new lenis instance
    setScrollController({
      lenis,
      scrollTo: (target, options) => lenis.scrollTo(target, options)
    });
    
    // Set up ScrollTrigger proxy
    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value);
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight
        };
      },
      pinType: document.body.style.transform ? "transform" : "fixed"
    });
    
    // Connect Lenis to ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    
    // Single RAF loop for better performance
    let rafId = null;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);
    
    // Listen for ScrollTrigger refresh events
    const refreshListener = () => {
      lenis.resize();
    };
    ScrollTrigger.addEventListener('refresh', refreshListener);
    
    // Cleanup on unmount
    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      
      lenis.off('scroll', ScrollTrigger.update);
      ScrollTrigger.removeEventListener('refresh', refreshListener);
      
      // Remove ScrollTrigger proxy
      ScrollTrigger.scrollerProxy(document.documentElement, null);
      
      // Kill all ScrollTriggers
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      
      // Destroy lenis
      lenis.destroy();
    };
  }, []);

  // Handle route changes - scroll to top and refresh ScrollTrigger
  useEffect(() => {
    if (lenisRef.current) {
      // Scroll to top when route changes
      lenisRef.current.scrollTo(0, { immediate: true });
      
      // Delay ScrollTrigger refresh to ensure DOM is updated
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }
  }, [location.pathname]);

  return (
    <SmoothScrollContext.Provider value={scrollController}>
      {children}
    </SmoothScrollContext.Provider>
  );
};

export default SmoothScrollProvider; 