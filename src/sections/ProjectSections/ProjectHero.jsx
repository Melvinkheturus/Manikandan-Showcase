import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, SplitText);

const ProjectHero = ({ project }) => {
  const titleRef = useRef(null);
  const taglineRef = useRef(null);
  const heroRef = useRef(null);
  const containerRef = useRef(null);
  
  // Animate text and parallax effect on mount
  useEffect(() => {
    if (!titleRef.current || !taglineRef.current) return;
    
    // Create SplitText for animation
    const titleSplit = new SplitText(titleRef.current, { type: "chars, words" });
    const taglineSplit = new SplitText(taglineRef.current, { type: "chars" });
    
    const chars = titleSplit.chars;
    const taglineChars = taglineSplit.chars;
    
    // Create animation timeline
    const tl = gsap.timeline();
    
    // Animate title
    tl.fromTo(chars, {
      opacity: 0,
      y: 20
    }, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.02,
      ease: "power2.out"
    });
    
    // Animate tagline
    tl.fromTo(taglineChars, {
      opacity: 0,
      y: 10
    }, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.01,
      ease: "power2.out"
    }, "-=0.4");
    
    // Parallax effect for hero image
    if (heroRef.current && containerRef.current) {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          gsap.to(heroRef.current, {
            scale: 1 + (0.2 * self.progress),
            duration: 0
          });
        }
      });
    }
    
    // Clean up
    return () => {
      tl.kill();
      titleSplit.revert();
      taglineSplit.revert();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  
  // Handle video or image background
  const isVideo = project.heroMedia?.includes('.mp4') || project.heroMedia?.includes('.webm');
  
  return (
    <motion.div 
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Hero Background */}
      <div className="absolute inset-0 z-0">
        {isVideo ? (
          <video
            ref={heroRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            src={project.heroMedia}
          />
        ) : (
          <div 
            ref={heroRef}
            className="w-full h-full bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${project.heroMedia || project.thumbnail})`,
              transformOrigin: 'center',
            }}
          />
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-90"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-end h-full pb-20 px-6">
        <div className="max-w-4xl w-full text-center">
          {/* Project Title */}
          <h1 
            ref={titleRef}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
          >
            {project.title}
          </h1>
          
          {/* Project Category or Tagline */}
          <p 
            ref={taglineRef}
            className="text-xl md:text-2xl text-gray-300 mb-8"
          >
            {project.category || project.tagline}
          </p>
          
          {/* Role & Timeline Badge */}
          <motion.div 
            className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md rounded-full"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <span className="text-emerald-400 font-medium">
              {project.role} · {project.timeline}
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectHero; 