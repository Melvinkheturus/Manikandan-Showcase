import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, PerspectiveCamera } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import * as THREE from 'three';

// Simple error boundary component for Three.js rendering
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Three.js rendering error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI when Three.js encounters an error
      return (
        <group>
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="red" />
          </mesh>
          <ambientLight intensity={0.5} />
        </group>
      );
    }

    return this.props.children;
  }
}

// Sample skills data - replace with your actual skills
const skillsData = [
  { name: 'React', level: 85, position: [0.8, 0.4, 0.3], orbitSpeed: 0.3, orbitRadius: 3.0, orbitOffset: 0 },
  { name: 'JavaScript', level: 90, position: [-0.7, 0.5, 0.4], orbitSpeed: 0.25, orbitRadius: 3.2, orbitOffset: 1 },
  { name: 'Node.js', level: 75, position: [0.2, -0.8, 0.5], orbitSpeed: 0.28, orbitRadius: 3.5, orbitOffset: 2 },
  { name: 'UI/UX', level: 80, position: [-0.4, -0.7, 0.3], orbitSpeed: 0.22, orbitRadius: 2.8, orbitOffset: 3 },
  { name: 'HTML5', level: 95, position: [0.3, 0.9, -0.1], orbitSpeed: 0.2, orbitRadius: 3.3, orbitOffset: 4 },
  { name: 'CSS3', level: 90, position: [-0.6, -0.1, -0.8], orbitSpeed: 0.32, orbitRadius: 2.9, orbitOffset: 5 },
  { name: 'Three.js', level: 65, position: [0.5, -0.4, -0.7], orbitSpeed: 0.27, orbitRadius: 3.4, orbitOffset: 6 },
  { name: 'Python', level: 70, position: [-0.3, 0.6, -0.6], orbitSpeed: 0.24, orbitRadius: 3.1, orbitOffset: 7 },
];

// Scene setup to ensure transparency
const SceneSetup = () => {
  const { scene } = useThree();
  
  useEffect(() => {
    // Ensure the scene background is transparent
    scene.background = null;
  }, [scene]);
  
  return null;
};

// 3D Skill Nodes Component
const SkillOrb = ({ hoveredSkill, setHoveredSkill }) => {
  const groupRef = useRef();
  const { isDarkMode } = useTheme();
  
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    
    try {
      const t = clock.getElapsedTime() * 0.1;
      if (!hoveredSkill) {
        groupRef.current.rotation.y = t;
        groupRef.current.rotation.x = Math.sin(t) * 0.2;
      }
    } catch (err) {
      console.error("Error in SkillOrb animation:", err);
    }
  });

  // When a skill is hovered, rotate to center it
  useEffect(() => {
    if (!hoveredSkill || !groupRef.current) return;
    
    try {
      const skill = skillsData.find(s => s.name === hoveredSkill);
      if (skill) {
        const targetPosition = new THREE.Vector3(...skill.position);
        targetPosition.normalize().multiplyScalar(-1);
        
        // Create a look-at rotation, but only for y-axis
        const targetRotation = new THREE.Euler();
        targetRotation.y = Math.atan2(targetPosition.x, targetPosition.z);
        
        groupRef.current.rotation.y = targetRotation.y;
      }
    } catch (err) {
      console.error("Error rotating to skill:", err);
    }
  }, [hoveredSkill]);
  
  return (
    <group ref={groupRef}>
      {/* Sphere wireframe - empty inside */}
      <mesh>
        <sphereGeometry args={[2, 24, 24]} />
        <meshBasicMaterial 
          color={'#10b981'} 
          wireframe 
          transparent 
          opacity={0.2} 
        />
      </mesh>
      
      {/* Skill nodes - now orbiting around the globe */}
      {skillsData.map((skill, index) => (
        <SkillNode 
          key={index} 
          skill={skill} 
          isHovered={hoveredSkill === skill.name}
          setHoveredSkill={setHoveredSkill}
        />
      ))}
    </group>
  );
};

