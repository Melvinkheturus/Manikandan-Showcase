import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView as useFramerInView } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import supabase from '../../../utils/supabaseClient';
import { FaArrowRight, FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { IoGridOutline, IoLayersOutline, IoCodeSlash, IoColorPaletteOutline, IoFlaskOutline, IoRocketOutline } from 'react-icons/io5';
import { sampleProjects } from '../../pages/ProjectGallery'; // Updated import path
import { ProjectGalleryEmpty } from '../common/EmptyStates';

// Styles for different UI elements
const uiStyles = {
  glassmorphism: {
    background: 'rgba(10, 10, 20, 0.3)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
  },
  sectionLabel: {
    background: 'rgba(0, 0, 0, 0.65)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
  },
  themeColors: {
    'Visual Identity': {
      gradient: 'radial-gradient(circle at 20% 30%, rgba(255, 147, 92, 0.4), transparent 70%)',
      accent: 'rgba(255, 147, 92, 0.8)',
      glow: '0 0 15px 2px rgba(255, 147, 92, 0.6)'
    },
    'UI/UX Design': {
      gradient: 'radial-gradient(circle at 80% 20%, rgba(74, 163, 223, 0.4), transparent 70%)',
      accent: 'rgba(74, 163, 223, 0.8)',
      glow: '0 0 15px 2px rgba(74, 163, 223, 0.6)'
    },
    'Development': {
      gradient: 'radial-gradient(circle at 60% 60%, rgba(87, 255, 172, 0.4), transparent 70%)',
      accent: 'rgba(87, 255, 172, 0.8)',
      glow: '0 0 15px 2px rgba(87, 255, 172, 0.6)'
    },
    'AI Projects': {
      gradient: 'radial-gradient(circle at 30% 70%, rgba(162, 89, 255, 0.4), transparent 70%)',
      accent: 'rgba(162, 89, 255, 0.8)',
      glow: '0 0 15px 2px rgba(162, 89, 255, 0.6)'
    },
    'Creative Lab': {
      gradient: 'radial-gradient(circle at 50% 40%, rgba(255, 92, 240, 0.4), transparent 70%)',
      accent: 'rgba(255, 92, 240, 0.8)',
      glow: '0 0 15px 2px rgba(255, 92, 240, 0.6)'
    }
  }
};

// Project Card components for different layouts
const PinterestCard = ({ project, index }) => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });
  
  const cardHeight = [400, 480, 350, 500, 420][index % 5];
  const navigate = useNavigate();
  
  return (
    <motion.div 
      ref={ref}
      className="relative overflow-hidden rounded-xl cursor-pointer"
      style={{ height: cardHeight }}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onClick={() => navigate(`/projects/${project.slug}`)}
    >
      <img 
        src={project.thumbnail} 
        alt={project.title}
        className="w-full h-full object-cover transition-transform duration-500 ease-out hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 flex flex-col justify-end">
        <h3 className="text-lg font-bold text-white">{project.title}</h3>
        <p className="text-sm text-gray-300 mt-1 line-clamp-2">{project.short_description}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {project.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="text-xs bg-white/10 px-2 py-1 rounded-full">{tag}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const SnapScrollCard = ({ project, index, inView }) => {
  return (
    <motion.div 
      className="relative h-screen w-full flex items-center justify-center snap-center"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 -z-10">
        <img 
          src={project.thumbnail} 
          alt="" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/60"></div>
      </div>
      
      <div className="max-w-4xl mx-auto px-5 grid md:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative aspect-video rounded-xl overflow-hidden group"
        >
          <img 
            src={project.thumbnail} 
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <h3 className="text-3xl font-bold mb-4">{project.title}</h3>
          <p className="text-gray-300 mb-6">{project.full_description || project.short_description}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag, i) => (
              <span key={i} className="text-sm bg-white/10 px-3 py-1 rounded-full">{tag}</span>
            ))}
          </div>
          <Link to={`/projects/${project.slug}`} className="btn-primary inline-flex items-center">
            View Project <FaArrowRight className="ml-2" />
          </Link>
        </motion.div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <p className="text-sm text-gray-400 mb-2">Scroll to continue</p>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <FaArrowDown className="text-gray-400" />
        </motion.div>
      </div>
    </motion.div>
  );
};

