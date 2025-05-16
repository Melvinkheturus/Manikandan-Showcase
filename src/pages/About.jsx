import React from 'react';
import { motion } from 'framer-motion';
import { Parallax } from 'react-scroll-parallax';
import { FaDribbble, FaBehance, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';
import SkillConstellation from '../components/SkillConstellation';
import ParticleBurst from '../components/ParticleBurst';
import { useTheme } from '../context/ThemeContext';

// NOTE: Add your resume file at: public/Manikandan_S_Resume.pdf
// If you don't have a PDF ready, you can create one using tools like Canva, Resume.com, or MS Word

export default function About() {
  const { theme } = useTheme();
  
  // Social media links
  const socialLinks = [
    { icon: FaGithub, url: 'https://github.com/yourusername', label: 'GitHub' },
    { icon: FaLinkedin, url: 'https://linkedin.com/in/yourusername', label: 'LinkedIn' },
    { icon: FaDribbble, url: 'https://dribbble.com/yourusername', label: 'Dribbble' },
    { icon: FaBehance, url: 'https://behance.net/yourusername', label: 'Behance' },
    { icon: FaInstagram, url: 'https://instagram.com/yourusername', label: 'Instagram' },
  ];
  
  return (
    <div className="min-h-screen">
      {/* About Me Section */}
      <ParticleBurst>
        <section className="py-20">
          <div className="container mx-auto px-4">
            <Parallax speed={5}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-12"
              >
                <h1 className="text-3xl md:text-5xl font-bold mb-4">About Me</h1>
                <div className="w-20 h-1 bg-primary mx-auto"></div>
              </motion.div>
            </Parallax>
            
            <div className="flex flex-col md:flex-row items-center gap-10">
              {/* Profile Image */}
              <Parallax speed={-5} className="w-full md:w-1/3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative rounded-xl overflow-hidden shadow-xl"
                >
                  <img
                    src="/path-to-your-photo.jpg" // Add your profile image
                    alt="Manikandan S"
                    className="w-full h-auto rounded-xl"
                  />
                  <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </motion.div>
              </Parallax>
              
              {/* Bio */}
              <div className="w-full md:w-2/3">
                <Parallax speed={2} className="mb-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Full Stack Developer & UI/UX Enthusiast</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                      I'm a passionate developer specializing in creating immersive digital experiences with modern web technologies.
                      With a focus on both frontend and backend development, I build applications that are not only visually stunning
                      but also performant and scalable.
                    </p>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                      My expertise includes React, Node.js, Three.js for 3D visualizations, and modern UI/UX design principles.
                      I'm constantly exploring new technologies and techniques to enhance user experiences.
                    </p>
                  </motion.div>
                </Parallax>
                
                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="flex flex-wrap gap-4 mb-8"
                >
                  <motion.a
                    href="/Manikandan_S_Resume.pdf"
                    download
                    className="px-6 py-3 bg-primary text-white font-semibold rounded-full shadow-lg hover:bg-primary/90 transition-all"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: `0 0 20px ${theme === 'dark' ? 'rgba(16, 185, 129, 0.5)' : 'rgba(16, 185, 129, 0.3)'}` 
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Download Resume
                  </motion.a>
                  <motion.a
                    href="#contact"
                    className="px-6 py-3 border-2 border-primary text-primary rounded-full hover:bg-primary hover:text-white transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Let's Connect
                  </motion.a>
                </motion.div>
                
                {/* Social Links */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <h3 className="text-lg font-semibold mb-4">Connect With Me</h3>
                  <div className="flex flex-wrap gap-4">
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 border-2 border-primary rounded-full text-primary hover:bg-primary hover:text-white transition-colors"
                        whileHover={{ scale: 1.2 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.7 + (index * 0.1) }}
                        aria-label={social.label}
                      >
                        <social.icon size={20} />
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </ParticleBurst>
      
      {/* Skills Section */}
      <SkillConstellation />
      
      {/* Fixed Resume Button */}
      <motion.a
        href="/Manikandan_S_Resume.pdf"
        download
        className="fixed top-24 right-4 bg-primary p-3 rounded-full shadow-lg z-10 hidden md:block"
        whileHover={{ scale: 1.1, boxShadow: `0 0 15px ${theme === 'dark' ? 'rgba(16, 185, 129, 0.5)' : 'rgba(16, 185, 129, 0.3)'}` }}
        aria-label="Download Resume"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </motion.a>
    </div>
  );
} 