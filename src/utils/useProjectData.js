import { useState, useEffect } from 'react';
import supabase from './supabaseClient';

/**
 * Custom hook to fetch a list of projects
 * 
 * @param {Object} options - Fetch options
 * @param {boolean} options.featuredOnly - Fetch only featured projects
 * @param {number} options.limit - Maximum number of projects to fetch
 * @returns {Object} Projects data and loading state
 */
export function useProjects({ featuredOnly = false, limit = null } = {}) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build query
        let query = supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        // Add featured filter if needed
        if (featuredOnly) {
          query = query.eq('featured', true);
        }

        // Add limit if provided
        if (limit) {
          query = query.limit(limit);
        }

        const { data, error } = await query;

        if (error) throw error;

        setProjects(data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchProjects();

    // Subscribe to changes
    const channel = supabase
      .channel('projects-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'projects' }, 
        fetchProjects
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [featuredOnly, limit]);

  return { projects, loading, error };
}

/**
 * Custom hook to fetch a single project and its sections
 * 
 * @param {string} slug - Project slug
 * @returns {Object} Project data, sections and loading state
 */
export function useProjectDetail(slug) {
  const [project, setProject] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    const fetchProjectDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch project basic info
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('slug', slug)
          .single();

        if (projectError) throw projectError;

        if (!projectData) {
          setError('Project not found');
          setLoading(false);
          return;
        }

        setProject(projectData);

        // Fetch project sections
        const { data: sectionsData, error: sectionsError } = await supabase
          .from('project_sections')
          .select('*')
          .eq('enabled', true)
          .order('position');

        if (sectionsError) throw sectionsError;

        // Set sections with content
        setSections(sectionsData || []);
      } catch (error) {
        console.error('Error fetching project detail:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchProjectDetail();

    // Subscribe to changes in the project
    const projectChannel = supabase
      .channel(`project-${slug}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'projects', filter: `slug=eq.${slug}` }, 
        fetchProjectDetail
      )
      .subscribe();

    // Subscribe to changes in project sections
    const sectionsChannel = supabase
      .channel(`project-sections-${slug}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'project_sections' }, 
        fetchProjectDetail
      )
      .subscribe();

    return () => {
      supabase.removeChannel(projectChannel);
      supabase.removeChannel(sectionsChannel);
    };
  }, [slug]);

  return { project, sections, loading, error };
} 