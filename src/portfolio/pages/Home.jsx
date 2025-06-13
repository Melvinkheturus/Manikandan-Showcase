import React, { useState, useEffect } from 'react';
import supabase from '../../utils/supabaseClient';
import LoadingScreen from '../components/ui/LoadingScreen';
import { motion } from 'framer-motion';
import SectionWrapper from '../components/layout/SectionWrapper';

// Section Components
import HeroSection from '../../sections/HeroSection';
import AboutSection from '../../sections/AboutSection';
import SkillsSection from '../../sections/SkillsSection';
import ProjectGallery from './ProjectGallery';
import ExperienceSection from '../../sections/ExperienceSection';
import FooterContactSection from '../../sections/FooterContactSection';

// Fallback sections for when database connection fails
const fallbackSections = [
  { id: 'hero-fallback', slug: 'hero', position: 1, enabled: true },
  { id: 'skills-fallback', slug: 'skills', position: 2, enabled: true },
  { id: 'projects-fallback', slug: 'projects', position: 3, enabled: true }
];

const Home = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Set a timeout to prevent indefinite loading
    const loadingTimeout = setTimeout(() => {
      if (loading) {
        console.log('Loading timeout reached, using fallback sections');
        setSections(fallbackSections);
        setLoading(false);
      }
    }, 5000); // 5 seconds timeout

    const fetchSections = async () => {
      try {
        setLoading(true);
        
        // Fetch all enabled sections
        const { data, error } = await supabase
          .from('page_sections')
          .select('*')
          .eq('enabled', true)
          .order('position');
        
        if (error) {
          console.error('Supabase query error:', error);
          throw error;
        }
        
        // If data is valid, use it, otherwise fallback
        if (data && data.length > 0) {
          setSections(data);
        } else {
          console.warn('No sections found, using fallback sections');
          setSections(fallbackSections);
        }
      } catch (err) {
        console.error('Error fetching sections:', err);
        setError(err.message);
        // Use fallback sections on error
        setSections(fallbackSections);
      } finally {
        setLoading(false);
        clearTimeout(loadingTimeout);
      }
    };
    
    fetchSections();
    
    // Subscribe to section changes with error handling
    let channel;
    try {
      channel = supabase
      .channel('public:page_sections')
      .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'page_sections' }, 
          fetchSections)
        .subscribe((status) => {
          console.log(`Supabase channel status: ${status}`);
        });
    } catch (err) {
      console.error('Error setting up Supabase subscription:', err);
    }
    
    return () => {
      clearTimeout(loadingTimeout);
      if (channel) {
        try {
      supabase.removeChannel(channel);
        } catch (err) {
          console.error('Error removing channel:', err);
        }
      }
    };
  }, []);

  // Map section types to components
  const sectionComponents = {
    'hero': HeroSection,
    'about': AboutSection,
    'skills': SkillsSection,
    'projects': ProjectGallery,
    'experience': ExperienceSection,
    'contact': FooterContactSection
  };

  // Loading timeout of 8 seconds to prevent indefinite loading screen
  useEffect(() => {
    const loadingScreenTimeout = setTimeout(() => {
      if (loading) setLoading(false);
    }, 8000);
    
    return () => clearTimeout(loadingScreenTimeout);
  }, [loading]);

  if (loading) {
    return <LoadingScreen />;
  }

  // Even if there's an error, still render the fallback sections
  if (error && sections.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-500">Error</h1>
          <p className="mt-2 text-gray-300">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Render sections in the order specified by position */}
      {sections.map((section) => {
        const SectionComponent = sectionComponents[section.slug];
        
        if (!SectionComponent) {
          console.warn(`No component found for section slug: ${section.slug}`);
          return null;
        }
        
        return <SectionComponent key={section.id} sectionId={section.id} />;
      })}
    </div>
  );
};

export default Home; 