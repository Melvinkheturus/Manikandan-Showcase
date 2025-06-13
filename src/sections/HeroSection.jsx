import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { FaInstagram, FaLinkedin, FaYoutube, FaDribbble, FaMediumM, FaGithub, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Social Media Icons component
const SocialIcons = () => {
  // Social media links
  const socialLinks = [
    { id: 'instagram', icon: <FaInstagram size={20} />, url: '#', color: 'hover:text-pink-500' },
    { id: 'dribbble', icon: <FaDribbble size={20} />, url: '#', color: 'hover:text-pink-400' },
    { id: 'youtube', icon: <FaYoutube size={20} />, url: '#', color: 'hover:text-red-500' },
    { id: 'linkedin', icon: <FaLinkedin size={20} />, url: '#', color: 'hover:text-blue-500' },
    { id: 'github', icon: <FaGithub size={20} />, url: '#', color: 'hover:text-gray-300' },
  ];

  return (
    <motion.div
      className="flex items-center space-x-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.8 }}
    >
      {socialLinks.map((link) => (
        <motion.a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-white ${link.color} transition-all duration-300 hover:scale-110`}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.9 }}
        >
          {link.icon}
        </motion.a>
      ))}
    </motion.div>
  );
};

const HeroSection = () => {
  const controls = useAnimation();

  // Start with very dim opacity and animate to full brightness
  useEffect(() => {
    const startAnimation = async () => {
      // Make sure the animation starts immediately
      await controls.start({
        opacity: [0.2, 1],
        filter: ["brightness(0.2)", "brightness(1)"],
        transition: { duration: 1, ease: "easeOut" }
      });
    };
    
    startAnimation();
  }, [controls]);

  // Function for gradient text hover effect
  const handleTextHoverIn = (e) => {
    // Create a smooth transition from white to transparent
    const elem = e.currentTarget;
    let opacity = 1;
    const fadeInterval = setInterval(() => {
      opacity -= 0.05;
      if (opacity <= 0) {
        clearInterval(fadeInterval);
        elem.style.WebkitTextFillColor = 'transparent';
        return;
      }
      // Set the text fill color with changing opacity
      elem.style.WebkitTextFillColor = `rgba(255, 255, 255, ${opacity})`;
    }, 20);
  };

  const handleTextHoverOut = (e) => {
    // Create a smooth transition from transparent to white
    const elem = e.currentTarget;
    let opacity = 0;
    const fadeInterval = setInterval(() => {
      opacity += 0.05;
      if (opacity >= 1) {
        clearInterval(fadeInterval);
        elem.style.WebkitTextFillColor = 'white';
        return;
      }
      // Set the text fill color with changing opacity
      elem.style.WebkitTextFillColor = `rgba(255, 255, 255, ${opacity})`;
    }, 20);
  };

  // Gradient text style
  const gradientTextStyle = {
    color: 'white',
    background: 'linear-gradient(180deg, #b084f9 0%, #8e6fff 50%, #9868ff 70%, #8143ff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'white',
    display: 'inline-block',
    transition: 'all 0.8s ease-in-out',
  };

  return (
    <motion.section 
      id="hero"
      className="h-screen w-full relative overflow-hidden flex flex-col items-center justify-center"
      initial={{ opacity: 0.2, filter: "brightness(0.2)" }}
      animate={controls}
    >
      {/* Full-width transparent to black gradient overlay - positioned above everything */}
      <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-full z-10 pointer-events-none">
        <div 
          className="absolute inset-0 w-full h-full" 
          style={{
            backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.9) 100%)',
            pointerEvents: 'none'
          }}
        ></div>
      </div>
      
      {/* Logo - Added to hero section */}
      <div className="fixed top-6 left-6 z-40">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/" className="block">
            <img src="/assets/Logo.png" alt="Manikandan" className="h-12 w-auto" />
          </Link>
        </motion.div>
      </div>
      
      {/* ===== DESKTOP LAYOUT (≥1024px) ===== */}
      <div className="hidden lg:block container mx-auto px-2 relative z-5 w-full">
        {/* Top area: email - now styled as a pill button */}
        <div className="absolute top-6 w-full text-center z-30">
          <a href="mailto:smk.manikandan.dev@gmail.com" className="text-sm hover:text-primary font-montserrat bg-background-50/70 px-4 py-1 rounded-full transition-colors hover:bg-background-100/80 border border-gray-800">
            smk.manikandan.dev@gmail.com
          </a>
        </div>
        
        {/* Social Media Icons - Added to desktop layout */}
        <div className="absolute top-6 right-6 z-30">
          <SocialIcons />
        </div>

        {/* Profile Image - Positioned higher and lower z-index */}
        <div className="absolute inset-0 z-0">
          <div className="h-full w-full flex items-start justify-center pt-16">
            <div className="relative">
              <img 
                src="/assets/Profile.png" 
                alt="Manikandan" 
                className="h-[380px] w-auto object-cover"
              />
            </div>
          </div>
        </div>
        
        {/* Text elements centered and moved down */}
        <div className="grid grid-cols-2 gap-20 pt-44 mb-8 z-20 relative">
          {/* Left Side - Job Title - Now left-aligned */}
          <div className="text-center max-w-[70%] ml-[26px]">  
            <h2 className="font-montserrat text-lg md:text-xl lg:text-1.5xl font-extrabold tracking-wider text-white">
              UI/UX DESIGNER &<br />
              CREATIVE TECHNOLOGIST
            </h2>
          </div>
          
          {/* Right Side - Tagline - Now right-aligned */}
          <div className="text-center mr-[-90px]">
            <p className="font-montserrat text-lg md:text-xl lg:text-1.5xl font-light text-white mb-6">
              Creating clarity in a<br />
              chaotic digital world
            </p>
            
            {/* Button centered under the tagline */}
            <div className="flex justify-center z-20 relative">
              <button className="flex items-center justify-center gap-2 border border-white text-white rounded-full px-5 py-2 text-sm hover:bg-white hover:text-black transition">
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2"/>
                  <path d="M10 6V14M10 14L6 10M10 14L14 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                SEE MY WORKS
              </button>
            </div>
          </div>
        </div>
        
        {/* Desktop Name with better spacing - moved back to bottom */}
        <div className="relative mt-16 mb-8 w-full text-center z-20">
          <div className="relative inline-block">
            {/* "Hi, I'm" text using Corinthia font */}
            <span 
              className="absolute -left-2 -top-14 z-10 corinthia-bold"
              style={{
                fontSize: '60px',
                color: 'white',
                transform: 'rotate(-2deg)',
                textShadow: '0 0 10px rgba(0, 255, 127, 0.4)'
              }}
            >
              Hi, i'm
            </span>
            
            {/* Arrow pointing from Hi I'm to profile image */}
            <img 
              src="/assets/Arrow.png" 
              alt="Arrow" 
              className="absolute -left-90 -top-40 h-[100px] w-auto z-60"
              style={{
                height: '160px',
                top: '-140px',
                left: '140px',
                transform: 'rotate(34deg) scaleX(1)',
                position: 'absolute'
              }}
            />
            
            <h1 
              className="font-montserrat text-6xl sm:text-7xl md:text-8xl lg:text-[140px] font-extrabold leading-none tracking-tighter hover:gradient-text"
              style={gradientTextStyle}
              onMouseOver={handleTextHoverIn}
              onMouseOut={handleTextHoverOut}
            >
              MANIKANDAN
            </h1>
          </div>
        </div>
      </div>
      
      {/* ===== TABLET LAYOUT (640px-1023px) ===== */}
      <div className="hidden sm:block lg:hidden container mx-auto px-6 relative z-5 w-full">
        {/* Email link at top */}
        <div className="w-full text-center mb-10 pt-8 relative z-20">
          <a href="mailto:smk.manikandan.dev@gmail.com" className="text-sm hover:text-primary font-montserrat bg-background-50/70 px-4 py-1 rounded-full transition-colors hover:bg-background-100/80 border border-gray-800">
            smk.manikandan.dev@gmail.com
          </a>
        </div>

        {/* Social Media Icons - Added to tablet layout */}
        <div className="w-full flex justify-center mb-6 relative z-20">
          <SocialIcons />
        </div>
        
        {/* Profile Image - Centered and sized appropriately for tablets - moved to z-0 */}
        <div className="relative flex justify-center mb-8 z-0">
          <div className="relative">
            <img 
              src="/assets/Profile.png" 
              alt="Manikandan" 
              className="h-[340px] w-auto object-cover mx-auto"
            />
            
            {/* "Hi, I'm" text with arrow - adjusted for tablet layout */}
            <div className="absolute left-[-30px] top-10">
              <span 
                className="corinthia-bold"
                style={{
                  fontSize: '50px',
                  color: 'white',
                  transform: 'rotate(-5deg)',
                  display: 'block',
                  textShadow: '0 0 8px rgba(0, 255, 127, 0.4)'
                }}
              >
                Hi, i'm
              </span>
              <img 
                src="/assets/Arrow.png" 
                alt="Arrow" 
                className="h-24 w-auto"
                style={{
                  transform: 'rotate(80deg)',
                  marginTop: '10px',
                  marginLeft: '20px'
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Name - Centered and sized for tablet - moved to z-20 */}
        <div className="text-center mb-5 relative z-20">
          <h1 
            className="font-montserrat text-5xl md:text-7xl font-extrabold leading-none tracking-tighter"
            style={gradientTextStyle}
            onMouseOver={handleTextHoverIn}
            onMouseOut={handleTextHoverOut}
          >
            MANIKANDAN
          </h1>
        </div>
        
        {/* Job Title - Centered under name - moved to z-20 */}
        <div className="text-center mb-6 relative z-20">
          <h2 className="font-montserrat text-xl md:text-2xl font-extrabold tracking-wider text-white">
            UI/UX DESIGNER & CREATIVE TECHNOLOGIST
          </h2>
        </div>
        
        {/* Tagline - Centered - moved to z-20 */}
        <div className="text-center mb-8 relative z-20">
          <p className="font-montserrat text-xl md:text-2xl font-light text-white">
            Creating clarity in a chaotic digital world
          </p>
        </div>
        
        {/* See My Works button - Centered - moved to z-20 */}
        <div className="flex justify-center mb-6 relative z-20">
          <button className="flex items-center justify-center gap-2 border border-white text-white rounded-full px-5 py-2 text-sm hover:bg-white hover:text-black transition">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2"/>
              <path d="M10 6V14M10 14L6 10M10 14L14 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            SEE MY WORKS
          </button>
        </div>
      </div>
      
      {/* ===== MOBILE LAYOUT (≤639px) ===== */}
      <div className="block sm:hidden container mx-auto px-4 relative z-5 flex flex-col items-center">
        {/* Profile Image with glow effect - moved to z-0 */}
        <div className="relative w-66 h-72 sm:w-58 sm:h-58 md:w-66 md:h-66 mb-1/2 z-0">
          <img 
            src="/assets/Profile.png" 
            alt="Manikandan" 
            className="w-full h-full object-cover"
          />
          
          {/* "Hi, I'm" text with arrow */}
          <div className="absolute left-[-16px] top-64">
            <span 
              className="corinthia-bold"
              style={{
                fontSize: 'clamp(18px, 8vw, 30px)',
                color: 'white',
                transform: 'rotate(-5deg)',
                display: 'block',
                textShadow: '0 0 8px rgba(0, 255, 127, 0.4)'
              }}
            >
              Hi, i'm
            </span>
            <img 
              src="/assets/Arrow.png" 
              alt="Arrow" 
              className="h-26 w-auto mt-2 absolute"
              style={{
                
                top: '-62px',
                left: '8px',
                transform: 'rotate(2deg)',
                position: 'absolute'
              }}
            />
          </div>
        </div>
        
        {/* Name - Centered - moved to z-20 */}
        <h1 
          className="font-montserrat text-5xl sm:text-5xl md:text-6xl font-extrabold leading-none tracking-tighter mb-3 text-center relative z-20"
          style={gradientTextStyle}
          onMouseOver={handleTextHoverIn}
          onMouseOut={handleTextHoverOut}
        >
          MANIKANDAN
        </h1>
        
        {/* Job Title - Moved below name - moved to z-20 */}
        <div className="text-center mb-1 relative z-20">
          <h2 className="font-montserrat text-base sm:text-lg md:text-xl font-extrabold tracking-wider text-white">
            UI/UX DESIGNER &<br />
            CREATIVE TECHNOLOGIST
          </h2>
        </div>
        {/* Tagline (Quote) - Moved to top - moved to z-20 */}
        <div className="text-center mb-10 mt-2 relative z-20">
          <p className="font-montserrat text-sm sm:text-base font-light text-white">
            Creating clarity in a chaotic digital world
          </p>
        </div>
        
        {/* Only See My Works button - moved to z-20 */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10 relative z-20">
          <a 
            href="#projects"
            className="border border-white text-white font-medium rounded-full px-6 py-2.5 text-sm hover:bg-white/10 transition flex items-center justify-center gap-1"
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
              <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2"/>
              <path d="M10 6V14M10 14L6 10M10 14L14 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            SEE MY WORKS
          </a>
        </div>
        
        {/* Email Link - More visible on mobile - moved to z-20 */}
        <a 
          href="mailto:smk.manikandan.dev@gmail.com" 
          className="text-sm hover:text-primary font-montserrat mb-6 bg-background-50/70 px-4 py-1 rounded-full transition-colors hover:bg-background-100/80 border border-gray-800 relative z-20"
        >
          smk.manikandan.dev@gmail.com
        </a>
        
        {/* Social Icons - moved to z-20 */}
        <div className="flex space-x-6 mb-12 relative z-20">
          <SocialIcons />
        </div>
      </div>
      
      {/* Scroll Down Indicator - Shown on all layouts */}
      <motion.div 
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M12 4L12 20M12 20L18 14M12 20L6 14" 
            stroke="url(#scrollArrowGradient)" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="scrollArrowGradient" x1="12" y1="4" x2="12" y2="20" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#b4ff8d" />
              <stop offset="50%" stopColor="#00FF7F" />
              <stop offset="100%" stopColor="#00b862" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;