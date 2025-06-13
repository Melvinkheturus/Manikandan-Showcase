import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import supabase from '../utils/supabaseClient';
import SkillsJourney from '../portfolio/components/skills/SkillsJourney';
import SectionWrapper from '../portfolio/components/layout/SectionWrapper';

const SkillsSection = ({ sectionId }) => {
  // Always declare all hooks at the top level
  const [sectionData, setSectionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);

  // Fetch section data
  useEffect(() => {
    const fetchSectionData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // If we have a section ID, fetch data
        if (sectionId) {
          const { data, error } = await supabase
            .from('page_sections')
            .select('*')
            .eq('id', sectionId)
            .single();
          
          if (error) throw error;
          setSectionData(data);
        }
        
        // Set a timeout to ensure we don't get stuck loading
        setTimeout(() => {
          setIsReady(true);
          setLoading(false);
        }, 500);
      } catch (err) {
        console.error('Error fetching section data:', err);
        setError(err);
        setLoading(false);
        setIsReady(true);
      }
    };
    
    fetchSectionData();
  }, [sectionId]);

  if (loading && !isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <SectionWrapper id="skills" threshold={0.5}>
      <div className="text-center pt-8">
        <h2 className="text-4xl md:text-5xl font-bold mb-2">
          WHAT I <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">DO</span>
        </h2>
      </div>
      
      {/* Use our SkillsJourney component */}
      <SkillsJourney />
    </SectionWrapper>
  );
};

export default SkillsSection; 