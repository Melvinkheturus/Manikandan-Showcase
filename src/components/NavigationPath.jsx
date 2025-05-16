import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, useGLTF, CatmullRomLine } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';
import { useInView } from 'react-intersection-observer';

// Navigation path points - defining the 3D spline that connects sections
const pathPoints = [
  [2, 2, -5],      // Welcome section
  [-3, 1.5, -5],   // About section
  [-1, -1, -5],    // Skills section
  [2, -1.5, -5],   // Projects section
  [0, -3, -5],     // Contact section
];

// Navigation section data
export const navSections = [
  { id: 'welcome', label: 'Home', position: pathPoints[0], color: '#10b981' },
  { id: 'about', label: 'About', position: pathPoints[1], color: '#3b82f6' },
  { id: 'skills', label: 'Skills', position: pathPoints[2], color: '#f97316' },
  { id: 'projects', label: 'Projects', position: pathPoints[3], color: '#8b5cf6' },
  { id: 'contact', label: 'Contact', position: pathPoints[4], color: '#ec4899' },
];

// NavNode component - the interactive hotspots on the path
const NavNode = ({ section, isActive, onClick, distanceFromCamera }) => {
  const nodeRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  // Animation for node scaling and glowing
  const { scale, intensity, emissive } = useSpring({
    scale: hovered ? 1.3 : isActive ? 1.2 : 1,
    intensity: hovered ? 0.8 : isActive ? 0.6 : 0.3,
    emissive: hovered || isActive ? section.color : '#333333',
    config: { mass: 1, tension: 280, friction: 60 }
  });
  
  // Hover animations
  useFrame((state, delta) => {
    if (nodeRef.current) {
      // Gentle floating effect
      nodeRef.current.position.y += Math.sin(state.clock.elapsedTime * 2 + nodeRef.current.position.x) * 0.002;
      
      // Slow rotation
      nodeRef.current.rotation.y += delta * 0.3;
    }
  });
  
  // Show label based on distance from camera (only when close enough)
  const labelVisible = distanceFromCamera < 15 || hovered;
  
  return (
    <animated.group position={section.position} scale={scale}>
      {/* Interactive node */}
      <mesh 
        ref={nodeRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
      >
        <sphereGeometry args={[0.3, 16, 16]} />
        <animated.meshStandardMaterial 
          color={section.color}
          emissive={emissive}
          emissiveIntensity={intensity}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Label */}
      {labelVisible && (
        <Html
          position={[0, 0.6, 0]}
          center
          distanceFactor={10}
        >
          <div className={`
            px-2 py-1 rounded-md text-sm text-white font-medium
            transition-all duration-300 transform 
            ${hovered ? 'scale-110' : 'scale-100'}
            backdrop-blur-sm bg-black/50 border border-${section.color}/30
          `}>
            {section.label}
          </div>
        </Html>
      )}
    </animated.group>
  );
};

// Emerald spline that connects the nav nodes
const PathSpline = ({ activeNodeIndex }) => {
  const lineRef = useRef();
  const color = useMemo(() => new THREE.Color('#10b981'), []);
  
  // More bright at the active node location
  useFrame(() => {
    if (lineRef.current) {
      const colors = lineRef.current.geometry.attributes.color;
      const point = pathPoints.length > 0 ? activeNodeIndex / (pathPoints.length - 1) : 0;
      
      // Spread brightness along the path
      for (let i = 0; i < colors.count; i++) {
        const alpha = i / (colors.count - 1);
        const distance = Math.abs(alpha - point);
        const intensity = Math.max(0.2, 1 - distance * 2);
        
        color.setRGB(0.062 * intensity, 0.725 * intensity, 0.506 * intensity);
        colors.setXYZ(i, color.r, color.g, color.b);
      }
      
      colors.needsUpdate = true;
    }
  });
  
  return (
    <CatmullRomLine
      ref={lineRef}
      points={pathPoints}
      color={color}
      lineWidth={5}
      transparent
      opacity={0.7}
      worldUnits
      tension={0.5}
    />
  );
};

// Main NavigationPath component
const NavigationPath = ({ activeSection, onNavigate }) => {
  const { camera } = useThree();
  const groupRef = useRef();
  const [distances, setDistances] = useState(Array(navSections.length).fill(0));
  
  // Calculate active node index for path highlighting
  const activeNodeIndex = navSections.findIndex(section => section.id === activeSection);
  
  // Update distances from camera to determine label visibility
  useFrame(() => {
    if (groupRef.current) {
      const newDistances = navSections.map((section, index) => {
        const position = new THREE.Vector3(...section.position);
        return camera.position.distanceTo(position);
      });
      
      setDistances(newDistances);
    }
  });
  
  // Handle node click - navigate to section
  const handleNodeClick = (sectionId) => {
    onNavigate(sectionId);
  };
  
  return (
    <group ref={groupRef}>
      {/* Connecting path */}
      <PathSpline activeNodeIndex={activeNodeIndex >= 0 ? activeNodeIndex : 0} />
      
      {/* Navigation nodes */}
      {navSections.map((section, index) => (
        <NavNode
          key={section.id}
          section={section}
          isActive={section.id === activeSection}
          onClick={() => handleNodeClick(section.id)}
          distanceFromCamera={distances[index]}
        />
      ))}
    </group>
  );
};

export default NavigationPath; 