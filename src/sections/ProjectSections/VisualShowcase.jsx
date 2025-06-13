import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const VisualShowcase = ({ project }) => {
  const containerRef = useRef(null);
  const galleryRef = useRef(null);
  const imageRefs = useRef([]);
  
  // Set up horizontal scroll animation
  useEffect(() => {
    if (!containerRef.current || !galleryRef.current) return;
    
    // Parse images from project data
    const images = Array.isArray(project.showcase) 
      ? project.showcase 
      : project.showcase?.split(',').map(url => url.trim()).filter(Boolean) || [];
      
    if (images.length === 0) return;
    
    // Create the pinned scroll animation
    const totalWidth = galleryRef.current.scrollWidth;
    const windowWidth = window.innerWidth;
    
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      pin: true,
      start: "top top",
      end: () => `+=${totalWidth - windowWidth + 100}`,
      scrub: 1,
    });
    
    // Main horizontal scroll animation
    gsap.to(galleryRef.current, {
      x: -(totalWidth - windowWidth + 100),
      ease: "none",
      scrollTrigger: trigger
    });
    
    // Individual image animations
    imageRefs.current.forEach((ref, i) => {
      if (!ref) return;
      
      // Initial state - slightly zoomed in
      gsap.set(ref, {
        scale: 1.1
      });
      
      // Zoom out when image enters center of viewport
      gsap.to(ref, {
        scale: 1,
        duration: 1,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: ref.parentElement,
          containerAnimation: trigger,
          start: "left center",
          end: "right center",
          scrub: true,
        }
      });
    });
    
    return () => {
      trigger.kill();
    };
  }, [project.showcase]);
  
  // Parse images from project data
  const images = Array.isArray(project.showcase) 
    ? project.showcase 
    : project.showcase?.split(',').map(url => url.trim()).filter(Boolean) || [];

  // If no images, show a placeholder
  if (images.length === 0) {
    return (
      <section className="py-24 bg-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Visual Showcase</h2>
          <div className="p-12 border border-dashed border-gray-700 rounded-lg">
            <p className="text-gray-400">No showcase images available for this project.</p>
          </div>
        </div>
      </section>
    );
  }
  
  // Determine if any images are videos
  const hasVideo = images.some(src => 
    src.includes('.mp4') || src.includes('.webm') || src.includes('youtube')
  );
  
  return (
    <section className="relative bg-black overflow-hidden h-screen">
      {/* Section title - fixed at top */}
      <div className="absolute top-0 left-0 right-0 z-10 py-6 bg-gradient-to-b from-black to-transparent">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white">
          Visual Showcase
        </h2>
      </div>
      
      {/* Pinned container for horizontal scroll */}
      <div 
        ref={containerRef}
        className="h-screen w-full overflow-hidden"
      >
        {/* Gallery container */}
        <div 
          ref={galleryRef}
          className="flex items-center h-full pt-24 will-change-transform"
        >
          {/* Left spacing */}
          <div className="flex-shrink-0 w-[10vw]"></div>
          
          {/* Media items */}
          {images.map((src, index) => (
            <div key={index} className="flex-shrink-0 h-[70vh] w-[85vw] md:w-[60vw] p-4">
              {/* Detect if media is a video */}
              {src.includes('.mp4') || src.includes('.webm') ? (
                <div className="w-full h-full rounded-xl overflow-hidden">
                  <video 
                    className="w-full h-full object-cover"
                    src={src}
                    controls
                    muted={false}
                    playsInline
                  />
                </div>
              ) : src.includes('youtube') ? (
                <div className="w-full h-full rounded-xl overflow-hidden">
                  <iframe
                    className="w-full h-full"
                    src={src}
                    title={`Project showcase ${index + 1}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div className="w-full h-full rounded-xl overflow-hidden">
                  <img 
                    ref={el => imageRefs.current[index] = el}
                    src={src} 
                    alt={`Project showcase ${index + 1}`}
                    className="w-full h-full object-cover will-change-transform"
                    style={{ transformOrigin: 'center' }}
                  />
                </div>
              )}
              
              {/* Optional: Image counter */}
              <div className="mt-2 text-center text-gray-400 text-sm">
                {index + 1} of {images.length}
              </div>
            </div>
          ))}
          
          {/* Right spacing */}
          <div className="flex-shrink-0 w-[10vw]"></div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.3, 0.8, 0.3], y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-sm mt-1">Scroll to view more</span>
      </motion.div>
    </section>
  );
};

export default VisualShowcase; 