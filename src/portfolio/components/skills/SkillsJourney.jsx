import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaFigma, FaReact, FaWordpress, FaGithub, FaPython } from "react-icons/fa";
import { SiTailwindcss, SiFramer, SiHtml5, SiCss3, SiSupabase, SiAdobephotoshop, SiCanva, SiNotion, SiFlutter } from "react-icons/si";
import { TbBrandVscode, TbBrandThreejs } from "react-icons/tb";
import { BsLightningChargeFill } from "react-icons/bs";
import { MdAutoFixHigh } from "react-icons/md";

// Skill categories with their associated skills
const categories = [
  {
    title: "Design",
    color: "#F59E0B",
    icon: <MdAutoFixHigh className="text-xl" />,
    skills: [
      { name: "Figma", icon: <FaFigma />, level: "Expert" },
      { name: "Canva", icon: <SiCanva />, level: "Expert" },
      { name: "Photoshop", icon: <SiAdobephotoshop />, level: "Intermediate" },
      { name: "Spline", icon: <TbBrandThreejs />, level: "Intermediate" }
    ]
  },
  {
    title: "AI & No-Code Tools",
    color: "#3B82F6",
    icon: <BsLightningChargeFill className="text-xl" />,
    skills: [
      { name: "Framer", icon: <SiFramer />, level: "Advanced" },
      { name: "WordPress", icon: <FaWordpress />, level: "Expert" },
      { name: "FlutterFlow", icon: <SiFlutter />, level: "Intermediate" },
      { name: "Notion", icon: <SiNotion />, level: "Expert" }
    ]
  },
  {
    title: "Frontend",
    color: "#F43F5E",
    icon: <FaReact className="text-xl" />,
    skills: [
      { name: "HTML", icon: <SiHtml5 />, level: "Expert" },
      { name: "CSS", icon: <SiCss3 />, level: "Expert" },
      { name: "Tailwind", icon: <SiTailwindcss />, level: "Expert" },
      { name: "React", icon: <FaReact />, level: "Advanced" }
    ]
  },
  {
    title: "Additional Skills",
    color: "#A855F7",
    icon: <TbBrandVscode className="text-xl" />,
    skills: [
      { name: "Supabase", icon: <SiSupabase />, level: "Intermediate" },
      { name: "Python", icon: <FaPython />, level: "Intermediate" },
      { name: "GitHub", icon: <FaGithub />, level: "Advanced" },
      { name: "VSCode", icon: <TbBrandVscode />, level: "Expert" }
    ]
  }
];

// Badge component for skill levels
const SkillBadge = ({ level }) => {
  const colors = {
    Expert: "bg-green-500",
    Advanced: "bg-blue-500",
    Intermediate: "bg-yellow-500",
    Beginner: "bg-red-500"
  };
  
  return (
    <span className={`text-[10px] xs:text-xs px-1 sm:px-2 py-0.5 rounded-full ${colors[level]} text-white absolute -top-1 -right-1`}>
      {level}
    </span>
  );
};

export default function SkillsJourney() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });
  
  const [activeIndices, setActiveIndices] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Map scroll progress to section visibility
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange(value => {
      // Adjust thresholds for better visibility at center of viewport
      const thresholds = isMobile 
        ? [0.05, 0.25, 0.45, 0.65] // Lower thresholds for mobile
        : [0.1, 0.3, 0.5, 0.7];
        
      let newActiveIndices = [];
      
      thresholds.forEach((threshold, index) => {
        if (value >= threshold) {
          newActiveIndices.push(index);
        }
      });
      
      setActiveIndices(newActiveIndices);
    });
    
    return () => unsubscribe();
  }, [scrollYProgress, isMobile]);
  
  return (
    <div 
      ref={containerRef} 
      className="relative min-h-screen pt-16 sm:pt-20 pb-16 sm:pb-20 text-white overflow-hidden px-2 sm:px-4"
    >
      {/* Main connector line */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <path
          d="M 50% 100 L 50% 520"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="2"
          strokeDasharray="5,5"
          fill="none"
        />
      </svg>
      
      {/* Skill categories and skills - reduced spacing between sections */}
      <div className="relative flex flex-col items-center gap-16 sm:gap-20">
        {categories.map((category, index) => (
          <motion.div 
            key={index}
            className="w-full max-w-3xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ 
              opacity: activeIndices.includes(index) ? 1 : 0.3,
              y: activeIndices.includes(index) ? 0 : 50
            }}
            transition={{ duration: 0.6 }}
          >
            {/* Category box */}
            <motion.div
              className="relative mx-auto mb-6 w-48 sm:w-64 flex flex-col items-center"
            >
              {/* Connector to previous category */}
              {index > 0 && (
                <svg className="absolute -top-16 sm:-top-20 left-1/2 transform -translate-x-1/2 w-2 h-16 sm:h-20 pointer-events-none">
                  <line
                    x1="1"
                    y1="0"
                    x2="1"
                    y2="80"
                    stroke={activeIndices.includes(index) ? category.color : "rgba(255,255,255,0.1)"}
                    strokeWidth="2"
                    strokeDasharray="4,4"
                  />
                </svg>
              )}
              
              {/* Category icon */}
              <motion.div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-2 sm:mb-3"
                style={{ 
                  backgroundColor: activeIndices.includes(index) ? category.color : "rgba(255,255,255,0.1)" 
                }}
                animate={{
                  boxShadow: activeIndices.includes(index) 
                    ? `0 0 20px 5px ${category.color}80` 
                    : "none"
                }}
              >
                {category.icon}
              </motion.div>
              
              {/* Category title */}
              <h3 className="text-base sm:text-xl font-semibold text-white mb-1">
                {category.title}
              </h3>
              
              {/* Connector to skills */}
              <svg className="absolute -bottom-5 sm:-bottom-6 left-1/2 transform -translate-x-1/2 w-2 h-5 sm:h-6">
                <line
                  x1="1"
                  y1="0"
                  x2="1"
                  y2="24"
                  stroke={activeIndices.includes(index) ? category.color : "rgba(255,255,255,0.1)"}
                  strokeWidth="2"
                  strokeDasharray="3,3"
                />
              </svg>
            </motion.div>
            
            {/* Skills grid */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 justify-items-center"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: activeIndices.includes(index) ? 1 : 0
              }}
              transition={{ duration: 0.4 }}
            >
              {category.skills.map((skill, skillIndex) => (
                <motion.div
                  key={skillIndex}
                  className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-gray-900 flex items-center justify-center relative"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: activeIndices.includes(index) ? 1 : 0, 
                    scale: activeIndices.includes(index) ? 1 : 0.8,
                    boxShadow: activeIndices.includes(index) 
                      ? `0 0 15px 2px ${category.color}40` 
                      : "none"
                  }}
                  transition={{ 
                    duration: 0.4, 
                    delay: activeIndices.includes(index) ? 0.2 + (skillIndex * 0.1) : 0 
                  }}
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="text-xl sm:text-2xl md:text-3xl text-gray-200">{skill.icon}</div>
                  <SkillBadge level={skill.level} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 