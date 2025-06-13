import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Path coordinates for the orb to follow along the skill tree
const pathPoints = [
  { x: 400, y: 50 },  // Main node
  { x: 100, y: 180 }, // Design category
  { x: 75, y: 300 },  // Design skills (first row)
  { x: 75, y: 400 },  // Design skills (second row)
  { x: 100, y: 500 }, // Design skills (last)
  { x: 350, y: 180 }, // AI & No-Code category
  { x: 325, y: 300 }, // AI skills (first row)
  { x: 325, y: 400 }, // AI skills (second row)
  { x: 350, y: 500 }, // AI skills (last)
  { x: 600, y: 180 }, // Frontend category
  { x: 575, y: 300 }, // Frontend skills (first row)
  { x: 600, y: 400 }, // Frontend skills (second)
  { x: 800, y: 180 }, // Additional skills category
  { x: 775, y: 300 }, // Additional skills (first row)
  { x: 775, y: 400 }, // Additional skills (second row)
  { x: 800, y: 500 }, // Additional skills (last)
];

const OrbController = ({ setNodes, setEdges }) => {
  const orbRef = useRef(null);
  const containerRef = useRef(null);
  
  useEffect(() => {
    const orb = orbRef.current;
    const container = containerRef.current;
    
    if (!orb || !container) return;
    
    // Create a GSAP timeline for the orb
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        pin: true,
        pinSpacing: true,
      }
    });
    
    // Animate the orb along the path
    pathPoints.forEach((point, index) => {
      const delay = index * 1; // Delay between points
      const position = index / (pathPoints.length - 1); // Position along the path (0-1)
      
      // Add animation to the timeline
      tl.to(orb, {
        x: point.x,
        y: point.y,
        duration: 1,
        ease: 'power1.inOut',
        onUpdate: () => {
          // Update nodes visibility or edges based on current progress
          updateNodesAndEdges(position);
        }
      }, delay);
    });
    
    return () => {
      // Clean up
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
      tl.kill();
    };
  }, [setNodes, setEdges]);
  
  // Function to update nodes and edges based on animation progress
  const updateNodesAndEdges = (progress) => {
    // Update nodes visibility based on progress
    setNodes(nodes => nodes.map(node => {
      // Calculate if this node should be visible based on progress
      // This logic depends on your specific implementation and timing
      
      // For example, main node appears at progress 0
      if (node.id === 'main' && progress >= 0) {
        return { ...node, style: { ...node.style, opacity: 1 } };
      }
      
      // Category nodes appear after progress 0.1
      if (node.type === 'categoryNode' && node.id !== 'main') {
        const categoryIndex = ['design', 'ai-nocode', 'frontend', 'additional'].indexOf(node.id);
        const categoryThreshold = 0.1 + (categoryIndex * 0.05);
        
        if (progress >= categoryThreshold) {
          return { ...node, style: { ...node.style, opacity: 1 } };
        }
      }
      
      // Skill nodes appear after their category
      if (node.type === 'skillNode') {
        const categoryMap = {
          'design': 0.25,
          'ai-nocode': 0.4,
          'frontend': 0.55,
          'additional': 0.7
        };
        
        const categoryThreshold = categoryMap[node.data.category] || 0.3;
        const skillIndex = parseInt(node.id.split('-')[1] || '0', 10) % 5;
        const skillThreshold = categoryThreshold + (skillIndex * 0.03);
        
        if (progress >= skillThreshold) {
          return { ...node, style: { ...node.style, opacity: 1 } };
        }
      }
      
      // Default: start with low opacity until revealed
      return { ...node, style: { ...node.style, opacity: 0.2 } };
    }));
    
    // Update edges based on progress
    setEdges(edges => edges.map(edge => {
      const sourceType = edge.source === 'main' ? 'main' : 
                        ['design', 'ai-nocode', 'frontend', 'additional'].includes(edge.source) ? 'category' : 'skill';
      
      // Main to category edges
      if (sourceType === 'main') {
        const categoryIndex = ['design', 'ai-nocode', 'frontend', 'additional'].indexOf(edge.target);
        const edgeThreshold = 0.1 + (categoryIndex * 0.05);
        
        if (progress >= edgeThreshold) {
          return { 
            ...edge, 
            style: { ...edge.style, opacity: 1, strokeWidth: 3 },
            animated: true 
          };
        }
      }
      
      // Category to skill edges
      if (sourceType === 'category') {
        const categoryMap = {
          'design': 0.25,
          'ai-nocode': 0.4,
          'frontend': 0.55,
          'additional': 0.7
        };
        
        const categoryThreshold = categoryMap[edge.source] || 0.3;
        
        if (progress >= categoryThreshold) {
          return { 
            ...edge, 
            style: { ...edge.style, opacity: 0.8, strokeWidth: 2 },
            animated: true
          };
        }
      }
      
      // Default: low opacity until revealed
      return { 
        ...edge, 
        style: { ...edge.style, opacity: 0.1 },
        animated: false
      };
    }));
  };
  
  return (
    <div ref={containerRef} className="absolute inset-0 z-50 pointer-events-none">
      <motion.div 
        ref={orbRef}
        className="absolute top-0 left-0 w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-cyan-400 blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ 
          boxShadow: '0 0 20px 5px rgba(74, 222, 128, 0.5)',
          transform: 'translate(-50%, -50%)'
        }}
      >
        {/* Inner orb */}
        <div className="absolute inset-1 rounded-full bg-white/80 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-white"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default OrbController; 