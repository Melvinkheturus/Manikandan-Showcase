import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowUp, FaAngleDown, FaArrowLeft } from 'react-icons/fa';
import { IoLayersOutline, IoCodeSlash, IoColorPaletteOutline, IoFlaskOutline, IoRocketOutline } from 'react-icons/io5';
import supabase from '../../utils/supabaseClient';
import AllProjectsSection from '../components/projects/AllProjectsSection';
import VerticalStackReveal from '../components/projects/VerticalStackReveal';
import SectionTransitionManager from '../components/layout/SectionTransitionManager';

// Import the separated section components
import {
  // New parallax transition component
  ParallaxTransition,
  
  // Section components
  VisualIdentitySection,
  UIUXDesignSection,
  DevelopmentSection,
  AIProjectsSection,
  CreativeLabSection,
  
  // Shared styles
  themeStyles
} from '../components/projects/ProjectGallerySections';

// Section header component for consistent styling
const SectionHeader = ({ title, icon }) => {
  return (
    <div className="flex items-center mb-6 pb-2 border-b border-primary/20">
      <div className="mr-3 text-primary text-xl">
        {icon}
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
    </div>
  );
};

// Sample project data for development
export const sampleProjects = [
  {
    id: 1,
    title: "EXAMINERPRO – COE AUTOMATION TOOL",
    slug: "examinerpro",
    thumbnail: "https://images.unsplash.com/photo-1551739440-5dd934d3a94a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    short_description: "Developed a full-stack salary automation app in 15 days using AI tools—60% faster than usual.",
    full_description: "ExaminerPro is a comprehensive automation tool designed specifically for Controllers of Examinations (COE) in educational institutions. It streamlines the entire examination process from planning to result publication, significantly reducing manual work and potential errors.",
    completed_date: "2023-08-15",
    tags: ["Flutter", "React", "Supabase"],
    categories: ["Web Application", "Desktop Application"],
    tools_used: ["Flutter", "React", "Supabase", "SQLite"],
    is_featured: true,
    category: "Development"
  },
  {
    id: 2,
    title: "EVENT MANAGEMENT WEBSITE",
    slug: "event-management",
    thumbnail: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    short_description: "Built a full event management site with real-time editing in 15 hours using AI-enhanced workflows.",
    full_description: "A comprehensive event management platform with integrated CMS capabilities that allows organizers to create, manage, and promote events efficiently. The entire solution was built in just 15 hours by leveraging AI-enhanced development workflows.",
    completed_date: "2023-06-22",
    tags: ["React", "Tailwind", "Supabase"],
    categories: ["Web Application", "CMS"],
    tools_used: ["React", "Tailwind CSS", "Supabase"],
    is_featured: false,
    category: "Development"
  },
  {
    id: 3,
    title: "UI/UX DESIGN FOR EXAMINERPRO",
    slug: "examinerpro-uiux",
    thumbnail: "https://images.unsplash.com/photo-1541462608143-67571c6738dd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    short_description: "Designed the complete UI/UX flow from research to prototypes using AI tools for rapid ideation.",
    full_description: "A comprehensive UI/UX design project for ExaminerPro, focusing on creating an intuitive, accessible interface for examination controllers. The design process leveraged AI tools for rapid wireframing and ideation while maintaining a focus on hierarchy, accessibility, and simplifying complex workflows.",
    completed_date: "2023-07-10",
    tags: ["Figma", "UI/UX"],
    categories: ["UI Design", "UX Design"],
    tools_used: ["Figma", "Canva", "Galileo AI", "Uizard"],
    is_featured: false,
    category: "UI/UX Design"
  },
  {
    id: 4,
    title: "P2P RENTAL PLATFORM",
    slug: "rental-platform",
    thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    short_description: "A P2P rental platform built with React & Supabase for Chennai students—2-week sprint.",
    full_description: "RentOut is a peer-to-peer rental platform specifically designed for college students in Chennai. It allows students to rent out their unused items to other students, generating extra income while providing affordable access to needed items.",
    completed_date: "2024-04-05",
    tags: ["React", "Supabase", "Mobile"],
    categories: ["Web Application", "Mobile"],
    tools_used: ["React", "Supabase", "Stripe", "Google Maps API"],
    is_featured: false,
    category: "Development"
  },
  {
    id: 5,
    title: "HEALTHCARE APPOINTMENT SYSTEM",
    slug: "healthcare-app",
    thumbnail: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    short_description: "Mobile app for booking and managing healthcare appointments with telemedicine features.",
    full_description: "An integrated healthcare appointment management system that allows patients to book, reschedule and manage their appointments. The application includes telemedicine features, prescription management, and integration with laboratory test results.",
    completed_date: "2023-11-18",
    tags: ["React Native", "Firebase", "Mobile"],
    categories: ["Mobile"],
    tools_used: ["React Native", "Firebase", "Twilio", "Stripe"],
    is_featured: false,
    category: "Development"
  },
  {
    id: 6,
    title: "RESTAURANT ORDERING KIOSK",
    slug: "restaurant-kiosk",
    thumbnail: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    short_description: "Self-service kiosk for restaurant ordering with kitchen display integration.",
    full_description: "A complete restaurant self-service ordering solution that includes customer-facing kiosks, mobile ordering, and kitchen display system integration. The system reduces wait times and improves order accuracy while integrating with existing POS systems.",
    completed_date: "2024-01-10",
    tags: ["React", "Node.js", "WebSocket"],
    categories: ["Web Application", "Kiosk"],
    tools_used: ["React", "Node.js", "MongoDB", "Socket.io"],
    is_featured: false,
    category: "Development"
  },
  {
    id: 7,
    title: "FINANCE TRACKING DASHBOARD",
    slug: "finance-dashboard",
    thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    short_description: "Personal finance dashboard with expense tracking, budgeting, and visualization.",
    full_description: "A comprehensive personal finance management dashboard that helps users track expenses, manage budgets, and visualize spending patterns. The application integrates with bank accounts, categorizes transactions automatically, and provides insights to improve financial health.",
    completed_date: "2023-09-28",
    tags: ["Vue.js", "D3.js", "Finance"],
    categories: ["Web Application", "Dashboard"],
    tools_used: ["Vue.js", "D3.js", "Plaid API", "Firebase"],
    is_featured: false,
    category: "AI Projects"
  },
  {
    id: 8,
    title: "TRAVEL APP REDESIGN",
    slug: "travel-app-redesign",
    thumbnail: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    short_description: "Complete redesign of a travel booking app with focus on accessibility and user journey simplification.",
    full_description: "A comprehensive redesign of an existing travel booking application that drastically improved user satisfaction scores. The project focused on simplifying the booking flow, enhancing accessibility features, and implementing a consistent design system for future scalability.",
    completed_date: "2023-12-15",
    tags: ["UI/UX", "Figma", "Design System"],
    categories: ["UI Design", "UX Research", "Mobile Design"],
    tools_used: ["Figma", "Adobe XD", "Maze", "Miro"],
    is_featured: true,
    category: "UI/UX Design"
  },
  {
    id: 9,
    title: "E-LEARNING PLATFORM UX",
    slug: "elearning-ux",
    thumbnail: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    short_description: "Reimagined online learning experience with engaging gamification and personalized learning paths.",
    full_description: "This project transformed a traditional e-learning platform into an engaging, personalized learning experience. By implementing gamification elements, adaptive learning paths, and a comprehensive design system, student engagement increased by 47% and course completion rates improved by 38%.",
    completed_date: "2024-02-22",
    tags: ["UI/UX", "Educational Design", "Gamification"],
    categories: ["UI Design", "UX Design", "Web Application"],
    tools_used: ["Figma", "Principle", "Optimal Workshop", "Hotjar"],
    is_featured: false,
    category: "UI/UX Design"
  },
  {
    id: 10,
    title: "BANKING APP REDESIGN",
    slug: "banking-app-redesign",
    thumbnail: "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    short_description: "Modernized digital banking experience with focus on security, clarity, and personalization.",
    full_description: "A complete redesign of a major bank's mobile application focusing on modern visual design, simplified transaction flows, and enhanced security features. The project included extensive user research, iterative prototyping, and A/B testing to validate design decisions before implementation.",
    completed_date: "2024-03-05",
    tags: ["UI/UX", "Fintech", "Mobile"],
    categories: ["UI Design", "UX Design", "Mobile App"],
    tools_used: ["Figma", "Protopie", "UserTesting", "FullStory"],
    is_featured: true,
    category: "UI/UX Design"
  }
];

