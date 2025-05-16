import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ParallaxProvider } from 'react-scroll-parallax';

// Create a separate container for hydration
const appRoot = document.getElementById('root');

// Configure Router with future flags
const router = createBrowserRouter(
  [
    {
      path: "*",
      element: (
        <ThemeProvider>
            <ParallaxProvider>
              <App />
            </ParallaxProvider>
        </ThemeProvider>
      ),
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

// Use createRoot for improved React 18 features
ReactDOM.createRoot(appRoot).render(
  <RouterProvider router={router} />
);

// Add performance monitoring in development
if (import.meta.env.DEV) {
  // Import and start the performance monitoring
  import('web-vitals').then((vitals) => {
    // Check if each function exists before calling it
    if (vitals.getCLS) vitals.getCLS(console.log);
    if (vitals.getFID) vitals.getFID(console.log);
    if (vitals.getFCP) vitals.getFCP(console.log);
    if (vitals.getLCP) vitals.getLCP(console.log);
    if (vitals.getTTFB) vitals.getTTFB(console.log);
  }).catch(err => {
    console.warn('Failed to load web-vitals:', err);
  });
}