const TerminalCard = ({ project, index }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  const [displayedTitle, setDisplayedTitle] = useState('');
  const [displayedDescription, setDisplayedDescription] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (inView) {
      let titleCounter = 0;
      const titleInterval = setInterval(() => {
        if (titleCounter < project.title.length) {
          setDisplayedTitle(project.title.substring(0, titleCounter + 1));
          titleCounter++;
        } else {
          clearInterval(titleInterval);
          
          // Start typing description after title is complete
          let descCounter = 0;
          const descInterval = setInterval(() => {
            if (descCounter < project.short_description.length) {
              setDisplayedDescription(project.short_description.substring(0, descCounter + 1));
              descCounter++;
            } else {
              clearInterval(descInterval);
            }
          }, 15);
          
          return () => clearInterval(descInterval);
        }
      }, 30);
      
      // Blinking cursor
      const cursorInterval = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 530);
      
      return () => {
        clearInterval(titleInterval);
        clearInterval(cursorInterval);
      };
    }
  }, [inView, project.title, project.short_description]);
  
  return (
    <motion.div 
      ref={ref}
      className="bg-black/70 border border-green-500/30 rounded-md p-4 mb-5 hover:border-green-500/70 transition-colors duration-300 cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: index * 0.15 }}
      onClick={() => navigate(`/projects/${project.slug}`)}
      whileHover={{ 
        boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)',
        scale: 1.01
      }}
    >
      <div className="flex items-center space-x-2 mb-3">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <div className="text-xs text-gray-400 ml-2">project_{project.id}.sh</div>
      </div>
      
      <div className="font-mono text-sm">
        <div className="text-green-400">$ cat project_info.md</div>
        <div className="text-white mt-2">
          <span className="text-green-300">{">"}</span> TITLE: <span className="text-white">{displayedTitle}{displayedTitle.length === project.title.length && displayedDescription.length === 0 && showCursor ? '|' : ''}</span>
        </div>
        <div className="text-white mt-1">
          <span className="text-green-300">{">"}</span> DESCRIPTION: <span className="text-gray-300">{displayedDescription}{displayedDescription.length > 0 && displayedDescription.length < project.short_description.length && showCursor ? '|' : ''}</span>
        </div>
        <div className="text-white mt-1">
          <span className="text-green-300">{">"}</span> TECH: <span className="text-yellow-200">{project.tags.join(', ')}</span>
        </div>
        <div className="text-white mt-3 group">
          <span className="text-green-400">$ open</span> <span className="text-blue-300 underline group-hover:text-blue-100">/projects/{project.slug}</span>
          <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">↵</span>
        </div>
      </div>
    </motion.div>
  );
};

const LensGridCard = ({ project, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  
  return (
    <motion.div 
      className="relative group"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => navigate(`/projects/${project.slug}`)}
    >
      <div className="overflow-hidden rounded-xl">
        <img 
          src={project.thumbnail} 
          alt={project.title}
          className="w-full aspect-video object-cover transition-transform duration-700"
          style={{ 
            transform: isHovered ? 'scale(1.08)' : 'scale(1)',
            filter: isHovered ? 'brightness(1.1)' : 'brightness(0.9)'
          }}
        />
      </div>
      
      <motion.div 
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-5"
        initial={{ opacity: 0.7 }}
        animate={{ opacity: isHovered ? 0.9 : 0.7 }}
      >
        <div className="flex items-center mb-2">
          <div className="w-2 h-2 rounded-full bg-purple-400 mr-2"></div>
          <div className="text-xs text-purple-300 uppercase tracking-wider">AI-Powered</div>
        </div>
        <h3 className="text-xl font-bold text-white">{project.title}</h3>
        <p className="text-sm text-gray-300 mt-1 line-clamp-2">{project.short_description}</p>
      </motion.div>
      
      <motion.div 
        className="absolute inset-0 border-2 rounded-xl pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        style={{ borderColor: 'rgba(162, 89, 255, 0.6)' }}
      ></motion.div>
      
      {/* Lens focus effect */}
      {isHovered && (
        <motion.div 
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-purple-500/10 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-purple-900/30"></div>
        </motion.div>
      )}
    </motion.div>
  );
};

