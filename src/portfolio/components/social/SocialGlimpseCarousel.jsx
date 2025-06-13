import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { FaInstagram, FaTwitter, FaYoutube, FaLinkedin, FaBehance, FaPlay } from 'react-icons/fa';

const SocialGlimpseCarousel = () => {
  // Sample social media posts data
  // In a real app, this would come from an API or CMS
  const posts = [
    {
      id: 1,
      platform: 'instagram',
      type: 'image',
      image: '/assets/social/instagram-post1.jpg',
      color: 'from-purple-500 to-pink-500',
      caption: 'Exploring new UI trends for a healthcare app',
      date: 'March 2023',
      stats: '1.2k likes',
      link: '#'
    },
    {
      id: 2,
      platform: 'twitter',
      type: 'text',
      image: '/assets/social/twitter-post1.jpg',
      color: 'from-blue-400 to-blue-600',
      caption: 'Just launched my latest design system - check it out!',
      date: 'April 2023',
      stats: '46 retweets',
      link: '#'
    },
    {
      id: 3,
      platform: 'youtube',
      type: 'video',
      image: '/assets/social/youtube-post1.jpg',
      color: 'from-red-500 to-red-700',
      caption: 'Creating a modern portfolio site with React & Framer Motion',
      date: 'May 2023',
      stats: '3.5k views',
      link: '#'
    },
    {
      id: 4,
      platform: 'behance',
      type: 'project',
      image: '/assets/social/behance-post1.jpg',
      color: 'from-blue-600 to-indigo-600',
      caption: 'E-commerce redesign concept - Fashion Store',
      date: 'June 2023',
      stats: '412 appreciations',
      link: '#'
    },
    {
      id: 5,
      platform: 'linkedin',
      type: 'article',
      image: '/assets/social/linkedin-post1.jpg',
      color: 'from-blue-500 to-sky-400',
      caption: 'How AI is transforming the UX design landscape',
      date: 'July 2023',
      stats: '89 comments',
      link: '#'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const autoplayRef = useRef(null);
  const controls = useAnimation();

  // Get current, previous, and next posts
  const currentPost = posts[currentIndex];
  const previousPost = posts[(currentIndex - 1 + posts.length) % posts.length];
  const nextPost = posts[(currentIndex + 1) % posts.length];

  // Platform icons mapping
  const platformIcons = {
    instagram: <FaInstagram />,
    twitter: <FaTwitter />,
    youtube: <FaYoutube />,
    linkedin: <FaLinkedin />,
    behance: <FaBehance />
  };

  // Autoplay functionality
  useEffect(() => {
    if (isAutoplay) {
      autoplayRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % posts.length);
      }, 4000);
    }
    
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [isAutoplay, posts.length]);

  // Handle post change with animation
  useEffect(() => {
    controls.start({
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeInOut" }
    });
  }, [currentIndex, controls]);

  // Handle manual navigation
  const handleNext = () => {
    setIsAutoplay(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % posts.length);
  };

  const handlePrevious = () => {
    setIsAutoplay(false);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + posts.length) % posts.length);
  };

  // Function to check if an image exists
  const imageExists = (url) => {
    // This is a simplified check for demo purposes
    // In production, you'd want to use a more robust method
    return url && url !== '';
  };

  // Post card component
  const PostCard = ({ post, type }) => {
    const isCenter = type === 'center-focus';
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    
    return (
      <motion.div
        className={`relative overflow-hidden rounded-xl transition-all duration-500 ${
          isCenter 
            ? 'w-[280px] sm:w-[380px] h-[320px] sm:h-[420px] z-10' 
            : 'w-[160px] sm:w-[220px] h-[240px] sm:h-[320px] opacity-40'
        }`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isCenter ? { opacity: 1, scale: 1 } : { opacity: 0.4, scale: 0.85 }}
        transition={{ duration: 0.5 }}
        whileHover={isCenter ? { scale: 1.02 } : { opacity: 0.6 }}
        onMouseEnter={() => isCenter && setIsAutoplay(false)}
        onMouseLeave={() => setIsAutoplay(true)}
      >
        {/* Post background - either image or gradient fallback */}
        <div className="absolute inset-0">
          {!imageError ? (
            <img 
              src={post.image}
              alt={post.caption}
              className="w-full h-full object-cover"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              style={{
                opacity: imageLoaded ? 0.8 : 0,
                filter: isCenter ? 'none' : 'blur(1px)',
                transition: 'opacity 0.5s ease'
              }}
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${post.color}`}>
              {/* Decorative pattern for gradient background */}
              <div className="absolute inset-0 opacity-30">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse">
                      <path d="M 8 0 L 0 0 0 8" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"/>
                    </pattern>
                    <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                      <rect width="80" height="80" fill="url(#smallGrid)"/>
                      <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
            </div>
          )}
        </div>
        
        {/* Overlay for text readability */}
        <div className={`absolute inset-0 ${
          isCenter 
            ? 'bg-gradient-to-t from-black/80 via-black/40 to-transparent' 
            : 'bg-gradient-to-t from-black/90 via-black/60 to-black/40'
        }`}></div>
        
        {/* Glassmorphism effect */}
        <div className={`absolute inset-0 ${
          isCenter 
            ? 'backdrop-blur-[2px]' 
            : 'backdrop-blur-[3px]'
        }`}></div>
        
        {/* Glowing border for center post */}
        {isCenter && (
          <div className="absolute inset-0 rounded-xl border border-primary/30 shadow-[0_0_15px_rgba(162,89,255,0.3)]"></div>
        )}
        
        {/* Post content */}
        <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-end">
          {/* Platform icon */}
          <div className="absolute top-3 right-3 text-white/80">
            <span className="text-lg sm:text-xl">{platformIcons[post.platform]}</span>
          </div>
          
          {/* Play button for video */}
          {post.type === 'video' && isCenter && (
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                className="w-14 h-14 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                whileHover={{ scale: 1.1, backgroundColor: "rgba(162, 89, 255, 0.3)" }}
              >
                <FaPlay className="text-white text-xl ml-1" />
              </motion.div>
            </div>
          )}
          
          {/* Post caption - only for center post */}
          {isCenter && (
            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-bold line-clamp-2">{post.caption}</h3>
              <p className="text-xs sm:text-sm text-white/60">
                {post.date} • {post.stats}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <section className="relative py-16 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section title */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-2 heading-glow section-title-gradient">From My Feed</h2>
          <div className="w-20 h-1 bg-primary mx-auto neon-divider"></div>
          <p className="mt-4 text-white/70 max-w-xl mx-auto">
            A glimpse of my latest social posts and creative updates across platforms
          </p>
        </motion.div>
        
        {/* Carousel container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Background glow effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-primary/5 blur-[80px] rounded-full -z-10"></div>
          
          {/* Posts carousel */}
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            <button 
              className="hidden sm:block absolute left-0 sm:left-10 z-20 bg-black/30 backdrop-blur-sm hover:bg-black/50 p-3 rounded-full text-white/70 hover:text-white transition-colors" 
              onClick={handlePrevious}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            {/* Previous post preview */}
            <PostCard post={previousPost} type="left-preview" />
            
            {/* Current post (center) */}
            <motion.div
              key={currentPost.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={controls}
            >
              <PostCard post={currentPost} type="center-focus" />
            </motion.div>
            
            {/* Next post preview */}
            <PostCard post={nextPost} type="right-preview" />
            
            <button 
              className="hidden sm:block absolute right-0 sm:right-10 z-20 bg-black/30 backdrop-blur-sm hover:bg-black/50 p-3 rounded-full text-white/70 hover:text-white transition-colors" 
              onClick={handleNext}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          
          {/* Mobile navigation dots */}
          <div className="flex justify-center mt-8 sm:hidden">
            {posts.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 mx-1 rounded-full ${
                  index === currentIndex ? 'bg-primary' : 'bg-white/30'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
          
          {/* View all link */}
          <div className="text-center mt-10">
            <a href="#" className="inline-flex items-center text-sm text-primary hover:text-primary/80 text-glow-hover">
              View all posts
              <svg className="ml-1 w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialGlimpseCarousel; 