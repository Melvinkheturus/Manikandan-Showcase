import React, { useEffect, useState, lazy, Suspense, useCallback } from 'react';
import { useTheme } from './context/ThemeContext';
import SmoothScrollProvider from './portfolio/components/providers/SmoothScrollProvider';
import Navbar from './portfolio/components/layout/Navbar';
import PreloaderPage from './portfolio/pages/PreloaderPage';
import WelcomeToHeroSound from './portfolio/components/audio/WelcomeToHeroSound';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './styles/smoothScroll.css';
import FooterContactSection from './sections/FooterContactSection';

// Register GSAP plugins to ensure they're available
gsap.registerPlugin(ScrollTrigger);

// Lazy load components that aren't needed immediately
const CustomCursor = lazy(() => import('./portfolio/components/ui/CustomCursor'));

// Import PageRouter for main site navigation and ProjectDetail page
const PageRouter = lazy(() => import('./portfolio/components/layout/PageRouter'));
const ProjectDetail = lazy(() => import('./portfolio/pages/ProjectDetail'));

// Admin Pages
import AdminLayout from './admin/components/AdminLayout';
import CMSDashboard from './admin/pages/CMSDashboard';
import CMSLogin from './admin/pages/auth/CMSLogin';
import CMSProjects from './admin/pages/CMSProjects';
import CMSSettings from './admin/pages/CMSSettings';
import CMSProfile from './admin/pages/CMSProfile';
import PageSections from './admin/pages/PageSections';

// Simple fallback components for lazy-loaded UI elements
const SimpleFallback = () => <div className="hidden"></div>;
const PageFallback = () => <div className="flex-grow min-h-screen"></div>;

// Determine if user is authenticated (simplified)
const isAuthenticated = () => {
  // In a real app, check for session token or auth state
  return true; // For demo purposes
};

// Protected route component
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

function App() {
  const [loading, setLoading] = useState(true);
  const [transitioningToHero, setTransitioningToHero] = useState(false);
  const { isDarkMode } = useTheme();
  const location = useLocation();

  // Check if we're on the projects page
  const isProjectsPage = location.pathname === '/projects';
  
  // Check if preloader should be skipped
  const searchParams = new URLSearchParams(location.search);
  const skipPreloader = searchParams.get('nopreloader') === 'true';
  
  // Skip preloader if URL parameter is present
  useEffect(() => {
    if (skipPreloader) {
      setLoading(false);
    }
  }, [skipPreloader]);

  // Register ScrollTrigger with Lenis scroll updates
  useEffect(() => {
    // On route changes, refresh ScrollTrigger to handle any new animations
    ScrollTrigger.refresh();
    
    // Return cleanup function
    return () => {
      // Clear any ScrollTrigger instances when component unmounts
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [location.pathname]);

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
        enableScroll();
        setLoading(false);
      }
    }, 10000); // Reduced timeout to 10 seconds
    
    return () => clearTimeout(safetyTimer);
  }, [loading, enableScroll]);

  const handleLoadingComplete = useCallback(() => {
    setTransitioningToHero(true);
  }, []);

  const handleTransitionComplete = useCallback(() => {
    // Remove preloader completely and show hero section with dim-to-bright effect immediately
    setLoading(false);
    setTransitioningToHero(false);
  }, []);

  // Dark gradient with purple instead of emerald
  const darkGradient = `linear-gradient(
    135deg,
    #0a0a0a 0%,
    rgba(162,89,255,0.15) 30%,
    rgba(162,89,255,0.05) 50%,
    #0a0a0a 100%
  )`;

  // Conditionally render content based on route
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isProjectDetailRoute = location.pathname.startsWith('/project/');

  return (
    <SmoothScrollProvider>
      <div 
        className="relative text-white min-h-screen flex flex-col"
        style={{
          background: darkGradient,
          backgroundAttachment: 'fixed',
        }}
      >
        {isAdminRoute ? (
          <main className="flex-grow">
            <Routes>
              <Route path="/admin/login" element={<CMSLogin />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<CMSDashboard />} />
                <Route path="sections/*" element={<PageSections />} />
                <Route path="projects" element={<CMSProjects />} />
                <Route path="settings" element={<CMSSettings />} />
                <Route path="profile" element={<CMSProfile />} />
              </Route>
            </Routes>
          </main>
        ) : (
          <>
            {/* Preloader - only shown if not skipped */}
            {loading && !skipPreloader && <PreloaderPage onFinish={handleLoadingComplete} />}
            
            {/* Welcome to Hero transition sound - only if not skipped */}
            {!skipPreloader && (
              <WelcomeToHeroSound 
                isLoading={loading && !transitioningToHero} 
                onTransitionComplete={handleTransitionComplete} 
              />
            )}
            
            {/* Custom Cursor - only load after main content */}
            <Suspense fallback={<SimpleFallback />}>
              {!loading && <CustomCursor />}
            </Suspense>
            
            {/* Only show navbar after loading is complete */}
            {!loading && <Navbar />}
            
            <main className="flex-grow scroll-smooth">
              <Suspense fallback={<PageFallback />}>
                <Routes>
                  {/* Main site using PageRouter component */}
                  <Route path="/*" element={<PageRouter />} />
                  
                  {/* Project detail page */}
                  <Route path="/project/:slug" element={<ProjectDetail />} />
                </Routes>
              </Suspense>
            </main>
            
            {/* Only show FooterContactSection on project detail pages */}
            {!loading && isProjectDetailRoute && <FooterContactSection />}
          </>
        )}
      </div>
    </SmoothScrollProvider>
  );
}

export default App;
