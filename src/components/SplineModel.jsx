import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const SplineModel = ({ url }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef(null);

  // Prevent scroll events from affecting the Spline model
  useEffect(() => {
    const container = containerRef.current;
    
    const preventScroll = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };
    
    // Define preventDocumentScroll outside the if block so it's available for cleanup
    const preventDocumentScroll = (e) => {
      if (container && container.contains(e.target)) {
        e.preventDefault();
        return false;
      }
    };
    
    if (container) {
      container.addEventListener('wheel', preventScroll, { passive: false });
      container.addEventListener('touchmove', preventScroll, { passive: false });
      container.addEventListener('scroll', preventScroll, { passive: false });
      
      // Prevent scrolling on the document when mouse is over container
      document.addEventListener('wheel', preventDocumentScroll, { passive: false });
      document.addEventListener('touchmove', preventDocumentScroll, { passive: false });
    }
    
    return () => {
      if (container) {
        container.removeEventListener('wheel', preventScroll);
        container.removeEventListener('touchmove', preventScroll);
        container.removeEventListener('scroll', preventScroll);
        document.removeEventListener('wheel', preventDocumentScroll);
        document.removeEventListener('touchmove', preventDocumentScroll);
      }
    };
  }, []);

  useEffect(() => {
    // Check if script is already loaded
    if (document.querySelector('script[src*="@splinetool/viewer"]')) {
      console.log('Spline script already loaded');
      return;
    }

    // Load the Spline script dynamically
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@splinetool/viewer@1.9.94/build/spline-viewer.js';
    script.onload = () => console.log('Spline script loaded');
    script.onerror = (e) => {
      console.error('Failed to load Spline script', e);
      setHasError(true);
    };
    document.head.appendChild(script);

    return () => {
      // We shouldn't remove the script on unmount as it might be used by other components
      // Just clean up event listeners instead
    };
  }, []);

  // Create an event listener for the Spline viewer load events
  useEffect(() => {
    const handleSplineLoad = () => {
      console.log('Spline model loaded');
      setIsLoaded(true);
      
      // After loading, find the spline viewer and disable its scroll behavior
      setTimeout(() => {
        const viewer = document.querySelector('spline-viewer');
        if (viewer && viewer.shadowRoot) {
          const canvas = viewer.shadowRoot.querySelector('canvas');
          if (canvas) {
            // Disable scroll events on the canvas
            canvas.addEventListener('wheel', e => {
              e.preventDefault();
              e.stopPropagation();
              return false;
            }, { passive: false });
            
            // Try to access and modify the Spline viewer's internal properties
            if (viewer.spline && viewer.spline.runtime) {
              // Disable orbit controls and zoom
              try {
                viewer.spline.runtime.disableZoom = true;
                viewer.spline.runtime.disableOrbit = true;
                
                // Try to disable the internal handlers
                if (viewer.spline.runtime.domElement) {
                  viewer.spline.runtime.domElement.onwheel = null;
                  viewer.spline.runtime.domElement.onmousewheel = null;
                }
              } catch (e) {
                console.warn('Could not disable Spline controls', e);
              }
            }
            
            // Insert a script to override Spline's internal wheel handler
            const script = document.createElement('script');
            script.innerHTML = `
              // Override wheel events for Spline viewers
              (function() {
                const originalAddEventListener = EventTarget.prototype.addEventListener;
                EventTarget.prototype.addEventListener = function(type, listener, options) {
                  if (type === 'wheel' && this.tagName === 'CANVAS' && this.closest('spline-viewer')) {
                    // Don't add wheel listeners to Spline canvas
                    console.log('Prevented wheel listener on Spline canvas');
                    return;
                  }
                  return originalAddEventListener.call(this, type, listener, options);
                };
              })();
            `;
            document.head.appendChild(script);
          }
        }
      }, 500);
    };

    // Add event listener for both custom event and direct element events
    document.addEventListener('spline-load', handleSplineLoad);
    
    // Check if we already have a spline-viewer that's loaded
    const checkExistingViewer = () => {
      const viewer = document.querySelector('spline-viewer');
      if (viewer && viewer.shadowRoot) {
        const canvas = viewer.shadowRoot.querySelector('canvas');
        if (canvas) {
          console.log('Found existing Spline canvas');
          setIsLoaded(true);
        }
      }
    };
    
    // Check initially and then periodically
    checkExistingViewer();
    const interval = setInterval(checkExistingViewer, 1000);
    
    return () => {
      document.removeEventListener('spline-load', handleSplineLoad);
      clearInterval(interval);
    };
  }, []);

  // Function to handle errors from the Spline viewer
  const handleSplineError = (e) => {
    console.error('Error loading Spline model', e);
    setHasError(true);
  };

  return (
    <div 
      ref={containerRef}
      className="spline-container w-full h-full relative flex justify-center items-center"
      style={{
        width: "1100px",  // Increased container width
        height: "900px", // Same height
        overflow: "hidden", // Prevent overflow
        margin: "0 auto"  // Center the container
      }}
    >
      {!isLoaded && !hasError && (
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="text-primary font-medium">Loading 3D model...</div>
        </motion.div>
      )}
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center text-red-500">
          Failed to load 3D model
        </div>
      )}

      <spline-viewer 
        url={url}
        className="spline-3d-model"
        style={{ 
          opacity: isLoaded ? 1 : 0, 
          transition: 'opacity 0.5s ease',
          width: "100%",
          height: "100%",
          transform: "scale(0.3)", // Add back scaling but smaller
          transformOrigin: "center" // Scale from the center
        }}
        onError={handleSplineError}
        onLoad={() => {
          console.log('Spline onLoad triggered');
          document.dispatchEvent(new Event('spline-load'));
          setIsLoaded(true);
        }}
        presentation="true"
        loading="lazy"
        width="100%"
        height="100%"
        zoom="0.3" // Reduce zoom value
      ></spline-viewer>
    </div>
  );
};

export default SplineModel; 