import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';
import React from 'react';

const ParticleField = () => {
  const ref = useRef();
  
  // Create particles once with useMemo to avoid recreation on re-renders
  const sphere = useMemo(() => {
    // Reduced particle count for better performance
    return random.inSphere(new Float32Array(1500), { radius: 1.5 });
  }, []);

  useFrame((state, delta) => {
    // More efficient way to handle rotation with less work per frame
    if (ref.current) {
      ref.current.rotation.x -= delta / 20;
      ref.current.rotation.y -= delta / 25;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={true}>
        <PointMaterial
          transparent
          color="#00FF7F" // Primary emerald green
          size={0.004} // Slightly larger size to compensate for fewer particles
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.5}
        />
      </Points>
    </group>
  );
};

// Memoize the component to prevent unnecessary re-renders
const MemoizedParticleField = React.memo(ParticleField);

const ParticleEffect = () => {
  return (
    <div className="fixed inset-0 -z-10 opacity-70">
      <Canvas 
        camera={{ position: [0, 0, 1] }}
        dpr={[1, 1.5]} // Limit pixel ratio for performance
        performance={{ min: 0.5 }} // Add performance limiter
      >
        <MemoizedParticleField />
      </Canvas>
    </div>
  );
};

export default React.memo(ParticleEffect); 