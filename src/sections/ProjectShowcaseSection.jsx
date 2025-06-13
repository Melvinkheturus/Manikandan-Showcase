import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import SectionWrapper from '../portfolio/components/layout/SectionWrapper';

// SSR compatibility - prevent useLayoutEffect warnings
const isBrowser = typeof window !== 'undefined';

// Enhanced stacked project showcase with glassmorphism, scroll pinning, and cursor glow
const ProjectShowcaseSection = () => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ x: 50, y: 50 });
  const [hoveredCard, setHoveredCard] = useState(null);
  
  // Scroll progress tracking for pin effect - only run in browser
  const { scrollYProgress } = useScroll(isBrowser ? {
    target: sectionRef,
    offset: ["start start", "end end"]
  } : {});
  
  // Scroll progress smoothing with fallback for SSR
  const smoothProgress = isBrowser ? useSpring(scrollYProgress, { damping: 20, stiffness: 100 }) : { onChange: () => {}, get: () => 0 };
  
  // Mock data for featured projects
  const featuredProjects = [
    {
      id: "01",
      title: "EXAMINERPRO",
      description: "COE AUTOMATION TOOL",
      subTitle: "3D Modeling",
      details: "Developed a full-stack salary automation app in 15 days using AI tools—60% faster than usual.",
      image: "https://images.unsplash.com/photo-1551739440-5dd934d3a94a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      tools: ["Flutter", "React", "Supabase", "Node.js", "PostgreSQL"],
      slug: "examinerpro",
      color: "from-primary-400/20 to-blue-500/20"
    },
    {
      id: "02",
      title: "EVENT MANAGEMENT",
      description: "WEBSITE",
      subTitle: "Web design and development",
      details: "Built a full event management site with real-time editing in 15 hours using AI-enhanced workflows.",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      tools: ["React", "Supabase", "Tailwind CSS", "Next.js", "Vercel"],
      slug: "event-management",
      color: "from-pink-500/20 to-primary-400/20"
    },
    {
      id: "03",
      title: "GAME HUB",
      description: "UI/UX DESIGN",
      subTitle: "Web Project",
      details: "Designed the complete UI/UX flow from research to prototypes using AI tools for rapid ideation.",
      image: "https://images.unsplash.com/photo-1541462608143-67571c6738dd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      tools: ["React", "TypeScript", "Express", "Node", "Zustand", "Chakra UI"],
      slug: "game-hub",
      color: "from-blue-500/20 to-primary-400/20"
    }
  ];
  
  // Update active index based on scroll position - with SSR guard
  useEffect(() => {
    if (!isBrowser) return;
    
    const unsubscribe = smoothProgress.onChange(value => {
      // Map scroll progress to project index
      const totalProjects = featuredProjects.length;
      const scrollRange = 1 / totalProjects;
      
      // Calculate active index from scroll progress
      const newIndex = Math.min(
        Math.floor(value / scrollRange),
        totalProjects - 1
      );
      
      if (newIndex !== activeIndex && newIndex >= 0) {
        setActiveIndex(newIndex);
      }
    });
    
    return () => unsubscribe();
  }, [smoothProgress, activeIndex, featuredProjects.length]);

  // Handle cursor movement for glow effect
  const handleMouseMove = (e, index) => {
    if (index === activeIndex) {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      setCursorPosition({ x, y });
      setHoveredCard(index);
    }
  };
  
  const handleMouseLeave = () => {
    setHoveredCard(null);
  };

  // Animation variants for the cards
  const cardVariants = {
    initial: (index) => ({
      opacity: 0.3,
      y: index * 80,
      scale: 1 - (index * 0.06),
      filter: "blur(4px)",
      zIndex: 30 - (index * 10)
    }),
    active: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      zIndex: 30,
      transition: { duration: 0.7, ease: [0.19, 1, 0.22, 1] }
    },
    inactive: (index) => ({
      opacity: 0.3 - (index * 0.1),
      y: 80 + (index * 40),
      scale: 0.94 - (index * 0.06),
      filter: "blur(4px)",
      zIndex: 20 - (index * 10),
      transition: { duration: 0.7, ease: [0.19, 1, 0.22, 1] }
    }),
    exit: {
      opacity: 0,
      y: -100,
      scale: 0.9,
      filter: "blur(8px)",
      transition: { duration: 0.5, ease: [0.19, 1, 0.22, 1] }
    },
    hover: {
      scale: 1.02,
      y: -5,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };
  
  // Animation variants for the content
  const contentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };
  
  // Project navigator dots
  const NavigatorDots = () => (
    <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 hidden lg:flex flex-col gap-3">
      {featuredProjects.map((_, index) => (
        <motion.div
          key={index}
          className={`w-3 h-3 rounded-full cursor-pointer relative ${index === activeIndex ? 'bg-primary' : 'bg-white/30'}`}
          onClick={() => {
            if (!isBrowser || !sectionRef.current) return;
            
            // Calculate the scroll position based on the index
            const scrollPerCard = 1 / featuredProjects.length;
            const scrollTarget = scrollPerCard * index;
            
            // Get section's position relative to the document
            const sectionTop = sectionRef.current.offsetTop;
            const sectionHeight = sectionRef.current.offsetHeight;
            
            // Calculate exact pixel to scroll to
            const scrollPixel = sectionTop + (scrollTarget * sectionHeight);
            
            window.scrollTo({
              top: scrollPixel,
              behavior: 'smooth'
            });
          }}
          whileHover={{ scale: 1.5 }}
        >
          {index === activeIndex && (
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/40"
              animate={{ scale: [1, 1.8, 1], opacity: [1, 0, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );

  return (
    <SectionWrapper id="project-showcase">
      <div 
        ref={sectionRef} 
        className="relative w-full" 
        style={{ height: `${featuredProjects.length * 100}vh` }} // Expanded height for scrolling
      >
        {/* Pinned Content Container */}
        <motion.div
          ref={containerRef}
          className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col justify-center items-center"
          style={{ 
            willChange: 'transform',
          }}
        >
          <div className="container mx-auto px-4 md:px-6 lg:px-8 relative">
            {/* Header */}
            <div className="mb-8 sm:mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 heading-glow gradient-heading">
                  My Work
                </h1>
                <div className="w-24 h-1 bg-primary mx-auto mb-6 neon-divider"></div>
                <p className="text-base sm:text-lg text-gray-300 max-w-xl mx-auto">
                  Explore my latest projects — each one built with purpose, creativity, and technical excellence.
                </p>
              </motion.div>
            </div>

            {/* Stacked Project Cards */}
            <div className="h-[700px] md:h-[600px] relative perspective">
              {/* Navigation dots */}
              <NavigatorDots />
              
              {/* Project cards */}
              <div className="relative h-full">
                {featuredProjects.map((project, index) => {
                  const isActive = index === activeIndex;
                  const relativeIndex = index - activeIndex;
                  const isHovered = hoveredCard === index;
                  
                  return (
                    <motion.div
                      key={project.id}
                      className="absolute top-0 left-0 w-full max-w-5xl mx-auto"
                      style={{ 
                        x: "-50%", 
                        left: "50%",
                        pointerEvents: isActive ? "auto" : "none" 
                      }}
                      custom={relativeIndex}
                      variants={cardVariants}
                      initial="initial"
                      animate={isActive ? "active" : "inactive"}
                      exit="exit"
                      whileHover={isActive ? "hover" : ""}
                      onMouseMove={(e) => handleMouseMove(e, index)}
                      onMouseLeave={handleMouseLeave}
                    >
                      {/* Glassmorphism Card */}
                      <div 
                        className={`
                          relative h-[500px] md:h-[400px] rounded-xl overflow-hidden cursor-pointer
                          border border-white/10 shadow-xl transition-all duration-500
                          ${isActive ? 'shadow-primary/30' : ''}
                        `}
                        style={{
                          "--x": `${cursorPosition.x}%`,
                          "--y": `${cursorPosition.y}%`,
                        }}
                      >
                        {/* Background gradient */}
                        <div 
                          className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-80`}
                          style={{ 
                            backdropFilter: "blur(12px)",
                            WebkitBackdropFilter: "blur(12px)"
                          }}
                        />
                        
                        {/* Grid Pattern */}
                        <div 
                          className="absolute inset-0 opacity-10" 
                          style={{
                            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
                            backgroundSize: "20px 20px"
                          }}
                        />
                        
                        {/* Cursor follow glow effect */}
                        {isActive && (
                          <div 
                            className="absolute inset-0 pointer-events-none glow-cursor-effect"
                            style={{
                              background: isHovered 
                                ? `radial-gradient(circle at var(--x) var(--y), ${isHovered ? 'rgba(162, 89, 255, 0.3)' : 'rgba(162, 89, 255, 0)'} 0%, transparent 50%)`
                                : 'none',
                              opacity: isHovered ? 1 : 0,
                              transition: 'opacity 0.3s ease'
                            }}
                          />
                        )}
                        
                        {/* Project content */}
                        <div className="absolute inset-0 p-6 md:p-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
                          {/* Left Column - Info */}
                          <motion.div 
                            className="w-full md:w-1/2 relative z-10"
                            variants={contentVariants}
                            initial="hidden"
                            animate={isActive ? "visible" : "hidden"}
                          >
                            <motion.div variants={itemVariants} className="mb-2 opacity-40 flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                <span className="text-primary font-mono text-sm">{project.id}</span>
                              </div>
                              <div className="h-px bg-primary/30 flex-grow"></div>
                            </motion.div>
                            
                            <motion.h2 
                              variants={itemVariants} 
                              className="text-3xl sm:text-4xl font-bold mb-2 text-white tracking-tight"
                            >
                              {project.title}
                              <span className="block text-lg font-normal text-primary mt-1">{project.description}</span>
                            </motion.h2>
                            
                            <motion.p 
                              variants={itemVariants}
                              className="text-white/70 mb-6"
                            >
                              {project.details}
                            </motion.p>
                            
                            <motion.div variants={itemVariants} className="mb-8">
                              <h4 className="text-xs uppercase tracking-wider text-white/50 mb-2">Technologies</h4>
                              <div className="flex flex-wrap gap-2">
                                {project.tools.map((tool, i) => (
                                  <span 
                                    key={i} 
                                    className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/80"
                                  >
                                    {tool}
                                  </span>
                                ))}
                              </div>
                            </motion.div>
                            
                            <motion.div variants={itemVariants}>
                              <Link 
                                to={`/project/${project.slug}`}
                                className="group inline-flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-full hover:bg-primary/90 transition-all duration-300 relative overflow-hidden"
                              >
                                <span className="relative z-10">View Project</span>
                                <svg 
                                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                                  fill="none" 
                                  viewBox="0 0 24 24" 
                                  stroke="currentColor"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                                <span className="absolute inset-0 w-full h-full bg-white/20 transform scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100"></span>
                              </Link>
                            </motion.div>
                          </motion.div>
                          
                          {/* Right Column - Image */}
                          <motion.div 
                            className="w-full md:w-1/2 h-60 md:h-full relative overflow-hidden rounded-lg"
                            variants={contentVariants}
                            initial="hidden"
                            animate={isActive ? "visible" : "hidden"}
                          >
                            <motion.div
                              className="absolute inset-0 backdrop-blur-sm bg-black/30 z-10 rounded-lg"
                              initial={{ opacity: 1 }}
                              animate={{ opacity: isHovered ? 0 : 0.5 }}
                              transition={{ duration: 0.3 }}
                            />
                            
                            <motion.img 
                              variants={itemVariants}
                              src={project.image} 
                              alt={project.title}
                              className="w-full h-full object-cover"
                              style={{ 
                                filter: "saturate(0.8) contrast(1.1)",
                              }}
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.5 }}
                            />
                            
                            {/* Image Corner Glow */}
                            <motion.div 
                              className="absolute top-0 right-0 w-40 h-40 bg-primary/30 rounded-full filter blur-3xl"
                              animate={{ 
                                opacity: [0.3, 0.6, 0.3],
                                scale: [1, 1.1, 1],
                              }}
                              transition={{ 
                                duration: 5, 
                                repeat: Infinity,
                                repeatType: "reverse" 
                              }}
                            />
                          </motion.div>
                        </div>
                        
                        {/* Perspective Edge Line */}
                        <motion.div 
                          className="absolute left-0 right-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"
                          animate={{ 
                            opacity: [0.3, 0.8, 0.3],
                            backgroundPosition: ['100% 0%', '0% 0%', '100% 0%']
                          }}
                          transition={{ duration: 5, repeat: Infinity }}
                        />
                      </div>
                      
                      {/* Card stack shadows (only for inactive cards) */}
                      {!isActive && relativeIndex > 0 && (
                        <div 
                          className="absolute inset-x-0 -bottom-2 h-2 rounded-b-xl bg-black/20 blur-sm"
                          style={{
                            transform: `translateY(${relativeIndex * 5}px)`
                          }}
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
            
            {/* CTA Button */}
            <div className="text-center mt-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Link 
                  to="/projects" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-primary text-white rounded-full hover:bg-primary/10 transition-all duration-300 group relative overflow-hidden btn-outline-glow"
                >
                  <span>View All Projects</span>
                  <svg 
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Add global CSS for glassmorphism and effects */}
      <style>
        {`
        .perspective {
          perspective: 1000px;
        }
        
        .text-shadow-sm {
          text-shadow: 0 0 8px rgba(162, 89, 255, 0.5);
        }
        
        .shadow-glow {
          box-shadow: 0 0 15px rgba(162, 89, 255, 0.4);
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        .glow-cursor-effect {
          mix-blend-mode: soft-light;
          pointer-events: none;
          z-index: 10;
        }
        `}
      </style>
    </SectionWrapper>
  );
};

export default ProjectShowcaseSection; 