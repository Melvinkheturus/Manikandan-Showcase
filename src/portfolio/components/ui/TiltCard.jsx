import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VanillaTilt from 'vanilla-tilt';
import { useTheme } from '../../../context/ThemeContext';

// TiltEffect hook
const useTilt = (options) => {
  const tiltRef = useRef(null);
  
  React.useEffect(() => {
    const tiltNode = tiltRef.current;
    const vanillaTiltOptions = {
      max: 15,
      speed: 400,
      glare: true,
      'max-glare': 0.2,
      ...options,
    };
    
    VanillaTilt.init(tiltNode, vanillaTiltOptions);
    
    return () => {
      if (tiltNode) {
        tiltNode.vanillaTilt.destroy();
      }
    };
  }, [options]);
  
  return tiltRef;
};

export default function TiltCard({
  children,
  image,
  title,
  description,
  links = [],
  tags = [],
  detailContent,
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const { theme } = useTheme();
  const tiltRef = useTilt({
    glare: true,
    'max-glare': theme === 'dark' ? 0.2 : 0.1,
    scale: 1.05,
  });

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const cardBgClass = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const cardBorderClass = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const textClass = theme === 'dark' ? 'text-white' : 'text-gray-800';
  const subTextClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  
  return (
    <AnimatePresence mode="wait">
      {!isFlipped ? (
        // Front of card
        <motion.div
          ref={tiltRef}
          className={`group relative w-full h-full overflow-hidden rounded-xl ${cardBgClass} border ${cardBorderClass} shadow-lg`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, rotateY: 90 }}
          transition={{ 
            duration: 0.4, 
            ease: [0.4, 0.0, 0.2, 1]
          }}
          onClick={handleCardClick}
          whileHover={{
            z: 20,
            boxShadow: theme === 'dark' 
              ? '0 0 30px rgba(16, 185, 129, 0.3)' 
              : '0 0 30px rgba(16, 185, 129, 0.2)'
          }}
          style={{ 
            transformStyle: 'preserve-3d',
            cursor: 'pointer',
          }}
        >
          {/* Card content */}
          <div className="flex flex-col h-full">
            {/* Image */}
            {image && (
              <div className="w-full h-48 overflow-hidden">
                <img 
                  src={image} 
                  alt={title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            )}
            
            {/* Content */}
            <div className="flex flex-col flex-grow p-5">
              <h3 className={`text-xl font-bold mb-2 ${textClass}`}>{title}</h3>
              <p className={`text-sm mb-4 flex-grow ${subTextClass}`}>{description}</p>
              
              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Links */}
              {links.length > 0 && (
                <div className="flex gap-3 mt-auto">
                  {links.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 text-sm font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
            
            {/* Emerald border glow on hover */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                boxShadow: 'inset 0 0 20px rgba(16, 185, 129, 0.4)',
                borderRadius: 'inherit',
              }}
            />
            
            {/* Click to flip hint */}
            <div className="absolute bottom-2 right-2 text-xs text-primary opacity-0 group-hover:opacity-70">
              Tap for details
            </div>
          </div>
        </motion.div>
      ) : (
        // Back of card (details)
        <motion.div
          className={`w-full h-full overflow-auto rounded-xl ${cardBgClass} border ${cardBorderClass} p-5 shadow-lg`}
          initial={{ opacity: 0, rotateY: -90 }}
          animate={{ opacity: 1, rotateY: 0 }}
          exit={{ opacity: 0, rotateY: 90 }}
          transition={{ 
            duration: 0.4, 
            ease: [0.4, 0.0, 0.2, 1]
          }}
          onClick={handleCardClick}
          style={{ 
            cursor: 'pointer',
            boxShadow: theme === 'dark' 
              ? '0 0 30px rgba(16, 185, 129, 0.2)' 
              : '0 0 30px rgba(16, 185, 129, 0.1)'
          }}
        >
          <h3 className={`text-xl font-bold mb-4 ${textClass}`}>{title} - Details</h3>
          
          <div className={`text-sm ${subTextClass} prose prose-sm dark:prose-invert max-w-full`}>
            {detailContent || (
              <>
                <p>{description}</p>
                <p>This is the detailed view of the project. Click to go back to the card.</p>
              </>
            )}
          </div>
          
          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Links */}
          {links.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-4">
              {links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
          
          {/* Back button */}
          <div className="mt-4 text-center">
            <span className="text-xs text-primary">
              Click to flip back
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 