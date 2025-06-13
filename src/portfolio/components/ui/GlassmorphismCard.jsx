import React from 'react';
import { motion } from 'framer-motion';

const GlassmorphismCard = ({ 
  title, 
  description, 
  icon, 
  cta, 
  onClick, 
  className = "" 
}) => {
  return (
    <motion.div 
      className={`rounded-xl overflow-hidden relative ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ 
        scale: 1.02,
      }}
    >
      {/* Glassmorphism effect */}
      <motion.div 
        className="absolute inset-0 bg-white/5 backdrop-blur-[5px] z-0"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileHover={{ 
          backdropFilter: "blur(15px)",
          backgroundColor: "rgba(255, 255, 255, 0.15)",  
        }}
      />
      
      {/* Border glow */}
      <div className="absolute inset-0 rounded-xl border border-white/20 z-10" />
      
      {/* 3D Tilt effect container */}
      <motion.div 
        className="relative z-20 p-6 h-full"
        whileHover={{ rotateX: 5, rotateY: 10 }}
        style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
      >
        {/* Icon */}
        {icon && (
          <div className="text-emerald-400 text-2xl mb-4" style={{ transform: "translateZ(20px)" }}>
            {icon}
          </div>
        )}
        
        {/* Content */}
        <div style={{ transform: "translateZ(10px)" }}>
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          {description && (
            <p className="text-gray-300 mb-6">{description}</p>
          )}
        </div>
        
        {/* CTA */}
        {cta && (
          <motion.button
            className="mt-auto px-5 py-3 bg-white/10 backdrop-blur-sm rounded-lg text-white border border-white/20 inline-flex items-center gap-2"
            onClick={onClick}
            whileHover={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              scale: 1.05
            }}
            style={{ transform: "translateZ(30px)" }}
          >
            {cta}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
};

export default GlassmorphismCard; 