import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaLinkedin, FaYoutube, FaDribbble, FaMediumM, FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [inHeroSection, setInHeroSection] = useState(true);
  
  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
      
      // Check if we're in hero section
      const heroSection = document.getElementById('welcome');
      if (heroSection) {
        const heroHeight = heroSection.offsetHeight;
        setInHeroSection(window.scrollY < heroHeight - 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);
  
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
    console.log("Toggled menu, new state:", !mobileMenuOpen);
  };

  // Social media links
  const socialLinks = [
    { id: 'instagram', icon: FaInstagram, url: 'https://instagram.com/yourusername' },
    { id: 'dribbble', icon: FaDribbble, url: 'https://dribbble.com/yourusername' },
    { id: 'youtube', icon: FaYoutube, url: 'https://youtube.com/yourusername' },
    { id: 'linkedin', icon: FaLinkedin, url: 'https://linkedin.com/in/yourusername' },
    { id: 'medium', icon: FaMediumM, url: 'https://medium.com/@yourusername' },
  ];

  // Navigation sections 
  const navigationLinks = [
    { id: 'welcome', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' }
  ];

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
    backgroundColor: 'rgba(18, 18, 30, 0.6)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.25)'
  };

  const menuItemStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(5px)',
    WebkitBackdropFilter: 'blur(5px)',
    borderRadius: '10px',
    padding: '12px 18px',
    marginBottom: '8px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    transition: 'all 0.3s ease'
  };

  return (
    <>
      {/* Desktop Navbar - fully transparent */}
      <div className={`fixed top-0 w-full z-50 transition-all duration-300 ease-in-out ${
        scrolled ? 'bg-transparent border-b border-white/10' : 'bg-transparent'
      }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-white">
              <img src="/assets/Logo.png" alt="Manikandan" className="h-16" />
            </Link>
          </div>
          
            {/* Hamburger Menu Button - Only visible on mobile */}
            <div className="block md:hidden">
              <button
                id="hamburger-button"
                onClick={toggleMobileMenu}
                className="text-white hover:text-primary focus:outline-none p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? (
                  <FaTimes className="h-6 w-6" />
                ) : (
                  <FaBars className="h-6 w-6" />
                )}
              </button>
            </div>
            
            {/* Desktop Navigation - Social media in hero section, navigation links elsewhere */}
            <div className="hidden md:flex items-center space-x-4">
              {inHeroSection ? (
                // Social media icons - Only shown in hero section
                socialLinks.map((link) => (
                  <a 
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-primary transition-colors duration-300"
                  >
                    <link.icon className="h-5 w-5" />
                  </a>
                ))
              ) : (
                // Section navigation - Shown in all other sections
                navigationLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className="text-white hover:text-primary font-medium transition-colors duration-300"
                  >
                    {link.label}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu - With glassmorphism effect */}
      {mobileMenuOpen && (
        <div 
          id="mobile-menu"
          className="fixed right-0 top-16 bottom-0 w-72 z-[999] bg-gray-900/80 backdrop-blur-xl border-l border-white/10"
          style={{
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.25)'
          }}
        >
          <div className="p-6 flex flex-col h-full overflow-hidden">
            {/* Menu Items */}
            <div className="flex flex-col space-y-4 mb-8">
              {navigationLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-white hover:text-primary text-xl font-medium p-3 rounded-md bg-white/5 hover:bg-white/10 transition-all text-left"
                >
                  {link.label}
                </button>
              ))}
            </div>
            
            {/* Social Icons */}
            <div className="mt-auto pt-6 border-t border-white/10">
              <p className="text-white/60 text-sm mb-4">Connect with me</p>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((link) => (
                  <a 
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-primary transition-all"
                  >
                    <link.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar; 