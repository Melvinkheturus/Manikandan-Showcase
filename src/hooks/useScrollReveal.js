import { useEffect, useRef } from 'react';
import { useSmoothScroll } from '../context/SmoothScrollContext';

/**
 * Hook to add scroll reveal animations to DOM elements using IntersectionObserver
 * 
 * @param {Object} options - Configuration options
 * @param {String} options.animation - The animation class to add ('fade-in', 'scale-in', etc.)
 * @param {String} options.rootMargin - IntersectionObserver rootMargin
 * @param {Number} options.threshold - IntersectionObserver threshold
 * @param {Boolean} options.reset - Whether to remove the class when element exits viewport
 * @returns {Object} - Ref to attach to the target element
 */
const useScrollReveal = (options = {}) => {
  const {
    animation = 'reveal-element',
    rootMargin = '0px 0px -100px 0px',
    threshold = 0.2,
    reset = false,
  } = options;

  const elementRef = useRef(null);
  const { lenis } = useSmoothScroll();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Create observer with options
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Add class when element enters viewport
          if (entry.isIntersecting) {
            requestAnimationFrame(() => {
              entry.target.classList.add('is-visible');
            });
            
            // If no reset is needed, unobserve after animation is triggered
            if (!reset) {
              observer.unobserve(entry.target);
            }
          } 
          // Remove class when element exits viewport (if reset is true)
          else if (reset) {
            requestAnimationFrame(() => {
              entry.target.classList.remove('is-visible');
            });
          }
        });
      },
      { rootMargin, threshold }
    );

    // Add animation class to element
    if (animation && !element.classList.contains(animation)) {
      element.classList.add(animation);
    }

    // Start observing the element
    observer.observe(element);

    // Cleanup
    return () => {
      if (element) observer.unobserve(element);
    };
  }, [animation, rootMargin, threshold, reset, lenis]);

  return elementRef;
};

/**
 * Hook to add staggered animations to child elements of a container
 * 
 * @param {Object} options - Configuration options
 * @param {String} options.animation - The animation class to add to container ('reveal-stagger')
 * @param {String} options.childSelector - Selector for children to animate
 * @param {String} options.rootMargin - IntersectionObserver rootMargin
 * @param {Number} options.threshold - IntersectionObserver threshold
 * @param {Boolean} options.reset - Whether to remove the class when element exits viewport
 * @returns {Object} - Ref to attach to the container element
 */
export const useStaggeredScrollReveal = (options = {}) => {
  const {
    animation = 'reveal-stagger',
    childSelector = '*',
    rootMargin = '0px 0px -100px 0px',
    threshold = 0.2,
    reset = false,
  } = options;

  const containerRef = useRef(null);
  const { lenis } = useSmoothScroll();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create observer with options
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Add class when container enters viewport
          if (entry.isIntersecting) {
            requestAnimationFrame(() => {
              entry.target.classList.add('is-visible');
            });
            
            // If no reset is needed, unobserve after animation is triggered
            if (!reset) {
              observer.unobserve(entry.target);
            }
          } 
          // Remove class when container exits viewport (if reset is true)
          else if (reset) {
            requestAnimationFrame(() => {
              entry.target.classList.remove('is-visible');
            });
          }
        });
      },
      { rootMargin, threshold }
    );

    // Add animation class to container
    if (animation && !container.classList.contains(animation)) {
      container.classList.add(animation);
    }

    // Start observing the container
    observer.observe(container);

    // Cleanup
    return () => {
      if (container) observer.unobserve(container);
    };
  }, [animation, rootMargin, threshold, reset, childSelector, lenis]);

  return containerRef;
};

export default useScrollReveal; 