import React, { useState, useEffect } from 'react';
import { LazyMotion, domMax } from 'framer-motion';

// This component handles SSR compatibility for Framer Motion
const FramerMotionProvider = ({ children }) => {
  // Track if we're mounted in the browser
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    // Once the component mounts in the browser, we can safely use animations
    setIsMounted(true);
  }, []);
  
  // During SSR or before hydration is complete, render a placeholder
  if (!isMounted) {
    // This styling helps prevent layout shift during hydration
    return (
      <div style={{ visibility: 'hidden' }}>
        {children}
      </div>
    );
  }
  
  // Once mounted in the browser, use the full Framer Motion features
  return (
    <LazyMotion features={domMax}>
      {children}
    </LazyMotion>
  );
};

export default FramerMotionProvider; 