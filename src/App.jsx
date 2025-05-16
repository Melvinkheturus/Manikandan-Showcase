import React, { useEffect, useState, lazy, Suspense, useCallback } from 'react';
import { useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WelcomeLoader from './components/WelcomeLoader';
import WelcomeToHeroSound from './components/WelcomeToHeroSound';
import { Routes, Route, useLocation } from 'react-router-dom';
import { initSmoothScrolling } from './utils/smoothScroll';
import './styles/spline.css';

// Lazy load components that aren't needed immediately
const ParallaxBackground = lazy(() => import('./components/ParallaxBackground'));
const CustomCursor = lazy(() => import('./components/CustomCursor'));
const ScrollProgress = lazy(() => import('./components/ScrollProgress'));

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Projects = lazy(() => import('./pages/Projects'));
const Contact = lazy(() => import('./pages/Contact'));

// Simple fallback components for lazy-loaded UI elements
const BackgroundFallback = () => <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-900 to-black"></div>;
const SimpleFallback = () => <div className="hidden"></div>;
const PageFallback = () => <div className="flex-grow min-h-screen"></div>;

function App() {
  const [loading, setLoading] = useState(true);
  const [transitioningToHero, setTransitioningToHero] = useState(false);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const { isDarkMode } = useTheme();
  const location = useLocation();

  // More reliable overflow handling
  const enableScroll = useCallback(() => {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    document.body.style.height = '';
    document.documentElement.style.height = '';
  }, []);

  const disableScroll = useCallback(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.height = '100%';
    document.documentElement.style.height = '100%';
  }, []);

  // Apply overflow handling
  useEffect(() => {
    if (loading) {
      disableScroll();
    } else {
      enableScroll();
    }
    
    // Force enable scroll when component unmounts
    return enableScroll;
  }, [loading, enableScroll, disableScroll]);

  // Safety fallback for scrolling in case the loader fails
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      if (loading) {
        console.log("Safety timeout: forcing scroll restoration");
        enableScroll();
        setLoading(false);
      }
    }, 15000); // 15 seconds max loading time
    
    return () => clearTimeout(safetyTimer);
  }, [loading, enableScroll]);

  // Simulate loading time or actual data fetching
  useEffect(() => {
    // This will be handled by the useProgress hook in the WelcomeLoader
    // Keep the timer as a fallback
    const timer = setTimeout(() => {
      setLoading(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Initialize smooth scrolling
  useEffect(() => {
    initSmoothScrolling();
  }, []);

  // Preload Spline script
  useEffect(() => {
    // Check if the script already exists
    if (!document.querySelector('script[src*="@splinetool/viewer"]')) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://unpkg.com/@splinetool/viewer@1.9.94/build/spline-viewer.js';
      script.async = true;
      script.onload = () => {
        console.log('Spline script loaded in App');
        setSplineLoaded(true);
      };
      script.onerror = (e) => {
        console.error('Failed to load Spline script in App', e);
      };
      document.head.appendChild(script);
    } else {
      setSplineLoaded(true);
    }
  }, []);

  const handleLoadingComplete = useCallback(() => {
    // Start the transition to hero
    setTransitioningToHero(true);
  }, []);

  const handleTransitionComplete = useCallback(() => {
    // Transition sound has completed, finish loading
    setLoading(false);
    setTransitioningToHero(false);
  }, []);

  // Dark gradient only
  const darkGradient = `linear-gradient(
    135deg,
    #0a0f0d 0%,
    rgba(16,185,129,0.15) 30%,
    rgba(16,185,129,0.05) 50%,
    #0a0f0d 100%
  )`;

  return (
    <div 
      className="relative text-white min-h-screen flex flex-col"
      style={{
        background: darkGradient,
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Welcome loader */}
      {loading && <WelcomeLoader onFinish={handleLoadingComplete} />}
      
      {/* Welcome to Hero transition sound */}
      <WelcomeToHeroSound 
        isLoading={loading && !transitioningToHero} 
        onTransitionComplete={handleTransitionComplete} 
      />
      
      {/* 3D Parallax Background with fallback for lazy loading */}
      <Suspense fallback={<BackgroundFallback />}>
        <ParallaxBackground />
      </Suspense>
      
      {/* Custom Cursor - only load after main content */}
      <Suspense fallback={<SimpleFallback />}>
        {!loading && <CustomCursor />}
      </Suspense>

      {/* Scroll Progress Indicator - only load after main content */}
      <Suspense fallback={<SimpleFallback />}>
        {!loading && <ScrollProgress />}
      </Suspense>
      
      {/* Only show navbar after loading is complete */}
      {!loading && <Navbar />}
      
      <main className="flex-grow scroll-smooth">
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Suspense>
      </main>
      
      {/* Only show footer after loading is complete */}
      {!loading && <Footer />}
    </div>
  );
}

export default App;
