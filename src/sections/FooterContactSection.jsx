import React, { useState, useEffect, useRef } from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaFilePdf, FaArrowUp, FaYoutube, FaInstagram, FaBehance, FaMedium, FaPhone } from 'react-icons/fa';
import { SiDribbble } from 'react-icons/si';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionWrapper from '../portfolio/components/layout/SectionWrapper';
import useSectionData from '../utils/useSectionData';

// Register the plugins
gsap.registerPlugin(ScrollTrigger);

const FooterContactSection = ({ sectionId }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState({ submitting: false, submitted: false, success: false, message: '' });
  const [content, setContent] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { data, loading, error } = useSectionData('contact');
  const sectionRef = useRef(null);
  const formRef = useRef(null);
  const videoRef = useRef(null);
  const footerTextRef = useRef(null);
  const currentYear = new Date().getFullYear();

  // Default content if data is not available yet
  const defaultContent = {
    intro: "Ready to create something cosmic?",
    info: [
      { icon: "location", value: "Chennai, Tamil Nadu 600077" },
      { icon: "email", value: "smk.manikandan.dev@gmail.com" },
      { icon: "phone", value: "+91 99403 98023" }
    ],
    social: [
      { platform: "LinkedIn", url: "https://linkedin.com/in/manikandan-s" },
      { platform: "GitHub", url: "https://github.com/manikandan-s" },
      { platform: "Twitter", url: "https://twitter.com/manikandan" },
      { platform: "YouTube", url: "https://youtube.com/@manikandan" },
      { platform: "Instagram", url: "https://instagram.com/manikandan" },
      { platform: "Dribbble", url: "https://dribbble.com/manikandan" },
      { platform: "Behance", url: "https://behance.net/manikandan" },
      { platform: "Medium", url: "https://medium.com/@manikandan" }
    ],
    form_enabled: true
  };

  // Set content based on data
  useEffect(() => {
    setContent(data?.content || defaultContent);
  }, [data]);

  // Video playback effect
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75; // Slightly slower playback for more subtle effect
    }
  }, [videoRef]);

  // Scroll animation and typewriter effect
  useEffect(() => {
    if (!sectionRef.current || loading) return;

    // Section entrance animation
    const sectionTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        end: 'top 40%',
        scrub: 1,
        toggleActions: 'play none none reverse',
      }
    });

    sectionTimeline.fromTo(sectionRef.current, 
      { opacity: 0, y: 50 }, 
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    );

    // Footer text animation
    if (footerTextRef.current) {
      gsap.fromTo(footerTextRef.current,
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.5, 
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footerTextRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    return () => {
      // Cleanup
      const triggers = ScrollTrigger.getAll();
      triggers.forEach(trigger => trigger.kill());
    };
  }, [loading, sectionRef.current]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ submitting: true, submitted: false, success: false, message: 'Sending message...' });
    
    // Simulate form submission
    setTimeout(() => {
      setFormStatus({ submitting: false, submitted: true, success: true, message: 'Message sent successfully! I will get back to you soon.' });
      setFormData({ name: '', email: '', message: '' });
    }, 1500);
  };

  const toggleForm = () => {
    setIsFormOpen(prev => !prev);
    
    if (!isFormOpen && formRef.current) {
      // Animate form opening
      gsap.fromTo(formRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
      );
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Early return for loading state
  if (loading || !content) {
    return (
      <SectionWrapper id="contact">
        <section className="w-full max-w-6xl mx-auto p-8 flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </section>
      </SectionWrapper>
    );
  }

  // Get correct icon for contact info
  const getInfoIcon = (iconType) => {
    switch(iconType) {
      case 'location':
        return '📍';
      case 'email':
        return '✉️';
      case 'phone':
        return '📞';
      default:
        return '🔗';
    }
  };

  // Filter out social links with empty URLs
  const validSocialLinks = content.social?.filter(item => item.url) || [];

  // Get social icon component
  const getSocialIcon = (platform) => {
    const iconClass = "w-5 h-5 text-white group-hover:text-primary filter drop-shadow-glow";
    
    switch(platform.toLowerCase()) {
      case 'linkedin':
        return <FaLinkedin className={iconClass} />;
      case 'github':
        return <FaGithub className={iconClass} />;
      case 'twitter':
        return <FaTwitter className={iconClass} />;
      case 'youtube':
        return <FaYoutube className={iconClass} />;
      case 'instagram':
        return <FaInstagram className={iconClass} />;
      case 'dribbble':
        return <SiDribbble className={iconClass} />;
      case 'behance':
        return <FaBehance className={iconClass} />;
      case 'medium':
        return <FaMedium className={iconClass} />;
      default:
        return <FaEnvelope className={iconClass} />; // Default icon if platform not recognized
    }
  };

  return (
    <div 
      ref={sectionRef} 
      id="contact"
      className="relative w-full py-20 overflow-hidden transition-all duration-700 ease-out"
    >
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ filter: "brightness(0.5)" }}
      >
        <source src="/assets/videos/Footer_bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Foggy Gradient Overlay */}
      <div 
        className="absolute inset-0 z-10" 
        style={{
          background: "linear-gradient(to top, rgba(10,15,13,0.85) 0%, rgba(16,185,129,0.25) 50%, rgba(10,15,13,0.85) 100%)",
          backdropFilter: "blur(4px)"
        }} 
      />
      
      {/* Particle background effect - purely CSS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-primary-600/20"
              style={{
                width: `${Math.random() * 5 + 1}px`,
                height: `${Math.random() * 5 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5,
                filter: 'blur(1px)',
                animation: `float ${Math.random() * 10 + 10}s linear infinite`
              }}
            />
          ))}
        </div>
      </div>

      {/* Main content container */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cinematic heading with two lines */}
        <div className="text-center mb-16 transform translate-y-0 opacity-100 transition-all duration-700">
          <h2 className="font-bold text-center">
            <span 
              className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-2"
              style={{
                backgroundImage: 'linear-gradient(to top, #a259ff, #ffffff)',
                backgroundSize: '100% 200%',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 20px rgba(162, 89, 255, 0.3)'
              }}
            >
              CREATIVITY MEETS STRATEGY.
            </span>
            <span 
              className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
              style={{
                backgroundImage: 'linear-gradient(to top, #a259ff, #ffffff)',
                backgroundSize: '100% 200%',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 20px rgba(162, 89, 255, 0.3)'
              }}
            >
              LET'S TALK.
            </span>
          </h2>
          
          {/* Two buttons: Download CV and Back to Top */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a 
              href="/Manikandan_S_Resume.pdf" 
              download
              className="px-6 py-3 bg-black/40 border border-primary text-white rounded-full hover:bg-primary hover:text-black transition-all duration-300 transform hover:scale-105 group relative overflow-hidden backdrop-blur-sm flex items-center gap-2 btn-outline-glow"
              aria-label="Download my CV"
            >
              <FaFilePdf className="w-4 h-4" />
              <span className="relative z-10">Download CV</span>
              <span className="absolute inset-0 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out"></span>
            </a>

            <button 
              onClick={scrollToTop}
              className="px-6 py-3 bg-black/40 border border-primary text-white rounded-full hover:bg-primary hover:text-black transition-all duration-300 transform hover:scale-105 group relative overflow-hidden backdrop-blur-sm flex items-center gap-2 btn-outline-glow"
              aria-label="Back to top"
            >
              <FaArrowUp className="w-4 h-4" />
              <span className="relative z-10">Back to Top</span>
              <span className="absolute inset-0 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out"></span>
            </button>
          </div>
        </div>

        {/* Contact and Connect Grid - 2 columns on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-16">
          {/* Contact Info - Left Side */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-4 text-white border-b border-primary/30 pb-2 heading-glow">Contact</h3>
            
            {/* Phone */}
            <div className="flex items-center gap-3 group">
              <span className="w-8 h-8 flex items-center justify-center text-primary group-hover:scale-110 transition-transform bg-black/30 rounded-full">
                <FaPhone className="w-4 h-4" />
              </span>
              <a href="tel:+919940398022" className="text-gray-300 hover:text-primary transition-colors text-glow-hover">+91 9940398022</a>
            </div>
            
            {/* Email */}
            <div className="flex items-center gap-3 group">
              <span className="w-8 h-8 flex items-center justify-center text-primary group-hover:scale-110 transition-transform bg-black/30 rounded-full">
                <FaEnvelope className="w-4 h-4" />
              </span>
              <a href="mailto:smk.manikandan.dev@gmail.com" className="text-gray-300 hover:text-primary transition-colors text-glow-hover">smk.manikandan.dev@gmail.com</a>
            </div>
            
            {/* Send Message Button */}
            <button 
              onClick={toggleForm}
              className="mt-4 px-6 py-3 bg-black/40 border border-primary text-white rounded-full hover:bg-primary hover:text-black transition-all duration-300 transform hover:scale-105 group relative overflow-hidden flex items-center gap-2 btn-outline-glow"
            >
              <span className="text-xl">✍️</span>
              <span className="relative z-10">Send a Message</span>
              <span className="absolute inset-0 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out"></span>
            </button>
          </div>
          
          {/* Connect - Right Side */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-4 text-white border-b border-primary/30 pb-2 heading-glow">Connect with me:</h3>
            
            {/* Social Icons Grid - Always horizontal */}
            <div className="flex flex-wrap gap-3">
              {content.social && content.social.map((social, index) => (
                social.url && (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-background-800/80 hover:bg-primary/30 border border-primary/40 flex items-center justify-center transition-all hover:scale-110 shadow-sm shadow-primary/20"
                    aria-label={social.platform}
                    style={{backdropFilter: "blur(4px)"}}
                  >
                    <div className="text-white hover:text-primary transition-colors">
                      {getSocialIcon(social.platform)}
                    </div>
                  </a>
                )
              ))}
            </div>
            
            {/* Social Platform Labels */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
              {content.social && content.social.filter(s => s.url).map((social, index) => (
                <a 
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center px-2 py-1 bg-background-800/50 border border-primary/20 rounded-md text-sm text-gray-300 hover:text-primary hover:border-primary/40 transition-all hover:bg-background-800/70"
                >
                  [ {social.platform} ]
                </a>
              ))}
            </div>
          </div>
        </div>
        
        {/* Modal contact form with glassmorphism */}
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={() => setIsFormOpen(false)}>
            <div 
              ref={formRef}
              className="w-full max-w-lg bg-background-500/70 backdrop-blur-md border border-primary/30 rounded-xl p-8 transform transition-all duration-500"
              style={{ boxShadow: '0 0 30px rgba(162, 89, 255, 0.2)' }}
              onClick={e => e.stopPropagation()}
            >
              {formStatus.submitted && formStatus.success ? (
                <div className="bg-primary/20 border border-primary rounded-lg p-6 text-white h-full flex flex-col items-center justify-center">
                  <h3 className="text-xl font-semibold mb-4">Thank You!</h3>
                  <p className="text-center">{formStatus.message}</p>
                  <button 
                    onClick={() => setIsFormOpen(false)} 
                    className="mt-6 px-6 py-2 bg-primary text-black font-medium rounded-full"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit}>
                  <h3 className="text-2xl font-bold mb-2 text-white">Send a Message</h3>
                  <div className="border-b border-primary/30 mb-4"></div>
                  
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    required
                    className="w-full p-3 rounded-lg border border-primary/30 bg-background-800/50 text-white placeholder:text-gray-400 focus:border-primary focus:outline-none transition-colors"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    required
                    className="w-full p-3 rounded-lg border border-primary/30 bg-background-800/50 text-white placeholder:text-gray-400 focus:border-primary focus:outline-none transition-colors"
                  />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your Message"
                    rows={5}
                    required
                    className="w-full p-3 rounded-lg border border-primary/30 bg-background-800/50 text-white placeholder:text-gray-400 resize-none focus:border-primary focus:outline-none transition-colors"
                  />
                  
                  <div className="flex justify-between mt-2">
                    <button
                      type="button"
                      onClick={() => setIsFormOpen(false)}
                      className="px-6 py-3 bg-transparent border border-gray-600 text-white font-semibold rounded-full hover:bg-gray-800 transition-all"
                    >
                      Cancel
                    </button>
                    
                    <button
                      type="submit"
                      disabled={formStatus.submitting}
                      className="px-6 py-3 bg-primary text-black font-semibold rounded-full shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                    >
                      {formStatus.submitting ? 'Sending...' : 'Submit'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
        
        {/* Simple Copyright Text - No card container */}
        <div ref={footerTextRef} className="mt-16 pt-6 border-t border-white/10 text-center">
          <p className="text-gray-300 text-sm">
            Design & Developed by Manikandan | © Manikandan Showcase. All rights reserved.
          </p>
        </div>
      </div>
      
      {/* Add styles for drop shadow */}
      <style>
        {`
          .drop-shadow-glow {
            filter: drop-shadow(0 0 2px rgba(0, 255, 127, 0.5));
          }
          
          @keyframes float {
            0% {
              transform: translateY(0) translateX(0);
            }
            50% {
              transform: translateY(-20px) translateX(10px);
            }
            100% {
              transform: translateY(0) translateX(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default FooterContactSection; 