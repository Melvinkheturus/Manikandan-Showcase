import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const useScrollAnimation = (options = {}) => {
  const {
    trigger = null,
    start = 'top bottom',
    end = 'bottom top',
    scrub = false,
    pin = false,
    markers = false,
    animation = null,
    onEnter = null,
    onLeave = null,
    onEnterBack = null,
    onLeaveBack = null,
  } = options;

  const elementRef = useRef(null);
  const triggerRef = useRef(null);
  const scrollTriggerRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    const triggerElement = trigger ? trigger.current : elementRef.current;

    if (!element || !triggerElement) return;

    // Create the animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerElement,
        start,
        end,
        scrub,
        pin,
        markers,
        onEnter,
        onLeave,
        onEnterBack,
        onLeaveBack,
      },
    });

    // Add animations if provided
    if (animation && typeof animation === 'function') {
      animation(tl, element);
    }

    scrollTriggerRef.current = tl.scrollTrigger;

    // Cleanup
    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
      tl.kill();
    };
  }, [
    trigger,
    start,
    end,
    scrub,
    pin,
    markers,
    animation,
    onEnter,
    onLeave,
    onEnterBack,
    onLeaveBack,
  ]);

  return { elementRef, triggerRef };
};

export default useScrollAnimation; 