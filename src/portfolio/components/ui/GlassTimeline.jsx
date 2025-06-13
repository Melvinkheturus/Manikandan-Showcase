import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const TimelineEvent = ({ event, index }) => {
  const dotRef = useRef(null);
  const cardRef = useRef(null);
  
  useEffect(() => {
    if (!dotRef.current || !cardRef.current) return;
    
    // Create timeline for dot pulse animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: cardRef.current,
        start: "left center",
        toggleActions: "play none none reverse",
        containerAnimation: ScrollTrigger.getById("timelineScroll")
      }
    });
    
    // Dot pulse animation
    tl.to(dotRef.current, {
      scale: 1.5,
      duration: 0.4,
      ease: "power2.out"
    });
    
    tl.to(dotRef.current, {
      scale: 1,
      duration: 0.3,
      ease: "power2.in"
    });
    
    return () => {
      tl.kill();
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
    };
  }, []);
  
  return (
    <div 
      ref={cardRef}
      className="min-w-[300px] w-[90vw] max-w-md px-6"
    >
      {/* Timeline dot */}
      <div className="relative mb-8">
        <div 
          ref={dotRef}
          className="w-6 h-6 rounded-full bg-emerald-500 absolute top-0 left-0 -translate-x-1/2"
        />
        <div className="w-10 h-10 rounded-full bg-emerald-500/30 absolute top-0 left-0 -translate-x-1/2 -translate-y-1/4" />
      </div>
      
      {/* Event card with glassmorphism */}
      <motion.div
        className="backdrop-blur-[10px] bg-white/10 rounded-xl p-6 border border-white/20"
        initial={{ backdropFilter: "blur(0px)", y: 20, opacity: 0 }}
        whileInView={{ 
          backdropFilter: "blur(10px)", 
          y: 0, 
          opacity: 1,
          transition: { duration: 0.8, delay: index * 0.1 }
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-xl text-white">{event.title}</h3>
          <span className="text-emerald-400 text-sm">{event.date}</span>
        </div>
        {event.location && (
          <p className="text-gray-300 text-sm mb-2">{event.location}</p>
        )}
        <p className="text-gray-300">{event.description}</p>
      </motion.div>
    </div>
  );
};

const GlassTimeline = ({ title, events = [] }) => {
  const containerRef = useRef(null);
  const timelineRef = useRef(null);
  const panelRef = useRef(null);
  
  // Set up horizontal scroll
  useEffect(() => {
    if (!containerRef.current || !timelineRef.current || events.length === 0) return;
    
    // Get the total width for scrolling
    const totalWidth = timelineRef.current.scrollWidth;
    const viewportWidth = window.innerWidth;
    
    // Create ScrollTrigger for horizontal timeline
    const trigger = ScrollTrigger.create({
      id: "timelineScroll",
      trigger: containerRef.current,
      pin: true,
      start: "top top",
      end: `+=${totalWidth - viewportWidth + 100}`,
      scrub: 1,
    });
    
    // Create animation for horizontal scroll
    gsap.to(timelineRef.current, {
      x: -(totalWidth - viewportWidth + 100),
      ease: "none",
      scrollTrigger: trigger
    });
    
    // Add blur animation for panel
    if (panelRef.current) {
      gsap.fromTo(panelRef.current, 
        { backdropFilter: "blur(0px)" }, 
        { 
          backdropFilter: "blur(10px)", 
          duration: 1.5, 
          delay: 0.5,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          }
        }
      );
    }
    
    return () => {
      trigger.kill();
    };
  }, [events.length]);
  
  return (
    <div 
      ref={containerRef} 
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Background elements for depth */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[30%] left-[20%] w-40 h-40 rounded-full bg-emerald-700/20 blur-3xl"></div>
        <div className="absolute bottom-[30%] right-[20%] w-60 h-60 rounded-full bg-emerald-700/10 blur-3xl"></div>
      </div>
      
      {/* Section title */}
      <div className="absolute top-10 left-0 right-0 text-center z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white">{title || "Experience Timeline"}</h2>
      </div>
      
      {/* Glassmorphism panel */}
      <div 
        ref={panelRef}
        className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[60%] bg-white/10 backdrop-blur-[0px] z-10"
        style={{
          backdropFilter: "blur(0px)" // Initial state, will be animated
        }}
      >
        {/* Horizontal line */}
        <div className="absolute top-[100px] left-0 right-0 h-[2px] bg-gray-500/20"></div>
        
        {/* Timeline container */}
        <div 
          ref={timelineRef}
          className="absolute top-[50px] left-[10vw] will-change-transform flex items-start gap-10 pt-[100px]"
        >
          {events.map((event, index) => (
            <TimelineEvent key={index} event={event} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GlassTimeline; 