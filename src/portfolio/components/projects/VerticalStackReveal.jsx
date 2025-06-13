import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/**
 * VerticalStackReveal - Converted from horizontal scroll to vertical stacked cards
 * Designed for UI/UX projects section with a design process storytelling approach
 * Includes enhanced scroll handling for both in-section scrolling and section transitions
 */
const VerticalStackReveal = ({ 
  projects, 
  sectionTitle = "UI/UX Projects",
  onSectionEnd = () => {}, // Callback for when user reaches end of section
  sectionIndex = 0,
}) => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const headerRef = useRef(null);
  const cards = useRef([]);
  const [isScrollLocked, setIsScrollLocked] = useState(false);
  const [reachedBottom, setReachedBottom] = useState(false);

  // Filter for only UI/UX projects
  const uiuxProjects = projects.filter(project => 
    project.category === 'UI/UX Design' || 
    project.tags.some(tag => tag.toLowerCase().includes('ui') || tag.toLowerCase().includes('ux') || tag.toLowerCase().includes('design'))
  );

  // Add sample UX process keywords to each project
  const processKeywords = [
    ["User Research", "Wireframes", "Prototyping"],
    ["Problem Framing", "User Flows", "Usability Testing"],
    ["Competitive Analysis", "UI System", "User Testing"],
    ["Persona Development", "Information Architecture", "User Journey"],
    ["Heuristic Evaluation", "Visual Design", "A/B Testing"]
  ];
  
  // Add sample UX insights to each project
  const uxInsights = [
    "Reduced checkout drop-offs by 34%",
    "Improved task completion rate by 47%",
    "Decreased onboarding time by 2.5 minutes",
    "Increased user engagement by 28%",
    "Boosted conversion rate by 19%"
  ];

  // Enhance projects with UX-specific information
  const enhancedProjects = uiuxProjects.map((project, index) => ({
    ...project,
    uxKeywords: processKeywords[index % processKeywords.length],
    uxInsight: uxInsights[index % uxInsights.length]
  }));

  // Set up scroll-triggered animations for vertical stack
  useEffect(() => {
    if (!containerRef.current || enhancedProjects.length === 0) return;

    // Timeline for the header animation
    const headerTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top center",
        end: "top top",
        scrub: true
      }
    });

    headerTimeline.fromTo(headerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1 }
    );

    // Individual card animations
    cards.current.forEach((card, i) => {
      if (!card) return;

      // Text animation for each card
      const textElements = card.querySelectorAll('.animate-text');
      gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "top bottom-=100",
          end: "center center",
          scrub: 0.5,
        }
      }).fromTo(card, 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.6 }
      );

      // Animate the text elements
      textElements.forEach((el, j) => {
        gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top bottom-=50",
            toggleActions: "play none none none"
          }
        }).fromTo(el,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, delay: j * 0.1 }
        );
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [enhancedProjects.length]);

  // Handle inner section scroll to detect when user reaches end
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const handleScroll = () => {
      // Check if scrolled to bottom of content
      const isAtBottom = 
        Math.abs(content.scrollHeight - content.scrollTop - content.clientHeight) < 10;

      if (isAtBottom && !reachedBottom) {
        setReachedBottom(true);
        onSectionEnd(sectionIndex); // Notify parent component to transition to next section
      } else if (!isAtBottom && reachedBottom) {
        setReachedBottom(false);
      }
    };

    content.addEventListener('scroll', handleScroll);
    return () => content.removeEventListener('scroll', handleScroll);
  }, [reachedBottom, onSectionEnd, sectionIndex]);

  // Control outer scroll based on inner section hover
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const lockOuterScroll = () => {
      setIsScrollLocked(true);
      document.body.style.overflow = 'hidden';
    };

    const unlockOuterScroll = () => {
      setIsScrollLocked(false);
      document.body.style.overflow = 'auto';
    };

    content.addEventListener('mouseenter', lockOuterScroll);
    content.addEventListener('mouseleave', unlockOuterScroll);

    return () => {
      content.removeEventListener('mouseenter', lockOuterScroll);
      content.removeEventListener('mouseleave', unlockOuterScroll);
      document.body.style.overflow = 'auto'; // Reset on unmount
    };
  }, []);

  if (enhancedProjects.length === 0) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">UI/UX Projects</h2>
        <p className="text-gray-400">No UI/UX projects available.</p>
      </div>
    );
  }

  return (
    <section 
      ref={containerRef}
      className="relative bg-gradient-to-b from-[#0e1b2b] to-[#0a0f1f] overflow-hidden min-h-screen"
    >
      {/* Section header */}
      <div 
        ref={headerRef}
        className="sticky top-0 left-0 w-full z-10 pt-12 pb-6 px-4 text-center"
        style={{
          background: "linear-gradient(to bottom, rgba(10,15,31,0.9) 0%, rgba(10,15,31,0.7) 80%, transparent 100%)",
          backdropFilter: "blur(8px)"
        }}
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-black to-black inline-block mb-3">
          {sectionTitle}
        </h2>
        <div className="w-20 h-1 bg-black mx-auto mb-4 opacity-70 rounded"></div>
        <p className="text-gray-300 max-w-xl mx-auto">
          Explore my design process from research to finished products
        </p>
      </div>
      
      {/* Background decoration - Wireframe Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-10 z-0">
        <div className="absolute inset-0" 
             style={{
               backgroundImage: `
                 linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                 linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
               `,
               backgroundSize: '40px 40px',
             }}></div>
      </div>
      
      {/* Scrollable content container */}
      <div 
        ref={contentRef}
        className="container mx-auto px-4 py-16 overflow-y-auto"
        style={{ maxHeight: 'calc(100vh - 120px)' }} // Allow inner scrolling with fixed height
      >
        <div className="space-y-24 md:space-y-32 pb-20">
          {/* Project cards */}
          {enhancedProjects.map((project, index) => (
            <motion.div
              key={project.id || index}
              ref={el => cards.current[index] = el}
              className={`relative ${index % 2 === 0 ? 'md:ml-0 md:mr-auto' : 'md:ml-auto md:mr-0'} max-w-5xl`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <Link 
                to={`/project/${project.slug}`}
                className="block w-full h-full"
              >
                <div className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-black/30 transition-colors duration-300 flex flex-col md:flex-row hover:shadow-glow">
                  {/* Left side - Design preview */}
                  <div className="md:w-1/2 w-full aspect-video md:aspect-auto relative overflow-hidden">
                    <div className="absolute inset-0">
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-transparent mix-blend-multiply"></div>
                    </div>

                    {/* Design labels */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.uxKeywords.map((keyword, i) => (
                          <span
                            key={i}
                            className="text-xs bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full animate-text"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                      <p className="text-black text-sm animate-text">
                        <span className="font-semibold">Impact:</span> {project.uxInsight}
                      </p>
                    </div>
                  </div>

                  {/* Right side - Design story */}
                  <div className="md:w-1/2 w-full p-6 flex flex-col justify-center">
                    <h3 className="text-xl md:text-2xl font-bold mb-1 animate-text">
                      {project.title}
                    </h3>
                    <div className="w-16 h-[2px] bg-black mb-4 animate-text"></div>
                    <p className="text-gray-300 mb-6 animate-text">
                      {project.short_description}
                    </p>
                    
                    {/* Design process visualization */}
                    <div className="flex items-center space-x-3 mb-6 animate-text">
                      <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center text-black">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="h-[2px] bg-gradient-to-r from-black to-transparent flex-grow"></div>
                    </div>
                    
                    {/* Tools and categories */}
                    <div className="flex flex-wrap gap-2 animate-text">
                      {project.tools_used && project.tools_used.slice(0, 4).map((tool, i) => (
                        <span key={i} className="text-xs bg-white/10 px-2 py-1 rounded">
                          {tool}
                        </span>
                      ))}
                    </div>
                    
                    <div className="mt-6 animate-text">
                      <span className="text-sm inline-flex items-center font-medium text-black hover:text-black transition-colors">
                        View Case Study
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
          
          {/* Next section indicator */}
          {isScrollLocked && (
            <motion.div 
              className="text-center py-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: reachedBottom ? 1 : 0, y: reachedBottom ? 0 : 20 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-black text-sm mb-2">Scroll to next section</p>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto text-black animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Add CSS for shadow glow effect */}
      <style>
        {`
          .shadow-glow {
            box-shadow: 0 0 15px rgba(16, 185, 129, 0.3), 
                        inset 0 0 8px rgba(16, 185, 129, 0.2);
          }
          
          .animate-text {
            opacity: 0;
            transform: translateY(20px);
          }
        `}
      </style>
    </section>
  );
};

export default VerticalStackReveal; 