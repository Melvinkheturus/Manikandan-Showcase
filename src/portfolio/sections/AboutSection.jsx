import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, useSpring } from 'framer-motion';
import { FaFileDownload, FaEnvelope, FaLinkedin, FaGithub, FaInstagram, FaDribbble } from 'react-icons/fa';
import { SiMiro, SiNotion, SiFigma, SiFramer } from 'react-icons/si';
import SkillsMarquee from '../components/skills/SkillsMarquee';

const AboutSection = () => {
  // Refs for scrollable sections
  const introRef = useRef(null);
  const whoRef = useRef(null);
  const toolkitRef = useRef(null);
  const socialRef = useRef(null);

  // InView animations
  const [introInView, setIntroInView] = React.useState(false);
  const [whoInView, setWhoInView] = React.useState(false);
  const [toolkitInView, setToolkitInView] = React.useState(false);
  const [socialInView, setSocialInView] = React.useState(false);

  // Scroll progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Title animation
  const [titleIndex, setTitleIndex] = React.useState(0);
  const titles = [
    "AI-Native Maker",
    "UI/UX Designer",
    "Frontend Developer",
    "Creative Technologist"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex((prevIndex) => (prevIndex + 1) % titles.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Hero Intro and Who I Am Combined Section */}
      <section 
        ref={introRef}
        className="min-h-screen flex flex-col items-center relative overflow-hidden snap-start"
        onViewportEnter={() => setIntroInView(true)}
      >
        {/* Meet the Creator Section - Moved up */}
        <div className="container mx-auto px-4 pt-32 pb-8 text-center z-10">
          <motion.div 
            className="overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="mb-8">
              <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                MEET THE CREATOR
              </span>
            </div>
            
            <div className="h-8 sm:h-10 overflow-hidden relative mb-8">
              <motion.div
                animate={{ y: titleIndex * -40 }}  
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center"
              >
                {titles.map((title, index) => (
                  <div 
                    key={index} 
                    className="h-8 sm:h-10 flex items-center justify-center font-medium text-lg sm:text-xl text-white/90"
                  >
                    {title}
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
          
          {/* Arrow Only - No Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-12"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex flex-col items-center"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 4L12 20M12 20L6 14M12 20L18 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Who I Am Section - Directly below Meet the Creator */}
        <div className="container mx-auto px-4 max-w-4xl mt-0" ref={whoRef}>
          <div className="relative">
            <motion.div 
              className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 0.6, scale: 1 }}
              transition={{ duration: 1.5 }}
              viewport={{ once: true, margin: "-100px" }}
            />
            
            <motion.div
              className="mb-20"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-8">Who I Am</h2>
              <p className="text-xl leading-relaxed text-white/80 mb-6">
                I design intuitive digital experiences and build what I imagine using the power of AI.
              </p>
              <p className="text-lg leading-relaxed text-white/70">
                With a sharp eye for design and a future-forward mindset, I bridge the gap between ideas and execution—crafting interfaces that are not just beautiful, but purposeful.
              </p>
            </motion.div>
          </div>
        </div>
        
        {/* Background Pulse Effect */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-black/10 via-primary/5 to-black/10 z-0"
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </section>

      {/* The Toolkit Marquee (Live Section) - Moved up before Let's Connect */}
      <section 
        ref={toolkitRef}
        className="py-24 relative overflow-hidden"
      >
        <div className="container mx-auto px-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">My Toolkit</h2>
            <div className="w-20 h-1 bg-primary"></div>
            <p className="mt-4 text-white/70 max-w-2xl">
              A continuous flow of technologies and creative disciplines that shape my work
            </p>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true, margin: "-100px" }}
          className="w-full overflow-hidden"
        >
          <SkillsMarquee />
        </motion.div>
      </section>

      {/* Social + Resume Panel */}
      <section
        ref={socialRef}
        className="min-h-screen py-20 flex flex-col items-center justify-center relative"
      >
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Let's Connect</h2>
            <div className="w-20 h-1 bg-primary mx-auto"></div>
          </motion.div>
          
          {/* Social Icons */}
          <div className="flex justify-center flex-wrap gap-8 mb-16">
            {[
              { icon: <FaGithub size={24} />, name: "GitHub", link: "#", delay: 0 },
              { icon: <FaLinkedin size={24} />, name: "LinkedIn", link: "#", delay: 0.1 },
              { icon: <FaInstagram size={24} />, name: "Instagram", link: "#", delay: 0.2 },
              { icon: <FaDribbble size={24} />, name: "Dribbble", link: "#", delay: 0.3 },
              { icon: <FaEnvelope size={24} />, name: "Email", link: "mailto:example@example.com", delay: 0.4 }
            ].map((social, index) => (
              <motion.a
                key={social.name}
                href={social.link}
                className="bg-white/5 hover:bg-white/10 backdrop-blur-sm text-white hover:text-primary transition-colors rounded-lg p-4 relative group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: social.delay }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ scale: 1.1 }}
              >
                {social.icon}
                <motion.div
                  className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-3 py-1 rounded text-xs opacity-0 group-hover:opacity-100"
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                >
                  {social.name}
                </motion.div>
              </motion.a>
            ))}
          </div>
          
          {/* Download Resume Button */}
          <motion.div
            className="relative group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
            whileHover={{ scale: 1.05 }}
          >
            <a 
              href="/assets/resume.pdf" 
              download 
              className="bg-primary text-black font-medium rounded-full px-8 py-4 inline-flex items-center gap-2 group-hover:bg-primary/90 transition-all duration-300"
            >
              <FaFileDownload className="group-hover:rotate-12 transition-transform" />
              <span>Download Resume</span>
            </a>
            
            {/* Download Animation */}
            <motion.div 
              className="absolute -bottom-8 left-0 right-0 text-center text-sm text-white/60 opacity-0 group-hover:opacity-100"
              initial={{ opacity: 0, y: -10 }}
              whileHover={{ opacity: 1, y: 0 }}
            >
              Click to download
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutSection; 