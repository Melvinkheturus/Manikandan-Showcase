import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';

// Project Detail Empty State - "Still in the Lab"
export const ProjectDetailEmpty = () => {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    // Generate random particles for animation
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 6,
      duration: 2 + Math.random() * 3,
      delay: Math.random()
    }));
    
    setParticles(newParticles);
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-black/40 backdrop-blur-md border border-primary-500/20 rounded-xl p-8 text-center relative overflow-hidden">
        {/* Animated particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute bg-primary-500 rounded-full opacity-60"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* Test tube container */}
        <motion.div
          className="w-28 h-28 mx-auto mb-6 relative"
          initial={{ rotateZ: -5 }}
          animate={{ rotateZ: 5 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-24 bg-primary-900/20 backdrop-blur-sm rounded-b-full border-2 border-primary-500/50 overflow-hidden">
            <motion.div 
              className="absolute bottom-0 w-full h-3/5 bg-gradient-to-t from-primary-500 to-primary-400"
              animate={{ 
                height: ["60%", "65%", "60%"],
                y: [0, -5, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            />
            
            {/* Bubbles */}
            {[1, 2, 3].map(i => (
              <motion.div
                key={i}
                className="absolute bottom-2 left-1/2 w-2 h-2 bg-white rounded-full opacity-60"
                style={{ left: `${15 + i * 20}%` }}
                animate={{ 
                  y: [0, -40],
                  opacity: [0.7, 0] 
                }}
                transition={{ 
                  duration: 2 - i * 0.3,
                  repeat: Infinity,
                  delay: i * 0.6
                }}
              />
            ))}
          </div>
        </motion.div>

        <motion.h2
          className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary-400 to-blue-400 bg-clip-text text-transparent relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          🧪 Cooking Something Awesome...
        </motion.h2>
        
        <motion.p
          className="text-gray-300 mb-6 max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          This project's detail page is still brewing in the lab.
          Come back soon to see the magic unfold.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link 
            to="/projects" 
            className="inline-flex items-center px-5 py-2 bg-primary-700/70 hover:bg-primary-600/70 text-white rounded-md transition-all duration-300"
          >
            <FiArrowLeft className="mr-2" /> 
            Back to All Projects
          </Link>
        </motion.div>
        
        {/* Background code effect */}
        <div className="absolute inset-0 -z-10 overflow-hidden opacity-10">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="text-xs text-primary-500 absolute whitespace-nowrap" style={{
              top: `${i * 10}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.5
            }}>
              {Array.from({ length: 5 }).map((_, j) => (
                <span key={j}>function compileProject() {{ }} const data = await lab.process(); </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Project Gallery Empty State - "Gallery Lights Off"
export const ProjectGalleryEmpty = ({ category }) => {
  const [frames, setFrames] = useState([]);
  
  useEffect(() => {
    // Generate frames for gallery wall
    const newFrames = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      width: 140 + Math.random() * 60,
      height: 100 + Math.random() * 80,
      x: -15 + Math.random() * 30,
      y: -15 + Math.random() * 30,
      rotation: -5 + Math.random() * 10,
      delay: i * 0.15
    }));
    
    setFrames(newFrames);
  }, []);
  
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Gallery frames */}
        <div className="relative h-52 mb-8">
          {frames.map((frame, i) => (
            <motion.div
              key={frame.id}
              className="absolute border-2 border-gray-500/30 rounded-md bg-gray-800/40 backdrop-blur-sm"
              style={{
                width: frame.width,
                height: frame.height,
                left: `calc(${i % 3 * 33}% + ${frame.x}px)`,
                top: i < 3 ? '0px' : '120px',
              }}
              initial={{ 
                opacity: 0,
                rotateZ: frame.rotation,
                x: frame.x * 3,
                y: frame.y * 3
              }}
              animate={{ 
                opacity: [0, 0.7, 0],
                x: [frame.x * 3, 0, frame.x * 3],
              }}
              transition={{
                duration: 8,
                delay: frame.delay,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut"
              }}
              whileHover={{
                opacity: 0.9,
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <span className="text-xs text-gray-300 bg-black/50 px-2 py-1 rounded">Coming Soon</span>
              </div>
            </motion.div>
          ))}
          
          {/* Spotlight effects */}
          {[1, 2, 3].map(i => (
            <motion.div 
              key={`light-${i}`}
              className="absolute w-20 h-20 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)',
                left: `${25 * i}%`,
                top: '40%',
              }}
              animate={{ 
                opacity: [0, 0.6, 0],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{ 
                duration: 4, 
                delay: i * 0.8,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          ))}
        </div>

        <motion.h2
          className="text-3xl font-bold mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          🎨 Nothing Here Yet
        </motion.h2>
        
        <motion.p
          className="text-gray-300 mb-8 max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          This gallery wall is waiting for new masterpieces.
          {category && <span> No projects in <strong>{category}</strong> category yet.</span>}
          <br />Stay tuned, or check another category below.
        </motion.p>
      </div>
    </div>
  );
};

// 404 Page - "Page Lost in Space"
export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-gray-900 to-black overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        {/* Stars in background */}
        {Array.from({ length: 100 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
            animate={{ 
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{ 
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              repeatType: "reverse",
              delay: Math.random() * 2
            }}
          />
        ))}

        {/* Distant planets */}
        <motion.div 
          className="absolute w-32 h-32 rounded-full bg-purple-900/30 blur-xl"
          style={{ top: '60%', left: '15%' }}
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute w-16 h-16 rounded-full bg-blue-900/30 blur-lg"
          style={{ top: '30%', right: '20%' }}
          animate={{ y: [5, -5, 5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      
      <div className="max-w-xl w-full text-center relative z-10">
        <div className="relative mb-8">
          {/* Astronaut floating animation */}
          <motion.div
            className="relative w-40 h-40 mx-auto"
            animate={{ 
              y: [-10, 10, -10],
              rotate: [-5, 5, -5]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Broken data cable */}
              <motion.div
                className="absolute w-1 h-40 bg-red-500/70 right-0 top-[-50px]"
                style={{ transformOrigin: 'top' }}
                animate={{ 
                  scaleY: [1, 0.97, 1],
                  rotateZ: [-2, 2, -2]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <motion.div
                  className="absolute bottom-0 w-1 h-20 bg-red-500/70" 
                  style={{ transformOrigin: 'top' }}
                  animate={{ 
                    rotateZ: [0, -15, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <div className="absolute top-0 h-4 w-4 bg-red-500/70 rounded-full" />
                </motion.div>
                <div className="absolute top-0 h-4 w-4 bg-red-500/70 rounded-full" />
              </motion.div>
              
              {/* Astronaut svg or placeholder */}
              <div className="w-32 h-32 bg-gray-200 rounded-full relative flex items-center justify-center">
                <div className="absolute inset-2 bg-gray-800 rounded-full"></div>
                <div className="absolute inset-[18px] bg-gray-900 rounded-full flex items-center justify-center z-10">
                  <div className="text-5xl">👨‍🚀</div>
                </div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-20 h-24 bg-gray-200 rounded-xl -z-10"></div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.h1
            className="text-6xl font-bold mb-2 glitch-text"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <span className="bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">404</span>
          </motion.h1>
          
          <motion.h2
            className="text-2xl font-bold mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            🚫 Lost in the Source Code
          </motion.h2>
          
          <motion.p
            className="text-gray-300 mb-8 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            Looks like this page is floating in a black hole.
            The coordinates you're looking for don't exist in this dimension.
          </motion.p>
          
          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
          >
            <Link
              to="/"
              className="px-6 py-3 bg-blue-600/80 hover:bg-blue-500/80 text-white rounded-md transition-colors glitch-hover"
            >
              Return to Homebase
            </Link>
            <Link
              to="/projects"
              className="px-6 py-3 bg-purple-600/80 hover:bg-purple-500/80 text-white rounded-md transition-colors glitch-hover"
            >
              Back to Project Gallery
            </Link>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Add glitch effects CSS */}
      <style jsx>{`
        .glitch-hover:hover {
          position: relative;
        }
        .glitch-hover:hover::before {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          background: inherit;
          color: inherit;
          clip-path: polygon(0 0, 100% 0, 100% 20%, 0 20%, 0 40%, 100% 40%, 100% 60%, 0 60%, 0 80%, 100% 80%, 100% 100%, 0 100%);
          animation: glitch 200ms infinite;
          z-index: -1;
        }
        @keyframes glitch {
          0% { transform: translate(0); }
          25% { transform: translate(-2px, 1px); }
          50% { transform: translate(1px, -1px); }
          75% { transform: translate(1px, 2px); }
          100% { transform: translate(0); }
        }
      `}</style>
    </div>
  );
}; 