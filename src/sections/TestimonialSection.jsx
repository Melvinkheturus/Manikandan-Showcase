import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionWrapper from '../portfolio/components/layout/SectionWrapper';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

// Import handwritten font styles
const handwritingFontImport = `
  @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&display=swap');
`;

// Enhanced animated text component
const AnimatedText = ({ text, delay = 0, className = "" }) => {
  return (
    <motion.p
      className={`leading-relaxed ${className}`}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.7, 
        delay: delay * 0.2,
        staggerChildren: 0.08,
        ease: "easeOut"
      }}
      viewport={{ once: true, margin: "-50px" }}
    >
      {text}
    </motion.p>
  );
};

const StarRating = ({ rating, animate = false }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={animate ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
          whileInView={animate ? { 
            opacity: 1, 
            scale: 1, 
            transition: { 
              delay: 0.2 + (i * 0.1), 
              type: "spring", 
              stiffness: 300 
            } 
          } : {}}
          viewport={{ once: true }}
        >
          <FaStar 
            className={i < rating ? "text-yellow-400 mr-1" : "text-gray-500 mr-1"}
            size={16}
          />
        </motion.div>
      ))}
      <span className="text-yellow-400 text-sm ml-1 font-medium">{rating}.0</span>
    </div>
  );
};

// Tags component
const Tags = ({ tags }) => {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {tags.map((tag, index) => (
        <span 
          key={index}
          className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/20 text-primary"
        >
          #{tag}
        </span>
      ))}
    </div>
  );
};

const TestimonialCard = ({ testimonial, index, inView }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { 
        delay: index * 0.2,
        duration: 0.8,
        type: "spring",
        stiffness: 50
      }
    }
  };
  
  return (
    <motion.div
      className={`relative p-6 md:p-8 mb-16 md:mb-24 cursor-pointer overflow-hidden rounded-xl`}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileHover={{ 
        y: -8, 
        boxShadow: "0 20px 30px -10px rgba(0, 255, 127, 0.15)",
        transition: { duration: 0.3 }
      }}
    >
      {/* Card background with hover effect */}
      <div className="absolute inset-0 bg-background-900/30 backdrop-blur-md rounded-xl border border-primary/10 overflow-hidden transition-all duration-500 group-hover:border-primary/30">
        <div className="absolute inset-0 opacity-10">
          {/* Grid pattern */}
          <div className="absolute inset-0" 
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(0, 255, 127, 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0, 255, 127, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />
        </div>
        
        {/* Hover glow effect */}
        <div className="absolute inset-0 opacity-0 hover:opacity-20 transition-opacity duration-500 bg-gradient-radial from-primary/20 via-primary/10 to-transparent"></div>
      </div>
      
      <div className="relative z-10">
        {/* Reduced size quotation mark with semi-transparent green color */}
        <motion.div 
          className="absolute top-3 left-1 text-primary/10 pointer-events-none"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
          transition={{ delay: index * 0.1, duration: 0.8, ease: "easeOut" }}
        >
          <svg width="70" height="40" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </motion.div>
        
        {/* Testimonial text with proper positioning and handwriting font */}
        <div className="mb-6 pl-12 pr-4 pt-4">
          <AnimatedText 
            text={testimonial.quote} 
            delay={index * 0.3} 
            className="text-gray-100 text-lg font-handwriting" 
          />
        </div>
        
        {/* Bottom row with signature and rating */}
        <div className="flex items-center justify-between mt-8">
          <div>
            <motion.p 
              className="font-medium text-base text-primary relative inline-block overflow-hidden group"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: index * 0.2 + 0.5 }}
            >
              {testimonial.name}
              <motion.span 
                className="absolute bottom-0 left-0 w-full h-0.5 bg-primary origin-left"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.p>
            <motion.p 
              className="text-sm text-gray-400"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: index * 0.2 + 0.6 }}
            >
              {testimonial.role}, {testimonial.company}
            </motion.p>
            <Tags tags={testimonial.tags || []} />
          </div>
          
          {/* Rating positioned at bottom right */}
          <motion.div 
            className="ml-auto"
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ delay: index * 0.2 + 0.7 }}
          >
            <StarRating rating={testimonial.rating || 5} animate={true} />
          </motion.div>
        </div>
        
        {/* Hand-drawn doodle elements */}
        <motion.div 
          className="absolute bottom-2 right-8 text-primary/20"
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ delay: index * 0.2 + 1, type: "spring" }}
        >
          <svg width="60" height="12" viewBox="0 0 60 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 8.5C16.5 2.5 41.5 -1.5 59 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
};

