import { motion, useAnimation as useFramerAnimation } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import {
  FaFigma,
  FaReact,
  FaPython,
  FaGithub,
  FaCss3,
  FaHtml5,
  FaWordpress,
} from 'react-icons/fa';
import {
  SiCanva,
  SiFlutter,
  SiSupabase,
  SiNotion,
} from 'react-icons/si';
import { BiCodeCurly } from 'react-icons/bi';
import { GiHealthNormal } from 'react-icons/gi';
import { BsRobot } from 'react-icons/bs';
import LightBeamLine from './LightBeamLine';

// Main skills for the horizontal layout
const skills = [
  { 
    id: 0, 
    title: 'UI/UX Design', 
    icon: FaFigma
  },
  { 
    id: 1, 
    title: 'Frontend', 
    icon: FaReact
  },
  { 
    id: 2, 
    title: 'AI & No-Code', 
    icon: BsRobot
  },
  { 
    id: 3, 
    title: 'Code & Deploy', 
    icon: FaGithub
  },
  { 
    id: 4, 
    title: 'Healthcare Apps', 
    icon: GiHealthNormal
  },
];

// Quantum green gradient style
const quantumGreenStyle = {
  background: "linear-gradient(to right, #bbf7d0, #22c55e, #064e3b)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text"
};

function SkillIcon({ skill, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.7, 
        delay: 0.5 + (index * 0.2)
      }}
      className="flex flex-col items-center"
    >
      <div className="text-emerald-400 text-3xl mb-2">
        <skill.icon />
      </div>
      <p className="text-xs tracking-wider text-emerald-400/80">
        {skill.title}
      </p>
    </motion.div>
  );
}

export default function NeuroSkillFlowCircuit() {
  const containerRef = useRef(null);
  
  return (
    <div
      ref={containerRef}
      className="relative h-[60vh] overflow-hidden"
    >
      {/* What I Do heading */}
      <motion.div 
        className="absolute top-4 left-8 z-20"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-4xl md:text-5xl font-bold tracking-wide">
          <span className="text-white">WHAT I </span>
          <span style={quantumGreenStyle}>DO</span>
        </h2>
      </motion.div>
      
      {/* Light beams that connect the icons */}
      <LightBeamLine />
      
      {/* Skills horizontal row */}
      <div className="absolute bottom-2 left-0 right-0 grid grid-cols-5 gap-4 px-10 z-10">
        {skills.map((skill, index) => (
          <SkillIcon 
            key={skill.id} 
            skill={skill} 
            index={index}
          />
        ))}
      </div>
    </div>
  );
} 