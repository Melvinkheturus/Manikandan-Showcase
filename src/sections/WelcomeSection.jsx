import React, { useEffect } from 'react';
import { motion, useAnimate, stagger } from 'framer-motion';
import { Parallax } from 'react-scroll-parallax';
import ParticleBurst from '../components/ParticleBurst';
import { useTheme } from '../context/ThemeContext';
import SplineModel from '../components/SplineModel';

const WelcomeSection = () => {
  const { theme } = useTheme();
  const [scope, animate] = useAnimate();
  
  // Staggered animation sequence for initial reveal
  useEffect(() => {
    const sequence = [
      [
        'h1', 
        { opacity: [0, 1], y: [30, 0] }, 
        { duration: 0.8, delay: 0.2 }
      ],
      [
        'h2', 
        { opacity: [0, 1], y: [20, 0] }, 
        { duration: 0.7, delay: 0.1 }
      ],
      [
        '.cta-button', 
        { opacity: [0, 1], y: [20, 0] },
        { duration: 0.6, delay: stagger(0.1) }
      ],
      [
        '.particle', 
        { opacity: [0, 0.3], scale: [0, 1] },
        { duration: 0.8, delay: stagger(0.05) }
      ],
      [
        '.spline-container', 
        { opacity: [0, 1] },
        { duration: 1.2, delay: 0.5 }
      ]
    ];
    
    animate(sequence);
  }, [animate]);
  
  return (
    <ParticleBurst>
      <section id="welcome" className="relative min-h-screen flex items-center justify-center pt-10 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-center mt-8 md:mt-16">
            {/* Text Content - Left Side */}
            <Parallax speed={5} className="w-full md:w-1/2 text-center md:text-left mb-10 md:mb-0">
              <motion.div
                ref={scope}
                className="max-w-3xl mx-auto md:mx-0"
              >
                <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white opacity-0">
                  <span className="block">Hi, I'm</span> 
                  <span className="text-primary">Manikandan</span>
                </h1>
                <h2 className="text-xl md:text-2xl mb-6 text-gray-400 opacity-0">
                  Full Stack Developer & UI/UX Enthusiast
                </h2>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <motion.a
                    href="/Manikandan_S_Resume.pdf"
                    download
                    className="cta-button px-6 py-3 bg-primary text-black rounded-lg shadow-lg hover:bg-primary/90 transition-all opacity-0"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: `0 0 20px rgba(16, 185, 129, 0.5)`
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Download Resume
                  </motion.a>
                  <motion.a
                    href="#contact"
                    className="cta-button px-6 py-3 border-2 border-primary text-primary bg-transparent rounded-lg shadow-lg hover:bg-primary hover:text-black transition-all opacity-0"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Let's Connect
                  </motion.a>
                </div>
              </motion.div>
            </Parallax>
            
            {/* Spline 3D Model - Right Side */}
            <motion.div 
              className="w-full md:w-1/2 h-[350px] overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.5 }}
              style={{ pointerEvents: 'none' }}
            >
              <div className="spline-wrapper" style={{ 
                pointerEvents: 'none', 
                touchAction: 'none',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <SplineModel url="https://prod.spline.design/m6MK6t0DUTSCmAvU/scene.splinecode" />
              </div>
            </motion.div>
          </div>
              
          {/* Optional floating emerald particles for visual interest */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 pointer-events-none hidden md:block">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="particle absolute bg-primary rounded-full opacity-0"
                style={{
                  width: `${Math.random() * 15 + 5}px`,
                  height: `${Math.random() * 15 + 5}px`,
                  right: `${Math.random() * 300}px`,
                  top: `${Math.random() * 300 - 150}px`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                  delay: i * 0.5,
                }}
              />
            ))}
          </div>
        </div>
      </section>
    </ParticleBurst>
  );
};

export default WelcomeSection; 