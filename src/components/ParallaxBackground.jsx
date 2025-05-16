import React, { useRef, useEffect, useMemo } from 'react';
import { Parallax } from 'react-scroll-parallax';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTheme } from '../context/ThemeContext';
import * as THREE from 'three';

// Layer 1: Starfield/Gradient Mesh - Memoized for performance
const StarfieldLayer = React.memo(() => {
  const shaderRef = useRef();
  const { isDarkMode } = useTheme();
  
  // Define shaders once with useMemo to avoid recreation on re-renders
  const shaders = useMemo(() => {
    return {
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        varying vec2 vUv;
        
        // Simplex 2D noise
        vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy));
          vec2 x0 = v -   i + dot(i, C.xx);
          vec2 i1;
          i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod(i, 289.0);
          vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m ;
          m = m*m ;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }
        
        void main() {
          vec2 uv = vUv;
          
          // Create moving noise
          float noise1 = snoise(uv * 3.0 + uTime * 0.1);
          float noise2 = snoise(uv * 6.0 - uTime * 0.2);
          
          // Create stars effect
          float stars = step(0.97, snoise(uv * 100.0 + uTime * 0.05) * 0.5 + 0.5);
          
          // Mix colors using the noise
          vec3 color = mix(uColorA, uColorB, noise1 * 0.5 + 0.5);
          
          // Add subtle variation with second noise
          color += noise2 * 0.1;
          
          // Add stars
          color += stars * 0.3;
          
          // Make transparent to let the main gradient show through
          gl_FragColor = vec4(color, 0.3);
        }
      `
    };
  }, []);
  
  useFrame(({ clock }) => {
    if (shaderRef.current) {
      // Use less frequent updates for better performance
      shaderRef.current.uniforms.uTime.value = clock.getElapsedTime() * 0.05;
    }
  });
  
  // Memoize the colors to prevent unnecessary recalculations
  const colors = useMemo(() => {
    return {
      colorA: isDarkMode ? new THREE.Color(0x0a0f0d) : new THREE.Color(0xf9fafb),
      colorB: isDarkMode ? new THREE.Color(0x0a0f0d) : new THREE.Color(0xf9fafb)
    };
  }, [isDarkMode]);

  return (
    <mesh>
      <planeGeometry args={[50, 50]} />
      <shaderMaterial
        ref={shaderRef}
        vertexShader={shaders.vertexShader}
        fragmentShader={shaders.fragmentShader}
        transparent={true}
        uniforms={{
          uTime: { value: 0 },
          uColorA: { value: colors.colorA },
          uColorB: { value: colors.colorB },
        }}
      />
    </mesh>
  );
});

// Layer 2: Floating Shards - Optimized with fewer objects and better rendering performance
const FloatingShards = React.memo(() => {
  const groupRef = useRef();
  
  // Reduced count and memoized shard generation
  const count = 5; // Further reduced for better performance
  
  // Generate random positions for shards once
  const shardsData = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 8 - 5
      ],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ],
      scale: 0.2 + Math.random() * 0.8, // Smaller scale
      speed: 0.05 + Math.random() * 0.15  // Even slower movement
    }));
  }, []);
  
  // Individual shard component to improve performance
  const Shard = React.memo(({ position, rotation, scale, speed, color, emissive }) => {
    const meshRef = useRef();
    
    useFrame(({ clock }) => {
      if (meshRef.current) {
        const t = clock.getElapsedTime();
        // Rotate shard
        meshRef.current.rotation.x = rotation[0] + t * speed * 0.15;
        meshRef.current.rotation.y = rotation[1] + t * speed * 0.2;
        
        // Subtle floating movement
        meshRef.current.position.y = position[1] + Math.sin(t * speed) * 0.3;
      }
    });
    
    return (
      <mesh
        ref={meshRef}
        position={position}
        rotation={rotation}
        scale={scale}
      >
        <tetrahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={0.15}
          transparent={true}
          opacity={0.2}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>
    );
  });
  
  const { isDarkMode } = useTheme();
  const shardColor = isDarkMode ? '#0F1019' : '#F0F0F0';
  const emissiveColor = '#10b981';
  
  return (
    <group ref={groupRef}>
      {shardsData.map((shard, i) => (
        <Shard 
          key={i}
          position={shard.position}
          rotation={shard.rotation}
          scale={shard.scale}
          speed={shard.speed}
          color={shardColor}
          emissive={emissiveColor}
        />
      ))}
    </group>
  );
});

// Layer 3: SVG Wireframe Icons - Optimized with fewer elements
const WireframeIcons = React.memo(() => {
  // Reduced number of icons for better performance
  const icons = useMemo(() => [
    { path: "M5 5 L15 15 M5 15 L15 5", x: "15", y: "15" },
    { path: "M5 5 L15 5 L15 15 L5 15 Z", x: "75", y: "75" },
  ], []);
  
  const { isDarkMode } = useTheme();
  const strokeColor = isDarkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.15)';
  
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        {icons.map((icon, i) => (
          <g key={i} transform={`translate(${icon.x}, ${icon.y})`}>
            <path
              d={icon.path}
              stroke={strokeColor}
              strokeWidth="1"
              fill="none"
            />
          </g>
        ))}
      </svg>
    </div>
  );
});

// Main Component - Optimized with React.memo and code splitting
export default React.memo(function ParallaxBackground() {
  return (
    <div className="fixed inset-0 -z-10 w-full h-full overflow-hidden">
      {/* 3D Effects (most performance-intensive) with less detail */}
      <div className="absolute inset-0 w-full h-full">
        <Canvas 
          camera={{ position: [0, 0, 20], fov: 50 }}
          dpr={[1, 1.5]} // Limit pixel ratio for performance
          gl={{ 
            antialias: false, // Disable antialiasing for performance
            alpha: true,
            powerPreference: 'high-performance',
            depth: false
          }}
        >
          <StarfieldLayer />
          <FloatingShards />
        </Canvas>
      </div>
      
      {/* Static Decorative Elements */}
      <WireframeIcons />
    </div>
  );
}); 