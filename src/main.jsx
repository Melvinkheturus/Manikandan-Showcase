import React from 'react';
import ReactDOM from 'react-dom/client';
import Router from './router.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import './index.css';
import './styles/smoothScroll.css';
import './styles/fonts.css';
import './styles/utilities.css';
import './styles/scrollbar.css';
import './styles/glow-effects.css';

// Register GSAP plugins if needed
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Create root
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render app
root.render(
  <React.StrictMode>
      <ThemeProvider>
      <Router />
        <Analytics />
        <SpeedInsights />
      </ThemeProvider>
  </React.StrictMode>
);

// Add performance monitoring in development
if (import.meta.env.DEV) {
  // Import and start the performance monitoring
  import('web-vitals').then((vitals) => {
    const vitalsObj = {
      getCLS: vitals.getCLS,
      getFID: vitals.getFID,
      getFCP: vitals.getFCP,
      getLCP: vitals.getLCP,
      getTTFB: vitals.getTTFB
    };
    
    Object.keys(vitalsObj).forEach((key) => {
      if (typeof vitalsObj[key] === 'function') {
        vitalsObj[key](console.log);
      }
    });
  }).catch(() => {
    // Silently fail in production
  });
}
