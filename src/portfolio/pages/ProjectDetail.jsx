import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';
import { useInView } from 'react-intersection-observer';
import supabase from '../../utils/supabaseClient';
import LoadingScreen from '../components/ui/LoadingScreen';
import getSampleProject from '../../utils/sampleProjectData';
import { ProjectDetailEmpty } from '../components/common/EmptyStates';

// Import all section components
import ProjectHero from '../../sections/ProjectSections/ProjectHero';
import QuickInfoStrip from '../../sections/ProjectSections/QuickInfoStrip';
import ProjectSummary from '../../sections/ProjectSections/ProjectSummary';
import ProblemSolutionSection from '../../sections/ProjectSections/ProblemSolutionSection';
import FeaturesSection from '../../sections/ProjectSections/FeaturesSection';
import VisualShowcase from '../../sections/ProjectSections/VisualShowcase';
import DesignProcess from '../../sections/ProjectSections/DesignProcess';
import ResultsLearnings from '../../sections/ProjectSections/ResultsLearnings';
import ResourceLinks from '../../sections/ProjectSections/ResourceLinks';
import ProjectNavigation from '../../sections/ProjectSections/ProjectNavigation';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, SplitText);

const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextProject, setNextProject] = useState(null);

  useEffect(() => {
    // For development purposes, use sample project data
    const sampleProject = getSampleProject(slug);
    if (sampleProject) {
      setProject(sampleProject);
      
      // Get next project for navigation
      const projectSlugs = ["examinerpro", "event-management", "examinerpro-uiux"];
      const currentIndex = projectSlugs.indexOf(slug);
      const nextIndex = (currentIndex + 1) % projectSlugs.length;
      const nextProjectSlug = projectSlugs[nextIndex];
      
      setNextProject(getSampleProject(nextProjectSlug));
      setLoading(false);
      return;
    }
    
    // If no sample project found or in production, fetch from Supabase
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        
        // Fetch the main project data
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .single();
        
        if (projectError) throw projectError;
        
        if (!projectData) {
          throw new Error('Project not found');
        }
        
        // Fetch the next project for navigation
        const { data: nextProjectData } = await supabase
          .from('projects')
          .select('id, title, slug, thumbnail')
          .gt('id', projectData.id)
          .order('id', { ascending: true })
          .limit(1);
        
        // If no next project found, get the first project (loop around)
        if (!nextProjectData || nextProjectData.length === 0) {
          const { data: firstProject } = await supabase
            .from('projects')
            .select('id, title, slug, thumbnail')
            .order('id', { ascending: true })
            .limit(1);
            
          setNextProject(firstProject?.[0] || null);
        } else {
          setNextProject(nextProjectData[0]);
        }
        
        setProject(projectData);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError(err.message);
        
        // Use sample project data if not found in database
        const sampleProject = getSampleProject(slug);
        if (sampleProject) {
          setProject(sampleProject);
          setError(null);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjectData();
    
    // Scroll to top when the component mounts
    window.scrollTo(0, 0);
  }, [slug]);
  
  // Reset ScrollTrigger when the component unmounts
  useEffect(() => {
    return () => {
      const triggers = ScrollTrigger.getAll();
      triggers.forEach(trigger => trigger.kill());
    };
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !project) {
    return <ProjectDetailEmpty />;
  }

  return (
    <div className="min-h-screen">
      {/* 1. Hero Section - Mandatory */}
      <ProjectHero project={project} />
      
      {/* 2. Quick Info Strip - Mandatory */}
      <QuickInfoStrip project={project} />
      
      {/* 3. Summary/Description - Mandatory */}
      <ProjectSummary project={project} />
      
      {/* 4. Problem → Solution Section - Mandatory */}
      <ProblemSolutionSection project={project} />
      
      {/* 5. Features & Functionality - Optional */}
      {project.showFeatures && (
        <FeaturesSection project={project} />
      )}
      
      {/* 6. Visual Showcase - Mandatory */}
      <VisualShowcase project={project} />
      
      {/* 7. Design Process - Optional */}
      {project.showDesignProcess && (
        <DesignProcess project={project} />
      )}
      
      {/* 8. Results & Learnings - Optional */}
      {project.showResults && (
        <ResultsLearnings project={project} />
      )}
      
      {/* 9. Resource Links - Mandatory */}
      <ResourceLinks project={project} />
      
      {/* 10. Navigation Footer - Mandatory */}
      <ProjectNavigation nextProject={nextProject} />
    </div>
  );
};

export default ProjectDetail; 