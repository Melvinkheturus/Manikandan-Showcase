import React, { useState } from 'react';
import { motion } from 'framer-motion';

const FeaturesSection = ({ project }) => {
  // State for hover effect coordinates to create a dynamic light effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Function to get icon for feature type
  const getFeatureIcon = (feature) => {
    // This is a simplified version - ideal implementation would use a more comprehensive
    // icon library like react-icons or heroicons
    
    const lowerFeature = (feature.title || '').toLowerCase();
    
    if (lowerFeature.includes('dashboard') || lowerFeature.includes('analytics')) {
      return (
        <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    }
    
    if (lowerFeature.includes('pdf') || lowerFeature.includes('export') || lowerFeature.includes('document')) {
      return (
        <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    }
    
    if (lowerFeature.includes('real') || lowerFeature.includes('time') || lowerFeature.includes('update')) {
      return (
        <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      );
    }
    
    if (lowerFeature.includes('auth') || lowerFeature.includes('login') || lowerFeature.includes('user')) {
      return (
        <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    
    // Default icon
    return (
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    );
  };
  
  // Parse features from project data
  const features = Array.isArray(project.features) 
    ? project.features
    : typeof project.features === 'string' 
      ? project.features.split('\n\n').map(item => {
          const lines = item.split('\n');
          return {
            title: lines[0],
            description: lines.slice(1).join('\n')
          };
        })
      : [];

  // Helper function to determine card size and style based on index
  const getCardProps = (index) => {
    const cardTypes = [
      { 
        size: "col-span-2 row-span-2", 
        bgClass: "bg-gradient-to-br from-emerald-500/20 to-teal-600/20",
        iconSize: "w-12 h-12",
        iconBg: "bg-emerald-500/30",
        featured: true,
        accent: "emerald",
        shadowColor: "shadow-emerald-500/10"
      },
      { 
        size: "col-span-1 row-span-1", 
        bgClass: "bg-white/5",
        iconSize: "w-8 h-8",
        iconBg: "bg-blue-500/30",
        featured: false,
        accent: "blue",
        shadowColor: "shadow-blue-500/10"
      },
      { 
        size: "col-span-1 row-span-2", 
        bgClass: "bg-gradient-to-b from-blue-500/20 to-purple-600/20",
        iconSize: "w-10 h-10",
        iconBg: "bg-purple-500/30",
        featured: false,
        accent: "purple",
        shadowColor: "shadow-purple-500/10"
      },
      { 
        size: "col-span-1 row-span-1", 
        bgClass: "bg-white/5",
        iconSize: "w-8 h-8",
        iconBg: "bg-teal-500/30", 
        featured: false,
        accent: "teal",
        shadowColor: "shadow-teal-500/10"
      },
      { 
        size: "col-span-2 row-span-1",
        bgClass: "bg-gradient-to-r from-amber-500/20 to-orange-600/20",
        iconSize: "w-10 h-10",
        iconBg: "bg-amber-500/30",
        featured: false,
        accent: "amber",
        shadowColor: "shadow-amber-500/10"
      },
      { 
        size: "col-span-1 row-span-1", 
        bgClass: "bg-white/5",
        iconSize: "w-8 h-8",
        iconBg: "bg-rose-500/30", 
        featured: false,
        accent: "rose",
        shadowColor: "shadow-rose-500/10"
      }
    ];
    
    return cardTypes[index % cardTypes.length];
  };
  
  // Update mouse position for light effect
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    
    const x = (clientX - left) / width;
    const y = (clientY - top) / height;
    
    setMousePosition({ x, y });
  };
  
  return (
    <section 
      className="py-24 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Background lighting effect */}
      <div 
        className="absolute w-1/3 h-1/3 bg-emerald-500/5 rounded-full blur-3xl"
        style={{
          left: `${mousePosition.x * 100}%`,
          top: `${mousePosition.y * 100}%`,
          transform: 'translate(-50%, -50%)',
          transition: 'left 1s ease, top 1s ease',
        }}
      ></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Key Features & Functionality
          </motion.h2>
          <motion.p 
            className="text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Core capabilities and technologies that power this project
          </motion.p>
        </div>
        
        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-fr gap-4 md:gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => {
            const cardProps = getCardProps(index);
            return (
              <FeatureCard 
                key={index} 
                feature={feature} 
                index={index}
                icon={getFeatureIcon(feature)}
                cardProps={cardProps}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ feature, index, icon, cardProps }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { size, bgClass, iconSize, iconBg, featured, accent, shadowColor } = cardProps;
  
  // Predefined color classes to avoid Tailwind purge issues
  const getBlobColor = () => {
    const colors = {
      emerald: "bg-emerald-500/20",
      blue: "bg-blue-500/20",
      purple: "bg-purple-500/20",
      teal: "bg-teal-500/20",
      amber: "bg-amber-500/20",
      rose: "bg-rose-500/20"
    };
    return colors[accent];
  };
  
  const getTextColor = () => {
    const colors = {
      emerald: "text-emerald-400 group-hover:text-emerald-300",
      blue: "text-blue-400 group-hover:text-blue-300",
      purple: "text-purple-400 group-hover:text-purple-300",
      teal: "text-teal-400 group-hover:text-teal-300",
      amber: "text-amber-400 group-hover:text-amber-300",
      rose: "text-rose-400 group-hover:text-rose-300"
    };
    return colors[accent];
  };
  
  const getHoverTitleColor = () => {
    const colors = {
      emerald: "group-hover:text-emerald-50",
      blue: "group-hover:text-blue-50",
      purple: "group-hover:text-purple-50",
      teal: "group-hover:text-teal-50",
      amber: "group-hover:text-amber-50",
      rose: "group-hover:text-rose-50"
    };
    return colors[accent];
  };
  
  const cardVariants = {
    offscreen: { 
      y: 50,
      opacity: 0
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.2,
        duration: 0.8,
        delay: index * 0.1
      }
    }
  };
  
  return (
    <motion.div
      className={`${size} rounded-3xl overflow-hidden ${bgClass} backdrop-blur-xl 
                  border border-white/10 group transition-all relative
                  p-6 flex flex-col justify-between hover:shadow-lg ${shadowColor} perspective-1000`}
      variants={cardVariants}
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 0.1 }}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        rotateX: 2,
        rotateY: -2,
        transition: { duration: 0.4, ease: "easeOut" } 
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      {/* Apple-style card shine effect */}
      <div 
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background: "linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.1) 45%, rgba(255, 255, 255, 0.1) 50%, transparent 55%)",
          transform: "translateY(-100%)",
          animation: isHovered ? "shine 1.5s infinite" : "none"
        }}
      ></div>
      
      <style jsx>{`
        @keyframes shine {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
      
      {/* Light blob effect */}
      <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full ${getBlobColor()} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
      
      {/* 3D floating icon effect */}
      <motion.div 
        className="mb-4 relative z-10"
        animate={isHovered ? { 
          y: -5,
          rotateZ: 5,
          transition: { duration: 0.2, type: "spring" }
        } : { 
          y: 0,
          rotateZ: 0,
          transition: { duration: 0.3, type: "spring" }
        }}
      >
        <div className={`${iconSize} ${iconBg} rounded-2xl p-2 flex items-center justify-center ${getTextColor()} shadow-lg`}>
          {icon}
        </div>
      </motion.div>
      
      <div className="relative z-10 flex-grow">
        <h3 className={`${featured ? 'text-2xl' : 'text-xl'} font-bold text-white mb-3 ${getHoverTitleColor()}`}>
          {feature.title}
        </h3>
        
        <p className={`text-gray-300 ${featured ? 'text-lg' : ''} group-hover:text-white/90`}>
          {feature.description}
        </p>
      </div>
      
      {/* Arrow indicator for interactive feel */}
      <motion.div 
        className={`absolute bottom-5 right-5 opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ${getTextColor()}`}
        animate={isHovered ? { x: 0, opacity: 1 } : { x: 10, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
        </svg>
      </motion.div>
    </motion.div>
  );
};

export default FeaturesSection; 