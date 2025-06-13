import React from 'react';
import HeroSection from '../../sections/HeroSection';
import AboutSection from '../../sections/AboutSection';
import SkillsSection from '../../sections/SkillsSection';
import ExperienceSection from '../../sections/ExperienceSection';
import TestimonialSection from '../../sections/TestimonialSection';
import FooterContactSection from '../../sections/FooterContactSection';
import ProjectShowcaseSection from '../../sections/ProjectShowcaseSection';
import { motion } from 'framer-motion';

const MainSection = () => {
  return (
    <motion.div className="relative flex flex-col">
      {/* Hero Section */}
      <HeroSection />
      
      {/* About Section */}
      <AboutSection />
      
      {/* Skills Section */}
      <SkillsSection />
      
      {/* Project Showcase Section */}
      <ProjectShowcaseSection />
      
      {/* Experience Section */}
      <ExperienceSection />
      
      {/* Testimonial Section */}
      <TestimonialSection />
      
      {/* Footer Contact Section */}
      <FooterContactSection />
    </motion.div>
  );
};

export default MainSection; 