// Individual skill node - now orbiting around the globe
const SkillNode = ({ skill, isHovered, setHoveredSkill }) => {
  const nodeRef = useRef();
  const orbitRef = useRef();
  const { isDarkMode } = useTheme();
  
  // Create orbit path only once
  useEffect(() => {
    if (orbitRef.current) {
      // Create orbit visualization
      const segments = 64;
      const orbitGeometry = new THREE.BufferGeometry();
      const orbitPositions = [];
      
      for (let i = 0; i <= segments; i++) {
        const orbitAngle = (i / segments) * Math.PI * 2;
        const orbitX = Math.sin(orbitAngle) * skill.orbitRadius;
        const orbitY = Math.cos(orbitAngle) * skill.orbitRadius * 0.5;
        const orbitZ = Math.cos(orbitAngle) * skill.orbitRadius;
        
        orbitPositions.push(orbitX, orbitY, orbitZ);
      }
      
      orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(orbitPositions, 3));
      orbitRef.current.geometry = orbitGeometry;
    }
  }, [skill.orbitRadius]);
  
  // Update node position on each frame
  useFrame(({ clock }) => {
    if (nodeRef.current) {
      const t = clock.getElapsedTime();
      
      // Calculate orbit position
      const angle = t * skill.orbitSpeed + skill.orbitOffset;
      const orbitRadius = skill.orbitRadius;
      
      // Create orbital paths on different planes for variety
      const x = Math.sin(angle) * orbitRadius;
      const y = Math.cos(angle) * orbitRadius * 0.5 + Math.sin(t * 0.2) * 0.5;
      const z = Math.cos(angle) * orbitRadius;
      
      // Update node position
      nodeRef.current.position.set(x, y, z);
      
      // Make node always face the center
      nodeRef.current.lookAt(0, 0, 0);
    }
  });
  
  // Determine color based on skill level
  const getColorForLevel = (level) => {
    if (level >= 90) return '#10b981'; // Expert - emerald
    if (level >= 70) return '#60a5fa'; // Advanced - blue
    if (level >= 40) return '#f0f0f0'; // Intermediate - white
    return '#fbbf24'; // Beginner - amber
  };
  
  const handlePointerOver = () => setHoveredSkill(skill.name);
  const handlePointerOut = () => setHoveredSkill(null);
  const color = getColorForLevel(skill.level);
  
  return (
    <group>
      {/* Orbit path visualization */}
      <line ref={orbitRef}>
        <bufferGeometry />
        <lineBasicMaterial attach="material" color={color} transparent opacity={0.1} />
      </line>
      
      {/* Skill node */}
      <group 
        ref={nodeRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        {/* Connection line to globe center */}
        <mesh>
          <boxGeometry args={[0.01, 0.01, skill.orbitRadius]} />
          <meshBasicMaterial color={color} transparent opacity={0.1} />
        </mesh>
        
        {/* Skill sphere with glow effect */}
        <group scale={isHovered ? 1.3 : 1} position={[0, 0, 0]}>
          {/* Circle background for the node */}
          <mesh>
            <sphereGeometry args={[0.18, 32, 32]} />
            <meshBasicMaterial color={color} opacity={isHovered ? 0.7 : 0.5} transparent />
          </mesh>
          
          {/* Glowing halo for the icon when hovered */}
          {isHovered && (
            <mesh>
              <ringGeometry args={[0.2, 0.25, 32]} />
              <meshBasicMaterial color={color} transparent opacity={0.6} />
            </mesh>
          )}
        </group>
        
        {/* Skill label */}
        <Text
          position={[0, 0.4, 0]}
          fontSize={0.2}
          color={'#ffffff'}
          anchorX="center"
          anchorY="middle"
          material-toneMapped={false}
          renderOrder={1}
        >
          {skill.name}
        </Text>
      </group>
    </group>
  );
};

