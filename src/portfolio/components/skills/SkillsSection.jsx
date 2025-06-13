import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useScroll, useTransform } from 'framer-motion';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';

// Import icons
import { 
  FaFigma, FaHtml5, FaCss3Alt, FaPython, FaGithub, FaWordpress, FaBrain,
  FaCode, FaCog, FaTools, FaTerminal, FaMouse
} from 'react-icons/fa';
import { 
  SiCanva, SiAdobephotoshop, SiAdobeillustrator, SiTailwindcss, 
  SiFlutter, SiNotion, SiSqlite, SiSupabase, SiFramer
} from 'react-icons/si';
import { BiCodeBlock } from 'react-icons/bi';
import { PiFilmSlate, PiPaintBrushBold } from 'react-icons/pi';
import { HiOutlineLightBulb, HiOutlineSparkles } from 'react-icons/hi';
import { MdOutlineDesignServices, MdOutlineCode } from 'react-icons/md';

// Define skill categories and items
const skillsData = {
  'Design': {
    icon: <MdOutlineDesignServices />,
    color: '#FFA94D',
    skills: [
      { name: 'Figma', icon: <FaFigma />, level: 'Proficient', description: 'UI/UX design, prototyping, and collaboration' },
      { name: 'Canva', icon: <SiCanva />, level: 'Proficient', description: 'Quick graphics and social media content' },
      { name: 'Photoshop', icon: <SiAdobephotoshop />, level: 'Intermediate', description: 'Image editing and manipulation' },
      { name: 'Illustrator', icon: <SiAdobeillustrator />, level: 'Intermediate', description: 'Vector graphics and illustrations' },
      { name: 'Spline', icon: <HiOutlineSparkles />, level: 'Intermediate', description: '3D design for web interfaces' },
    ]
  },
  'AI & No-Code Tools': {
    icon: <FaBrain />,
    color: '#4A9EFF',
    skills: [
      { name: 'Cursor AI', icon: <FaMouse />, level: 'Proficient', description: 'AI-assisted coding and development' },
      { name: 'Framer', icon: <SiFramer />, level: 'Intermediate', description: 'Interactive prototyping and design' },
      { name: 'WordPress', icon: <FaWordpress />, level: 'Proficient', description: 'CMS and website building' },
      { name: 'FlutterFlow', icon: <SiFlutter />, level: 'Intermediate', description: 'Visual app development with Flutter' },
      { name: 'Gen-AI', icon: <HiOutlineLightBulb />, level: 'Proficient', description: 'Using AI tools for content creation' },
    ]
  },
  'Frontend': {
    icon: <MdOutlineCode />,
    color: '#FF6B9D',
    skills: [
      { name: 'HTML', icon: <FaHtml5 />, level: 'Proficient', description: 'Structure and semantics' },
      { name: 'CSS', icon: <FaCss3Alt />, level: 'Proficient', description: 'Styling and responsive design' },
      { name: 'Tailwind', icon: <SiTailwindcss />, level: 'Proficient', description: 'Utility-first CSS framework' },
    ]
  },
  'Additional Skills': {
    icon: <FaTools />,
    color: '#B388FF',
    skills: [
      { name: 'Supabase', icon: <SiSupabase />, level: 'Intermediate', description: 'Backend-as-a-Service platform' },
      { name: 'Python', icon: <FaPython />, level: 'Intermediate', description: 'Automation and data processing' },
      { name: 'Premiere', icon: <PiFilmSlate />, level: 'Intermediate', description: 'Video editing and production' },
      { name: 'CapCut', icon: <PiFilmSlate />, level: 'Proficient', description: 'Quick video editing and effects' },
      { name: 'GitHub', icon: <FaGithub />, level: 'Proficient', description: 'Version control and collaboration' },
      { name: 'Notion', icon: <SiNotion />, level: 'Proficient', description: 'Project management and documentation' },
      { name: 'SQLite', icon: <SiSqlite />, level: 'Intermediate', description: 'Local database management' },
    ]
  }
};

