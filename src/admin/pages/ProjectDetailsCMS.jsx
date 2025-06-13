import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiSave, FiChevronRight, FiEye } from 'react-icons/fi';
import supabase from '../../utils/supabaseClient';
import CloudinaryUpload from '../components/CloudinaryUpload';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const isNewProject = projectId === 'new';
  
  // State
  const [activeTab, setActiveTab] = useState('content');
  const [project, setProject] = useState({
    title: '',
    slug: '',
    category: 'Visual Identity',
    type: '',
    description: '',
    short_description: '',
    thumbnail_url: '',
    gallery_urls: [],
    problem: '',
    solution: '',
    process: '',
    results: '',
    project_url: '',
    github_url: '',
    tags: [],
    is_published: false,
    features: []
  });
  const [loading, setLoading] = useState(!isNewProject);
  const [saving, setSaving] = useState(false);
  const [formChanged, setFormChanged] = useState(false);
  
  // Categories
  const categories = [
    'Visual Identity',
    'UI/UX',
    'Development', 
    'AI Projects',
    'Creative Lab'
  ];
  
  // Load project data if editing existing project
  useEffect(() => {
    if (!isNewProject) {
      fetchProject();
    }
  }, [projectId]);
  
  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();
        
      if (error) throw error;
      
      setProject(data || {});
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
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
  };
  
  // Handle thumbnail upload
  const handleThumbnailUpload = (url) => {
    setProject(prev => ({
      ...prev,
      thumbnail_url: url
    }));
    
    setFormChanged(true);
  };
  
  // Handle gallery upload
  const handleGalleryUpload = (urls) => {
    setProject(prev => ({
      ...prev,
      gallery_urls: urls
    }));
    
    setFormChanged(true);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Validate required fields
      if (!project.title || !project.slug || !project.category) {
        alert('Please fill in all required fields (title, slug, category)');
        setSaving(false);
        return;
      }
      
      let result;
      
      if (isNewProject) {
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
          .eq('id', projectId)
          .select()
          .single();
          
        if (error) throw error;
        result = data;
      }
      
      setFormChanged(false);
      
      // Navigate to edit mode if this was a new project
      if (isNewProject && result) {
        navigate(`/admin/project-details/${result.id}`, { replace: true });
      }
      
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
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-gray-700 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-gray-300">Loading project...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-full">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center text-sm">
          <Link to="/admin/project-gallery" className="text-gray-400 hover:text-gray-300">Project CMS</Link>
          <FiChevronRight className="mx-2 text-gray-600" />
          <span className="text-white font-medium">
            {isNewProject ? 'New Project' : project.title || 'Project Details'}
          </span>
        </div>
        
        <div className="flex items-center space-x-3">
          {!isNewProject && (
            <Link
              to={`/project/${project.slug}`}
              target="_blank"
              className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-sm rounded flex items-center text-gray-300 hover:text-white transition-colors"
            >
              <FiEye size={16} className="mr-1.5" />
              Preview
            </Link>
          )}
          
          <button
            onClick={handleSubmit}
            disabled={saving || !formChanged}
            className={`px-4 py-1.5 rounded flex items-center text-sm transition-colors ${
              saving ? 'bg-emerald-700/50 text-emerald-300/70' : 
              formChanged ? 'bg-emerald-600 hover:bg-emerald-700 text-white' :
              'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            <FiSave size={16} className="mr-1.5" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">
            {isNewProject ? 'Create New Project' : 'Edit Project'}
          </h1>
          <p className="text-gray-400 text-sm">
            {isNewProject ? 'Add a new project to your portfolio' : `Editing project: ${project.title}`}
          </p>
        </div>
        
        <div>
          <div className="flex items-center">
            <span className="text-sm text-gray-400 mr-3">Status:</span>
            <label className="inline-flex items-center cursor-pointer">
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={project.is_published} 
                  onChange={togglePublish}
                />
                <div className={`block w-10 h-5 rounded-full ${project.is_published ? 'bg-emerald-500' : 'bg-gray-600'}`}></div>
                <div className={`dot absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition ${project.is_published ? 'transform translate-x-5' : ''}`}></div>
              </div>
              <span className={`ml-2 text-sm ${project.is_published ? 'text-emerald-400' : 'text-gray-400'}`}>
                {project.is_published ? 'Published' : 'Draft'}
              </span>
            </label>
          </div>
        </div>
      </div>
      
      {/* Content/Visual/Preview Tabs */}
      <div className="flex mb-6 border-b border-gray-700">
        <button
          className={`px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'content' 
              ? 'border-b-2 border-gray-200 text-white' 
              : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('content')}
        >
          Content
        </button>
        <button
          className={`px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'visual' 
              ? 'border-b-2 border-gray-200 text-white' 
              : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('visual')}
        >
          Visual
        </button>
        <button
          className={`px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'preview' 
              ? 'border-b-2 border-gray-200 text-white' 
              : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('preview')}
        >
          Preview
        </button>
      </div>
      
      {/* CONTENT TAB */}
      {activeTab === 'content' && (
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Project Title*
                </label>
                <input
                  type="text"
                  name="title"
                  value={project.title}
                  onChange={handleTitleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter project title"
                  required
                />
              </div>
              
              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  URL Slug*
                </label>
                <input
                  type="text"
                  name="slug"
                  value={project.slug}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="project-url-slug"
                  required
                />
                <p className="mt-1 text-xs text-gray-400">Used in URL: /project/{project.slug || 'example-slug'}</p>
              </div>
              
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Category*
                </label>
                <select
                  name="category"
                  value={project.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Project Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Project Type
                </label>
                <input
                  type="text"
                  name="type"
                  value={project.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. Website, Mobile App, Brand Identity"
                />
              </div>
              
              {/* Tags */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={project.tags ? project.tags.join(', ') : ''}
                  onChange={handleTagsChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="React, Figma, UI Design, Responsive"
                />
              </div>
            </div>
          </div>
          
          {/* Hero Section */}
          <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Hero Section</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Thumbnail */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Hero Image*
                </label>
                <CloudinaryUpload
                  onUpload={handleThumbnailUpload}
                  value={project.thumbnail_url}
                />
                <p className="mt-1 text-xs text-gray-400">Recommended size: 1200×800px</p>
              </div>
              
              {/* Short Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Short Description (for cards)
                </label>
                <textarea
                  name="short_description"
                  value={project.short_description}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Brief description that appears on project cards (max 150 characters)"
                  maxLength={150}
                />
                <p className="mt-1 text-xs text-gray-400">
                  {project.short_description ? project.short_description.length : 0}/150 characters
                </p>
              </div>
              
              {/* Full Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Full Description
                </label>
                <textarea
                  name="description"
                  value={project.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Detailed description of your project"
                />
              </div>
            </div>
          </div>
          
          {/* Problem & Solution */}
          <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Problem & Solution</h2>
            
            <div className="space-y-6">
              {/* Problem */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  The Problem
                </label>
                <textarea
                  name="problem"
                  value={project.problem}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="What problem were you trying to solve?"
                />
              </div>
              
              {/* Solution */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  The Solution
                </label>
                <textarea
                  name="solution"
                  value={project.solution}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="How did you solve the problem?"
                />
              </div>
            </div>
          </div>
          
          {/* Features */}
          <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Features & Functionality</h2>
              <button
                type="button"
                onClick={addFeature}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-sm rounded text-gray-300 hover:text-white"
              >
                + Add Feature
              </button>
            </div>
            
            {(project.features || []).length === 0 ? (
              <div className="text-center py-6 border border-dashed border-gray-700 rounded-lg">
                <p className="text-gray-400">No features added yet. Click "Add Feature" to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {(project.features || []).map((feature, index) => (
                  <div key={index} className="border border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Feature #{index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Feature Title
                        </label>
                        <input
                          type="text"
                          value={feature.title || ''}
                          onChange={(e) => updateFeature(index, 'title', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="e.g. Real-time Collaboration"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Description
                        </label>
                        <textarea
                          value={feature.description || ''}
                          onChange={(e) => updateFeature(index, 'description', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="Describe this feature"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Gallery */}
          <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Project Gallery</h2>
            
            <CloudinaryUpload
              onUpload={handleGalleryUpload}
              value={project.gallery_urls || []}
              multiple={true}
            />
            <p className="mt-1 text-xs text-gray-400">Upload multiple images showcasing your project</p>
          </div>
          
          {/* Links & Resources */}
          <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Links & Resources</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Live Project URL */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Live Project URL
                </label>
                <input
                  type="url"
                  name="project_url"
                  value={project.project_url || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="https://example.com"
                />
              </div>
              
              {/* GitHub URL */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  GitHub Repository URL
                </label>
                <input
                  type="url"
                  name="github_url"
                  value={project.github_url || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="https://github.com/username/repo"
                />
              </div>
            </div>
          </div>
          
          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving || !formChanged}
              className={`px-6 py-2.5 rounded flex items-center text-base transition-colors ${
                saving ? 'bg-emerald-700/50 text-emerald-300/70' : 
                formChanged ? 'bg-emerald-600 hover:bg-emerald-700 text-white' :
                'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              <FiSave size={18} className="mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}
      
      {/* VISUAL TAB */}
      {activeTab === 'visual' && (
        <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-6">
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🎨</div>
            <h2 className="text-xl font-medium mb-2">Visual Editor Coming Soon</h2>
            <p className="text-gray-400 max-w-lg mx-auto mb-6">
              The visual drag-and-drop editor for project layouts is currently in development.
              Please use the Content tab to manage your project information.
            </p>
            <button
              onClick={() => setActiveTab('content')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors text-sm"
            >
              Return to Content Editor
            </button>
          </div>
        </div>
      )}
      
      {/* PREVIEW TAB */}
      {activeTab === 'preview' && (
        <div className="bg-gray-800/40 border border-gray-700 rounded-lg overflow-hidden">
          <div className="flex justify-between items-center p-4 bg-gray-800/60 border-b border-gray-700">
            <h3 className="font-medium">Project Preview</h3>
            <div className="flex space-x-3">
              <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-sm rounded flex items-center">
                <span className="mr-1">🖥️</span> Desktop
              </button>
              <button className="px-3 py-1 bg-gray-700/50 hover:bg-gray-600 text-sm text-gray-300 hover:text-white rounded flex items-center">
                <span className="mr-1">📱</span> Mobile
              </button>
              <button className="px-3 py-1 bg-gray-700/50 hover:bg-gray-600 text-sm text-gray-300 hover:text-white rounded flex items-center">
                <span className="mr-1">📲</span> Tablet
              </button>
            </div>
          </div>
          
          <div className="p-6 flex items-center justify-center min-h-[600px]">
            {project.title && project.thumbnail_url ? (
              <div className="w-full max-w-3xl mx-auto space-y-8">
                {/* Hero */}
                <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden mb-6">
                  <img 
                    src={project.thumbnail_url}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Content */}
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold">{project.title}</h1>
                    <div className="flex items-center mt-2">
                      <span className="text-sm px-2 py-1 rounded-full bg-gray-800 text-gray-300 mr-2">
                        {project.category}
                      </span>
                      {project.type && (
                        <span className="text-sm text-gray-400">
                          {project.type}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {project.description && (
                    <p className="text-gray-300">
                      {project.description}
                    </p>
                  )}
                  
                  {/* Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="text-sm bg-gray-800/80 px-2 py-1 rounded text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Problem & Solution */}
                  {(project.problem || project.solution) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                      {project.problem && (
                        <div className="bg-gray-800/60 rounded-lg p-6">
                          <h3 className="text-lg font-medium mb-3">The Problem</h3>
                          <p className="text-gray-300">{project.problem}</p>
                        </div>
                      )}
                      
                      {project.solution && (
                        <div className="bg-gray-800/60 rounded-lg p-6">
                          <h3 className="text-lg font-medium mb-3">The Solution</h3>
                          <p className="text-gray-300">{project.solution}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Features */}
                  {project.features && project.features.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-medium mb-4">Features & Functionality</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {project.features.map((feature, index) => (
                          <div key={index} className="bg-gray-800/60 rounded-lg p-4">
                            <h4 className="font-medium mb-2">{feature.title || `Feature ${index + 1}`}</h4>
                            <p className="text-sm text-gray-300">{feature.description || 'No description provided.'}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Gallery */}
                  {project.gallery_urls && project.gallery_urls.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-medium mb-4">Project Gallery</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {project.gallery_urls.map((url, index) => (
                          <div key={index} className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                            <img 
                              src={url}
                              alt={`Gallery ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Links */}
                  {(project.project_url || project.github_url) && (
                    <div className="flex flex-wrap gap-3 mt-8">
                      {project.project_url && (
                        <a 
                          href={project.project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors"
                        >
                          View Live Project
                        </a>
                      )}
                      
                      {project.github_url && (
                        <a 
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                        >
                          View Source Code
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gray-700 text-center p-6 rounded">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-lg font-medium mb-2">Preview Not Available</h3>
                <p className="text-gray-400 mb-4">
                  Add at least a title and thumbnail image in the Content tab to see a preview.
                </p>
                <button
                  onClick={() => setActiveTab('content')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors"
                >
                  Return to Content Editor
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails; 