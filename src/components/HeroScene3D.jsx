import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, useGLTF, PerspectiveCamera } from '@react-three/drei';
import { useTheme } from '../context/ThemeContext';

// Define a 3D text component for the monogram
const Monogram = () => {
  const textRef = useRef();
  const { theme } = useTheme();
  
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (textRef.current) {
      textRef.current.rotation.y = Math.sin(time * 0.3) * 0.2;
      textRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
    }
  });

  // Colors based on theme - using emerald for both themes
  const textColor = '#10b981';
  const emissiveColor = '#10b981';
  
  return (
    <Suspense fallback={null}>
      <group>
        {/* M Letter */}
        <Text
          ref={textRef}
          position={[-1, 0, 0]}
          fontSize={3}
          font="/fonts/Poppins-Bold.ttf"
          color={textColor}
          anchorX="center"
          anchorY="middle"
          material-emissive={emissiveColor}
          material-emissiveIntensity={0.5}
          material-metalness={0.8}
          material-roughness={0.1}
        >
          M
        </Text>
        
        {/* S Letter */}
        <Text
          position={[1, 0, 0]}
          fontSize={3}
          font="/fonts/Poppins-Bold.ttf"
          color={textColor}
          anchorX="center"
          anchorY="middle"
          material-emissive={emissiveColor}
          material-emissiveIntensity={0.5}
          material-metalness={0.8}
          material-roughness={0.1}
          rotation={[0, Math.PI * 0.05, 0]}
        >
          S
        </Text>
      </group>
    </Suspense>
  );
};

// HUD display for tagline
const HudDisplay = ({ text }) => {
  const hudColor = '#10b981'; // Emerald color
  
  return (
    <group position={[0, -3, 0]}>
      <Text
        fontSize={0.5}
        color={hudColor}
        anchorX="center"
        anchorY="middle"
        material-toneMapped={false}
        maxWidth={10}
        lineHeight={1.2}
        font="/fonts/Poppins-Light.ttf"
      >
        {text}
      </Text>
    </group>
  );
};

export default function HeroScene3D({ tagline = "Full Stack Developer & UI/UX Enthusiast" }) {
  return (
    <div className="w-full h-[50vh] md:h-[60vh]">
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 50 }}
        dpr={[1, 2]}
      >
        {/* Make background fully transparent */}
        <color attach="background" args={['transparent']} />
        
        {/* Adjust fog to be subtle and match theme */}
        <fog
          attach="fog"
          args={[
            '#000000',
            8,
            20
          ]}
        />
        
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={0.5} />
        <spotLight position={[0, 10, 0]} intensity={0.3} />
        
        <group position={[0, 0, 0]}>
          <Monogram />
          <HudDisplay text={tagline} />
        </group>
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
          dampingFactor={0.05}
          rotateSpeed={0.15}
        />
      </Canvas>
    </div>
  );
} 