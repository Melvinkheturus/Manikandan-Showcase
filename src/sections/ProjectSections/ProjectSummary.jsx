import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, SplitText);

const ProjectSummary = ({ project }) => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const textRefs = useRef([]);
  
  // Set up animation
  useEffect(() => {
    if (!sectionRef.current || !titleRef.current || textRefs.current.length === 0) return;
    
    // Split title and paragraphs for animation
    const titleSplit = new SplitText(titleRef.current, { type: "words" });
    const textSplits = textRefs.current.map(ref => 
      ref ? new SplitText(ref, { type: "lines" }) : null
    ).filter(Boolean);
    
    // Animate title
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });
    
    tl.fromTo(titleSplit.words, {
      opacity: 0,
      y: 20
    }, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.05,
      ease: "power3.out"
    });
    
    // Animate paragraphs
    textSplits.forEach((split, i) => {
      tl.fromTo(split.lines, {
        opacity: 0,
        y: 20
      }, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.03,
        ease: "power3.out"
      }, i === 0 ? "-=0.4" : "-=0.2");
    });
    
    // Clean up
    return () => {
      titleSplit.revert();
      textSplits.forEach(split => split.revert());
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, []);
  
  // Parse paragraphs from project summary
  const paragraphs = Array.isArray(project.summary) 
    ? project.summary 
    : (project.summary || '').split('\n\n').filter(Boolean);
  
  return (
    <section 
      ref={sectionRef}
      className="py-24 bg-gradient-to-b from-black to-gray-900"
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 
          ref={titleRef}
          className="text-3xl md:text-4xl font-bold text-white mb-10"
        >
          Project Summary
        </h2>
        
        <div className="text-lg text-gray-300 space-y-6">
          {paragraphs.map((paragraph, index) => (
            <p 
              key={index}
              ref={el => textRefs.current[index] = el}
              className="leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
        </div>
        
        {/* Contribution tag */}
        {project.contribution && (
          <motion.div 
            className="mt-12 px-6 py-4 bg-white/5 backdrop-blur-sm border border-emerald-500/20 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h3 className="text-xl font-semibold text-emerald-400 mb-2">My Contribution</h3>
            <p className="text-white/90">{project.contribution}</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ProjectSummary; 