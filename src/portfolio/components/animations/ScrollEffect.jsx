import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const ScrollEffect = ({ children }) => {
  const smoothWrapperRef = useRef(null);
  const contentRef = useRef(null);
  const smootherRef = useRef(null);

  // We use useLayoutEffect to ensure DOM measurements happen before the browser paint
  useLayoutEffect(() => {
    // Create the smoother
    smootherRef.current = ScrollSmoother.create({
      smooth: 1.5, // Adjust the smoothness (higher = slower)
      effects: true,
      wrapper: smoothWrapperRef.current,
      content: contentRef.current,
      normalizeScroll: true, // Prevents other scroll plugins from affecting the smoothness
      ignoreMobileResize: true, // Prevents issues with mobile browser address bar show/hide
    });

    // Add effects to elements
    gsap.utils.toArray('[data-speed]').forEach(target => {
      const speed = parseFloat(target.getAttribute('data-speed')) || 0;
      smootherRef.current.effects(target, { speed });
    });

    return () => {
      // Clean up
      if (smootherRef.current) {
        smootherRef.current.kill();
      }
    };
  }, []);

  // Handle hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash && smootherRef.current) {
        const target = document.querySelector(hash);
        if (target) {
          // Wait a bit to ensure ScrollSmoother is initialized
          setTimeout(() => {
            smootherRef.current.scrollTo(target, true, 'top top');
          }, 100);
        }
      }
    };

    // Initial check
    handleHashChange();

    // Listen for changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div ref={smoothWrapperRef} className="smooth-wrapper">
      <div ref={contentRef} className="smooth-content">
        {children}
      </div>
    </div>
  );
};

export default ScrollEffect; 