// Level indicator component
const LevelIndicator = ({ level }) => {
  const levels = {
    'Beginner': 1,
    'Intermediate': 2,
    'Proficient': 3
  };
  
  const dots = [];
  for (let i = 0; i < 3; i++) {
    dots.push(
      <div 
        key={i} 
        className={`w-2 h-2 rounded-full mx-0.5 ${
          i < levels[level] ? 'bg-white' : 'bg-white/30'
        }`}
      />
    );
  }
  
  return (
    <div className="flex mt-1">
      {dots}
    </div>
  );
};

// Simple skill icon component without tooltip for better reliability
const SimpleSkillIcon = ({ skill, index, color }) => {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
    >
      <div
        className="skill-icon flex items-center justify-center w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 cursor-pointer z-10 relative hover:scale-110 transition-transform"
        style={{ boxShadow: `0 0 10px 1px ${color}40` }}
      >
        <span className="text-2xl text-gray-300">
          {skill.icon}
        </span>
      </div>
    </motion.div>
  );
};

// Skill icon component with tooltip
const SkillIcon = ({ skill, index, color }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Tippy
      content={
        <div className="p-2 text-center">
          <p className="font-medium text-gray-800">{skill.name}</p>
          <p className="text-xs text-gray-600">{skill.level}</p>
          <p className="text-xs text-gray-600 mt-1">{skill.description}</p>
          <LevelIndicator level={skill.level} />
        </div>
      }
      theme="light"
      arrow={true}
      duration={200}
      placement="top"
    >
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 * index }}
      >
        <motion.div
          className="skill-icon flex items-center justify-center w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 cursor-pointer z-10 relative"
          whileHover={{ 
            scale: 1.15, 
            transition: { duration: 0.2, type: 'spring', stiffness: 300 }
          }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          style={{ boxShadow: isHovered ? `0 0 15px 2px ${color}` : 'none' }}
        >
          <span className={`text-2xl ${isHovered ? 'text-white' : 'text-gray-300'}`}>
            {skill.icon}
          </span>
          {isHovered && (
            <motion.div
              className="absolute -inset-1 rounded-full z-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              style={{ 
                background: `radial-gradient(circle, ${color}, transparent 70%)`,
                filter: 'blur(8px)'
              }}
            />
          )}
        </motion.div>
      </motion.div>
    </Tippy>
  );
};