const GlitchCard = ({ project, index }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  const [isHovered, setIsHovered] = useState(false);
  const randomOffset = [5, -5, 8, -8, 3, -3][index % 6];
  const navigate = useNavigate();
  
  return (
    <motion.div 
      ref={ref}
      className="relative my-12 ml-4 cursor-pointer"
      initial={{ opacity: 0, x: randomOffset * 5, y: 20, skewX: randomOffset }}
      animate={inView ? { opacity: 1, x: randomOffset, y: 0, skewX: randomOffset / 2 } : { opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      onClick={() => navigate(`/projects/${project.slug}`)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-lg">
        <img 
          src={project.thumbnail} 
          alt={project.title}
          className="w-full aspect-video object-cover"
        />
        
        {/* Glitch effects */}
        <div className="absolute inset-0 bg-pink-500/10 mix-blend-hue"></div>
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 w-full h-1 bg-pink-500/50"
            animate={isHovered ? {
              y: [0, 30, 10, 40, 20, 0],
              opacity: [0.5, 0.8, 0.3, 0.7, 0.5]
            } : {}}
            transition={{
              duration: 0.5,
              ease: "easeInOut"
            }}
          ></motion.div>
          <motion.div 
            className="absolute top-1/3 left-0 w-full h-px bg-cyan-400/70"
            animate={isHovered ? {
              y: [0, -10, 5, -15, 0],
              opacity: [0.7, 0.3, 0.9, 0.5, 0.7]
            } : {}}
            transition={{
              duration: 0.4,
              ease: "easeInOut"
            }}
          ></motion.div>
          <motion.div 
            className="absolute top-2/3 left-0 w-full h-px bg-yellow-400/50"
            animate={isHovered ? {
              y: [0, 15, -5, 10, 0],
              opacity: [0.5, 0.9, 0.4, 0.7, 0.5]
            } : {}}
            transition={{
              duration: 0.3,
              ease: "easeInOut" 
            }}
          ></motion.div>
        </div>
      </div>
      
      <div className="mt-4 max-w-sm">
        <h3 className="text-lg font-bold relative inline-block">
          {project.title}
          <motion.div 
            className="absolute -inset-1 bg-pink-500/20 -z-10"
            animate={isHovered ? {
              skewX: [3, -2, 4, -1, 3],
              x: [1, 2, 0, 3, 1],
              y: [1, 0, 2, 1, 1]
            } : {
              skewX: 3,
              x: 1,
              y: 1
            }}
            transition={{ duration: 0.4 }}
          ></motion.div>
        </h3>
        <p className="text-sm text-gray-300 mt-2">{project.short_description}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {project.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="text-xs bg-white/5 border border-white/10 px-2 py-1 rounded-sm">{tag}</span>
          ))}
        </div>
        <div className="mt-4 text-xs text-gray-400 italic group-hover:text-pink-300 transition-colors">Coming soon...</div>
      </div>
    </motion.div>
  );
};

// Empty state component with animations
const EmptyProjectsState = ({ category }) => {
  return (
      <motion.div 
      className="flex flex-col items-center justify-center py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
            <motion.div
        className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center"
        animate={{ 
          y: [0, -10, 0],
          boxShadow: [
            '0 0 0 rgba(16, 185, 129, 0)',
            '0 0 20px rgba(16, 185, 129, 0.5)',
            '0 0 0 rgba(16, 185, 129, 0)'
          ]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          repeatType: "loop"
        }}
      >
        {category === 'Visual Identity' && <IoLayersOutline className="text-4xl text-primary/80" />}
        {category === 'UI/UX Design' && <IoColorPaletteOutline className="text-4xl text-primary/80" />}
        {category === 'Development' && <IoCodeSlash className="text-4xl text-primary/80" />}
        {category === 'AI Projects' && <IoFlaskOutline className="text-4xl text-primary/80" />}
        {category === 'Creative Lab' && <IoRocketOutline className="text-4xl text-primary/80" />}
      </motion.div>
      
      <h3 className="text-xl font-medium text-white mb-2">No projects here yet…</h3>
      <p className="text-gray-400 text-center max-w-md">
        but something exciting is brewing. Check back soon to see what's being created.
            </p>
          </motion.div>
  );
};

// Main AllProjectsSection component
const AllProjectsSection = ({ projects = [], sectionTitle = "", layoutType = "pinterest" }) => {
  const renderProjects = () => {
    if (!projects || projects.length === 0) {
      return <EmptyProjectsState category={sectionTitle} />;
    }

    switch (layoutType) {
      case "pinterest":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project, index) => (
              <PinterestCard key={project.id} project={project} index={index} />
            ))}
          </div>
        );
          
      case "terminal":
        return (
          <div className="max-w-3xl mx-auto">
            {projects.map((project, index) => (
              <TerminalCard key={project.id} project={project} index={index} />
            ))}
          </div>
        );
        
      case "lens":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <LensGridCard key={project.id} project={project} index={index} />
            ))}
          </div>
        );
        
      case "glitch":
        return (
          <div className="max-w-4xl mx-auto relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-pink-500/50 via-purple-500/50 to-transparent"></div>
            
            {projects.map((project, index) => (
              <GlitchCard key={project.id} project={project} index={index} />
            ))}
          </div>
        );
        
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project, index) => (
              <PinterestCard key={project.id} project={project} index={index} />
              ))}
            </div>
        );
    }
  };

  return (
    <div className="py-4">
      {sectionTitle && (
        <h2 className="text-3xl font-bold mb-10 text-center">{sectionTitle}</h2>
      )}
      
      {renderProjects()}
    </div>
  );
};

export default AllProjectsSection; 