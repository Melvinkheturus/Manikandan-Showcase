import React from 'react';
import HeroSection from './HeroSection';
import AboutSection from './AboutSection';
import SkillsSection from './SkillsSection';
import ExperienceSection from './ExperienceSection';
import TestimonialSection from './TestimonialSection';
import FooterContactSection from './FooterContactSection';
import ProjectShowcaseSection from './ProjectShowcaseSection';
import SocialGlimpseCarousel from '../portfolio/components/social/SocialGlimpseCarousel';
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
      
      {/* Social Glimpse Carousel */}
      <SocialGlimpseCarousel />
      
      {/* Footer Contact Section */}
      <FooterContactSection />
    </motion.div>
  );
};

export default MainSection; 