const TestimonialSection = () => {
  const sectionRef = useRef(null);
  const testimonialListRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  
  // Refined testimonial data with tags and improved content
  const testimonials = [
    {
      id: 1,
      name: "Alex Johnson",
      role: "Product Manager",
      company: "TechCorp",
      quote: "Manikandan's creativity and precision transformed our idea into a functional, user-focused interface. His design instincts and attention to detail truly elevated the final product.",
      rating: 5,
      tags: ["UIUX", "Precision", "Innovation"]
    },
    {
      id: 2,
      name: "Sarah Williams",
      role: "CEO",
      company: "Startup Innovations",
      quote: "Manikandan delivered our platform ahead of schedule with exceptional quality. His ability to translate our vision into a working product was impressive and exceeded all expectations.",
      rating: 5,
      tags: ["Delivery", "Quality", "Vision"]
    },
    {
      id: 3,
      name: "David Chen",
      role: "CTO",
      company: "FinTech Solutions",
      quote: "The dashboards Manikandan created simplified our complex data into actionable insights. His work significantly improved our decision-making process and operational efficiency.",
      rating: 5,
      tags: ["DataViz", "Simplicity", "Performance"]
    },
    {
      id: 4,
      name: "Priya Patel",
      role: "Design Director",
      company: "Creative Flux",
      quote: "I was thoroughly impressed with Manikandan's ability to blend creativity and functionality. The design system he developed has become the backbone of our product ecosystem.",
      rating: 5,
      tags: ["DesignSystem", "Creativity", "Systems"]
    }
  ];

  const itemsPerPage = 2; // For responsive design - show 2 per row on desktop
  const pageCount = Math.ceil(testimonials.length / itemsPerPage);
  
  // Get current testimonials for pagination
  const currentTestimonials = testimonials.slice(
    currentPage * itemsPerPage, 
    (currentPage + 1) * itemsPerPage
  );
  
  // Next/Prev navigation
  const nextPage = () => {
    setCurrentPage((prev) => (prev === pageCount - 1 ? 0 : prev + 1));
  };
  
  const prevPage = () => {
    setCurrentPage((prev) => (prev === 0 ? pageCount - 1 : prev - 1));
  };

  useEffect(() => {
    const scrollTrig = ScrollTrigger.create({
      trigger: testimonialListRef.current,
      start: "top center",
      end: "bottom center",
      onUpdate: (self) => {
        // Calculate which testimonial is in view based on scroll position
        const newIndex = Math.min(
          testimonials.length - 1,
          Math.max(0, Math.floor(self.progress * testimonials.length))
        );
        setActiveIndex(newIndex);
      }
    });

    return () => {
      scrollTrig.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [testimonials.length]);

  return (
    <SectionWrapper id="testimonials">
      <style>{handwritingFontImport}</style>
      
      <section 
        ref={sectionRef}
        className="relative py-20"
      >
        {/* Section content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-4 text-white relative inline-block"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-blue-400 heading-glow">Voices of My Journey</span>
              <motion.span 
                className="absolute -bottom-2 left-0 right-0 h-1 bg-primary rounded-full neon-divider"
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                transition={{ delay: 0.3, duration: 0.8 }}
                viewport={{ once: true }}
              ></motion.span>
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-300 max-w-2xl mx-auto font-handwriting mt-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              viewport={{ once: true }}
            >
              As I grow, I carry with me the words of those who've been part of my early creative path.
            </motion.p>
          </div>
          
          {/* Responsive grid for testimonials */}
          <div 
            ref={testimonialListRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto"
          >
            {testimonials.map((testimonial, index) => (
              <TestimonialCard 
                key={testimonial.id} 
                testimonial={testimonial} 
                index={index}
                inView={true}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Add custom styles */}
      <style jsx="true">{`
        .font-handwriting {
          font-family: 'Caveat', cursive;
        }
        
        .bg-gradient-radial {
          background-image: radial-gradient(circle, var(--tw-gradient-from), var(--tw-gradient-via), var(--tw-gradient-to));
        }
      `}</style>
    </SectionWrapper>
  );
};

export default TestimonialSection; 