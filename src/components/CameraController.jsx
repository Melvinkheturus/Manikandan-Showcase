import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { navSections } from './NavigationPath';

// Camera target positions for each section
const cameraPositions = {
  welcome: { position: [2, 2, 0], target: [2, 2, -5] },
  about: { position: [-3, 1.5, 0], target: [-3, 1.5, -5] },
  skills: { position: [-1, -1, 0], target: [-1, -1, -5] },
  projects: { position: [2, -1.5, 0], target: [2, -1.5, -5] },
  contact: { position: [0, -3, 0], target: [0, -3, -5] },
};

// Easing function for smooth camera movement
const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

const CameraController = ({ activeSection }) => {
  const { camera } = useThree();
  const controlsRef = useRef();
  
  // Animation state
  const animationRef = useRef({
    inProgress: false,
    startTime: 0,
    duration: 2, // seconds
    startPosition: new THREE.Vector3(),
    targetPosition: new THREE.Vector3(),
    startLookAt: new THREE.Vector3(),
    targetLookAt: new THREE.Vector3(),
  });
  
  // Start a new camera animation
  const startCameraAnimation = (targetSection) => {
    const targetConfig = cameraPositions[targetSection];
    if (!targetConfig) return;
    
    const animation = animationRef.current;
    animation.inProgress = true;
    animation.startTime = Date.now();
    
    // Store current camera position/rotation
    animation.startPosition.copy(camera.position);
    
    // Calculate current lookAt point
    const startLookAt = new THREE.Vector3(0, 0, -1);
    startLookAt.applyQuaternion(camera.quaternion);
    startLookAt.add(camera.position);
    animation.startLookAt.copy(startLookAt);
    
    // Set target position and lookAt
    animation.targetPosition.set(...targetConfig.position);
    animation.targetLookAt.set(...targetConfig.target);
  };
  
  // Animate camera when activeSection changes
  useEffect(() => {
    if (activeSection && cameraPositions[activeSection]) {
      startCameraAnimation(activeSection);
    }
  }, [activeSection]);
  
  // Camera animation frame
  useFrame(() => {
    const animation = animationRef.current;
    
    if (animation.inProgress) {
      const elapsed = (Date.now() - animation.startTime) / 1000;
      const progress = Math.min(elapsed / animation.duration, 1);
      const easedProgress = easeOutCubic(progress);
      
      // Interpolate position
      const newPosition = new THREE.Vector3().lerpVectors(
        animation.startPosition,
        animation.targetPosition,
        easedProgress
      );
      
      // Interpolate lookAt
      const newLookAt = new THREE.Vector3().lerpVectors(
        animation.startLookAt,
        animation.targetLookAt,
        easedProgress
      );
      
      // Apply new position
      camera.position.copy(newPosition);
      
      // Apply new lookAt
      camera.lookAt(newLookAt);
      
      // Animation complete
      if (progress >= 1) {
        animation.inProgress = false;
      }
    }
  });
  
  return null; // This component doesn't render anything
};

export default CameraController; 