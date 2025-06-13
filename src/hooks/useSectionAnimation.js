import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSmoothScroll } from '../portfolio/components/providers/SmoothScrollProvider';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/**
 * Custom hook for creating section animations with GSAP and ScrollTrigger
 * @param {Object} options - Configuration options
 * @param {String} options.type - Animation type ('fade', 'slide', 'stagger', 'custom')
 * @param {Number} options.duration - Animation duration in seconds
 * @param {String} options.easing - GSAP easing function
 * @param {Object} options.from - Starting properties for the animation
 * @param {Object} options.to - Ending properties for the animation
 * @param {Number} options.delay - Delay before animation starts
 * @param {Number} options.staggerDelay - Delay between staggered elements
 * @param {String} options.animateFrom - Direction for slide animations ('top', 'bottom', 'left', 'right')
 * @param {Function} options.customAnimation - Custom animation function when type is 'custom'
 * @param {Object} options.triggerOptions - Additional ScrollTrigger options
 */
const useSectionAnimation = (options = {}) => {
  const {
    type = 'fade',
    duration = 1,
    easing = 'power3.out',
    from = {},
    to = {},
    delay = 0,
    staggerDelay = 0.1,
    animateFrom = 'bottom',
    customAnimation = null,
    triggerOptions = {},
  } = options;

  const sectionRef = useRef(null);
  const elementsRef = useRef(null);
  const { lenis } = useSmoothScroll();
  
  useEffect(() => {
    if (!sectionRef.current) return;
    
    let animation;
    let ctx = gsap.context(() => {});
    
    // Make sure Lenis is initialized and wait for it
    const initAnimation = () => {
      if (!sectionRef.current) return;
      
      // Clear previous context if it exists
      ctx.revert();

      // Default ScrollTrigger settings
      const defaultScrollTrigger = {
        trigger: sectionRef.current,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
        ...triggerOptions // Override defaults with any provided options
      };
      
      // Create a new context
      ctx = gsap.context(() => {
        // Define default animations based on type
        if (type === 'fade') {
          animation = gsap.fromTo(
            sectionRef.current,
            { opacity: 0, ...from },
            { 
              opacity: 1,
              duration,
              ease: easing,
              delay,
              ...to,
              scrollTrigger: defaultScrollTrigger
            }
          );
        } else if (type === 'slide') {
          // Set default 'from' position based on animateFrom direction
          const defaultFrom = {
            top: { y: -50 },
            bottom: { y: 50 },
            left: { x: -50 },
            right: { x: 50 },
          }[animateFrom] || { y: 50 };
          
          animation = gsap.fromTo(
            sectionRef.current,
            { opacity: 0, ...defaultFrom, ...from },
            { 
              opacity: 1,
              x: 0,
              y: 0,
              duration,
              ease: easing,
              delay,
              ...to,
              scrollTrigger: defaultScrollTrigger
            }
          );
        } else if (type === 'stagger' && elementsRef.current) {
          // For staggered animations we need elements to animate
          animation = gsap.fromTo(
            elementsRef.current,
            { opacity: 0, y: 20, ...from },
            { 
              opacity: 1,
              y: 0,
              duration,
              stagger: staggerDelay,
              ease: easing,
              delay,
              ...to,
              scrollTrigger: defaultScrollTrigger
            }
          );
        } else if (type === 'custom' && typeof customAnimation === 'function') {
          // Use custom animation function
          animation = customAnimation(sectionRef.current, elementsRef.current, { 
            gsap, 
            ScrollTrigger,
            duration,
            ease: easing,
            delay,
            scrollTrigger: defaultScrollTrigger
          });
        }
      }, sectionRef); // Scope to section
    };

    // Initialize animation once
    initAnimation();

    // If lenis is available, refresh ScrollTrigger when lenis updates
    const handleLenisScroll = () => {
      ScrollTrigger.update();
    };

    if (lenis) {
      lenis.on('scroll', handleLenisScroll);
    }

    // Clean up animations when component unmounts
    return () => {
      ctx.revert(); // Clean up context
      if (lenis) {
        lenis.off('scroll', handleLenisScroll);
      }
    };
  }, [lenis, type, duration, easing, delay, staggerDelay, animateFrom, customAnimation, triggerOptions]);

  return { sectionRef, elementsRef };
};

export default useSectionAnimation; 