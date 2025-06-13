import React, { useRef, useState, useEffect } from 'react';
import SectionWrapper from '../portfolio/components/layout/SectionWrapper';
import useSectionData from '../utils/useSectionData';

// Import GSAP safely with error handling
let gsap;
let ScrollTrigger;
try {
  // Fix: Use ES imports instead of require
  import('gsap').then(module => {
    gsap = module.default;
    import('gsap/ScrollTrigger').then(module => {
      ScrollTrigger = module.ScrollTrigger;
gsap.registerPlugin(ScrollTrigger);
    });
  });
} catch (e) {
  console.error("GSAP loading error:", e);
}

export default function ExperienceSection({ sectionId }) {
  // Always declare all hooks at the top level and in the same order
  const sectionRef = useRef(null);
  const timelineItemsRef = useRef([]);
  const [content, setContent] = useState(null);
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const { data, loading, error } = useSectionData('experience');
  
  // Default content if data is not available yet
  const defaultContent = {
    items: [
      { title: "Web Dev Intern, SAIC", date: "May–Jun 2024", description: "Built WordPress sites, leveraged no-code tools." },
      { title: "Department General Secretary", date: "2024–2025", description: "Led 20-member team, organized campus events." },
      { title: "Event Head, Juno Fest 2024", date: "2024", description: "Coordinated logistics & design for 1K+ attendees." }
    ]
  };

  // Set content based on data
  useEffect(() => {
    setContent(data?.content || defaultContent);
  }, [data]);

  // Animation effect - safely handle GSAP
  useEffect(() => {
    // Skip if content not ready or animations disabled
    if (!content || !animationEnabled || !gsap || !ScrollTrigger) {
      return;
    }
    
    const experiences = content.items || [];
    if (!experiences.length) return;
    
    const section = sectionRef.current;
    const timelineItems = timelineItemsRef.current;

    try {
    // Timeline animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 70%",
        end: "bottom 20%",
        toggleActions: "play none none reset"
      }
    });

    // Animate each timeline item
    timelineItems.forEach((item, index) => {
      if (!item) return;
      
      tl.fromTo(
        item,
        { 
            opacity: 0.5,
          x: index % 2 === 0 ? -20 : 20 
        },
        { 
          opacity: 1,
          x: 0,
          duration: 0.8, 
          ease: "power3.out",
          delay: index * 0.2
        },
        index === 0 ? ">" : "-=0.6" // Stagger effect
      );
    });

    return () => {
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
    };
    } catch (error) {
      console.error("Animation error:", error);
      setAnimationEnabled(false);
    }
  }, [content, animationEnabled]);

  // Early return for loading state
  if (loading || !content) {
    return (
      <SectionWrapper id="experience">
        <section className="w-full max-w-3xl mx-auto p-8 flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </section>
      </SectionWrapper>
    );
  }
  
  const experiences = content.items || [];

  return (
    <SectionWrapper id="experience">
      <section ref={sectionRef} className="w-full max-w-3xl mx-auto p-8 min-h-[80vh]">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white heading-glow section-title-gradient">Experience & Achievements</h2>
        <div className="w-20 h-1 bg-primary mb-8 neon-divider"></div>
        
        <div className="relative">
          {/* Timeline center line */}
          <div className="absolute left-0 md:left-1/2 h-full w-0.5 bg-gray-700 transform md:translate-x-px"></div>
          
          {/* Timeline items */}
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <div 
                key={index}
                ref={el => timelineItemsRef.current[index] = el}
                className={`relative md:w-1/2 ${index % 2 === 0 ? 'md:ml-auto' : 'md:mr-auto'} md:pl-6 md:pr-12 ${!animationEnabled ? 'opacity-100' : 'opacity-50'}`}
              >
                {/* Timeline dot */}
                <div className="absolute left-0 md:left-0 top-0 w-5 h-5 rounded-full bg-primary-400 -translate-x-1/2 timeline-dot"></div>
                
                {/* Content */}
                <div className="ml-8 md:ml-0 p-5 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 card-glow">
                  <h3 className="text-lg font-bold text-white">{exp.title}</h3>
                  <div className="text-primary-400 text-sm mb-2">{exp.date}</div>
                  <p className="text-gray-300">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SectionWrapper>
  );
} 