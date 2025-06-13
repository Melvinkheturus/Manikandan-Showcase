import { useRef, forwardRef, useImperativeHandle } from "react";
import { useTheme } from "../../../context/ThemeContext";
import useSectionAnimation from "../../../hooks/useSectionAnimation";

const SectionWrapper = forwardRef(({ 
  children, 
  id, 
  bgImage, 
  bgStyle,
  className = "",
  alignment = "center", // 'center', 'start', or 'end'
  animationType = "fade", // 'fade', 'slide', 'stagger', 'custom'
  animationOptions = {},
  threshold = 0.2, // Default to 20% of viewport from the top
}, ref) => {
  const internalRef = useRef(null);
  // Forward the ref and expose any methods if needed
  useImperativeHandle(ref, () => internalRef.current);
  
  const { isDarkMode } = useTheme();

  // Use our custom animation hook
  const { sectionRef, elementsRef } = useSectionAnimation({
    type: animationType,
    ...animationOptions,
    triggerOptions: {
      start: `top ${threshold * 100}%` // Convert threshold to percentage
    }
  });

  // Define alignment classes
  const alignmentClasses = {
    center: "items-center justify-center",
    start: "items-center justify-start",
    end: "items-center justify-end",
  };

  return (
    <section
      id={id}
      ref={(el) => {
        // Assign to both refs
        internalRef.current = el;
        if (typeof sectionRef === 'object') {
          sectionRef.current = el;
        }
      }}
      className={`min-h-screen relative overflow-visible flex ${alignmentClasses[alignment]} px-6 py-24 ${className} bg-transparent`}
      style={{ zIndex: 10 }}
    >
      {/* Background - Image (if provided) */}
      {bgImage && (
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
          ref={elementsRef}
        />
      )}

      {/* Decorative Elements - Particles or shapes */}
      <div className="absolute inset-0 z-1 pointer-events-none">
        {/* Small decorative elements that appear on scroll */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary"
            style={{
              left: `${15 + i * 20}%`,
              top: `${20 + i * 15}%`,
            }}
          />
        ))}
      </div>

      {/* Foreground content */}
      <div
        className="relative z-10 max-w-5xl w-full"
      >
        {children}
      </div>

      {/* Scroll indicator */}
      {id === "welcome" && (
        <div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
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
        </div>
      )}

      {/* Section scroll progress indicator */}
      <div
        className="absolute left-2 top-1/2 -translate-y-1/2 h-1/2 w-1 z-10"
        style={{ 
          originY: 0,
          background: `linear-gradient(to bottom, #10b981, transparent)`,
        }}
      />
    </section>
  );
});

SectionWrapper.displayName = "SectionWrapper";

export default SectionWrapper; 