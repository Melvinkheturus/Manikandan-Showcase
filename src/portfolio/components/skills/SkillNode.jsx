import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { motion, AnimatePresence } from 'framer-motion';
import { badgeLevels } from '../data/skillsData';

// Badge component with enhanced animations
const LevelBadge = ({ level }) => {
  const badgeConfig = badgeLevels[level] || badgeLevels['Intermediate'];
  
  return (
    <motion.div 
      className={`absolute -top-2 -right-2 z-10 ${badgeConfig.pulsing ? 'animate-pulse' : ''}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
    >
      <motion.div 
        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white
          ${badgeConfig.color} ${badgeConfig.shimmer ? 'before:absolute before:inset-0 before:w-full before:h-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:bg-[length:200%_100%]' : ''}`}
        whileHover={{ scale: 1.2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        {level === 'Expert' ? '★' : 
         level === 'Advanced' ? '▲' : 
         level === 'Intermediate' ? '●' : 
         level === 'Beginner' ? '○' : 
         level === 'AI-Assisted' ? '⚡' : '▫️'}
      </motion.div>
    </motion.div>
  );
};

// Category Node Component
export const CategoryNode = ({ data }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  
  // Check if the node is revealed based on its style
  useEffect(() => {
    if (data.revealed) {
      setIsRevealed(true);
    }
  }, [data.revealed]);
  
  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Source handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 rounded-full bg-gray-300"
      />
      
      {/* Target handle (only for non-main nodes) */}
      {!data.isMainNode && (
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 rounded-full bg-gray-300"
        />
      )}
      
      {/* Node content */}
      <motion.div
        className={`px-4 py-3 font-bold text-center rounded-xl backdrop-blur-sm shadow-lg 
          bg-gradient-to-br ${data.color} ${data.isMainNode ? 'w-40 h-14' : 'w-32'} text-white`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: isRevealed ? 1 : 0.8, 
          opacity: isRevealed ? 1 : 0.2,
          boxShadow: isHovered || data.active
            ? '0 0 15px 5px rgba(255, 255, 255, 0.3)' 
            : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}
        whileHover={{ scale: 1.05 }}
        transition={{ 
          type: 'spring', 
          stiffness: 300, 
          damping: 20,
          opacity: { duration: 0.5 }
        }}
      >
        {data.icon && (
          <motion.div 
            className="text-2xl mx-auto mb-1"
            animate={{ 
              rotateY: isHovered ? 180 : 0,
              scale: data.active ? [1, 1.2, 1] : 1
            }}
            transition={{ 
              rotateY: { duration: 0.5 },
              scale: { repeat: data.active ? Infinity : 0, repeatDelay: 3 }
            }}
          >
            {data.icon}
          </motion.div>
        )}
        <div className={`${data.isMainNode ? 'text-xl' : 'text-lg'}`}>{data.label}</div>
        
        <AnimatePresence>
          {data.description && isHovered && (
            <motion.div 
              className="absolute -bottom-10 left-0 right-0 text-xs text-center text-white bg-black/70 p-2 rounded-md"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              {data.description}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

// Skill Node Component
const SkillNode = ({ data }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  
  // Check if the node is revealed based on its style
  useEffect(() => {
    if (data.revealed) {
      setIsRevealed(true);
    }
  }, [data.revealed]);
  
  // Get the appropriate color based on the category
  let glowColor;
  switch (data.category) {
    case 'design': glowColor = 'from-amber-400/30 to-yellow-400/30'; break;
    case 'ai-nocode': glowColor = 'from-blue-400/30 to-cyan-400/30'; break;
    case 'frontend': glowColor = 'from-rose-400/30 to-pink-400/30'; break;
    case 'additional': glowColor = 'from-purple-400/30 to-violet-400/30'; break;
    default: glowColor = 'from-gray-400/30 to-gray-400/30';
  }
  
  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Target handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 rounded-full bg-gray-300"
      />
      
      {/* Node content */}
      <motion.div
        className={`p-3 bg-black/40 text-white rounded-xl backdrop-blur-sm relative
          w-24 h-24 flex flex-col items-center justify-center transition-all duration-300
          ${isHovered ? 'bg-black/60' : ''} border border-white/10`}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ 
          scale: isRevealed ? 1 : 0.5, 
          opacity: isRevealed ? 1 : 0.3,
          boxShadow: isHovered 
            ? '0 0 20px 5px rgba(255, 255, 255, 0.15)' 
            : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}
        whileHover={{ scale: 1.1 }}
        transition={{ 
          type: 'spring', 
          stiffness: 300, 
          damping: 20,
          delay: data.animationDelay || 0,
          opacity: { duration: 0.5 }
        }}
      >
        {/* Glow effect behind the node */}
        <motion.div 
          className={`absolute inset-0 bg-gradient-to-br ${glowColor} rounded-xl blur-xl -z-10`}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: isHovered ? 1 : isRevealed ? 0.5 : 0
          }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Level badge - only show when fully revealed */}
        {isRevealed && <LevelBadge level={data.level} />}
        
        {/* Skill icon */}
        <motion.div 
          className="text-3xl mb-2"
          animate={{ 
            rotateY: isHovered ? 360 : 0,
            scale: isRevealed ? [1, 1.1, 1] : 0.8
          }}
          transition={{ 
            rotateY: { duration: 0.5 },
            scale: { duration: 0.5, times: [0, 0.5, 1], delay: data.animationDelay || 0 }
          }}
        >
          {data.icon}
        </motion.div>
        
        {/* Skill name */}
        <motion.div 
          className="text-sm font-medium text-center"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: isRevealed ? 1 : 0.5, y: 0 }}
          transition={{ duration: 0.3, delay: (data.animationDelay || 0) + 0.1 }}
        >
          {data.label}
        </motion.div>
        
        {/* Description tooltip */}
        <AnimatePresence>
          {isHovered && isRevealed && data.description && (
            <motion.div 
              className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-xs text-center text-white bg-black/70 p-2 rounded-md whitespace-nowrap z-50"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              {data.description}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SkillNode; 