const ProjectCard = ({ project, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  
  return (
    <motion.div 
      className={`project-card relative flex-shrink-0 w-[320px] md:w-[380px] h-[460px] rounded-xl overflow-hidden mx-3 ${isHovered ? 'glow-primary' : ''}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ 
        scale: 1.03, 
        transition: { duration: 0.3 } 
      }}
      onClick={() => navigate(`/projects/${project.slug}`)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Project Image */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={project.thumbnail} 
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 ease-out"
          style={{ 
            transform: isHovered ? 'scale(1.05)' : 'scale(1)'
          }}
        />
      </div>
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {project.tags.slice(0, 3).map((tag, i) => (
            <span 
              key={i} 
              className="text-xs bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <h3 className="text-xl font-bold mb-2 text-white">{project.title}</h3>
        <p className="text-sm text-gray-300 line-clamp-2 mb-4">{project.short_description}</p>
        
        <motion.div 
          className="inline-flex items-center text-primary text-sm font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          View Project <FaArrowRight className="ml-2" />
        </motion.div>
      </div>
    </motion.div>
  );
};

const CategorySection = React.forwardRef(({ id, title, icon, children, style, themeColor }, ref) => {
  const [inViewRef, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });
  
  // Use callback ref to merge the forwarded ref and the inView ref
  const mergedRef = (node) => {
    if (ref) {
      if (typeof ref === 'function') {
        ref(node);
      } else {
        ref.current = node;
      }
    }
    inViewRef(node);
  };
  
  return (
    <motion.div
      ref={mergedRef}
      id={id}
      className="relative mb-20 md:mb-32 px-4 py-10 rounded-2xl overflow-hidden"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={style}
    >
      {/* Background gradient glow with dynamic theme color */}
      <div 
        className="absolute inset-0 -z-10" 
        style={{
          background: themeColor ? 
            `radial-gradient(circle at 10% 0%, ${themeColor}15, transparent 70%), 
             radial-gradient(circle at 90% 100%, ${themeColor}10, transparent 70%)` 
            : themeStyles.sectionGlow.background
        }}
      ></div>
      
      {/* Section content */}
      <div className="container mx-auto">
        <SectionHeader title={title} icon={icon} />
        {children}
      </div>
    </motion.div>
  );
});

const ProjectGallery = () => {
  const [projects, setProjects] = useState(sampleProjects);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Navigation controls
  const [navbarVisible, setNavbarVisible] = useState(true);
  
  // Scroll hijacking state
  const [activeSection, setActiveSection] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [targetSection, setTargetSection] = useState("");
  const [scrollable, setScrollable] = useState(true);
  
  // Refs
  const scrollRef = useRef(null);
  const navScrollRef = useRef(null);
  const transitionTimerRef = useRef(null);
  
  // All sections data including hero
  const sections = [
    { id: 'hero', name: 'Home', icon: null, ref: useRef(null) },
    { id: 'visual-identity', name: 'Visual Identity', icon: <IoLayersOutline />, ref: useRef(null) },
    { id: 'ui-ux-design', name: 'UI/UX Design', icon: <IoColorPaletteOutline />, ref: useRef(null) },
    { id: 'development', name: 'Development', icon: <IoCodeSlash />, ref: useRef(null) },
    { id: 'ai-projects', name: 'AI Projects', icon: <IoFlaskOutline />, ref: useRef(null) },
    { id: 'creative-lab', name: 'Creative Lab', icon: <IoRocketOutline />, ref: useRef(null) }
  ];
  
  // More cinematic parallax-friendly transition timing
  const goToSection = (index) => {
    if (isTransitioning || index === activeSection || index < 0 || index >= sections.length || !scrollable) {
      return;
    }
    
    setIsTransitioning(true);
    setScrollable(false);
    setTargetSection(sections[index].name);
    
    // More cinematic parallax-friendly transition timing
    let progress = 0;
    const animationInterval = 16; // ~60fps
    const transitionDuration = 1500; // ms - slightly longer for more cinematic feel
    const totalSteps = transitionDuration / animationInterval;
    const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; // Cubic easing for smoother transitions
    
    if (transitionTimerRef.current) {
      clearInterval(transitionTimerRef.current);
    }
    
    transitionTimerRef.current = setInterval(() => {
      progress += 1 / totalSteps;
      const easedProgress = easeInOutCubic(Math.min(progress, 1));
      setTransitionProgress(easedProgress);
      
      if (progress >= 1) {
        clearInterval(transitionTimerRef.current);
        setActiveSection(index);
        setIsTransitioning(false);
        setTransitionProgress(0);
        
        // Re-enable scrolling after a short delay
        setTimeout(() => {
          setScrollable(true);
        }, 100);
      }
    }, animationInterval);
  };
  
  // Improved scroll event handler with proper throttling
  useEffect(() => {
    let throttled = false;
    
    const handleWheel = (e) => {
      e.preventDefault();
      
      if (throttled || !scrollable) return;
      
      // Use a debounce/accumulator approach for smoother scrolling
      const scrollDelta = e.deltaY;
      const scrollThreshold = 50; // Increase threshold for more intentional scrolling
      
      // Only trigger if scroll exceeds threshold
      if (Math.abs(scrollDelta) < scrollThreshold) return;
      
      throttled = true;
      setTimeout(() => {
        throttled = false;
      }, 1500); // Match transition duration
      
      if (scrollDelta > 0) {
        // Scroll down - next section with smoother easing
        goToSection(activeSection + 1);
      } else if (scrollDelta < 0) {
        // Scroll up - previous section with smoother easing
        goToSection(activeSection - 1);
      }
    };
    
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [activeSection, scrollable]);
  
  // Touch event handling for mobile devices
  useEffect(() => {
    let touchStartY = 0;
    let touchThreshold = 70; // Higher threshold for more intentional swipes on mobile
    let throttled = false;
    
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };
    
    const handleTouchMove = (e) => {
      if (!scrollable || throttled) return;
      
      const touchEndY = e.touches[0].clientY;
      const diff = touchStartY - touchEndY;
      
      if (Math.abs(diff) > touchThreshold) {
        throttled = true;
        setTimeout(() => {
          throttled = false;
        }, 1500); // Match transition duration
        
        if (diff > 0) {
          // Swipe up - next section with parallax transition
          goToSection(activeSection + 1);
        } else {
          // Swipe down - previous section with parallax transition 
          goToSection(activeSection - 1);
        }
        // Reset touch start to prevent rapid multiple transitions
        touchStartY = touchEndY;
      }
    };
    
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [activeSection, scrollable]);
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!scrollable) return;
      
      switch(e.key) {
        case 'ArrowDown':
        case 'PageDown':
          goToSection(activeSection + 1);
          break;
        case 'ArrowUp':
        case 'PageUp':
          goToSection(activeSection - 1);
          break;
        case 'Home':
          goToSection(0);
          break;
        case 'End':
          goToSection(sections.length - 1);
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection, scrollable]);
  
  // Fetch projects when component mounts
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Use sample data for development
        setProjects(sampleProjects);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects(sampleProjects);
        setLoading(false);
      }
    };
    
    fetchProjects();
    
    // Hide navbar initially on mobile devices
    const handleResize = () => {
      setNavbarVisible(window.innerWidth > 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Navigation functions
  const scrollToTop = () => goToSection(0);
  const goBack = () => navigate('/');

  return (
    <div 
      ref={scrollRef} 
      className="h-screen w-full overflow-hidden bg-[#0b0b0b]"
    >
      {/* Vertical progress bar with section indicators */}
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 hidden md:block">
        <div className="relative h-60 w-1">
          {/* Glowing vertical track */}
          <div className="absolute inset-x-0 h-full rounded-full bg-white/10"></div>
          
          {/* Animated progress indicator */}
          <motion.div 
            className="absolute inset-x-0 rounded-full bg-primary"
            initial={{ height: '0%', top: '0%' }}
            animate={{ 
              height: `${100 / (sections.length - 1)}%`, 
              top: `${(activeSection / (sections.length - 1)) * 100}%`
            }}
            transition={{ duration: 0.6 }}
            style={{ 
              boxShadow: '0 0 10px 1px rgba(16, 185, 129, 0.7)',
            }}
          ></motion.div>
          
          {/* Section dots */}
          {sections.map((section, index) => (
            <motion.button
              key={index}
              className={`absolute left-0 w-3 h-3 rounded-full bg-white transform -translate-x-1 -translate-y-1/2 cursor-pointer`}
              style={{ 
                top: `${(index / (sections.length - 1)) * 100}%`,
                opacity: activeSection === index ? 1 : 0.3,
                scale: activeSection === index ? 1.5 : 1
              }}
              animate={{ 
                opacity: activeSection === index ? 1 : 0.3,
                scale: activeSection === index ? 1.5 : 1,
                boxShadow: activeSection === index ? '0 0 8px 2px rgba(16, 185, 129, 0.6)' : 'none'
              }}
              onClick={() => goToSection(index)}
              aria-label={`Go to ${section.name} section`}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>
      
      {/* Back button - top left */}
      <motion.button
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-3 py-2 text-sm text-white/80 hover:text-white rounded-lg"
        onClick={goBack}
        style={{
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        <FaArrowLeft size={12} />
        <span>Back</span>
      </motion.button>
      
      {/* Up button - right side */}
      <AnimatePresence>
        {activeSection > 0 && (
          <motion.button
            className="fixed top-4 right-4 z-50 p-3 rounded-full bg-primary/20 hover:bg-primary/30 text-primary"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{ boxShadow: '0 0 15px 2px rgba(16, 185, 129, 0.3)' }}
          >
            <FaArrowUp size={16} />
          </motion.button>
        )}
      </AnimatePresence>
      
      {/* Camera focus shift transition */}
      <ParallaxTransition
        active={isTransitioning}
        progress={transitionProgress}
        targetSection={targetSection}
      />
      
      {/* Bottom floating navigation - glassmorphism style */}
      <AnimatePresence>
        {navbarVisible && (
          <motion.div 
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div 
              className="rounded-full overflow-hidden"
              style={{
                background: 'rgba(10, 10, 20, 0.4)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}
            >
              <div 
                ref={navScrollRef}
                className="flex items-center px-4 py-3 overflow-x-auto hide-scrollbar"
                style={{ 
                  maxWidth: "calc(100vw - 32px)",
                  msOverflowStyle: "none",
                  scrollbarWidth: "none"
                }}
              >
                {sections.slice(1).map((section, index) => (
                  <motion.button 
                    key={section.id}
                    className={`relative flex items-center whitespace-nowrap gap-1.5 px-4 py-2 rounded-full text-sm transition-all duration-300
                      ${activeSection === index + 1 ? 'text-primary' : 'text-white/70 hover:text-white'}
                    `}
                    onClick={() => goToSection(index + 1)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-base">{section.icon}</span>
                    <span className="font-medium">{section.name}</span>
                    
                    {activeSection === index + 1 && (
                      <motion.div 
                        className="absolute inset-0 bg-primary/10 rounded-full -z-10"
                        layoutId="activeCategoryBg"
                        initial={{ opacity: 0 }}
                        animate={{ 
                          opacity: 1,
                          boxShadow: ['0 0 10px rgba(16, 185, 129, 0.2)', '0 0 15px rgba(16, 185, 129, 0.4)', '0 0 10px rgba(16, 185, 129, 0.2)']
                        }}
                        transition={{ 
                          opacity: { duration: 0.3 },
                          boxShadow: { 
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse"
                          },
                          layout: { duration: 0.3, type: "spring" }
                        }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
              
              {/* Left and right fade indicators for scrolling */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[rgba(10,10,20,0.8)] to-transparent pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[rgba(10,10,20,0.8)] to-transparent pointer-events-none"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Sections Container - AnimatePresence for section transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          className="w-full h-full"
          initial={{ opacity: 0, y: 20, scale: 0.98 }} 
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }} // Expo easing for smooth parallax feeling
        >
          {/* Section content based on active section */}
          {activeSection === 0 && (
            // Hero Section
            <motion.div 
              id="hero" 
              ref={sections[0].ref} 
              className="relative w-full h-screen overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            >
              {/* Video Background with Parallax Effect */}
              <motion.div 
                className="absolute inset-0 z-0"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
              >
                <video 
                  className="absolute inset-0 w-full h-full object-cover" 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  style={{ opacity: 0.6 }}
                >
                  <source src="./assets/videos/Project_Gallery_Hero.mp4" type="video/mp4" />
                </video>
                
                {/* Radial gradient overlay */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: 'radial-gradient(circle, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.8) 100%)',
                    zIndex: 1
                  }}
                ></div>
                
                {/* Subtle glow overlay with parallax */}
                <motion.div 
                  className="absolute inset-0 opacity-20"
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.2 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  style={{
                    background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.3) 0%, transparent 70%)',
                    zIndex: 2
                  }}
                ></motion.div>
              </motion.div>
              
              {/* Hero Content - Enhanced with staggered parallax */}
              <motion.div 
                className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center z-10"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <motion.div 
                  className="overflow-hidden py-4 mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                >
                  <motion.h1 
                    className="text-6xl md:text-8xl font-light text-white tracking-wider"
                    style={{ fontFamily: "'Sora', 'Space Grotesk', sans-serif" }}
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1, ease: [0.6, 0.01, 0.05, 0.95] }}
                  >
                    {"PROJECT GALLERY".split('').map((letter, index) => (
                      <motion.span 
                        key={index}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          duration: 0.6, 
                          delay: 0.05 * index,
                          ease: [0.6, 0.01, 0.05, 0.95]
                        }}
                        className="inline-block"
                      >
                        {letter === ' ' ? <span>&nbsp;</span> : letter}
                      </motion.span>
                    ))}
                  </motion.h1>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="text-xl md:text-2xl text-white/80 max-w-3xl"
                >
                  Explore my work across design, development, and creativity.
                </motion.p>
                
                {/* Scroll down indicator */}
                <motion.div 
                  className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer"
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  onClick={() => goToSection(1)}
                >
                  <p className="text-sm text-white/70 mb-2">Scroll to explore</p>
                  <FaAngleDown className="text-white/70 text-2xl" />
                </motion.div>
              </motion.div>
            </motion.div>
          )}
          
          {activeSection === 1 && (
            <motion.div 
              className="w-full h-screen overflow-hidden p-4 flex items-center justify-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            >
              <VisualIdentitySection projects={projects} />
            </motion.div>
          )}
          
          {activeSection === 2 && (
            <motion.div 
              className="w-full h-screen overflow-hidden p-4 flex items-center justify-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            >
              <SectionTransitionManager>
                <UIUXDesignSection projects={projects} />
              </SectionTransitionManager>
            </motion.div>
          )}
          
          {activeSection === 3 && (
            <motion.div 
              className="w-full h-screen overflow-hidden p-4 flex items-center justify-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            >
              <DevelopmentSection projects={projects} />
            </motion.div>
          )}
          
          {activeSection === 4 && (
            <motion.div 
              className="w-full h-screen overflow-hidden p-4 flex items-center justify-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            >
              <AIProjectsSection projects={projects} />
            </motion.div>
          )}
          
          {activeSection === 5 && (
            <motion.div 
              className="w-full h-screen overflow-hidden p-4 flex items-center justify-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            >
              <CreativeLabSection projects={projects} />
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* Custom styles */}
      <style jsx global>{`
        body {
          overflow: hidden;
          margin: 0;
          padding: 0;
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        @font-face {
          font-family: 'Sora';
          src: url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500&display=swap');
        }
        
        @font-face {
          font-family: 'Space Grotesk';
          src: url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500&display=swap');
        }
      `}</style>
    </div>
  );
};

export default ProjectGallery;