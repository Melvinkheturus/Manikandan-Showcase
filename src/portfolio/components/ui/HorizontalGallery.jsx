import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BlendTextPreloader from './BlendTextPreloader';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const GalleryItem = ({ item, index }) => {
  const imageRef = useRef(null);
  
  return (
    <motion.div
      className="flex-shrink-0 w-[80vw] md:w-[40vw] h-[60vh] p-4"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-20%" }}
    >
      <div className="w-full h-full overflow-hidden rounded-xl relative">
        {/* Image with zoom effect */}
        <div
          ref={imageRef}
          className="w-full h-full bg-cover bg-center transition-transform duration-700"
          style={{ 
            backgroundImage: `url(${item.image})`,
            transformOrigin: 'center',
            transform: 'scale(1.1)'
          }}
        />
        
        {/* Content overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
          <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
          <p className="text-gray-300 mb-4">{item.description}</p>
          
          {/* CTA Button with glassmorphism */}
          {item.cta && (
            <motion.button
              className="px-5 py-3 bg-white/10 backdrop-blur-sm rounded-lg text-white border border-white/20 inline-flex items-center gap-2 self-start"
              whileHover={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                transition: { duration: 0.2 }
              }}
            >
              {item.cta}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const MovingText = ({ text }) => {
  const containerRef = useRef(null);
  
  return (
    <div 
      ref={containerRef}
      className="overflow-hidden py-4 bg-black/20 backdrop-blur-sm"
    >
      <motion.div 
        className="whitespace-nowrap flex gap-8"
        animate={{ 
          x: [0, -1000]
        }}
        transition={{
          x: { repeat: Infinity, duration: 20, ease: "linear" },
        }}
        whileHover={{ animationPlayState: 'paused' }}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i} className="text-lg text-emerald-400/80 mx-4">
            {text} <span className="mx-2">·</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};

const HorizontalGallery = ({ title = "Project Showcase", galleryItems = [] }) => {
  const containerRef = useRef(null);
  const galleryRef = useRef(null);
  const [preloaderComplete, setPreloaderComplete] = React.useState(false);
  
  // Set up horizontal scroll with pin
  useEffect(() => {
    if (!containerRef.current || !galleryRef.current || galleryItems.length === 0 || !preloaderComplete) return;
    
    // Get the total width of the gallery
    const totalWidth = galleryRef.current.scrollWidth;
    const viewportWidth = window.innerWidth;
    
    // Create ScrollTrigger for horizontal gallery
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      pin: true,
      start: "top top",
      end: () => `+=${totalWidth}`,
      scrub: 1,
    });
    
    // Create animation for horizontal scroll
    gsap.to(galleryRef.current, {
      x: -(totalWidth - viewportWidth),
      ease: "none",
      scrollTrigger: trigger
    });
    
    // Add zoom effect to images when they enter the center
    const images = galleryRef.current.querySelectorAll('.w-full.h-full.bg-cover');
    images.forEach((image) => {
      gsap.to(image, {
        scale: 1.0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: image.parentElement,
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
  }, [galleryItems.length, preloaderComplete]);
  
  // Handle preloader completion
  const handlePreloaderComplete = () => {
    setPreloaderComplete(true);
  };
  
  return (
    <div className="relative w-full overflow-hidden">
      {/* Preloader text */}
      {!preloaderComplete && (
        <BlendTextPreloader text={title} onComplete={handlePreloaderComplete} />
      )}
      
      {/* Main gallery container - only show after preloader */}
      {preloaderComplete && (
        <>
          {/* Marquee text */}
          <MovingText text="React · Tailwind · GSAP · Framer Motion · Three.js" />
          
          {/* Gallery with horizontal scroll */}
          <div 
            ref={containerRef}
            className="h-screen w-full overflow-hidden"
          >
            <div
              ref={galleryRef} 
              className="flex items-center h-full pt-10 will-change-transform"
            >
              {/* Left padding */}
              <div className="flex-shrink-0 w-[10vw]" />
              
              {/* Gallery items */}
              {galleryItems.map((item, index) => (
                <GalleryItem key={index} item={item} index={index} />
              ))}
              
              {/* Right padding */}
              <div className="flex-shrink-0 w-[10vw]" />
            </div>
          </div>
          
          {/* Glass CTA at the end */}
          <motion.div
            className="fixed bottom-10 right-10 z-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.button
              className="px-6 py-4 bg-white/10 backdrop-blur-lg rounded-lg text-white border border-white/20 flex items-center gap-2 shadow-lg"
              whileHover={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
            >
              View All Projects
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </motion.button>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default HorizontalGallery; 