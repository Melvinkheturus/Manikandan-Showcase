import { useState, useEffect } from 'react';
import supabase from './supabaseClient';

// Fallback data for important sections to prevent loading states from hanging
const fallbackData = {
  hero: {
    title: "Manikandan Raman",
    subtitle: "Designer & Developer",
    enabled: true,
    content: {}
  },
  about: {
    title: "About Me",
    enabled: true,
    content: {}
  },
  skills: {
    title: "Skills",
    enabled: true,
    content: {}
  },
  experience: {
    title: "Experience",
    enabled: true,
    content: {}
  },
  contact: {
    title: "Contact",
    enabled: true,
    content: {}
  }
};

/**
 * Custom hook to fetch and subscribe to section data from Supabase
 * 
 * @param {string} sectionSlug - The section slug (e.g., 'hero', 'about', 'skills')
 * @returns {Object} Section data and loading state
 */
export default function useSectionData(sectionSlug) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Set a timeout to prevent indefinite loading
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loading && fallbackData[sectionSlug]) {
        console.log(`Loading timeout for ${sectionSlug}, using fallback data`);
        setData(fallbackData[sectionSlug]);
        setLoading(false);
      }
    }, 5000); // 5 seconds timeout
    
    return () => clearTimeout(timeoutId);
  }, [loading, sectionSlug]);

  useEffect(() => {
    // Function to fetch section data
    const fetchSectionData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get the section record
        const { data: sectionData, error: sectionError } = await supabase
          .from('page_sections')
          .select('*')
          .eq('slug', sectionSlug)
          .single();

        if (sectionError) {
          console.error(`Error fetching ${sectionSlug} section:`, sectionError);
          throw sectionError;
        }

        // If section doesn't exist or is disabled, return null or fallback
        if (!sectionData || !sectionData.enabled) {
          setData(fallbackData[sectionSlug] || null);
          setLoading(false);
          return;
        }

        // Set data with the content directly from the content field
        setData({
          ...sectionData,
          content: sectionData.content || {}
        });
      } catch (error) {
        console.error(`Error fetching ${sectionSlug} section:`, error);
        setError(error.message);
        
        // Use fallback data if available
        if (fallbackData[sectionSlug]) {
          setData(fallbackData[sectionSlug]);
        }
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchSectionData();

    // Set up real-time subscription for the section
    let sectionChannel;
    try {
      sectionChannel = supabase
        .channel(`section-${sectionSlug}`)
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'page_sections', filter: `slug=eq.${sectionSlug}` }, 
          fetchSectionData
        )
        .subscribe(channel => {
          console.log(`Subscribed to ${sectionSlug} changes`);
        });
    } catch (err) {
      console.error(`Error setting up subscription for ${sectionSlug}:`, err);
    }

    // Cleanup subscriptions
    return () => {
      if (sectionChannel) {
        supabase.removeChannel(sectionChannel);
      }
    };
  }, [sectionSlug]);

  return { data, loading, error };
} 