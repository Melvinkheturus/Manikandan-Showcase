import React from 'react';
import { motion } from 'framer-motion';
import SectionWrapper from '../components/SectionWrapper';
import WelcomeSection from '../sections/WelcomeSection';
import ProjectsSection from '../sections/ProjectsSection';
import SkillConstellation from '../components/SkillConstellation';
import ParticleBurst from '../components/ParticleBurst';

export default function Home() {
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="flex flex-col">
      {/* Welcome/Hero Section */}
      <SectionWrapper id="welcome">
        <WelcomeSection />
      </SectionWrapper>
      
      {/* About Section */}
      <SectionWrapper id="about" alignment="start">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="w-full max-w-4xl mx-auto p-8"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold mb-6 text-white"
          >
            About Me
          </motion.h2>
          
          <motion.div 
            variants={itemVariants}
            className="w-20 h-1 bg-primary mb-8"
          />
          
          <motion.p 
            variants={itemVariants}
            className="text-lg mb-6 text-gray-300"
          >
            I'm a passionate full stack developer specializing in creating immersive digital experiences 
            with modern web technologies. With a focus on both frontend and backend development, I build 
            applications that are not only visually stunning but also performant and scalable.
          </motion.p>
          
          <motion.p 
            variants={itemVariants}
            className="text-lg mb-8 text-gray-300"
          >
            My expertise includes React, Node.js, Three.js for 3D visualizations, and modern UI/UX design principles. 
            I'm constantly exploring new technologies and techniques to enhance user experiences.
          </motion.p>
          
          <ParticleBurst>
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap gap-4"
            >
              <motion.a
                href="/Manikandan_S_Resume.pdf"
                download
                className="px-6 py-3 bg-primary text-black font-semibold rounded-full shadow-lg hover:bg-primary/90 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Download Resume
              </motion.a>
              
              <motion.a
                href="#contact"
                className="px-6 py-3 border-2 border-primary text-primary rounded-full hover:bg-primary hover:text-black transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Let's Connect
              </motion.a>
            </motion.div>
          </ParticleBurst>
        </motion.div>
      </SectionWrapper>
      
      {/* Skills Section */}
      <SectionWrapper id="skills">
        <SkillConstellation />
      </SectionWrapper>
      
      {/* Projects Section */}
      <SectionWrapper id="projects">
        <ProjectsSection />
      </SectionWrapper>
      
      {/* Contact Section */}
      <SectionWrapper id="contact">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="w-full max-w-3xl mx-auto p-8 text-center"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold mb-6 text-white"
          >
            Get In Touch
          </motion.h2>
          
          <motion.div 
            variants={itemVariants}
            className="w-20 h-1 bg-primary mx-auto mb-8"
          />
          
          <motion.p 
            variants={itemVariants}
            className="text-lg mb-8 text-gray-300"
          >
            Have a project in mind or want to discuss collaboration opportunities? 
            Feel free to reach out and I'll get back to you as soon as possible.
          </motion.p>
          
          <motion.form 
            variants={itemVariants}
            className="flex flex-col gap-4 w-full"
          >
            <input 
              type="text" 
              placeholder="Your Name" 
              className="p-3 rounded-lg border border-gray-700 bg-transparent text-white placeholder:text-gray-400"
            />
            <input 
              type="email" 
              placeholder="Your Email" 
              className="p-3 rounded-lg border border-gray-700 bg-transparent text-white placeholder:text-gray-400"
            />
            <textarea 
              placeholder="Your Message" 
              rows={4}
              className="p-3 rounded-lg border border-gray-700 bg-transparent text-white placeholder:text-gray-400 resize-none"
            />
            <motion.button
              type="submit"
              className="px-6 py-3 bg-primary text-black font-semibold rounded-full shadow-lg hover:bg-primary/90 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Send Message
            </motion.button>
          </motion.form>
        </motion.div>
      </SectionWrapper>

      {/* Add padding at the bottom to prevent footer overlap */}
      <div className="h-16"></div>
    </div>
  );
} 