// Radial Progress Bar Component with Neon Glow
const RadialProgressBar = ({ skill, index, hoveredSkill, setHoveredSkill }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  
  // Circle dimensions - dimensions adjusted to prevent overflow
  const size = 90;
  const strokeWidth = 4;
  const radius = (size - strokeWidth * 2) / 2; // Adjusted radius to prevent clipping
  const circumference = radius * 2 * Math.PI;
  const dashoffset = circumference * (1 - animatedValue / 100);
  
  // Determine color based on skill level
  const getColorForLevel = (level) => {
    if (level >= 90) return '#10b981'; // Expert - emerald
    if (level >= 70) return '#60a5fa'; // Advanced - blue
    if (level >= 40) return '#f0f0f0'; // Intermediate - white
    return '#fbbf24'; // Beginner - amber
  };
  
  const color = getColorForLevel(skill.level);
  const isHovered = hoveredSkill === skill.name;
  
  // Animate progress on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(skill.level);
    }, index * 100);
    
    return () => clearTimeout(timer);
  }, [skill.level, index]);
  
  // Calculate viewBox to ensure SVG is fully visible
  const viewBoxSize = size + strokeWidth * 2;
  const viewBox = `0 0 ${viewBoxSize} ${viewBoxSize}`;
  const centerPoint = viewBoxSize / 2;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex flex-col items-center justify-center"
      onMouseEnter={() => setHoveredSkill(skill.name)}
      onMouseLeave={() => setHoveredSkill(null)}
    >
      {/* Container with enough padding to prevent clipping */}
      <div className="relative p-6 rounded-full"> 
        {/* Circular glow effect */}
        <div 
          className={`absolute inset-0 rounded-full transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          style={{ 
            background: `radial-gradient(circle, ${color}33 30%, transparent 70%)`,
            filter: 'blur(8px)'
          }}
        />
        
        {/* SVG Circle with proper viewBox and overflow handling */}
        <div className="relative w-full h-full overflow-visible">
          <svg 
            width={size} 
            height={size} 
            viewBox={viewBox} 
            className="overflow-visible"
            style={{ display: 'block' }}
          >
            {/* Background circle */}
            <circle
              cx={centerPoint}
              cy={centerPoint}
              r={radius}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth={strokeWidth}
              fill="none"
            />
            
            {/* Progress circle */}
            <circle
              cx={centerPoint}
              cy={centerPoint}
              r={radius}
              stroke={color}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={dashoffset}
              strokeLinecap="round"
              fill="none"
              style={{ 
                transition: 'stroke-dashoffset 1.5s ease-in-out',
                transform: 'rotate(-90deg)',
                transformOrigin: 'center',
                filter: isHovered ? `drop-shadow(0 0 4px ${color})` : 'none'
              }}
            />
          </svg>
          
          {/* Percentage display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`font-bold text-lg ${isHovered ? 'text-primary' : 'text-white'}`}>
              {skill.level}%
            </span>
          </div>
        </div>
      </div>
      
      {/* Skill name */}
      <p className="mt-2 text-sm font-medium text-white group-hover:text-primary transition-colors">
        {skill.name}
      </p>
    </motion.div>
  );
};

// Fallback 2D visualization for devices without WebGL
const FallbackSkillVisualizer = ({ hoveredSkill, setHoveredSkill }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="relative w-60 h-60 md:w-72 md:h-72">
        {/* Center emerald circle */}
        <div className="absolute inset-1/4 rounded-full bg-emerald-600/20 backdrop-blur-md border border-emerald-500/30 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
          <div className="text-emerald-400 text-lg font-semibold">Skills</div>
        </div>
        
        {/* Orbital skill items */}
        {skillsData.map((skill, index) => {
          const angle = (index / skillsData.length) * Math.PI * 2;
          const radius = 110; // Orbit radius
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const isActive = hoveredSkill === skill.name;
          
          return (
            <motion.div
              key={skill.name}
              className={`absolute w-10 h-10 rounded-full flex items-center justify-center 
                          ${isActive ? 'bg-emerald-600/40 z-10' : 'bg-gray-800/40'} 
                          backdrop-blur-sm border ${isActive ? 'border-emerald-500/50' : 'border-gray-700/50'}`}
              style={{
                left: 'calc(50% - 20px)',
                top: 'calc(50% - 20px)',
                transform: `translate(${x}px, ${y}px)`,
              }}
              whileHover={{ scale: 1.2 }}
              onMouseEnter={() => setHoveredSkill(skill.name)}
              onMouseLeave={() => setHoveredSkill(null)}
            >
              <div className="text-xs text-white">{skill.name}</div>
              
              {/* Connection line */}
              <div 
                className={`absolute h-px ${isActive ? 'bg-emerald-500/40' : 'bg-gray-600/30'}`}
                style={{
                  width: `${radius}px`,
                  transformOrigin: 'left center',
                  transform: `rotate(${angle + Math.PI}rad)`,
                  left: '50%',
                  top: '50%'
                }}
              />
            </motion.div>
          );
        })}
      </div>
      <div className="text-gray-400 text-sm mt-4 text-center">
        Interactive 3D visualization not available.<br/>
        Using simplified visualization.
      </div>
    </div>
  );
};

export default function SkillConstellation() {
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [canvasError, setCanvasError] = useState(false);
  const [webGLSupported, setWebGLSupported] = useState(null);

  // Check WebGL support on component mount
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || 
                 canvas.getContext('webgl') || 
                 canvas.getContext('experimental-webgl');
      
      setWebGLSupported(!!gl);
      
      // Clean up
      if (gl && gl.getExtension) {
        // Try to get extensions 
        try {
          gl.getExtension('OES_standard_derivatives');
          gl.getExtension('OES_element_index_uint');
        } catch (e) {
          console.warn("WebGL extensions not available:", e);
        }
      }
      
      canvas.remove();
    } catch (e) {
      console.error("Error checking WebGL support:", e);
      setWebGLSupported(false);
      setCanvasError(true);
    }
  }, []);

  // Handle WebGL context errors
  const handleCanvasError = (error) => {
    console.error("Canvas rendering error:", error);
    setCanvasError(true);
  };
  
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">My Skills</h2>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            Interactive visualization of my technical expertise and proficiency levels
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* 3D Skill Orb with glassmorphism and glow */}
          <div className="w-full lg:w-1/2 flex justify-center">
            {/* Enhanced glassmorphic container with glow */}
            <div className="relative w-[300px] h-[300px] lg:w-[400px] lg:h-[400px] rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_0_20px_#00ffcc33] p-2">
              {/* Ambient glow behind the globe */}
              <div className="absolute w-64 h-64 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(16,185,129,0.2),transparent_70%)] blur-2xl -z-10"></div>
              
              {canvasError || webGLSupported === false ? (
                <FallbackSkillVisualizer 
                  hoveredSkill={hoveredSkill} 
                  setHoveredSkill={setHoveredSkill} 
                />
              ) : (
                <Canvas
                  gl={{ 
                    alpha: true,
                    antialias: true,
                    powerPreference: 'default',
                    failIfMajorPerformanceCaveat: false,
                    preserveDrawingBuffer: true,
                    depth: true,
                    stencil: false,
                    precision: 'highp'
                  }}
                  style={{ background: 'transparent' }}
                  camera={{ position: [0, 0, 8], fov: 60 }}
                  onCreated={({ gl, scene, events }) => {
                    // Set clear color with 0 alpha for transparency
                    gl.setClearColor(0x000000, 0);
                    
                    // Don't attempt to get extensions if not available
                    if (gl && gl.getExtension) {
                      try {
                        gl.getExtension('OES_standard_derivatives');
                        gl.getExtension('OES_element_index_uint');
                        gl.getExtension('OES_texture_float');
                        gl.getExtension('WEBGL_depth_texture');
                      } catch (e) {
                        console.warn("WebGL extension not available:", e);
                      }
                    }
                    
                    // Prevent event listeners issues
                    if (events && events.connected) {
                      console.log("Events are connected properly");
                    }
                    
                    // Make sure scene is initialized properly
                    if (scene) {
                      scene.background = null;
                    }
                  }}
                  onError={handleCanvasError}
                  dpr={Math.min(1.5, window.devicePixelRatio || 1)} // More stable approach
                  shadows={false} // Disable shadows for performance
                  frameloop="demand" // Only render when needed
                  resize={{ scroll: false }} // Prevent scroll listener issues
                >
                  <ErrorBoundary>
                    <SceneSetup />
                    <ambientLight intensity={0.6} />
                    <pointLight position={[10, 10, 10]} intensity={0.8} />
                    <pointLight position={[-10, -10, -10]} color="#10b981" intensity={0.4} />
                    <Suspense fallback={null}>
                      <SkillOrb hoveredSkill={hoveredSkill} setHoveredSkill={setHoveredSkill} />
                      <OrbitControls 
                        enableZoom={false} 
                        enablePan={false}
                        autoRotate={!hoveredSkill}
                        autoRotateSpeed={0.5}
                        rotateSpeed={0.3}
                      />
                    </Suspense>
                  </ErrorBoundary>
                </Canvas>
              )}
            </div>
          </div>
          
          {/* Radial Progress Bars - Modernized Layout */}
          <div className="w-full lg:w-1/2">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {skillsData.map((skill, index) => (
                <RadialProgressBar
                  key={index}
                  skill={skill}
                  index={index}
                  hoveredSkill={hoveredSkill}
                  setHoveredSkill={setHoveredSkill}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 