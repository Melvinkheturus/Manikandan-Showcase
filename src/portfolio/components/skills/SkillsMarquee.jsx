import React from "react";
import { motion } from "framer-motion";

// Import base icons from Font Awesome that are most likely to exist
import { 
  FaReact, FaFigma, FaCode, FaJs, 
  FaGithub, FaRobot
} from "react-icons/fa";

// Additional common icons from other sets
import { MdAnimation, MdDesignServices, MdWeb } from "react-icons/md";
import { AiFillTool } from "react-icons/ai";
import { BiLogoTypescript, BiPaint } from "react-icons/bi";

// Generate unique icons for design tools
const skillsIcons = [
  { name: "Figma", icon: <FaFigma /> },
  { name: "React", icon: <FaReact /> },
  { name: "Design", icon: <MdDesignServices /> },
  { name: "JavaScript", icon: <FaJs /> },
  { name: "Web Dev", icon: <MdWeb /> },
  { name: "AI Tools", icon: <FaRobot /> },
  { name: "Creativity", icon: <BiPaint /> },
  { name: "Tools", icon: <AiFillTool /> },
  { name: "GitHub", icon: <FaGithub /> },
  { name: "VS Code", icon: <FaCode /> },
  { name: "Web", icon: <MdWeb /> },
  { name: "Animation", icon: <MdAnimation /> },
  { name: "TypeScript", icon: <BiLogoTypescript /> },
  { name: "Backend", icon: <FaCode /> },
  { name: "3D", icon: <MdAnimation /> },
  { name: "Motion", icon: <MdAnimation /> },
  { name: "UI/UX", icon: <MdDesignServices /> },
];

const skillsCategories = [
  "UI/UX Design",
  "Frontend Development",
  "Graphic Design",
  "Motion Design",
  "No-Code Tools",
  "AI Tools",
  "Branding",
  "Web Animation",
  "Interactive Design",
];

const Marquee = ({ items, direction = "left", isIcon = false }) => {
  return (
    <div className="relative overflow-hidden py-2">
      <motion.div
        className={`flex gap-8 w-max ${isIcon ? 'items-end' : ''}`}
        animate={{ 
          x: direction === "left" ? [0, -1000] : [-1000, 0] 
        }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 30,
          ease: "linear"
        }}
      >
        {/* Duplicate the items to create a seamless loop */}
        {[...items, ...items].map((item, index) => (
          <div 
            key={index} 
            className={`
              flex flex-col items-center justify-center gap-1.5 
              ${isIcon ? 'px-3 py-2 rounded-lg hover:bg-white/5 transition-colors' : ''}
            `}
          >
            {isIcon ? (
              <>
                <div className="text-2xl sm:text-3xl text-white/80 group-hover:text-white/100 transition-colors">
                  {item.icon}
                </div>
                <span className="text-xs text-white/60 group-hover:text-white/80 transition-colors font-light">
                  {item.name}
                </span>
              </>
            ) : (
              <span className="whitespace-nowrap text-sm sm:text-base text-white/70">
                {item}
              </span>
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const SkillsMarquee = () => {
  return (
    <div className="space-y-5 py-2 backdrop-blur-sm bg-white/5 border border-white/10">
      <Marquee items={skillsIcons} direction="left" isIcon={true} />
      <Marquee items={skillsCategories} direction="right" />
    </div>
  );
};

export default SkillsMarquee; 