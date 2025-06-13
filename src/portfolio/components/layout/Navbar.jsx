import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [inHeroSection, setInHeroSection] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');
  const [navVisible, setNavVisible] = useState(false);
  const lastScrollY = useRef(0);
  
  // Navigation sections with IDs that match the section IDs in your page
  const navigationLinks = [
    { id: 'hero', label: 'Hero' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'contact', label: 'Contact' }
  ];

  // Enhanced scroll effect for smart navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrolled = currentScrollY > 50;
      
      // When we start scrolling down beyond hero threshold, show navbar
      if (isScrolled && !navVisible && currentScrollY > lastScrollY.current) {
        setNavVisible(true);
      }
      
      // Update scrolled state for styling
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
      
      // Check if we're in hero section
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        const heroHeight = heroSection.offsetHeight;
        setInHeroSection(currentScrollY < heroHeight - 100);
      }
      
      // Determine active section
      const sections = navigationLinks.map(link => document.getElementById(link.id));
      let newActiveSection = navigationLinks[0].id;
      
      sections.forEach((section, index) => {
        if (section) {
          const sectionTop = section.offsetTop - 100;
          const sectionHeight = section.offsetHeight;
          
          if (currentScrollY >= sectionTop && currentScrollY < sectionTop + sectionHeight) {
            newActiveSection = navigationLinks[index].id;
          }
        }
      });
      
      setActiveSection(newActiveSection);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled, navVisible]);
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('#mobile-menu') && !event.target.closest('#hamburger-button')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(prevState => !prevState);
  };

  // Scroll to section function
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  // Glassmorphism styles
  const glassmorphismStyle = {
    backgroundColor: 'rgba(10, 10, 20, 0.4)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
  };

  return (
    <>
      {/* Desktop Navbar */}
      <div className={`fixed top-6 left-0 right-0 z-50 transition-all duration-500 ease-in-out flex justify-center ${
        navVisible || inHeroSection ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-16'
      }`}>
        <div className={`px-2 py-2 rounded-full transition-all duration-300 ease-in-out flex items-center justify-center ${
          scrolled && !inHeroSection ? 'max-w-fit mx-auto' : 'bg-transparent'
        }`} style={scrolled && !inHeroSection ? glassmorphismStyle : {}}>
          {/* Desktop Navigation - Only shown when scrolled and not in hero section */}
          {scrolled && !inHeroSection && (
            <motion.div 
              className="hidden md:flex items-center space-x-1"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {navigationLinks.map((link) => (
                <motion.button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`px-3 py-1 rounded-md transition-all duration-300 text-sm ${
                    activeSection === link.id 
                      ? 'text-primary font-medium bg-primary/10' 
                      : 'text-white/80 hover:text-primary hover:bg-white/5'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.label}
                </motion.button>
              ))}
            </motion.div>
          )}
          
          {/* Hamburger Menu Button - Only visible on mobile */}
          <div className="md:hidden">
            <button
              id="hamburger-button"
              onClick={toggleMobileMenu}
              className={`text-white hover:text-primary focus:outline-none p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all ${
                scrolled && !inHeroSection ? '' : 'hidden'
              }`}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu - With glassmorphism effect */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            id="mobile-menu"
            className="fixed right-0 top-16 bottom-0 w-72 z-[999] border-l border-white/10"
            style={glassmorphismStyle}
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="p-6 flex flex-col h-full overflow-hidden">
              {/* Menu Items */}
              <div className="flex flex-col space-y-3">
                {navigationLinks.map((link) => (
                  <motion.button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className={`text-left p-3 rounded-md transition-all duration-300 ${
                      activeSection === link.id
                        ? 'bg-primary/20 text-primary font-medium'
                        : 'bg-white/5 hover:bg-white/10 text-white/80'
                    }`}
                    whileHover={{ x: 5 }}
                  >
                    {link.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar; 