import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, FiSave, FiChevronRight, FiEye, FiToggleRight, FiToggleLeft, 
  FiEdit2, FiLayers, FiBox, FiImage, FiBarChart, FiAward, FiCode, 
  FiCpu, FiGitBranch, FiGlobe, FiHardDrive, FiTerminal, FiX
} from 'react-icons/fi';
import supabase from '../../../utils/supabaseClient';
import CloudinaryUpload from '../../components/CloudinaryUpload';
import ContentPageLayout, { ContentSection } from '../../CMSHelper/ContentPageLayout';
import { TextInput, Button, Toggle } from '../../CMSHelper/FormComponents';

const CMSProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  // State
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState({
    id: null,
    title: '',
    slug: '',
    category: 'Visual Identity',
    type: '',
    description: '',
    problem_solved: '',
    who_it_helped: '',
    your_contribution: '',
    short_description: '',
    thumbnail_url: '',
    hero_image: '',
    gallery_urls: [],
    video_demo_url: '',
    problem: '',
    solution: '',
    process: '',
    process_steps: [],
    wireframes: [],
    mockups: [],
    color_typography: '',
    design_rationale: '',
    results: '',
    achievements: [],
    learnings: '',
    metrics: [],
    project_url: '',
    github_url: '',
    figma_url: '',
    pdf_url: '',
    tags: [],
    tech_stack: [],
    tools_used: [],
    project_type: 'Personal',
    is_published: false,
    features: [],
    role: '',
    timeline: '',
    showcase_items: [],
    resource_links: [],
    detail_page_enabled: false,
    sections_enabled: {
      hero: true,
      overview: true,
      quick_info: false,
      problem_solution: false,
      features: false,
      visual_showcase: false,
      process: false, 
      results: false,
      resource_links: false,
      technologies: false,
      gallery: true
    }
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState(false);
  const [formChanged, setFormChanged] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [autoSave, setAutoSave] = useState(true);
  
  // Categories
  const categories = [
    'Visual Identity',
    'UI/UX',
    'Development', 
    'AI Projects',
    'Creative Lab'
  ];
  
  // Available sections for detail page with new structure
  const availableSections = [
    { id: 'hero', name: 'Hero Section', icon: <FiImage />, required: true, description: 'Main project introduction' },
    { id: 'overview', name: 'Project Overview', icon: <FiLayers />, required: true, description: 'Summary and description' },
    { id: 'quick_info', name: 'Quick Info Panel', icon: <FiBarChart />, description: 'Key project metrics and facts' },
    { id: 'problem_solution', name: 'Problem → Solution', icon: <FiAward />, description: 'Challenge and approach' },
    { id: 'features', name: 'Features & Functionality', icon: <FiBox />, description: 'Main features and capabilities' },
    { id: 'visual_showcase', name: 'Visual Showcase', icon: <FiImage />, description: 'Image gallery with annotations' },
    { id: 'process', name: 'Design Process', icon: <FiGitBranch />, description: 'Your approach and workflow' },
    { id: 'results', name: 'Results & Impact', icon: <FiBarChart />, description: 'Outcomes and achievements' },
    { id: 'resource_links', name: 'Resource Links', icon: <FiGlobe />, description: 'External resources and URLs' },
    { id: 'technologies', name: 'Technologies Used', icon: <FiCpu />, description: 'Tools and technologies' },
  ];
  
  // Load all projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);
  
  // Load specific project data when ID changes
  useEffect(() => {
    if (projectId && projectId !== 'new') {
      fetchProjectDetails(projectId);
    } else {
      setLoading(false);
    }
  }, [projectId]);
  
  // Fetch all projects for selector
  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          id, 
          title,
          thumbnail_url,
          category,
          detail_page_enabled,
          category_id,
          project_categories(key, label)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedProjects = data.map(project => ({
        ...project,
        category: project.project_categories?.label || project.category || 'Uncategorized'
      }));
      
      setProjects(formattedProjects);
      } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };
  
  // Fetch detailed project data
  const fetchProjectDetails = async (id) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      // If sections_enabled is null, initialize with default values
      const sectionsEnabled = data.sections_enabled || {
        hero: true,
        overview: true,
        problem: false,
        solution: false,
        process: false, 
        features: false,
        results: false,
        technologies: false,
        gallery: true
      };
      
      setProject({
        ...data,
        sections_enabled: sectionsEnabled
      });
      setLoading(false);
      } catch (error) {
      console.error('Error fetching project details:', error);
      setLoading(false);
    }
  };
  
  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setProject(prev => ({
      ...prev,
      [name]: value
    }));
    
    setFormChanged(true);
    if (autoSave) handleSaveDebounced();
  };
  
  // Handle slug generation from title
  const handleTitleChange = (e) => {
    const { value } = e.target;
    
    // Generate slug from title
    const slug = value
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    
    setProject(prev => ({
      ...prev,
      title: value,
      slug: slug
    }));
    
    setFormChanged(true);
    if (autoSave) handleSaveDebounced();
  };
  
  // Handle tag changes
  const handleTagsChange = (e) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    setProject(prev => ({
      ...prev,
      tags: tagsArray
    }));
    
    setFormChanged(true);
    if (autoSave) handleSaveDebounced();
  };
  
  // Handle thumbnail upload
  const handleThumbnailUpload = (url) => {
    setProject(prev => ({
      ...prev,
      thumbnail_url: url
    }));
    
    setFormChanged(true);
    if (autoSave) handleSaveDebounced();
  };
  
  // Handle gallery upload
  const handleGalleryUpload = (urls) => {
    setProject(prev => ({
      ...prev,
      gallery_urls: urls
    }));
    
    setFormChanged(true);
    if (autoSave) handleSaveDebounced();
  };

  // Handle section toggle
  const toggleSection = (sectionId) => {
    // Don't allow disabling required sections
    const section = availableSections.find(s => s.id === sectionId);
    if (section?.required) return;
    
    setProject(prev => ({
      ...prev,
      sections_enabled: {
        ...prev.sections_enabled,
        [sectionId]: !prev.sections_enabled[sectionId]
      }
    }));
    
    setFormChanged(true);
    if (autoSave) handleSaveDebounced();
  };
  
  // Toggle detail page enable/disable
  const toggleDetailPage = () => {
    setProject(prev => ({
      ...prev,
      detail_page_enabled: !prev.detail_page_enabled
    }));
    
    setFormChanged(true);
    if (autoSave) handleSaveDebounced();
  };
  
  // Create debounced save function for auto-save
  const handleSaveDebounced = () => {
    clearTimeout(window.saveTimeout);
    window.saveTimeout = setTimeout(() => {
      handleSubmit();
    }, 2000);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (saving) return;
    
    const isValid = validateForm();
    if (!isValid) {
      alert('Please fill in all required fields in enabled sections.');
      return;
    }
    
    setSaving(true);
    
    try {
      // Validate required fields
      if (!project.title || !project.slug || !project.category) {
        alert('Please fill in all required fields (title, slug, category)');
        setSaving(false);
        return;
      }
      
      let result;
      
      if (!project.id) {
        // Create new project
        const { data, error } = await supabase
          .from('projects')
          .insert([{
            ...project,
            created_at: new Date()
          }])
          .select()
          .single();
          
        if (error) throw error;
        result = data;
      } else {
        // Update existing project
        const { data, error } = await supabase
          .from('projects')
          .update({
            ...project,
            updated_at: new Date()
          })
          .eq('id', project.id)
          .select()
          .single();
          
        if (error) throw error;
        result = data;
      }
      
      setFormChanged(false);
      
      // Navigate to edit mode if this was a new project
      if (!project.id && result) {
        navigate(`/admin/project-details/${result.id}`, { replace: true });
        setProject({...result});
      }
      
      // Refresh projects list
      fetchProjects();
      
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project');
    } finally {
      setSaving(false);
    }
  };
  
  // Handle project publish toggle
  const togglePublish = () => {
    setProject(prev => ({
      ...prev,
      is_published: !prev.is_published
    }));
    
    setFormChanged(true);
    if (autoSave) handleSaveDebounced();
  };
  
  // Add a new feature
  const addFeature = () => {
    setProject(prev => ({
      ...prev,
      features: [
        ...(prev.features || []),
        { title: '', description: '' }
      ]
    }));
    
    setFormChanged(true);
  };
  
  // Update a feature
  const updateFeature = (index, field, value) => {
    setProject(prev => {
      const features = [...(prev.features || [])];
      features[index] = {
        ...features[index],
        [field]: value
      };
      
      return {
        ...prev,
        features
      };
    });
    
    setFormChanged(true);
    if (autoSave) handleSaveDebounced();
  };
  
  // Remove a feature
  const removeFeature = (index) => {
    setProject(prev => {
      const features = [...(prev.features || [])];
      features.splice(index, 1);
      
      return {
        ...prev,
        features
      };
    });
    
    setFormChanged(true);
    if (autoSave) handleSaveDebounced();
  };
  
  // Handle project selection from the list
  const selectProject = (selectedProject) => {
    if (formChanged) {
      const confirm = window.confirm('You have unsaved changes. Do you want to continue?');
      if (!confirm) return;
    }
    
    navigate(`/admin/project-details/${selectedProject.id}`);
  };
  
  // Toggle autosave
  const toggleAutoSave = () => {
    setAutoSave(!autoSave);
  };
  
  // Filtered projects for search
  const filteredProjects = projects.filter(p => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
  return (
      (p.title && p.title.toLowerCase().includes(query)) ||
      (p.category && p.category.toLowerCase().includes(query))
    );
  });
  
  // Add a new showcase item
  const addShowcaseItem = () => {
    setProject(prev => ({
      ...prev,
      showcase_items: [
        ...(prev.showcase_items || []),
        { image: '', title: '', description: '' }
      ]
    }));
    
    setFormChanged(true);
  };
  
  // Update a showcase item
  const updateShowcaseItem = (index, field, value) => {
    setProject(prev => {
      const items = [...(prev.showcase_items || [])];
      items[index] = {
        ...items[index],
        [field]: value
      };
      
      return {
        ...prev,
        showcase_items: items
      };
    });
    
    setFormChanged(true);
    if (autoSave) handleSaveDebounced();
  };
  
  // Remove a showcase item
  const removeShowcaseItem = (index) => {
    setProject(prev => {
      const items = [...(prev.showcase_items || [])];
      items.splice(index, 1);
      
      return {
        ...prev,
        showcase_items: items
      };
    });
    
    setFormChanged(true);
    if (autoSave) handleSaveDebounced();
  };
  
  // Add a new process step
  const addProcessStep = () => {
    setProject(prev => ({
      ...prev,
      process_steps: [
        ...(prev.process_steps || []),
        { title: '', description: '', image: '' }
      ]
    }));
    
    setFormChanged(true);
  };
  
  // Update a process step
  const updateProcessStep = (index, field, value) => {
    setProject(prev => {
      const steps = [...(prev.process_steps || [])];
      steps[index] = {
        ...steps[index],
        [field]: value
      };
      
      return {
        ...prev,
        process_steps: steps
      };
    });
    
    setFormChanged(true);
    if (autoSave) handleSaveDebounced();
  };
  
  // Remove a process step
  const removeProcessStep = (index) => {
    setProject(prev => {
      const steps = [...(prev.process_steps || [])];
      steps.splice(index, 1);
      
      return {
        ...prev,
        process_steps: steps
      };
    });
    
    setFormChanged(true);
    if (autoSave) handleSaveDebounced();
  };
  
  // Add a new metric
  const addMetric = () => {
    setProject(prev => ({
      ...prev,
      metrics: [
        ...(prev.metrics || []),
        { label: '', value: '', unit: '' }
      ]
    }));
    
    setFormChanged(true);
  };
  
  // Update a metric
  const updateMetric = (index, field, value) => {
    setProject(prev => {
      const metrics = [...(prev.metrics || [])];
      metrics[index] = {
        ...metrics[index],
        [field]: value
      };
      
      return {
        ...prev,
        metrics
      };
    });
    
    setFormChanged(true);
    if (autoSave) handleSaveDebounced();
  };
  
  // Remove a metric
  const removeMetric = (index) => {
    setProject(prev => {
      const metrics = [...(prev.metrics || [])];
      metrics.splice(index, 1);
      
      return {
        ...prev,
        metrics
      };
    });
    
    setFormChanged(true);
    if (autoSave) handleSaveDebounced();
  };
  
  // Add a new resource link
  const addResourceLink = () => {
    setProject(prev => ({
      ...prev,
      resource_links: [
        ...(prev.resource_links || []),
        { title: '', url: '', type: 'website' }
      ]
    }));
    
    setFormChanged(true);
  };
  
  // Update a resource link
  const updateResourceLink = (index, field, value) => {
    setProject(prev => {
      const links = [...(prev.resource_links || [])];
      links[index] = {
        ...links[index],
        [field]: value
      };
      
      return {
        ...prev,
        resource_links: links
      };
    });
    
    setFormChanged(true);
    if (autoSave) handleSaveDebounced();
  };
  
  // Remove a resource link
  const removeResourceLink = (index) => {
    setProject(prev => {
      const links = [...(prev.resource_links || [])];
      links.splice(index, 1);
      
      return {
        ...prev,
        resource_links: links
      };
    });
    
    setFormChanged(true);
    if (autoSave) handleSaveDebounced();
  };
  
  // Handle multi-tag selection for tech_stack
  const handleTechStackChange = (e) => {
    const techString = e.target.value;
    const techArray = techString.split(',').map(tech => tech.trim()).filter(tech => tech);
    
    setProject(prev => ({
      ...prev,
      tech_stack: techArray
    }));
    
    setFormChanged(true);
    if (autoSave) handleSaveDebounced();
  };
  
  // Handle multi-tag selection for tools_used
  const handleToolsUsedChange = (e) => {
    const toolsString = e.target.value;
    const toolsArray = toolsString.split(',').map(tool => tool.trim()).filter(tool => tool);
    
    setProject(prev => ({
      ...prev,
      tools_used: toolsArray
    }));
    
    setFormChanged(true);
    if (autoSave) handleSaveDebounced();
  };
  
  // Add achievement to bullet list
  const addAchievement = () => {
    setProject(prev => ({
      ...prev,
      achievements: [...(prev.achievements || []), '']
    }));
    
    setFormChanged(true);
  };
  
  // Update achievement
  const updateAchievement = (index, value) => {
    setProject(prev => {
      const achievements = [...(prev.achievements || [])];
      achievements[index] = value;
      
      return {
        ...prev,
        achievements
      };
    });
    
    setFormChanged(true);
    if (autoSave) handleSaveDebounced();
  };
  
  // Remove achievement
  const removeAchievement = (index) => {
    setProject(prev => {
      const achievements = [...(prev.achievements || [])];
      achievements.splice(index, 1);
      
      return {
        ...prev,
        achievements
      };
    });
    
    setFormChanged(true);
    if (autoSave) handleSaveDebounced();
  };
  
  // Handle wireframe upload
  const handleWireframesUpload = (urls) => {
    setProject(prev => ({
      ...prev,
      wireframes: urls
    }));
    
    setFormChanged(true);
    if (autoSave) handleSaveDebounced();
  };
  
  // Handle mockups upload
  const handleMockupsUpload = (urls) => {
    setProject(prev => ({
      ...prev,
      mockups: urls
    }));
    
    setFormChanged(true);
    if (autoSave) handleSaveDebounced();
  };
  
  // Handle PDF upload
  const handlePdfUpload = (url) => {
    setProject(prev => ({
      ...prev,
      pdf_url: url
    }));
    
    setFormChanged(true);
    if (autoSave) handleSaveDebounced();
  };
  
  // Validate form before saving
  const validateForm = () => {
    // Validate mandatory fields
    if (!project.title || !project.slug || !project.category || 
        !project.description || !project.problem_solved || 
        !project.who_it_helped || !project.your_contribution) {
      return false;
    }
    
    // Validate enabled optional sections
    if (project.sections_enabled.problem_solution) {
      if (!project.problem || !project.solution) return false;
    }
    
    if (project.sections_enabled.features) {
      if (project.features.length > 0) {
        const invalidFeatures = project.features.some(feature => !feature.title || !feature.description);
        if (invalidFeatures) return false;
      }
    }
    
    return true;
  };
  
  if (loading) {
    return (
      <ContentPageLayout
        title="Project Details"
        icon={<FiLayers size={24} />}
        breadcrumbs={[
          { label: "Dashboard", path: "/admin" },
          { label: "Projects CRM", path: "/admin/projects" },
          { label: "Project Details" }
        ]}
      >
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      </ContentPageLayout>
    );
  }

  return (
    <ContentPageLayout
      title="Project Details"
      icon={<FiLayers size={24} />}
      breadcrumbs={[
        { label: "Dashboard", path: "/admin" },
        { label: "Projects CRM", path: "/admin/project-gallery" },
        { label: "Project Details" }
      ]}
      onSave={handleSubmit}
      hasUnsavedChanges={formChanged}
      autoSaveEnabled={autoSave}
      onToggleAutoSave={toggleAutoSave}
      previewUrl={project.id ? `/projects/${project.slug}` : null}
    >
      {/* Project Selector */}
      <ContentSection 
        title="Project Selector" 
        icon={<FiBox size={20} />}
        collapsible={true}
        defaultCollapsed={project.id !== null}
      >
        <div className="mb-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <TextInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="w-full"
              />
              <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        </div>
        
            <Link to="/admin/project-details/new">
              <Button>Create New Project</Button>
          </Link>
          </div>
        </div>
        
        <div className="rounded-lg border border-gray-800 overflow-hidden">
          <div className="bg-black/40 p-3 border-b border-gray-800 grid grid-cols-12 gap-2">
            <div className="col-span-1 font-medium text-gray-400 text-sm"></div>
            <div className="col-span-5 font-medium text-gray-400 text-sm">Title</div>
            <div className="col-span-3 font-medium text-gray-400 text-sm">Category</div>
            <div className="col-span-2 font-medium text-gray-400 text-sm text-center">Detail Page</div>
            <div className="col-span-1 font-medium text-gray-400 text-sm text-right">Action</div>
          </div>
          
          <div className="max-h-80 overflow-y-auto custom-scrollbar">
            {filteredProjects.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No projects found
              </div>
            ) : (
              filteredProjects.map(p => (
                <div 
                  key={p.id} 
                  className={`grid grid-cols-12 gap-2 p-3 border-b border-gray-800 transition-colors hover:bg-gray-900/20 cursor-pointer ${p.id === project.id ? 'bg-emerald-900/10 border-l-4 border-l-emerald-600' : ''}`}
                  onClick={() => selectProject(p)}
                >
                  <div className="col-span-1">
                    <div className="w-8 h-8 rounded bg-black/40 overflow-hidden">
                      {p.thumbnail_url ? (
                        <img 
                          src={p.thumbnail_url} 
                          alt={p.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                          <FiImage size={14} />
                  </div>
                )}
                  </div>
                  </div>
                  <div className="col-span-5 font-medium flex items-center">{p.title}</div>
                  <div className="col-span-3 flex items-center text-sm text-gray-300">{p.category}</div>
                  <div className="col-span-2 flex justify-center items-center">
                    {p.detail_page_enabled ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-900/30 text-emerald-400">
                        <FiToggleRight className="mr-1" size={12} /> Enabled
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-900/30 text-gray-400">
                        <FiToggleLeft className="mr-1" size={12} /> Disabled
                        </span>
                )}
              </div>
                  <div className="col-span-1 flex justify-end items-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        selectProject(p);
                      }}
                      className="p-1.5 text-gray-400 hover:text-emerald-400 rounded hover:bg-black/40"
                    >
                      <FiEdit2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </ContentSection>
      
      {/* Detail Page Settings */}
      {project.id && (
        <ContentSection
          title="Detail Page Settings"
          icon={<FiGlobe size={20} />}
          collapsible={true}
          defaultCollapsed={false}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 border border-gray-800 rounded-lg bg-black/30">
                  <div>
                <div className="font-medium">Detail Page Visibility</div>
                <div className="text-sm text-gray-400">Enable or disable the detailed page for this project</div>
              </div>
              <Toggle
                checked={project.detail_page_enabled}
                onChange={toggleDetailPage}
                label={project.detail_page_enabled ? "Enabled" : "Disabled"}
              />
            </div>
            
            {project.detail_page_enabled && (
              <div className="border border-gray-800 rounded-lg bg-black/30">
                <div className="p-4 border-b border-gray-800">
                  <h3 className="font-medium">Content Sections</h3>
                  <p className="text-sm text-gray-400">
                    Select which sections to display on the project detail page
                  </p>
                </div>
                
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableSections.map(section => (
                    <div 
                      key={section.id} 
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        section.required ? 'bg-gray-900/20' : 'bg-black/20'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className={`mr-3 p-2 rounded-full ${
                          project.sections_enabled[section.id] 
                            ? 'bg-emerald-900/20 text-emerald-400' 
                            : 'bg-gray-900/20 text-gray-400'
                        }`}>
                          {section.icon}
                      </span>
                        <div>
                          <div className="font-medium flex items-center">
                            {section.name}
                            {section.required && (
                              <span className="ml-2 text-xs px-2 py-0.5 bg-black/40 text-gray-400 rounded-full">
                                Required
                        </span>
                      )}
                          </div>
                          <div className="text-xs text-gray-400">{section.description}</div>
                    </div>
                  </div>
                  
                      <Toggle
                        checked={project.sections_enabled[section.id]}
                        onChange={() => toggleSection(section.id)}
                        disabled={section.required}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ContentSection>
      )}
      
      {/* MANDATORY SECTIONS */}
      {project.id && project.detail_page_enabled && (
        <>
          {/* 1. Hero Section - MANDATORY */}
          <ContentSection
            title="Hero Section"
            icon={<FiImage size={20} />}
            collapsible={true}
            defaultCollapsed={false}
            badge="Required"
          >
            <div className="space-y-6 p-2">
              <div className="bg-black/30 border border-gray-800 rounded-lg p-5">
                <h3 className="text-lg font-medium mb-4 text-emerald-400">Hero Section</h3>
                <p className="text-sm text-gray-400 mb-6">
                  This section appears at the top of your project page and showcases the key project information.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-1.5 text-sm font-medium text-gray-200">
                        Project Title <span className="text-red-400">*</span>
                      </label>
                      <TextInput
                        name="title"
                        value={project.title}
                        onChange={handleTitleChange}
                        placeholder="e.g. Portfolio Website Redesign"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-1.5 text-sm font-medium text-gray-200">
                        Project Category <span className="text-red-400">*</span>
                      </label>
                      <select
                        name="category"
                        value={project.category}
                        onChange={handleChange}
                        className="block w-full px-4 py-2 bg-black/40 border border-gray-800 rounded-lg text-white focus:ring-emerald-500 focus:border-emerald-500"
                        required
                      >
                        {categories.map((category, index) => (
                          <option key={index} value={category}>{category}</option>
                        ))}
                      </select>
                  </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1.5 text-sm font-medium text-gray-200">
                          Role <span className="text-red-400">*</span>
                        </label>
                        <TextInput
                          name="role"
                          value={project.role || ''}
                          onChange={handleChange}
                          placeholder="e.g. Lead Designer, Developer"
                          required
                        />
                </div>
                
                      <div>
                        <label className="block mb-1.5 text-sm font-medium text-gray-200">
                          Timeline <span className="text-red-400">*</span>
                        </label>
                        <TextInput
                          name="timeline"
                          value={project.timeline || ''}
                          onChange={handleChange}
                          placeholder="e.g. 2 weeks, Jan-Mar 2023"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block mb-1.5 text-sm font-medium text-gray-200">
                      Hero Image <span className="text-red-400">*</span>
                    </label>
                    <div className="bg-black/30 border border-gray-800 rounded-lg p-4">
                      <CloudinaryUpload
                        value={project.hero_image || project.thumbnail_url}
                        onChange={(url) => {
                          setProject(prev => ({
                            ...prev,
                            hero_image: url
                          }));
                          setFormChanged(true);
                          if (autoSave) handleSaveDebounced();
                        }}
                        multiple={false}
                        label="Upload Hero Image"
                      />
                      <p className="text-xs text-gray-400 mt-2">
                        This image will be displayed prominently at the top of your project page.
                        Recommended size: 1920×1080px.
                  </p>
                </div>
                  </div>
                </div>
              </div>
            </div>
          </ContentSection>
          
          {/* 2. Project Overview - MANDATORY */}
          <ContentSection
            title="Project Overview"
            icon={<FiLayers size={20} />}
            collapsible={true}
            defaultCollapsed={false}
            badge="Required"
          >
            <div className="space-y-6 p-2">
              <div className="bg-black/30 border border-gray-800 rounded-lg p-5">
                <h3 className="text-lg font-medium mb-4 text-emerald-400">Project Overview</h3>
                <p className="text-sm text-gray-400 mb-6">
                  This section provides an introduction to your project, explaining what it is and its purpose.
                </p>
                
                <div className="space-y-6">
                  <div>
                    <label className="block mb-1.5 text-sm font-medium text-gray-200">
                      URL Slug <span className="text-red-400">*</span>
                    </label>
                    <TextInput
                      name="slug"
                      value={project.slug}
                      onChange={handleChange}
                      placeholder="e.g. portfolio-website-redesign"
                      required
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      This will be used in the URL: /projects/{project.slug || 'your-slug'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block mb-1.5 text-sm font-medium text-gray-200">
                      Project Type
                    </label>
                    <TextInput
                      name="type"
                      value={project.type}
                      onChange={handleChange}
                      placeholder="e.g. Mobile App, Website, etc."
                    />
                  </div>
                </div>
              </div>
              
              {/* Summary / Description Section */}
              <div className="bg-black/30 border border-gray-800 rounded-lg p-5">
                <h3 className="text-lg font-medium mb-4 text-emerald-400">Summary / Description</h3>
                <p className="text-sm text-gray-400 mb-6">
                  Provide a detailed overview of your project and your involvement.
                </p>
                
                <div className="space-y-6">
                  {/* Project Summary */}
                  <div>
                    <label className="block mb-1.5 text-sm font-medium text-gray-200">
                      Project Summary <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={project.description}
                      onChange={handleChange}
                      rows={6}
                      placeholder="Provide a comprehensive overview of your project..."
                      className="block w-full px-4 py-2 bg-black/40 border border-gray-800 rounded-lg text-white focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    ></textarea>
                    <p className="text-xs text-gray-400 mt-1">
                      Explain what this project is about, its purpose, and key aspects.
                    </p>
                  </div>
                  
                  {/* Problem Solved */}
                  <div>
                    <label className="block mb-1.5 text-sm font-medium text-gray-200">
                      Problem Solved <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      name="problem_solved"
                      value={project.problem_solved || ''}
                      onChange={handleChange}
                      rows={4}
                      placeholder="What specific problem did this project address or solve?"
                      className="block w-full px-4 py-2 bg-black/40 border border-gray-800 rounded-lg text-white focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    ></textarea>
                  </div>
                  
                  {/* Who it Helped */}
                  <div>
                    <label className="block mb-1.5 text-sm font-medium text-gray-200">
                      Who it Helped <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      name="who_it_helped"
                      value={project.who_it_helped || ''}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Who are the users or stakeholders that benefited from this project?"
                      className="block w-full px-4 py-2 bg-black/40 border border-gray-800 rounded-lg text-white focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    ></textarea>
                  </div>
                  
                  {/* Your Contribution */}
                  <div>
                    <label className="block mb-1.5 text-sm font-medium text-gray-200">
                      Your Contribution <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      name="your_contribution"
                      value={project.your_contribution || ''}
                      onChange={handleChange}
                      rows={4}
                      placeholder="What was your specific role and contribution to this project?"
                      className="block w-full px-4 py-2 bg-black/40 border border-gray-800 rounded-lg text-white focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block mb-1.5 text-sm font-medium text-gray-200">
                      Tags (comma separated)
                    </label>
                    <TextInput
                      name="tags"
                      value={project.tags ? project.tags.join(', ') : ''}
                      onChange={handleTagsChange}
                      placeholder="e.g. React, Mobile, UI Design"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      These tags will be used for filtering and categorizing your project.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ContentSection>
          
          {/* Section Selector UI */}
          <ContentSection
            title="Add More Sections to This Project"
            icon={<FiLayers size={20} />}
            collapsible={true}
            defaultCollapsed={false}
          >
            <div className="space-y-6 p-2">
              <div className="bg-black/30 border border-gray-800 rounded-lg p-5">
                <h3 className="text-lg font-medium mb-4 text-emerald-400">Section Selector</h3>
                <p className="text-sm text-gray-400 mb-6">
                  Select which additional content sections you'd like to include in this project.
                </p>
                
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: 'quick_info', name: 'Quick Info Strip', description: 'Technical details and project metadata' },
                    { id: 'problem_solution', name: 'Problem → Solution', description: 'Challenge faced and how you solved it' },
                    { id: 'features', name: 'Features & Functionality', description: 'Key features of your project' },
                    { id: 'visual_showcase', name: 'Visual Showcase', description: 'Gallery of images with descriptions' },
                    { id: 'process', name: 'Design Process', description: 'Your approach and workflow' },
                    { id: 'results', name: 'Results & Learnings', description: 'Outcomes and what you learned' },
                    { id: 'resource_links', name: 'Resource Links', description: 'External resources and URLs' }
                  ].map(section => (
                    <div 
                      key={section.id} 
                      className={`flex items-center space-x-3 p-3 rounded-lg border border-gray-800 ${
                        project.sections_enabled[section.id] 
                          ? 'bg-emerald-900/10 border-emerald-500/50' 
                          : 'bg-black/20 hover:bg-gray-900/20'
                      } cursor-pointer`}
                      onClick={() => toggleSection(section.id)}
                    >
                      <input 
                        type="checkbox"
                        checked={!!project.sections_enabled[section.id]}
                        onChange={() => toggleSection(section.id)}
                        className="w-5 h-5 rounded border-gray-700 text-emerald-500 focus:ring-emerald-500 bg-black/40"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-200">{section.name}</h4>
                        <p className="text-sm text-gray-400">{section.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ContentSection>
          
          {/* Quick Info Strip Section - Updated */}
          {project.sections_enabled.quick_info && (
            <ContentSection
              title="Quick Info Strip"
              icon={<FiBarChart size={20} />}
              collapsible={true}
              defaultCollapsed={false}
            >
              <div className="space-y-6 p-2">
                <div className="bg-black/30 border border-gray-800 rounded-lg p-5">
                  <h3 className="text-lg font-medium mb-4 text-emerald-400">Quick Info Strip</h3>
                  <p className="text-sm text-gray-400 mb-6">
                    Add key technical details and project metadata.
                  </p>
                  
                  <div className="space-y-4">
                    {/* Tech Stack */}
                    <div>
                      <label className="block mb-1.5 text-sm font-medium text-gray-200">
                        Tech Stack (comma separated)
                      </label>
                      <TextInput
                        name="tech_stack"
                        value={project.tech_stack ? project.tech_stack.join(', ') : ''}
                        onChange={handleTechStackChange}
                        placeholder="e.g. React, Node.js, PostgreSQL"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        List the programming languages, frameworks, and databases used.
                      </p>
                    </div>
                    
                    {/* Tools Used */}
                    <div>
                      <label className="block mb-1.5 text-sm font-medium text-gray-200">
                        Tools Used (comma separated)
                      </label>
                      <TextInput
                        name="tools_used"
                        value={project.tools_used ? project.tools_used.join(', ') : ''}
                        onChange={handleToolsUsedChange}
                        placeholder="e.g. Figma, VS Code, Adobe XD"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        List the design tools, IDEs, and other software used.
                      </p>
                    </div>
                    
                    {/* Project Type */}
                    <div>
                      <label className="block mb-1.5 text-sm font-medium text-gray-200">
                        Project Type
                      </label>
                      <select
                        name="project_type"
                        value={project.project_type || 'Personal'}
                        onChange={handleChange}
                        className="block w-full px-4 py-2 bg-black/40 border border-gray-800 rounded-lg text-white focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="Client">Client Project</option>
                        <option value="Personal">Personal Project</option>
                        <option value="Internship">Internship</option>
                        <option value="Academic">Academic Project</option>
                      </select>
                    </div>
                    
                    {/* Project Links */}
                    <div>
                      <label className="block mb-1.5 text-sm font-medium text-gray-200">
                        Project URL
                      </label>
                      <TextInput
                        name="project_url"
                        value={project.project_url || ''}
                        onChange={handleChange}
                        placeholder="https://example.com"
                        type="url"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Link to the live project or demo.
                      </p>
                    </div>
                    
                    <div>
                      <label className="block mb-1.5 text-sm font-medium text-gray-200">
                        GitHub URL
                      </label>
                      <TextInput
                        name="github_url"
                        value={project.github_url || ''}
                        onChange={handleChange}
                        placeholder="https://github.com/username/repo"
                        type="url"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Link to the project's source code repository.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ContentSection>
          )}
          
          {/* Problem → Solution Section - Updated */}
          {project.sections_enabled.problem_solution && (
            <ContentSection
              title="Problem → Solution"
              icon={<FiAward size={20} />}
              collapsible={true}
              defaultCollapsed={false}
            >
              <div className="space-y-6 p-2">
                <div className="bg-black/30 border border-gray-800 rounded-lg p-5">
                  <h3 className="text-lg font-medium mb-4 text-emerald-400">Problem → Solution</h3>
                  <p className="text-sm text-gray-400 mb-6">
                    Describe the problem the project aimed to solve and how your solution addressed it.
                  </p>
                  
                  <div className="space-y-6">
                    {/* Problem Statement */}
                    <div>
                      <label className="block mb-1.5 text-sm font-medium text-gray-200">
                        Problem <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        name="problem"
                        value={project.problem || ''}
                        onChange={handleChange}
                        rows={6}
                        placeholder="Describe the problem this project aimed to solve..."
                        className="block w-full px-4 py-2 bg-black/40 border border-gray-800 rounded-lg text-white focus:ring-emerald-500 focus:border-emerald-500"
                        required={project.sections_enabled.problem_solution}
                      ></textarea>
                    </div>
                    
                    {/* Solution */}
                    <div>
                      <label className="block mb-1.5 text-sm font-medium text-gray-200">
                        Solution <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        name="solution"
                        value={project.solution || ''}
                        onChange={handleChange}
                        rows={6}
                        placeholder="Describe the solution you developed..."
                        className="block w-full px-4 py-2 bg-black/40 border border-gray-800 rounded-lg text-white focus:ring-emerald-500 focus:border-emerald-500"
                        required={project.sections_enabled.problem_solution}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </ContentSection>
          )}
          
          {/* Features & Functionality Section - Updated */}
          {project.sections_enabled.features && (
            <ContentSection
              title="Features & Functionality"
              icon={<FiBox size={20} />}
              collapsible={true}
              defaultCollapsed={false}
            >
              <div className="space-y-6 p-2">
                <div className="bg-black/30 border border-gray-800 rounded-lg p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-emerald-400">Features & Functionality</h3>
                    <Button onClick={addFeature} size="sm" variant="outline">
                      Add Feature
                    </Button>
                  </div>
                  <p className="text-sm text-gray-400 mb-6">
                    Highlight the main features and capabilities of your project.
                  </p>
                  
                  <div className="space-y-4">
                    {(project.features || []).length === 0 ? (
                      <div className="text-center p-4 bg-black/20 border border-gray-800 rounded-lg">
                        <p className="text-gray-400">No features added yet. Click "Add Feature" to get started.</p>
                      </div>
                    ) : (
                      (project.features || []).map((feature, index) => (
                        <div key={index} className="bg-black/20 border border-gray-800 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium">Feature {index + 1}</h4>
                            <button
                              onClick={() => removeFeature(index)}
                              className="text-red-400 hover:text-red-300"
                            >
                              Remove
                            </button>
                          </div>
                          
                          <div className="mb-4">
                            <label className="block mb-1.5 text-xs font-medium text-gray-400">
                              Feature Title <span className="text-red-400">*</span>
                            </label>
                            <TextInput
                              value={feature.title || ''}
                              onChange={(e) => updateFeature(index, 'title', e.target.value)}
                              placeholder="e.g. Real-time Collaboration"
                              required
                            />
                          </div>
                          
                          <div className="mb-4">
                            <label className="block mb-1.5 text-xs font-medium text-gray-400">
                              Description <span className="text-red-400">*</span>
                            </label>
                            <textarea
                              value={feature.description || ''}
                              onChange={(e) => updateFeature(index, 'description', e.target.value)}
                              rows={3}
                              placeholder="Describe this feature"
                              className="block w-full px-4 py-2 bg-black/30 border border-gray-800 rounded-lg text-white focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                              required
                            ></textarea>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block mb-1.5 text-xs font-medium text-gray-400">
                                Icon (optional)
                              </label>
                              <select
                                value={feature.icon || ''}
                                onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                                className="block w-full px-4 py-2 bg-black/40 border border-gray-800 rounded-lg text-white focus:ring-emerald-500 focus:border-emerald-500"
                              >
                                <option value="">Select an icon</option>
                                <option value="FiUsers">Users</option>
                                <option value="FiSettings">Settings</option>
                                <option value="FiSearch">Search</option>
                                <option value="FiSave">Save</option>
                                <option value="FiCloudUpload">Upload</option>
                                <option value="FiPieChart">Analytics</option>
                                <option value="FiDatabase">Database</option>
                                <option value="FiShield">Security</option>
                                <option value="FiCode">Code</option>
                                <option value="FiClock">Time</option>
                                <option value="FiZap">Performance</option>
                                <option value="FiLayout">Layout</option>
                                <option value="FiGlobe">Globe</option>
                                <option value="FiSmartphone">Mobile</option>
                                <option value="FiMonitor">Desktop</option>
                              </select>
                            </div>
                            <div>
                              <label className="block mb-1.5 text-xs font-medium text-gray-400">
                                Animation (optional)
                              </label>
                              <select
                                value={feature.animation || ''}
                                onChange={(e) => updateFeature(index, 'animation', e.target.value)}
                                className="block w-full px-4 py-2 bg-black/40 border border-gray-800 rounded-lg text-white focus:ring-emerald-500 focus:border-emerald-500"
                              >
                                <option value="">No animation</option>
                                <option value="fade-in">Fade In</option>
                                <option value="slide-up">Slide Up</option>
                                <option value="zoom-in">Zoom In</option>
                                <option value="bounce">Bounce</option>
                                <option value="flip">Flip</option>
                                <option value="pulse">Pulse</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </ContentSection>
          )}
          
          {/* Visual Showcase Section - Updated */}
          {project.sections_enabled.visual_showcase && (
            <ContentSection
              title="Visual Showcase"
              icon={<FiImage size={20} />}
              collapsible={true}
              defaultCollapsed={false}
            >
              <div className="space-y-6 p-2">
                <div className="bg-black/30 border border-gray-800 rounded-lg p-5">
                  <h3 className="text-lg font-medium mb-4 text-emerald-400">Visual Showcase</h3>
                  <p className="text-sm text-gray-400 mb-6">
                    Add images and videos to showcase your project visually.
                  </p>
                  
                  <div className="space-y-6">
                    {/* Image Gallery */}
                    <div>
                      <label className="block mb-1.5 text-sm font-medium text-gray-200">
                        Image Gallery
                      </label>
                      <div className="bg-black/30 border border-gray-800 rounded-lg p-4">
                        <CloudinaryUpload
                          value={project.gallery_urls}
                          onChange={handleGalleryUpload}
                          multiple={true}
                          label="Upload Images"
                        />
                        <p className="text-xs text-gray-400 mt-2">
                          Upload multiple images to showcase your project. You can drag and drop files here.
                        </p>
                      </div>
                    </div>
                    
                    {/* Video Demo URL */}
                    <div>
                      <label className="block mb-1.5 text-sm font-medium text-gray-200">
                        Video Demo URL
                      </label>
                      <TextInput
                        name="video_demo_url"
                        value={project.video_demo_url || ''}
                        onChange={handleChange}
                        placeholder="https://www.youtube.com/watch?v=..."
                        type="url"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Paste a YouTube, Vimeo, or Loom URL to embed a video demo of your project.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ContentSection>
          )}
          
          {/* Design Process Section - Updated */}
          {project.sections_enabled.process && (
            <ContentSection
              title="Design Process"
              icon={<FiGitBranch size={20} />}
              collapsible={true}
              defaultCollapsed={false}
            >
              <div className="space-y-6 p-2">
                <div className="bg-black/30 border border-gray-800 rounded-lg p-5">
                  <h3 className="text-lg font-medium mb-4 text-emerald-400">Design Process</h3>
                  <p className="text-sm text-gray-400 mb-6">
                    Document your design process, from wireframes to final mockups.
                  </p>
                  
                  <div className="space-y-6">
                    {/* Wireframes */}
                    <div>
                      <label className="block mb-1.5 text-sm font-medium text-gray-200">
                        Wireframes
                      </label>
                      <div className="bg-black/30 border border-gray-800 rounded-lg p-4">
                        <CloudinaryUpload
                          value={project.wireframes || []}
                          onChange={handleWireframesUpload}
                          multiple={true}
                          label="Upload Wireframes"
                        />
                        <p className="text-xs text-gray-400 mt-2">
                          Upload wireframe images to show your initial design concepts.
                        </p>
                      </div>
                    </div>
                    
                    {/* Color/Typography */}
                    <div>
                      <label className="block mb-1.5 text-sm font-medium text-gray-200">
                        Color/Typography
                      </label>
                      <textarea
                        name="color_typography"
                        value={project.color_typography || ''}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Describe your color palette and typography choices..."
                        className="block w-full px-4 py-2 bg-black/40 border border-gray-800 rounded-lg text-white focus:ring-emerald-500 focus:border-emerald-500"
                      ></textarea>
                    </div>
                    
                    {/* Mockups */}
                    <div>
                      <label className="block mb-1.5 text-sm font-medium text-gray-200">
                        Mockups
                      </label>
                      <div className="bg-black/30 border border-gray-800 rounded-lg p-4">
                        <CloudinaryUpload
                          value={project.mockups || []}
                          onChange={handleMockupsUpload}
                          multiple={true}
                          label="Upload Mockups"
                        />
                        <p className="text-xs text-gray-400 mt-2">
                          Upload mockup images to show your final design concepts.
                        </p>
                      </div>
                    </div>
                    
                    {/* Figma Embed */}
                    <div>
                      <label className="block mb-1.5 text-sm font-medium text-gray-200">
                        Figma Embed URL
                      </label>
                      <TextInput
                        name="figma_url"
                        value={project.figma_url || ''}
                        onChange={handleChange}
                        placeholder="https://www.figma.com/file/..."
                        type="url"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Paste a Figma share link to embed your design files.
                      </p>
                    </div>
                    
                    {/* Design Rationale */}
                    <div>
                      <label className="block mb-1.5 text-sm font-medium text-gray-200">
                        Design Rationale
                      </label>
                      <textarea
                        name="design_rationale"
                        value={project.design_rationale || ''}
                        onChange={handleChange}
                        rows={6}
                        placeholder="Explain your design decisions and the rationale behind your approach..."
                        className="block w-full px-4 py-2 bg-black/40 border border-gray-800 rounded-lg text-white focus:ring-emerald-500 focus:border-emerald-500"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </ContentSection>
          )}
          
          {/* Results & Learnings Section - Updated */}
          {project.sections_enabled.results && (
            <ContentSection
              title="Results & Learnings"
              icon={<FiBarChart size={20} />}
              collapsible={true}
              defaultCollapsed={false}
            >
              <div className="space-y-6 p-2">
                <div className="bg-black/30 border border-gray-800 rounded-lg p-5">
                  <h3 className="text-lg font-medium mb-4 text-emerald-400">Results & Learnings</h3>
                  <p className="text-sm text-gray-400 mb-6">
                    Document the outcomes of your project and what you learned from the experience.
                  </p>
                  
                  <div className="space-y-6">
                    {/* Achievements - Bullet List */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <label className="block text-sm font-medium text-gray-200">
                          Achievements
                        </label>
                        <Button onClick={addAchievement} size="sm" variant="outline">
                          Add Achievement
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        {(project.achievements || []).length === 0 ? (
                          <div className="text-center p-4 bg-black/20 border border-gray-800 rounded-lg">
                            <p className="text-gray-400">No achievements added yet. Click "Add Achievement" to get started.</p>
                          </div>
                        ) : (
                          (project.achievements || []).map((achievement, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="text-emerald-400">•</div>
                              <TextInput
                                value={achievement}
                                onChange={(e) => updateAchievement(index, e.target.value)}
                                placeholder="Enter an achievement..."
                                className="flex-1"
                              />
                              <button
                                onClick={() => removeAchievement(index)}
                                className="p-1.5 text-red-400 hover:text-red-300"
                              >
                                <FiX size={16} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                    
                    {/* Learnings */}
                    <div>
                      <label className="block mb-1.5 text-sm font-medium text-gray-200">
                        Learnings
                      </label>
                      <textarea
                        name="learnings"
                        value={project.learnings || ''}
                        onChange={handleChange}
                        rows={6}
                        placeholder="What did you learn from this project? What would you do differently next time?"
                        className="block w-full px-4 py-2 bg-black/40 border border-gray-800 rounded-lg text-white focus:ring-emerald-500 focus:border-emerald-500"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </ContentSection>
          )}
          
          {/* Resource Links Section - Updated */}
          {project.sections_enabled.resource_links && (
            <ContentSection
              title="Resource Links"
              icon={<FiGlobe size={20} />}
              collapsible={true}
              defaultCollapsed={false}
            >
              <div className="space-y-6 p-2">
                <div className="bg-black/30 border border-gray-800 rounded-lg p-5">
                  <h3 className="text-lg font-medium mb-4 text-emerald-400">Resource Links</h3>
                  <p className="text-sm text-gray-400 mb-6">
                    Add links to project resources and external materials.
                  </p>
                  
                  <div className="space-y-4">
                    {/* GitHub Link */}
                    <div>
                      <label className="block mb-1.5 text-sm font-medium text-gray-200">
                        GitHub Link
                      </label>
                      <TextInput
                        name="github_url"
                        value={project.github_url || ''}
                        onChange={handleChange}
                        placeholder="https://github.com/username/repo"
                        type="url"
                      />
                    </div>
                    
                    {/* Figma Link */}
                    <div>
                      <label className="block mb-1.5 text-sm font-medium text-gray-200">
                        Figma Link
                      </label>
                      <TextInput
                        name="figma_url"
                        value={project.figma_url || ''}
                        onChange={handleChange}
                        placeholder="https://www.figma.com/file/..."
                        type="url"
                      />
                    </div>
                    
                    {/* PDF Upload */}
                    <div>
                      <label className="block mb-1.5 text-sm font-medium text-gray-200">
                        PDF Documentation
                      </label>
                      <div className="bg-black/30 border border-gray-800 rounded-lg p-4">
                        <CloudinaryUpload
                          value={project.pdf_url || ''}
                          onChange={handlePdfUpload}
                          multiple={false}
                          label="Upload PDF"
                          fileTypes="application/pdf"
                        />
                        <p className="text-xs text-gray-400 mt-2">
                          Upload a PDF document with additional project documentation.
                        </p>
                      </div>
                    </div>
                    
                    {/* Live Project */}
                    <div>
                      <label className="block mb-1.5 text-sm font-medium text-gray-200">
                        Live Project
                      </label>
                      <TextInput
                        name="project_url"
                        value={project.project_url || ''}
                        onChange={handleChange}
                        placeholder="https://example.com"
                        type="url"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </ContentSection>
          )}
          
          {/* Technologies Used Section */}
          {project.sections_enabled.technologies && (
            <ContentSection
              title="Technologies Used"
              icon={<FiCpu size={20} />}
              collapsible={true}
              defaultCollapsed={false}
            >
              <div className="space-y-6 p-2">
                <div className="bg-black/30 border border-gray-800 rounded-lg p-5">
                  <h3 className="text-lg font-medium mb-4 text-emerald-400">Technologies Used</h3>
                  <p className="text-sm text-gray-400 mb-6">
                    List the technologies, tools, frameworks, and libraries used in this project.
                  </p>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block mb-1.5 text-sm font-medium text-gray-200">
                        Technologies (comma separated)
                      </label>
                      <TextInput
                        name="technologies"
                        value={project.technologies || ''}
                        onChange={handleChange}
                        placeholder="e.g. React, Node.js, Tailwind CSS, PostgreSQL"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Enter the technologies used in this project, separated by commas.
                      </p>
                    </div>
                    
                    <div>
                      <label className="block mb-1.5 text-sm font-medium text-gray-200">
                        Technical Details (optional)
                      </label>
                      <textarea
                        name="technical_details"
                        value={project.technical_details || ''}
                        onChange={handleChange}
                        rows={6}
                        placeholder="Provide additional technical details about the implementation..."
                        className="block w-full px-4 py-2 bg-black/40 border border-gray-800 rounded-lg text-white focus:ring-emerald-500 focus:border-emerald-500"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </ContentSection>
          )}
        </>
      )}
    </ContentPageLayout>
  );
};

export default CMSProjectDetail; 