// Simple category node for fallback rendering
const SimpleCategoryNode = ({ category, data }) => {
  return (
    <div className="category-node relative flex flex-col items-center mt-10">
      {/* Category icon and title */}
      <div className="relative">
        <div 
          className="category-icon w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-2"
          style={{ 
            background: `radial-gradient(circle at center, rgba(0,0,0,0.3), rgba(0,0,0,0.5))`,
            boxShadow: `0 0 15px 2px ${data.color}40`,
            border: `1px solid ${data.color}30`
          }}
        >
          <div className="text-white">{data.icon}</div>
        </div>
        <p className="text-white text-center font-semibold mt-2">
          {category}
        </p>
      </div>
      
      {/* Skills container */}
      <div className="skills-container mt-8 grid grid-cols-3 gap-4">        
        {/* Skill icons */}
        {data.skills.map((skill, idx) => (
          <div key={idx} className="flex flex-col items-center" style={{ minHeight: "80px" }}>
            <SimpleSkillIcon skill={skill} index={idx} color={data.color} />
            <div className="mt-2 text-xs text-center text-gray-400">
              {skill.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Category node component with animations
const CategoryNode = ({ category, data, isRendered }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, threshold: 0.1 });
  const [branchesDrawn, setBranchesDrawn] = useState(false);
  
  useEffect(() => {
    if (inView && isRendered) {
      // Draw branches after category appears
      setTimeout(() => setBranchesDrawn(true), 600);
    }
  }, [inView, isRendered]);
  
  return (
    <div className="category-node relative flex flex-col items-center mt-16" ref={ref}>
      {/* Category icon and title */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={inView && isRendered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div 
          className="category-icon w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-2"
          style={{ 
            background: `radial-gradient(circle at center, rgba(0,0,0,0.3), rgba(0,0,0,0.5))`,
            boxShadow: `0 0 15px 2px ${data.color}40`,
            border: `1px solid ${data.color}30`
          }}
        >
          <div className="text-white">{data.icon}</div>
          <div 
            className="absolute -inset-2 rounded-full z-0"
            style={{ 
              background: `radial-gradient(circle, ${data.color}40, transparent 70%)`,
              filter: 'blur(10px)'
            }}
          />
        </div>
        <motion.p 
          className="text-white text-center font-semibold mt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={inView && isRendered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          {category}
        </motion.p>
      </motion.div>
      
      {/* Skills container */}
      <div className="skills-container mt-12 grid grid-cols-3 gap-6">        
        {/* Skill icons */}
        {data.skills.map((skill, idx) => (
          <div key={idx} className="flex flex-col items-center" style={{ minHeight: "80px" }}>
            <SimpleSkillIcon skill={skill} index={idx} color={data.color} />
            <motion.p 
              className="text-xs text-gray-400 mt-2 text-center"
              initial={{ opacity: 0 }}
              animate={branchesDrawn ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + (idx * 0.1) }}
            >
              {skill.name}
            </motion.p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Simplified version without complex animations
const SimpleSkillsSection = () => {
  const categories = Object.keys(skillsData);
  
  return (
    <section className="skills-section relative py-20 min-h-screen flex flex-col items-center overflow-hidden">
      {/* Corner Glows */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full filter blur-3xl opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-cyan-500/20 to-transparent rounded-full filter blur-3xl opacity-30 pointer-events-none"></div>
      
      {/* Title with gradient text */}
      <div className="text-center mb-8 md:mb-16 relative z-10">
        <h2 className="text-4xl md:text-6xl font-bold">
          WHAT I <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">DO</span>
        </h2>
      </div>
      
      {/* Main content container */}
      <div className="container mx-auto px-4 relative z-10">
        {/* Grid for categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <SimpleCategoryNode 
              key={category} 
              category={category} 
              data={skillsData[category]}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const SkillsSection = ({ sectionData }) => {
  const [useFallback, setUseFallback] = useState(false);
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const [titleVisible, setTitleVisible] = useState(false);
  const inView = useInView(sectionRef, { threshold: 0.1, once: true });

  // Try using the animated version, but fall back to simple if there's an error
  useEffect(() => {
    try {
      if (inView) {
        setTimeout(() => setTitleVisible(true), 300);
      }
    } catch (err) {
      console.error("Error in SkillsSection animations:", err);
      setUseFallback(true);
    }
  }, [inView]);
  
  // If animation errors occur, use the simplified version
  if (useFallback) {
    return <SimpleSkillsSection />;
  }
  
  // Get categories
  const categories = Object.keys(skillsData);
  
  return (
    <section 
      ref={sectionRef}
      className="skills-section relative py-20 min-h-screen flex flex-col items-center overflow-hidden"
    >
      {/* Corner Glows */}
      <div className="fixed top-0 left-0 w-64 h-64 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full filter blur-3xl opacity-30 -translate-x-1/3 -translate-y-1/3 z-0 pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-cyan-500/20 to-transparent rounded-full filter blur-3xl opacity-30 translate-x-1/3 translate-y-1/3 z-0 pointer-events-none"></div>
      
      {/* Title with gradient text */}
      <div 
        ref={titleRef}
        className="text-center mb-8 md:mb-16 relative z-10"
      >
        <motion.h2 
          className="text-4xl md:text-6xl font-bold relative inline-block"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
        >
          WHAT I <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">DO</span>
        </motion.h2>
      </div>
      
      {/* Main content container */}
      <div className="container mx-auto px-4 relative z-10">
        {/* Grid for categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <CategoryNode 
              key={category} 
              category={category} 
              data={skillsData[category]} 
              isRendered={titleVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection; 