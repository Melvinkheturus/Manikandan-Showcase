import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTheme } from "../context/ThemeContext";

export default function SectionWrapper({ 
  children, 
  id, 
  bgImage, 
  bgStyle,
  className = "",
  alignment = "center" // 'center', 'start', or 'end'
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const { isDarkMode } = useTheme();

  // Define alignment classes
  const alignmentClasses = {
    center: "items-center justify-center",
    start: "items-center justify-start",
    end: "items-center justify-end",
  };

  return (
    <section
      id={id}
      ref={ref}
      className={`min-h-screen relative overflow-hidden flex ${alignmentClasses[alignment]} px-6 py-24 ${className} bg-transparent`}
    >
      {/* Background - Image (if provided) */}
      {bgImage && (
        <motion.div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
          initial={{ y: 100, opacity: 0 }}
          animate={{
            y: isInView ? 0 : 100,
            opacity: isInView ? 0.7 : 0,
          }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      )}

      {/* Decorative Elements - Particles or shapes */}
      <div className="absolute inset-0 z-1 pointer-events-none">
        {/* Small decorative elements that appear on scroll */}
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary"
            style={{
              left: `${15 + i * 20}%`,
              top: `${20 + i * 15}%`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: isInView ? 1 : 0, 
              opacity: isInView ? 0.3 : 0 
            }}
            transition={{ duration: 0.5, delay: 0.1 * i }}
          />
        ))}
      </div>

      {/* Foreground content with staggered children animations */}
      <motion.div
        className="relative z-10 max-w-5xl w-full"
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ 
          duration: 0.8,
          staggerChildren: 0.1,
          delayChildren: 0.2
        }}
      >
        {children}
      </motion.div>

      {/* Scroll indicator */}
      {id === "welcome" && (
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5, 
            delay: 1,
            repeat: Infinity,
            repeatType: "reverse",
            repeatDelay: 0.5
          }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8 text-primary animate-bounce" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 14l-7 7m0 0l-7-7m7 7V3" 
            />
          </svg>
        </motion.div>
      )}

      {/* Section scroll progress indicator */}
      <motion.div
        className="absolute left-2 top-1/2 -translate-y-1/2 h-1/2 w-1 z-10"
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ 
          scaleY: isInView ? 1 : 0,
          opacity: isInView ? 1 : 0,
        }}
        transition={{ duration: 1, ease: "circOut" }}
        style={{ 
          originY: 0,
          background: `linear-gradient(to bottom, #10b981, transparent)`,
        }}
      />
    </section>
  );
} 