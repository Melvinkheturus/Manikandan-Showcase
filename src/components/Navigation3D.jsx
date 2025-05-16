import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import NavigationPath from './NavigationPath';
import CameraController from './CameraController';
import RadialMenu from './RadialMenu';

const Navigation3D = () => {
  const [activeSection, setActiveSection] = useState('welcome');
  
  // Detect active section from scroll
  useEffect(() => {
    const sections = ['welcome', 'about', 'skills', 'projects', 'contact'];
    
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };
    
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.6, // When 60% of the section is visible
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe all sections
    sections.forEach(sectionId => {
      const section = document.getElementById(sectionId);
      if (section) observer.observe(section);
    });
    
    return () => {
      // Cleanup
      sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) observer.unobserve(section);
      });
    };
  }, []);
  
  // Handle navigation to a section
  const handleNavigate = (sectionId) => {
    setActiveSection(sectionId);
    
    // Scroll to the section smoothly
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -70; // Consider any fixed headers
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };
  
  return (
    <>
      {/* 3D Navigation Canvas */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-10">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          dpr={[1, 1.5]}
          gl={{ 
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance'
          }}
          style={{ pointerEvents: 'auto' }}
        >
          {/* Navigation Path with interactive hotspots */}
          <NavigationPath 
            activeSection={activeSection}
            onNavigate={handleNavigate}
          />
          
          {/* Camera Controller */}
          <CameraController 
            activeSection={activeSection}
          />
          
          {/* Lighting for 3D elements */}
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
        </Canvas>
      </div>
      
      {/* Optional Radial Menu Overlay */}
      <RadialMenu onNavigate={handleNavigate} />
    </>
  );
};

export default Navigation3D; 