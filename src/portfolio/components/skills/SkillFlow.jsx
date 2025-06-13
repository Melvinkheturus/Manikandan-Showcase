import React, { useCallback, useEffect, useState, useRef } from 'react';
import ReactFlow, {
  Controls,
  useNodesState,
  useEdgesState,
  MiniMap,
  Background,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import SkillNode, { CategoryNode } from './SkillNode';
import { initialNodes as baseNodes, initialEdges as baseEdges } from '../data/skillsData';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

// Node types mapping
const nodeTypes = {
  skillNode: SkillNode,
  categoryNode: CategoryNode,
};

// Adjust node positions for better spacing
const adjustNodePositions = () => {
  // Create a deep copy to avoid mutating the original
  const adjustedNodes = JSON.parse(JSON.stringify(baseNodes));
  
  // Get screen dimensions for responsive layout
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  
  // Define layout parameters
  const mainNodeY = 50;
  const categoryY = 180;
  const skillStartY = 300;
  const skillGapY = 120;
  const skillGapX = 150;
  
  // Center the main node
  const mainNode = adjustedNodes.find(node => node.id === 'main');
  if (mainNode) {
    mainNode.position = {
      x: screenWidth / 2 - 70,
      y: mainNodeY
    };
    mainNode.data.revealed = true;
  }
  
  // Get category nodes
  const categoryNodes = adjustedNodes.filter(node => 
    node.type === 'categoryNode' && node.id !== 'main'
  );
  
  // Calculate category positions (evenly spaced)
  const categoryWidth = screenWidth / (categoryNodes.length + 1);
  categoryNodes.forEach((node, index) => {
    node.position = {
      x: categoryWidth * (index + 1) - 50,
      y: categoryY
    };
    
    // Set all nodes initially unrevealed
    node.data = {
      ...node.data,
      revealed: false
    };
  });
  
  // Position skills in grids under each category
  const categories = ['design', 'ai-nocode', 'frontend', 'additional'];
  
  categories.forEach((category, catIndex) => {
    const categoryNode = categoryNodes.find(node => node.id === category);
    if (!categoryNode) return;
    
    // Get all skills for this category
    const skills = adjustedNodes.filter(
      node => node.type === 'skillNode' && node.data.category === category
    );
    
    // Position skills in a grid (2 columns)
    skills.forEach((skill, skillIndex) => {
      const row = Math.floor(skillIndex / 2);
      const col = skillIndex % 2;
      
      skill.position = {
        x: categoryNode.position.x + (col === 0 ? -60 : 60),
        y: skillStartY + (row * skillGapY)
      };
      
      // Set all skills initially unrevealed
      skill.data = {
        ...skill.data,
        revealed: false,
        // Add animation delay based on index
        animationDelay: 0.1 * skillIndex
      };
    });
  });
  
  return adjustedNodes;
};

// Create simplified edges (remove lower connectors)
const createSimplifiedEdges = () => {
  // Start with clean edges
  const simplifiedEdges = [];
  
  // Add main -> category connections
  const categories = ['design', 'ai-nocode', 'frontend', 'additional'];
  const categoryColors = {
    'design': '#f59e0b',
    'ai-nocode': '#3b82f6',
    'frontend': '#f43f5e',
    'additional': '#a855f7'
  };
  
  // Add main to category connections
  categories.forEach(category => {
    simplifiedEdges.push({
      id: `main-to-${category}`,
      source: 'main',
      target: category,
      type: 'smoothstep',
      style: { 
        stroke: categoryColors[category], 
        strokeWidth: 2,
        opacity: 0.2,
        strokeDasharray: '5, 5'
      },
      animated: false
    });
  });
  
  // Add category to skill connections
  baseNodes.filter(node => node.type === 'skillNode').forEach(skill => {
    const category = skill.data.category;
    if (!category) return;
    
    simplifiedEdges.push({
      id: `${category}-to-${skill.id}`,
      source: category,
      target: skill.id,
      type: 'smoothstep',
      style: {
        stroke: categoryColors[category],
        strokeWidth: 1.5,
        opacity: 0.1
      },
      animated: false
    });
  });
  
  return simplifiedEdges;
};

const SkillFlow = () => {
  // Get adjusted nodes and edges
  const adjustedNodes = adjustNodePositions();
  const simplifiedEdges = createSimplifiedEdges();
  
  // Initialize all nodes with opacity 0 for animation
  const processedNodes = adjustedNodes.map(node => ({
    ...node,
    data: {
      ...node.data,
      // Ensure React elements are properly passed as strings for JSON handling
      icon: null, // Will be restored from original data
    },
    style: { 
      ...node.style, 
      opacity: node.id === 'main' ? 0.6 : 0 
    }
  }));
  
  // Restore React elements after JSON processing
  processedNodes.forEach(node => {
    const originalNode = baseNodes.find(n => n.id === node.id);
    if (originalNode && originalNode.data && originalNode.data.icon) {
      node.data.icon = originalNode.data.icon;
    }
  });
  
  // Initialize edges with low opacity
  const processedEdges = simplifiedEdges.map(edge => ({
    ...edge,
    style: { ...edge.style, opacity: 0.1 },
    animated: false
  }));
  
  const [nodes, setNodes, onNodesChange] = useNodesState(processedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(processedEdges);
  const [flowInstance, setFlowInstance] = useState(null);
  const [pathReady, setPathReady] = useState(false);
  const [connectorPaths, setConnectorPaths] = useState([]);
  
  // Refs for animation
  const containerRef = useRef(null);
  const flowRef = useRef(null);
  const orbRef = useRef(null);
  const timelineRef = useRef(null);
  const svgContainerRef = useRef(null);
  
  // Initialize ReactFlow with proper fit view
  const onInit = useCallback((reactFlowInstance) => {
    setFlowInstance(reactFlowInstance);
    setTimeout(() => {
      reactFlowInstance.fitView({ padding: 0.4 });
      
      // Calculate connector paths from the rendered edges
      calculateConnectorPaths(reactFlowInstance);
    }, 800);
  }, []);
  
  // Handle window resize to ensure the flow stays properly fitted
  useEffect(() => {
    const handleResize = () => {
      if (flowInstance) {
        flowInstance.fitView({ padding: 0.4 });
        calculateConnectorPaths(flowInstance);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [flowInstance]);
  
  // Calculate connector paths from rendered edges
  const calculateConnectorPaths = (instance) => {
    try {
      if (!instance) return;
      
      // Small delay to ensure edges are rendered
      setTimeout(() => {
        const edgeElements = document.querySelectorAll('.react-flow__edge-path');
        if (!edgeElements || edgeElements.length === 0) {
          console.warn("No edge elements found");
          return;
        }
        
        const paths = Array.from(edgeElements).map(element => {
          const pathData = element.getAttribute('d');
          // Ensure we can find the parent edge
          const edgeElement = element.closest('.react-flow__edge');
          if (!edgeElement) return null;
          
          const edgeId = edgeElement.getAttribute('data-testid');
          if (!edgeId) return null;
          
          const edgeInfo = edges.find(edge => `edge-${edge.id}` === edgeId);
          
          return {
            path: pathData,
            id: edgeId,
            source: edgeInfo?.source || '',
            target: edgeInfo?.target || '',
            type: edgeInfo?.source === 'main' ? 'main-to-category' : 'category-to-skill'
          };
        }).filter(Boolean); // Filter out null values
        
        setConnectorPaths(paths);
        console.log("Connector paths calculated:", paths.length);
        
        // Create a combined path for the orb animation
        createCombinedSvgPath(paths);
        
        // Set path ready after paths are calculated
        setTimeout(() => {
          setPathReady(true);
        }, 300);
      }, 500);
    } catch (error) {
      console.error("Error calculating connector paths:", error);
    }
  };
  
  // Create a combined SVG path for the orb animation
  const createCombinedSvgPath = (paths) => {
    try {
      if (!paths || paths.length === 0 || !svgContainerRef.current) return;
      
      // First, get main to category paths
      const mainToCategoryPaths = paths.filter(path => path.source === 'main');
      
      // Sort by target (to ensure consistent order)
      const categoryOrder = ['design', 'ai-nocode', 'frontend', 'additional'];
      const sortedPaths = [];
      
      // Add main to category paths in order
      categoryOrder.forEach(category => {
        const mainToCategory = mainToCategoryPaths.find(p => p.target === category);
        if (mainToCategory) {
          sortedPaths.push(mainToCategory);
          
          // Add paths from this category to its skills
          const categoryToSkills = paths.filter(p => p.source === category);
          if (categoryToSkills.length > 0) {
            sortedPaths.push(...categoryToSkills);
          }
        }
      });
      
      // Create a path element for each segment
      sortedPaths.forEach((pathData, index) => {
        if (!pathData.path) return;
        
        const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pathElement.setAttribute("d", pathData.path);
        pathElement.setAttribute("fill", "none");
        
        // Style the path based on its type
        let strokeColor;
        if (pathData.source === 'main') {
          strokeColor = categoryOrder.includes(pathData.target) 
            ? categoryColors[pathData.target] 
            : "#38bdf8";
        } else {
          strokeColor = categoryOrder.includes(pathData.source)
            ? categoryColors[pathData.source]
            : "#38bdf8";
        }
        
        pathElement.setAttribute("stroke", strokeColor);
        pathElement.setAttribute("stroke-width", "2");
        pathElement.setAttribute("stroke-dasharray", "5,5");
        pathElement.setAttribute("opacity", "0.2");
        pathElement.id = `path-${index}`;
        pathElement.dataset.source = pathData.source;
        pathElement.dataset.target = pathData.target;
        
        svgContainerRef.current.appendChild(pathElement);
      });
      
      // Create the main animation path
      const mainAnimPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
      mainAnimPath.id = "orb-animation-path";
      mainAnimPath.setAttribute("fill", "none");
      mainAnimPath.setAttribute("stroke", "none");
      svgContainerRef.current.appendChild(mainAnimPath);
      
      // Calculate a combined path from all segments
      const combinePath = (pathsArray) => {
        if (!pathsArray || pathsArray.length === 0) return "";
        
        // Start with the first path
        let combinedPath = pathsArray[0].path;
        
        return combinedPath;
      };
      
      const combinedPathData = combinePath(sortedPaths);
      mainAnimPath.setAttribute("d", combinedPathData);
      
    } catch (error) {
      console.error("Error creating combined SVG path:", error);
    }
  };
  
  // Setup GSAP animation for the orb along the path with pauses at categories
  useEffect(() => {
    // Only start animation when path is ready
    if (!pathReady || connectorPaths.length === 0) return;
    
    const container = containerRef.current;
    const orb = orbRef.current;
    const svgContainer = svgContainerRef.current;
    
    if (!container || !orb || !svgContainer) {
      console.error("Missing required elements for animation");
      return;
    }
    
    try {
      // Get all path elements
      const pathElements = svgContainer.querySelectorAll('path[id^="path-"]');
      if (pathElements.length === 0) {
        console.error("No path elements found for animation");
        return;
      }
      
      // Filter for main-to-category paths only
      const mainToCategoryPaths = Array.from(pathElements).filter(
        el => el.dataset.source === 'main'
      );
      
      // Sort by category order
      const categoryOrder = ['design', 'ai-nocode', 'frontend', 'additional'];
      const sortedMainPaths = [];
      
      categoryOrder.forEach(category => {
        const path = mainToCategoryPaths.find(p => p.dataset.target === category);
        if (path) sortedMainPaths.push(path);
      });
      
      if (sortedMainPaths.length === 0) {
        console.error("No main-to-category paths found");
        return;
      }
      
      // Get the first path for initial position
      const firstPath = sortedMainPaths[0];
      
      // Initial orb position and appearance
      gsap.set(orb, { 
        xPercent: -50, 
        yPercent: -50,
        opacity: 0.2,
        scale: 0.8,
        filter: 'blur(4px)'
      });
      
      // Get the main node position to position orb at start
      const mainNode = nodes.find(node => node.id === 'main');
      if (mainNode) {
        // Set initial position at main node
        gsap.set(orb, {
          x: mainNode.position.x + 70,
          y: mainNode.position.y + 30
        });
      }
      
      // Create scroll-triggered timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
        }
      });
      
      // Store timeline for external access
      timelineRef.current = tl;
      
      // Initial orb reveal
      tl.to(orb, { 
        opacity: 0.7, 
        scale: 1, 
        filter: 'blur(1px)',
        duration: 0.5 
      });
      
      // Animate along main paths first (to categories)
      sortedMainPaths.forEach((pathElement, index) => {
        const category = pathElement.dataset.target;
        
        // Animate along this path
        tl.to(orb, {
          motionPath: {
            path: pathElement,
            align: pathElement,
            alignOrigin: [0.5, 0.5],
            autoRotate: false,
            useRAF: true
          },
          duration: 2,
          ease: "power1.inOut",
          onStart: () => {
            // Highlight this path
            gsap.to(pathElement, {
              opacity: 0.8,
              strokeWidth: 3,
              duration: 0.5
            });
          },
          onComplete: () => {
            // Highlight category when orb reaches it
            highLightCategory(category);
          }
        });
        
        // Pause at the category with a glow effect
        tl.to(orb, {
          scale: 1.5,
          opacity: 1,
          filter: 'blur(0px)',
          boxShadow: '0 0 20px 10px rgba(255,255,255,0.3)',
          duration: 0.5,
          onComplete: () => {
            // Reveal skills for this category
            revealSkillsForCategory(category);
          }
        });
        
        // Return to normal size
        tl.to(orb, {
          scale: 1,
          boxShadow: '0 0 10px 5px rgba(255,255,255,0.2)',
          duration: 0.3
        });
        
        // Get all skill paths for this category
        const skillPaths = Array.from(pathElements).filter(
          el => el.dataset.source === category
        );
        
        // Animate along each skill path
        skillPaths.forEach((skillPath, skillIndex) => {
          const skillId = skillPath.dataset.target;
          
          // Animate to skill
          tl.to(orb, {
            motionPath: {
              path: skillPath,
              align: skillPath,
              alignOrigin: [0.5, 0.5],
              autoRotate: false
            },
            duration: 1,
            ease: "power1.inOut",
            onStart: () => {
              // Highlight path
              gsap.to(skillPath, {
                opacity: 0.7,
                strokeWidth: 2,
                duration: 0.3
              });
            },
            onComplete: () => {
              // Highlight skill
              highlightSkill(skillId);
            }
          });
          
          // Small pulse at skill
          tl.to(orb, {
            scale: 1.2,
            duration: 0.2,
            yoyo: true,
            repeat: 1
          });
          
          // Return to skill category if not the last skill
          if (skillIndex < skillPaths.length - 1) {
            tl.to(orb, {
              motionPath: {
                path: skillPath,
                align: skillPath,
                alignOrigin: [0.5, 0.5],
                autoRotate: false,
                start: 1,
                end: 0
              },
              duration: 0.7,
              ease: "power1.in"
            });
          }
        });
        
        // If not the last category, return to the main path to continue
        if (index < sortedMainPaths.length - 1) {
          tl.to(orb, {
            motionPath: {
              path: pathElement,
              align: pathElement,
              alignOrigin: [0.5, 0.5],
              autoRotate: false,
              start: 1,
              end: 0
            },
            duration: 1,
            ease: "power1.in"
          });
        }
      });
      
      return () => {
        // Clean up
        if (tl.scrollTrigger) {
          tl.scrollTrigger.kill();
        }
        tl.kill();
      };
    } catch (error) {
      console.error("Error setting up GSAP animation:", error);
    }
  }, [pathReady, connectorPaths, nodes]);
  
  // Function to highlight a category and its skills
  const highLightCategory = (categoryId) => {
    // Apply special highlighting to the category node
    setNodes(nodes => nodes.map(node => {
      if (node.id === categoryId) {
        return { 
          ...node, 
          style: { 
            ...node.style, 
            opacity: 1,
            boxShadow: '0 0 20px 8px rgba(255, 255, 255, 0.3)',
            transform: 'scale(1.05)'
          },
          data: {
            ...node.data,
            active: true,
            revealed: true
          }
        };
      }
      return node;
    }));
  };
  
  // Function to highlight a specific skill
  const highlightSkill = (skillId) => {
    setNodes(nodes => nodes.map(node => {
      if (node.id === skillId) {
        return {
          ...node,
          style: {
            ...node.style,
            opacity: 1,
            boxShadow: '0 0 15px 5px rgba(255, 255, 255, 0.2)',
            transform: 'scale(1.1)'
          },
          data: {
            ...node.data,
            revealed: true
          }
        };
      }
      return node;
    }));
  };
  
  // Function to reveal skills for a category with staggered animation
  const revealSkillsForCategory = (categoryId) => {
    // First, collect all skill nodes for this category
    const categorySkills = nodes.filter(
      node => node.type === 'skillNode' && node.data.category === categoryId
    );
    
    // Update nodes to reveal these skills with staggered delay
    categorySkills.forEach((skill, index) => {
      // Staggered animation for each skill
      setTimeout(() => {
        setNodes(nodes => nodes.map(node => {
          if (node.id === skill.id) {
            return { 
              ...node, 
              style: { 
                ...node.style, 
                opacity: 1,
                transform: 'scale(1)'
              },
              data: {
                ...node.data,
                revealed: true
              }
            };
          }
          return node;
        }));
        
        // Also highlight the connecting edge
        setEdges(edges => edges.map(edge => {
          if (edge.target === skill.id && edge.source === categoryId) {
            return { 
              ...edge, 
              style: { ...edge.style, opacity: 0.7 },
              animated: true 
            };
          }
          return edge;
        }));
      }, 150 * index); // 150ms delay between each skill
    });
  };
  
  // Category colors for svg paths
  const categoryColors = {
    'design': '#f59e0b',
    'ai-nocode': '#3b82f6',
    'frontend': '#f43f5e',
    'additional': '#a855f7'
  };
  
  // Create a fallback view for error state
  if (!nodes || !edges) {
    return (
      <div className="w-full h-[100vh] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-2xl mb-4">Loading Skills Visualization</div>
          <div className="inline-block animate-spin h-10 w-10 border-4 border-white/20 border-t-white rounded-full"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      ref={containerRef} 
      className="w-full h-[180vh] bg-transparent relative"
    >
      {/* ReactFlow container */}
      <div ref={flowRef} className="w-full h-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          onInit={onInit}
          fitView
          proOptions={{ hideAttribution: true }}
          minZoom={0.3}
          maxZoom={1.5}
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
          zoomOnScroll={false}
          panOnScroll={false}
          panOnDrag={false}
          nodesDraggable={false}
          preventScrolling={false}
          style={{ background: 'transparent' }}
        >
          <Controls 
            showZoom={false}
            showFitView={false} 
            showInteractive={false}
            className="opacity-70 hover:opacity-100 transition-opacity" 
          />
        </ReactFlow>
        
        {/* SVG container for custom paths */}
        <svg 
          ref={svgContainerRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{ zIndex: 5 }}
        >
          <defs>
            <linearGradient id="glow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="50%" stopColor="#2dd4bf" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
        </svg>
        
        {/* Glowing orb */}
        <div 
          ref={orbRef}
          className="absolute top-0 left-0 w-10 h-10 rounded-full z-10 pointer-events-none transform transition-transform"
          style={{ zIndex: 10 }}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-cyan-400 blur-md opacity-70"></div>
          <div className="absolute inset-[2px] rounded-full bg-gradient-to-r from-green-400 to-cyan-400 opacity-90"></div>
          <div className="absolute inset-[4px] rounded-full bg-white/90 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white"></div>
          </div>
        </div>
      </div>
      
      {/* Fixed instruction text */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white py-2 px-6 rounded-full text-sm z-50">
        <span className="mr-2">✨</span> Scroll to explore my skills journey <span className="ml-2">✨</span>
      </div>
      
      {/* Loading indicator shown when path isn't ready */}
      {!pathReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="text-white text-center">
            <div className="inline-block animate-spin h-8 w-8 border-4 border-white/20 border-t-white rounded-full mb-2"></div>
            <p>Preparing skills journey...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillFlow; 