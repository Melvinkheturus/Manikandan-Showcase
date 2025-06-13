import React, { useState, useEffect } from 'react';
import { FiSave, FiX, FiPlus, FiTrash, FiLink, FiExternalLink, FiArrowRight } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import { Tab } from '@headlessui/react';
import CloudinaryUploader from '../../components/CloudinaryUploader';
import Toaster from '../../components/Toaster';
import ContentPageLayout, { ContentSection } from '../../CMSHelper/ContentPageLayout';

const CMSProjectGalleryForm = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const isEditMode = Boolean(projectId);
  
  // State for project data
  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    category_id: '',
    thumbnail_url: '',
    tags: [],
    has_detail: true,
    color_palette: [],
    experiment_tag: '',
    ctas: []
  });
  
  const [categories, setCategories] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [newColor, setNewColor] = useState('#FFFFFF');
  const [categoryType, setCategoryType] = useState(''); // 'ui-ux', 'visual-identity', or 'creative-lab'

  // Load project data if in edit mode
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real app, fetch from API
        // Mock data for demo purposes
        setTimeout(() => {
          // Fetch categories
          const mockCategories = [
            { id: '1', name: 'UI/UX Design', slug: 'ui-ux', layout: 'snap-scroll' },
            { id: '2', name: 'Visual Identity', slug: 'visual-identity', layout: 'pinterest-grid' },
            { id: '3', name: 'Web Development', slug: 'development', layout: 'terminal-cards' },
            { id: '4', name: 'AI Projects', slug: 'ai-projects', layout: 'grid-zoom' },
            { id: '5', name: 'Creative Lab', slug: 'creative-lab', layout: 'hover-card' }
          ];
          
          setCategories(mockCategories);
          
          // If in edit mode, fetch project data
          if (isEditMode) {
            const mockProjectData = {
              id: projectId,
              title: 'E-commerce Redesign',
              description: 'A complete redesign of an e-commerce platform',
              category_id: '1',
              thumbnail_url: 'https://example.com/thumbnail1.jpg',
              tags: ['Figma', 'UI Design', 'E-commerce'],
              has_detail: true,
              color_palette: [],
              experiment_tag: '',
              ctas: [
                { id: '1', label: 'View Project', url: 'https://example.com/project', icon: 'arrow-right' },
                { id: '2', label: 'GitHub', url: 'https://github.com/username/project', icon: 'github' }
              ]
            };
            
            setProjectData(mockProjectData);
            
            // Set category type based on the selected category
            const category = mockCategories.find(c => c.id === mockProjectData.category_id);
            if (category) {
              setCategoryType(getCategoryType(category.slug));
            }
          }
          
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching data:', error);
        setToast({
          show: true,
          message: isEditMode ? 'Failed to load project data' : 'Failed to load categories',
          type: 'error'
        });
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isEditMode, projectId]);

  // Determine the category type based on slug
  const getCategoryType = (slug) => {
    if (slug === 'visual-identity') return 'visual-identity';
    if (slug === 'creative-lab') return 'creative-lab';
    return 'standard'; // UI/UX, Development, AI Projects
  };

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProjectData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setProjectData(prev => ({
      ...prev,
      category_id: categoryId
    }));
    
    // Set category type based on the selected category
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      setCategoryType(getCategoryType(category.slug));
    }
  };

  // Handle thumbnail upload
  const handleThumbnailUpload = (url) => {
    setProjectData(prev => ({
      ...prev,
      thumbnail_url: url
    }));
    setToast({
      show: true,
      message: 'Thumbnail uploaded successfully',
      type: 'success'
    });
  };

  // Add tag
  const addTag = () => {
    if (!newTag.trim()) return;
    
    if (projectData.tags.includes(newTag.trim())) {
      setToast({
        show: true,
        message: 'This tag is already added',
        type: 'warning'
      });
      return;
    }
    
    setProjectData(prev => ({
      ...prev,
      tags: [...prev.tags, newTag.trim()]
    }));
    
    setNewTag('');
  };

  // Remove tag
  const removeTag = (tag) => {
    setProjectData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  // Add color to palette
  const addColor = () => {
    if (projectData.color_palette.includes(newColor)) {
      setToast({
        show: true,
        message: 'This color is already in the palette',
        type: 'warning'
      });
      return;
    }
    
    setProjectData(prev => ({
      ...prev,
      color_palette: [...prev.color_palette, newColor]
    }));
    
    setNewColor('#FFFFFF');
  };

  // Remove color from palette
  const removeColor = (color) => {
    setProjectData(prev => ({
      ...prev,
      color_palette: prev.color_palette.filter(c => c !== color)
    }));
  };

  // Add new CTA
  const addCTA = () => {
    const newCTA = {
      id: `cta-${Date.now()}`,
      label: 'View Project',
      url: '',
      icon: 'arrow-right'
    };
    
    setProjectData(prev => ({
      ...prev,
      ctas: [...prev.ctas, newCTA]
    }));
  };

  // Update CTA
  const updateCTA = (id, field, value) => {
    setProjectData(prev => ({
      ...prev,
      ctas: prev.ctas.map(cta => 
        cta.id === id ? { ...cta, [field]: value } : cta
      )
    }));
  };

  // Remove CTA
  const removeCTA = (id) => {
    setProjectData(prev => ({
      ...prev,
      ctas: prev.ctas.filter(cta => cta.id !== id)
    }));
  };

  // Save project
  const saveProject = async () => {
    // Validate form
    if (!projectData.title.trim()) {
      setToast({
        show: true,
        message: 'Project title is required',
        type: 'error'
      });
      return;
    }
    
    if (!projectData.category_id) {
      setToast({
        show: true,
        message: 'Please select a category',
        type: 'error'
      });
      return;
    }
    
    if (!projectData.thumbnail_url) {
      setToast({
        show: true,
        message: 'Please upload a thumbnail image',
        type: 'error'
      });
      return;
    }
    
    setIsSaving(true);
    try {
      // In a real app, save to API
      // Mock successful save for demo
      setTimeout(() => {
        setIsSaving(false);
        setToast({
          show: true,
          message: isEditMode ? 'Project updated successfully!' : 'Project created successfully!',
          type: 'success'
        });
        
        // Navigate back to gallery after short delay
        setTimeout(() => {
          navigate('/admin/projects/gallery');
        }, 1500);
      }, 800);
    } catch (error) {
      console.error('Error saving project:', error);
      setToast({
        show: true,
        message: 'Failed to save project',
        type: 'error'
      });
      setIsSaving(false);
    }
  };

  // Cancel and go back
  const handleCancel = () => {
    navigate('/admin/projects/gallery');
  };

  // Available icon options for CTAs
  const iconOptions = [
    { value: 'arrow-right', label: 'Arrow Right', component: <FiArrowRight /> },
    { value: 'external-link', label: 'External Link', component: <FiExternalLink /> },
    { value: 'github', label: 'GitHub', component: <span className="text-xl">🔵</span> },
    { value: 'figma', label: 'Figma', component: <span className="text-xl">🎨</span> },
    { value: 'dribbble', label: 'Dribbble', component: <span className="text-xl">🏀</span> },
    { value: 'behance', label: 'Behance', component: <span className="text-xl">Bē</span> }
  ];

  return (
    <ContentPageLayout title={isEditMode ? 'Edit Project' : 'Add New Project'}>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
        <div className="space-y-6">
          {/* Basic Info Section - Common for all project types */}
          <ContentSection title="Basic Information" icon="📋" defaultCollapsed={false}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Project Title */}
              <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Project Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={projectData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter project title"
                  required
                  />
                </div>
                
              {/* Project Category */}
              <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category <span className="text-red-500">*</span>
                    </label>
                    <select
                  name="category_id"
                  value={projectData.category_id}
                  onChange={handleCategoryChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  required
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
              {/* Project Description (1-line) */}
              <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description (One-liner)
                    </label>
                    <input
                  type="text"
                  name="description"
                  value={projectData.description}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Brief one-line description"
                  maxLength={100}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {projectData.description.length}/100 characters - Keep it concise
                </p>
              </div>

              {/* Thumbnail Upload */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Project Thumbnail <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col md:flex-row items-start gap-4">
                  <div className="flex-shrink-0 w-40 h-32 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600 overflow-hidden">
                    {projectData.thumbnail_url ? (
                      <img 
                        src={projectData.thumbnail_url} 
                        alt="Thumbnail" 
                        className="w-full h-full object-cover"
                      />
                  ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No image
                    </div>
                  )}
                  </div>
                  
                  <div>
                    <CloudinaryUploader
                      onUploadSuccess={handleThumbnailUpload}
                      cloudName="portfolio-cms"
                      uploadPreset="project_thumbnails"
                      resourceType="image"
                      folder="projects"
                      buttonText={projectData.thumbnail_url ? "Replace Thumbnail" : "Upload Thumbnail"}
                      acceptTypes="image/*"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Recommended size: 1200x800px. Max size: 5MB
                    </p>
                  </div>
                </div>
              </div>
              </div>
          </ContentSection>
          
          {/* Section for tags - Common for all */}
          <ContentSection title="Tags" icon="🏷️" defaultCollapsed={false}>
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {projectData.tags.map(tag => (
                  <div 
                    key={tag} 
                    className="inline-flex items-center bg-emerald-100 text-emerald-800 text-sm px-2 py-1 rounded-md dark:bg-emerald-800/30 dark:text-emerald-300"
                  >
                    <span>{tag}</span>
                          <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-emerald-600 hover:text-emerald-800 dark:text-emerald-400"
                          >
                      <FiX size={14} />
                          </button>
                  </div>
                ))}
                {projectData.tags.length === 0 && (
                  <p className="text-gray-500 text-sm italic">No tags added yet</p>
                )}
              </div>
              
              <div className="flex gap-2">
                  <input
                    type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                    className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Add a tag (e.g. React, Figma, AI)"
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <button
                  onClick={addTag}
                  className="px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                  >
                    Add
                  </button>
                </div>
            </div>
          </ContentSection>
          
          {/* Type-specific sections */}
          {categoryType === 'visual-identity' && (
            <ContentSection title="Visual Identity Details" icon="🎨" defaultCollapsed={false}>
              {/* Color Palette */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color Palette
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {projectData.color_palette.map(color => (
                    <div 
                      key={color} 
                      className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700"
                    >
                      <div 
                        className="w-8 h-8 rounded-md border border-gray-300 dark:border-gray-600" 
                        style={{ backgroundColor: color }} 
                      />
                      <span className="text-sm font-mono">{color}</span>
                      <button
                        onClick={() => removeColor(color)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="h-10 w-10 rounded border border-gray-300 dark:border-gray-600"
                  />
                  <input
                    type="text"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white font-mono"
                  />
                  <button
                    onClick={addColor}
                    className="px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                  >
                    Add Color
                  </button>
                </div>
              </div>
            </ContentSection>
          )}
          
          {categoryType === 'creative-lab' && (
            <ContentSection title="Creative Lab Details" icon="🧪" defaultCollapsed={false}>
              {/* Experiment Tag */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Experiment Tag
                </label>
                <input
                  type="text"
                  name="experiment_tag"
                  value={projectData.experiment_tag}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g. Beta, Prototype, WIP"
                />
              </div>
              
              {/* Detail page toggle */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="has_detail"
                  name="has_detail"
                  checked={projectData.has_detail}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <label htmlFor="has_detail" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Include detail page
                </label>
              </div>
            </ContentSection>
          )}
          
          {/* CTA Links - Only for standard projects and can be enabled for Creative Lab */}
          {(categoryType === 'standard' || (categoryType === 'creative-lab' && projectData.has_detail)) && (
            <ContentSection title="Call-to-Action Links" icon="🔗" defaultCollapsed={false}>
              <div className="space-y-4">
                {projectData.ctas.map(cta => (
                  <div key={cta.id} className="flex flex-wrap md:flex-nowrap items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md border border-gray-200 dark:border-gray-700">
                    <div className="w-full md:w-1/4">
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">
                        Label
                  </label>
                  <input
                        type="text"
                        value={cta.label}
                        onChange={(e) => updateCTA(cta.id, 'label', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                        placeholder="e.g. View Project"
                  />
                </div>
                
                    <div className="w-full md:w-2/5">
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">
                        URL
                  </label>
                      <div className="flex items-center">
                        <div className="flex-grow">
                  <input
                    type="url"
                            value={cta.url}
                            onChange={(e) => updateCTA(cta.id, 'url', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                            placeholder="https://"
                  />
                </div>
                      </div>
                    </div>
                    
                    <div className="w-full md:w-1/4">
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">
                        Icon
                      </label>
                      <select
                        value={cta.icon}
                        onChange={(e) => updateCTA(cta.id, 'icon', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                      >
                        {iconOptions.map(icon => (
                          <option key={icon.value} value={icon.value}>
                            {icon.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex items-end mb-2">
                      <button
                        onClick={() => removeCTA(cta.id)}
                        className="p-2 text-red-500 hover:text-red-700"
                        title="Remove CTA"
                      >
                        <FiTrash size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={addCTA}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <FiPlus className="mr-2" size={16} />
                  Add CTA Link
                </button>
              </div>
            </ContentSection>
          )}
          
          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={saveProject}
              disabled={isSaving}
              className="flex items-center px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:bg-gray-400"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="mr-2" />
                  Save Project
                </>
              )}
            </button>
          </div>
          </div>
        )}
      
      {/* Toast Notification */}
      <Toaster 
        show={toast.show} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({...toast, show: false})} 
      />
    </ContentPageLayout>
  );
};

export default CMSProjectGalleryForm; 