/**
 * Smoothly scrolls to a target element with configurable options
 * 
 * @param {string} targetId - The ID of the element to scroll to
 * @param {Object} options - Configuration options
 * @param {number} options.duration - Duration of the scroll animation in ms (default: 800)
 * @param {string} options.easing - Easing function to use (default: 'easeInOutQuad')
 * @param {number} options.offset - Offset from the target in pixels (default: 0)
 * @param {Function} options.callback - Function to call when scrolling is complete
 */
export const smoothScrollTo = (targetId, options = {}) => {
  const {
    duration = 800,
    easing = 'easeInOutQuad',
    offset = 0,
    callback = () => {}
  } = options;

  const targetElement = document.getElementById(targetId);
  if (!targetElement) return;

  const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
  const startPosition = window.scrollY;
  const distance = targetPosition - startPosition + offset;
  let startTime = null;

  // Easing functions
  const easings = {
    linear: t => t,
    easeInQuad: t => t * t,
    easeOutQuad: t => t * (2 - t),
    easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeInCubic: t => t * t * t,
    easeOutCubic: t => (--t) * t * t + 1,
    easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
  };

  // Animation function
  function animate(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const easeProgress = easings[easing](progress);
    
    window.scrollTo(0, startPosition + distance * easeProgress);
    
    if (timeElapsed < duration) {
      requestAnimationFrame(animate);
    } else {
      callback();
    }
  }

  requestAnimationFrame(animate);
};

/**
 * Activates smooth scrolling for all links that point to internal anchors
 */
export const initSmoothScrolling = () => {
  document.addEventListener('click', (e) => {
    // Check if the clicked element is an anchor with a hash link
    const anchor = e.target.closest('a[href^="#"]');
    
    if (anchor) {
      const targetId = anchor.getAttribute('href').substring(1);
      if (targetId) {
        e.preventDefault();
        
        smoothScrollTo(targetId, {
          offset: -80, // Account for fixed header if needed
          duration: 1000,
          easing: 'easeInOutCubic'
        });
      }
    }
  });
};

export default { smoothScrollTo, initSmoothScrolling }; 