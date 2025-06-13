import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSmoothScroll } from '../../context/SmoothScrollContext';
import { Link } from 'react-router-dom';
import './ProjectsHorizontalScroll.css';

// Sample project data
const projectsData = [
  {
    id: 1,
    title: 'Road Safety Quiz',
    image: 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=1000',
    categories: ['App', 'Technology'],
    url: '/projects/road-safety-quiz'
  },
  {
    id: 2,
    title: 'Direct Investing',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1000',
    categories: ['Website', 'Services'],
    url: '/projects/direct-investing'
  },
  {
    id: 3,
    title: 'Loho',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1000',
    categories: ['Website', 'Real Estate'],
    url: '/projects/loho'
  },
  {
    id: 4,
    title: 'Portfolio Website',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=1000',
    categories: ['Website', 'Personal'],
    url: '/projects/portfolio'
  },
  {
    id: 5,
    title: 'Mobile Application',
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1000',
    categories: ['App', 'Development'],
    url: '/projects/mobile-app'
  },
  {
    id: 6,
    title: 'E-commerce Platform',
    image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=1000',
    categories: ['Website', 'E-commerce'],
    url: '/projects/ecommerce'
  }
];

const ProjectsHorizontalScroll = () => {
  const sectionRef = useRef(null);
  const triggerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const headerRef = useRef(null);
  const centerCardRef = useRef(null);
  const indicatorRef = useRef(null);
  const { lenis } = useSmoothScroll();
  const [activeIndex, setActiveIndex] = useState(0);
  const [introCompleted, setIntroCompleted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Initialize the intro animation and horizontal scroll setup
  useEffect(() => {
    if (!sectionRef.current || !scrollContainerRef.current || !triggerRef.current) return;

    // Ensure ScrollTrigger is registered
    gsap.registerPlugin(ScrollTrigger);

    // Get references to key elements
    const section = sectionRef.current;
    const container = scrollContainerRef.current;
    const header = headerRef.current;
    const cards = container.querySelectorAll('.project-card');
    const centerCard = centerCardRef.current;
    const indicator = indicatorRef.current;

    // Create a main context for all animations
    const ctx = gsap.context(() => {
      // Initial animation sequence - Zoom and reveal
      const introTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top 70%",
          end: "top 30%",
          scrub: true,
          onLeave: () => setIntroCompleted(true),
          onEnterBack: () => setIntroCompleted(false),
        }
      });

      // Fade in header
      introTimeline
        .from(header, {
          opacity: 0,
          y: 30,
          duration: 0.5
        })
        // Initial state - all cards except the first one are invisible
        .set(cards, {
          opacity: 0,
          scale: 0.5,
          xPercent: (i) => (i === 0 ? 0 : (i < 3 ? 100 : -100)),
          display: (i) => (i === 0 ? 'block' : 'none')
        }, 0)
        // Center the first card
        .set(centerCard, {
          left: '50%',
          xPercent: -50,
          top: '50%',
          yPercent: -50,
          scale: 1.2,
          zIndex: 10,
          position: 'absolute'
        }, 0)
        // Zoom out the center card
        .to(centerCard, {
          scale: 1,
          position: 'relative',
          left: 'auto',
          top: 'auto',
          xPercent: 0,
          yPercent: 0,
          duration: 1
        }, 0.5)
        // Reveal all cards in sequence
        .to(cards, {
          opacity: 1,
          scale: 1,
          xPercent: 0,
          display: 'block',
          stagger: 0.1,
          duration: 0.8
        }, 0.8);

      // Main horizontal scrolling animation - only activates after intro animation
      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${container.scrollWidth - window.innerWidth + 100}`,
          pin: true,
          anticipatePin: 1,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Update scroll progress state
            setScrollProgress(self.progress);
            
            // Calculate active index based on scroll progress
            if (introCompleted) {
              const newIndex = Math.min(
                Math.floor(self.progress * projectsData.length),
                projectsData.length - 1
              );
              setActiveIndex(newIndex);
            }
          }
        }
      });

      // Only apply the horizontal scrolling once the intro animation completes
      scrollTimeline.to(container, {
        x: () => -(container.scrollWidth - window.innerWidth),
        ease: "none"
      });

      // Add subtle fade and scale animation to each card as it comes into view
      cards.forEach((card, i) => {
        if (i > 0) { // Skip the first card as it's part of the intro animation
          gsap.from(card, {
            opacity: 0.5,
            scale: 0.9,
            duration: 0.4,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              containerAnimation: scrollTimeline,
              start: "left center+=200",
              end: "left center-=200",
              scrub: true
            }
          });
        }
      });
      
      // Animate scroll indicator appearance
      gsap.from(indicator, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 30%",
          toggleActions: "play none none reverse"
        }
      });
    }, sectionRef);

    // Update ScrollTrigger when lenis scrolls
    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update);
    }

    // Clean up all animations when component unmounts
    return () => {
      ctx.revert();
      if (lenis) {
        lenis.off('scroll', ScrollTrigger.update);
      }
    };
  }, [lenis, introCompleted]);

  // Navigation functions
  const scrollToNext = () => {
    if (activeIndex < projectsData.length - 1) {
      const nextCard = document.querySelector(`.project-card:nth-child(${activeIndex + 2})`);
      if (nextCard && lenis) {
        // Get the container's current position
        const container = scrollContainerRef.current;
        const containerRect = container.getBoundingClientRect();
        const nextCardRect = nextCard.getBoundingClientRect();
        
        // Calculate how much to scroll to center the next card
        const offset = nextCardRect.left - containerRect.left - (window.innerWidth - nextCardRect.width) / 2;
        
        // Use lenis to animate scroll position
        lenis.scrollTo(lenis.scroll.current + offset, {
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      }
    }
  };

  const scrollToPrev = () => {
    if (activeIndex > 0) {
      const prevCard = document.querySelector(`.project-card:nth-child(${activeIndex})`);
      if (prevCard && lenis) {
        // Get the container's current position
        const container = scrollContainerRef.current;
        const containerRect = container.getBoundingClientRect();
        const prevCardRect = prevCard.getBoundingClientRect();
        
        // Calculate how much to scroll to center the previous card
        const offset = prevCardRect.left - containerRect.left - (window.innerWidth - prevCardRect.width) / 2;
        
        // Use lenis to animate scroll position
        lenis.scrollTo(lenis.scroll.current + offset, {
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      }
    }
  };
  
  // Handle dot indicator click
  const handleDotClick = (index) => {
    if (lenis && introCompleted) {
      const targetCard = document.querySelector(`.project-card:nth-child(${index + 1})`);
      if (targetCard) {
        const container = scrollContainerRef.current;
        const containerRect = container.getBoundingClientRect();
        const targetCardRect = targetCard.getBoundingClientRect();
        const offset = targetCardRect.left - containerRect.left - (window.innerWidth - targetCardRect.width) / 2;
        
        lenis.scrollTo(lenis.scroll.current + offset, {
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      }
    }
  };

  return (
    <div ref={triggerRef} className="projects-trigger">
      <div className="projects-header" ref={headerRef}>
        <h2 className="projects-title">Recent projects</h2>
        <Link to="/projects" className="view-all-link">
          View All
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>

      <div className="projects-section" ref={sectionRef}>
        <div className="projects-container" ref={scrollContainerRef}>
          {projectsData.map((project, index) => (
            <div 
              key={project.id} 
              className={`project-card ${index === activeIndex ? 'active' : ''}`}
              ref={index === 0 ? centerCardRef : null}
              data-index={index}
            >
              <Link to={project.url} className="project-link">
                <div className="project-image-container">
                  <img src={project.image} alt={project.title} className="project-image" />
                  <div className="project-categories">
                    {project.categories.map((category, i) => (
                      <span key={i} className="project-category">{category}</span>
                    ))}
                  </div>
                  <div className="card-arrow">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>
                <h3 className="project-title">{project.title}</h3>
              </Link>
            </div>
          ))}
        </div>
        
        {/* Dot indicators */}
        <div className={`scroll-indicator ${introCompleted ? 'visible' : ''}`} ref={indicatorRef}>
          {projectsData.map((_, index) => (
            <button 
              key={index}
              className={`indicator-dot ${index === activeIndex ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to project ${index + 1}`}
            />
          ))}
        </div>
        
        <div className={`navigation-controls ${introCompleted ? 'visible' : ''}`}>
          <button 
            className={`nav-button prev ${activeIndex === 0 ? 'disabled' : ''}`}
            onClick={scrollToPrev}
            disabled={activeIndex === 0}
            aria-label="Previous project"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <button 
            className={`nav-button next ${activeIndex === projectsData.length - 1 ? 'disabled' : ''}`}
            onClick={scrollToNext}
            disabled={activeIndex === projectsData.length - 1}
            aria-label="Next project"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectsHorizontalScroll; 