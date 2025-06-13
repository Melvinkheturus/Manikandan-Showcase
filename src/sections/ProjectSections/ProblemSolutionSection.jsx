import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

const ProblemSolutionSection = ({ project }) => {
  const sectionRef = useRef(null);
  const problemRef = useRef(null);
  const solutionRef = useRef(null);
  
  // Set up scroll animations
  useEffect(() => {
    if (!sectionRef.current || !problemRef.current || !solutionRef.current) return;
    
    // Create animation for problem section sliding in from left
    gsap.fromTo(problemRef.current, 
      { x: -100, opacity: 0 },
      { 
        x: 0, 
        opacity: 1, 
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "center center",
          toggleActions: "play none none none",
          scrub: 0.5
        }
      }
    );
    
    // Create animation for solution section sliding in from right
    gsap.fromTo(solutionRef.current, 
      { x: 100, opacity: 0 },
      { 
        x: 0, 
        opacity: 1, 
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "center center",
          toggleActions: "play none none none",
          scrub: 0.5
        }
      }
    );
    
    // Clean up
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  
  return (
    <section 
      ref={sectionRef}
      className="py-24 bg-gradient-to-b from-gray-900 to-black"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">
          Problem & Solution
        </h2>
        
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          {/* Problem Section */}
          <div 
            ref={problemRef}
            className="flex-1 p-6 lg:p-8 bg-gradient-to-br from-red-900/20 to-transparent rounded-xl border border-red-800/30"
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full bg-red-900/30 flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white">The Problem</h3>
            </div>
            
            <div className="text-gray-300 space-y-4">
              {(project.problem || '')
                .split('\n')
                .filter(Boolean)
                .map((paragraph, i) => (
                  <p key={i} className="leading-relaxed">{paragraph}</p>
                ))
              }
            </div>
          </div>
          
          {/* Solution Section */}
          <div 
            ref={solutionRef}
            className="flex-1 p-6 lg:p-8 bg-gradient-to-br from-emerald-900/20 to-transparent rounded-xl border border-emerald-800/30"
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full bg-emerald-900/30 flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white">The Solution</h3>
            </div>
            
            <div className="text-gray-300 space-y-4">
              {(project.solution || '')
                .split('\n')
                .filter(Boolean)
                .map((paragraph, i) => (
                  <p key={i} className="leading-relaxed">{paragraph}</p>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection; 