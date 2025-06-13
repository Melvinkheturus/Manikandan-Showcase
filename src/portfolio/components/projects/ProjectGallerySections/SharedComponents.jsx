import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaAngleDown } from 'react-icons/fa';

// Section header component for consistent styling
export const SectionHeader = ({ title, icon }) => {
  return (
    <div className="flex items-center mb-6 pb-2 border-b border-primary/20">
      <div className="mr-3 text-primary text-xl">
        {icon}
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
    </div>
  );
};

// Reusable category section component with ref forwarding and enhanced animations
export const CategorySection = React.forwardRef(({ id, title, icon, children, style, themeColor, sectionType }, ref) => {
  // Set a more generous threshold to trigger animations earlier
  const [inViewRef, inView] = useInView({
    threshold: 0.05,
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
  
  // Section-specific animation variants
  const getSectionVariants = (type) => {
    // Default animations
    const defaults = {
      hidden: { 
        opacity: 0,
        y: 50
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: { 
          duration: 1.2,
          ease: [0.25, 0.1, 0.25, 1]
        }
      },
      exit: {
        opacity: 0,
        transition: { duration: 0.5 }
      }
    };
    
    // Custom animations per section type
    switch(type) {
      case 'visual-identity':
        return {
          hidden: { opacity: 0, scale: 0.95, y: 30 },
          visible: { 
            opacity: 1, 
            scale: 1, 
            y: 0,
            transition: { 
              duration: 1, 
              ease: [0.34, 1.56, 0.64, 1]
            }
          }
        };
      case 'ui-ux-design':
        return {
          hidden: { opacity: 0, x: -50 },
          visible: { 
            opacity: 1, 
            x: 0,
            transition: { 
              duration: 0.8, 
              ease: "easeOut"
            }
          }
        };
      case 'development':
        return {
          hidden: { opacity: 0, clipPath: "inset(0 100% 0 0)" },
          visible: { 
            opacity: 1, 
            clipPath: "inset(0 0% 0 0)",
            transition: { 
              duration: 0.8, 
              ease: [0.25, 1, 0.5, 1]
            }
          }
        };
      case 'ai-projects':
        return {
          hidden: { 
            opacity: 0, 
            filter: "blur(10px) brightness(1.5)" 
          },
          visible: { 
            opacity: 1, 
            filter: "blur(0px) brightness(1)",
            transition: { 
              duration: 1.2,
              ease: "easeOut" 
            }
          }
        };
      case 'creative-lab':
        return {
          hidden: { opacity: 0, rotate: -3, scale: 0.97 },
          visible: { 
            opacity: 1, 
            rotate: 0, 
            scale: 1,
            transition: { 
              duration: 1, 
              ease: [0.34, 1.56, 0.64, 1]
            }
          }
        };
      default:
        return defaults;
    }
  };
  
  // Get the appropriate animation variants
  const variants = getSectionVariants(id);
  
  return (
    <motion.div
      ref={mergedRef}
      id={id}
      className="w-full h-full overflow-y-auto overflow-x-hidden rounded-2xl relative"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      style={style}
    >
      {/* Background gradient glow with dynamic theme color */}
      <div 
        className="absolute inset-0 -z-10" 
        style={{
          background: themeColor ? 
            `radial-gradient(circle at 10% 0%, ${themeColor}15, transparent 70%), 
             radial-gradient(circle at 90% 100%, ${themeColor}10, transparent 70%)` 
            : `radial-gradient(circle at 10% 0%, rgba(16, 185, 129, 0.15), transparent 70%), 
               radial-gradient(circle at 90% 100%, rgba(255, 255, 255, 0.1), transparent 70%)`
        }}
      ></div>
      
      {/* Section content - with responsive padding for better mobile experience */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-full flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-6"
        >
          <SectionHeader title={title} icon={icon} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="flex-1 overflow-hidden"
        >
          {children}
        </motion.div>
        
        {/* Scroll indicator - fades out when content is scrolled */}
        <motion.div 
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          animate={{ 
            opacity: [0.5, 0.8, 0.5],
            y: [0, 5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        >
          <p className="text-xs text-white/50 mb-1">Explore content</p>
          <FaAngleDown className="text-white/50 text-lg" />
        </motion.div>
      </div>
      
      {/* Floating emblem for section */}
      <motion.div
        className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full opacity-10 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${themeColor || 'rgba(16, 185, 129, 0.8)'} 0%, transparent 70%)`
        }}
        animate={{
          scale: [0.9, 1.1, 0.9],
          opacity: [0.05, 0.15, 0.05]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Section edges highlight */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
    </motion.div>
  );
});

// Display name for debugging
CategorySection.displayName = 'CategorySection';

// Theme styles for consistent design
export const themeStyles = {
  shadowGlow: {
    boxShadow: '0 0 25px 5px rgba(0, 255, 127, 0.2), 0 0 15px 2px rgba(255, 255, 255, 0.1)',
  },
  sectionGlow: {
    background: 'radial-gradient(circle at 10% 0%, rgba(0, 255, 127, 0.15), transparent 70%), radial-gradient(circle at 90% 100%, rgba(255, 255, 255, 0.1), transparent 70%)',
  },
  sectionLabel: {
    background: 'rgba(0, 0, 0, 0.65)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
  },
  glassmorphism: {
    background: 'rgba(10, 10, 20, 0.4)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
  }
}; 