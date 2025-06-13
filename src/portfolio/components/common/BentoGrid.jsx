import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import gsap from 'gsap';

const BentoTile = ({ item, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
    rootMargin: '-50px'
  });
  
  const tileRef = useRef(null);
  const blobRef = useRef(null);
  
  // Handle entry animation
  const variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.6,
        ease: [0.19, 1.0, 0.22, 1.0],
        delay: index * 0.1
      }
    }
  };
  
  // Handle hover morph effect
  useEffect(() => {
    if (!tileRef.current) return;
    
    // Create blob animation
    const colors = {
      start: 'rgba(16, 185, 129, 0.05)', 
      hover: 'rgba(16, 185, 129, 0.15)'
    };
    
    // Create blob path morphing animation
    const createBlobTimeline = () => {
      const tl = gsap.timeline({ paused: true });
      
      // Generate random shape points
      const generatePoints = () => {
        const points = [];
        const segments = 8;
        const angleStep = (Math.PI * 2) / segments;
        
        for (let i = 0; i < segments; i++) {
          const angle = i * angleStep;
          const radius = 50 + Math.random() * 10;
          const x = 50 + Math.cos(angle) * radius;
          const y = 50 + Math.sin(angle) * radius;
          points.push([x, y]);
        }
        return points;
      };
      
      const startPoints = generatePoints();
      const endPoints = generatePoints();
      
      // Create SVG path strings
      const createPathFromPoints = (points) => {
        let path = `M ${points[0][0]} ${points[0][1]}`;
        
        points.forEach((point, i) => {
          if (i < points.length - 1) {
            const cp1x = point[0] + (points[i + 1][0] - point[0]) / 2;
            const cp1y = point[1];
            const cp2x = point[0] + (points[i + 1][0] - point[0]) / 2;
            const cp2y = points[i + 1][1];
            path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${points[i + 1][0]} ${points[i + 1][1]}`;
          }
        });
        
        path += ' Z';
        return path;
      };
      
      const startPath = createPathFromPoints(startPoints);
      const endPath = createPathFromPoints(endPoints);
      
      if (blobRef.current) {
        gsap.set(blobRef.current, { attr: { d: startPath } });
        
        tl.to(blobRef.current, { 
          attr: { d: endPath },
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }
      
      return tl;
    };
    
    // Create card shape morphing
    const blobTimeline = createBlobTimeline();
    blobTimeline.play();
    
    // Hover interactions
    const hoverEnter = () => {
      gsap.to(tileRef.current, { 
        clipPath: item.size === 'wide' 
          ? 'polygon(0% 15%, 100% 0%, 100% 85%, 0% 100%)' 
          : 'polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%)',
        duration: 0.4,
        ease: "power2.out"
      });
      
      gsap.to(blobRef.current, {
        fill: colors.hover,
        duration: 0.4,
        ease: "power2.out"
      });
    };
    
    const hoverLeave = () => {
      gsap.to(tileRef.current, { 
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        duration: 0.4,
        ease: "power2.out"
      });
      
      gsap.to(blobRef.current, {
        fill: colors.start,
        duration: 0.4,
        ease: "power2.out"
      });
    };
    
    tileRef.current.addEventListener('mouseenter', hoverEnter);
    tileRef.current.addEventListener('mouseleave', hoverLeave);
    
    return () => {
      if (tileRef.current) {
        tileRef.current.removeEventListener('mouseenter', hoverEnter);
        tileRef.current.removeEventListener('mouseleave', hoverLeave);
      }
      blobTimeline.kill();
    };
  }, [item.size]);
  
  return (
    <motion.div
      ref={ref}
      className={`relative rounded-xl overflow-hidden p-1 ${
        item.size === 'wide' ? 'col-span-2' : 
        item.size === 'tall' ? 'row-span-2' : 
        item.size === 'large' ? 'col-span-2 row-span-2' : ''
      }`}
      variants={variants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {/* Blob background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            ref={blobRef}
            d="M50,10 C70,10 90,30 90,50 C90,70 70,90 50,90 C30,90 10,70 10,50 C10,30 30,10 50,10 Z"
            fill="rgba(16, 185, 129, 0.05)"
          />
        </svg>
      </div>
      
      {/* Card content */}
      <div 
        ref={tileRef}
        className="relative z-10 h-full bg-black/40 backdrop-blur-sm rounded-lg overflow-hidden transition-all duration-300"
        style={{
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/10 to-transparent opacity-70"></div>
        
        <div className="p-4 h-full flex flex-col">
          <div className="mb-2">
            {item.icon && (
              <span className="text-emerald-400 text-xl">{item.icon}</span>
            )}
          </div>
          
          <h3 className="text-xl font-bold mb-2 text-white">{item.title}</h3>
          {item.description && (
            <p className="text-sm text-gray-300 mt-auto">{item.description}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const BentoGrid = ({ items }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
      {items.map((item, index) => (
        <BentoTile key={index} item={item} index={index} />
      ))}
    </div>
  );
};

export default BentoGrid; 