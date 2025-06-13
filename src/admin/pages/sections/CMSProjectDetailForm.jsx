import React, { useState, useEffect } from 'react';
import { 
  FiSave, FiX, FiPlus, FiTrash, FiLink, FiEye, FiArrowUp, 
  FiArrowDown, FiToggleLeft, FiToggleRight, FiGithub,
  FiUpload, FiDownload, FiFileText, FiSearch
} from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import CloudinaryUpload from '../../components/CloudinaryUpload';
import Toaster from '../../components/Toaster';

const CMSProjectDetailForm = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const isEditMode = Boolean(projectId);
  
  // State for project data
  const [projectData, setProjectData] = useState({
    title: '',
    subtitle: '',
    description: '',
    problem: '',
    solution: '',
    outcome: '',
    contribution: '',
    category: '',
    duration: '',
    client: '',
    role: '',
    thumbnail: '',
    heroImage: '',
    heroVideo: '',
    heroType: 'image',
    projectType: 'personal',
    images: [],
    technologies: [],
    tools: [],
    features: [],
    wireframes: [],
    colorPalette: [],
    typography: '',
    accessibilityNotes: '',
    galleryLayout: 'lightbox',
    videoType: 'embed',
    videoUrl: '',
    videoFileUrl: '',
    results: [],
    learnings: '',
    testimonial: {
      content: '',
      author: '',
      position: ''
    },
    projectUrl: '',
    githubUrl: '',
    figmaUrl: '',
    pdfUrl: '',
    isFeatured: false
  });
  
  // UI states and form helpers
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newTechnology, setNewTechnology] = useState('');
  const [newTool, setNewTool] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [newResult, setNewResult] = useState('');
  const [featureTiles, setFeatureTiles] = useState([]);
  const [autoSave, setAutoSave] = useState(false);
  const [livePreview, setLivePreview] = useState(false);
  const [activeTab, setActiveTab] = useState('ui-ux');
  
  // Section toggles
  const [sectionToggles, setSectionToggles] = useState({
    heroSection: true, // Mandatory
    quickInfo: true, // Mandatory
    summary: true,
    problemSolution: true,
    features: true,
    visualShowcase: true,
    designProcess: true,
    learnings: true,
    resourceLinks: true
  });
  
  // Toast notification
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'info'
  });
  
  // Load project data if in edit mode
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real app, fetch from API
        // Mock data for demo purposes
        setTimeout(() => {
          // Fetch categories
          setCategories([
            { id: 'ui-ux', name: 'UI/UX Design' },
            { id: 'development', name: 'Development' },
            { id: 'ai-projects', name: 'AI Projects' },
            { id: 'creative', name: 'Creative Lab' }
          ]);
          
          // If in edit mode, fetch project data
          if (isEditMode) {
            setProjectData({
              title: 'E-commerce Website Redesign',
              subtitle: 'Modernizing the online shopping experience',
              description: 'A comprehensive redesign of an e-commerce platform focused on improving user experience, accessibility, and conversion rates.',
              problem: 'The client's existing e-commerce website had poor navigation, inconsistent UI, and a complex checkout process leading to high cart abandonment rates.',
              solution: 'We redesigned the interface with simplified navigation, consistent UI components, and a streamlined 3-step checkout process.',
              outcome: 'The redesign resulted in a 35% decrease in cart abandonment and a 28% increase in overall conversion rate.',
              contribution: 'I led the UX research, created wireframes and prototypes, and collaborated with developers during implementation.',
              category: 'ui-ux',
              duration: '12 weeks',
              client: 'GlobalShop Inc.',
              role: 'Lead UX/UI Designer',
              projectType: 'client',
              thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
              heroImage: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902',
              heroType: 'image',
              galleryLayout: 'lightbox',
              images: [
                { id: 'img1', url: 'https://images.unsplash.com/photo-1555421689-491a97ff2040', caption: 'Product listing page' },
                { id: 'img2', url: 'https://images.unsplash.com/photo-1555421689-d68471e189f2', caption: 'Checkout flow' }
              ],
              technologies: ['React', 'Tailwind CSS', 'Node.js', 'MongoDB'],
              tools: ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator'],
              features: ['Responsive Design', 'Real-time Product Filtering', 'Guest Checkout'],
              wireframes: [
                { id: 'wf1', url: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e', caption: 'Homepage wireframe' },
                { id: 'wf2', url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e', caption: 'Product page wireframe' }
              ],
              colorPalette: ['#336699', '#FF5733', '#FFFFFF', '#333333'],
              typography: 'Primary: Inter, 16px\nHeadings: Montserrat, 24-48px',
              accessibilityNotes: 'Designed with WCAG 2.1 AA compliance. All interactive elements have appropriate focus states and color contrast ratios exceed 4.5:1.',
              results: [
                'Increased conversion rate by 28%',
                'Reduced cart abandonment by 35%',
                'Improved average session duration by 45%'
              ],
              learnings: 'This project taught me the importance of user testing at multiple stages. Early feedback on the checkout process allowed us to identify and address pain points before full implementation.',
              testimonial: {
                content: 'The redesign completely transformed our online presence. We've seen immediate improvements in sales and customer satisfaction.',
                author: 'Jane Smith',
                position: 'CMO, GlobalShop Inc.'
              },
              projectUrl: 'https://example.com',
              githubUrl: 'https://github.com/username/ecommerce-redesign',
              figmaUrl: 'https://figma.com/file/example',
              isFeatured: true
            });

            // Set feature tiles with sample data
            setFeatureTiles([
              { 
                id: `tile-1`, 
                title: 'Real-time Filtering',
                description: 'Filter products instantly without page reloads',
                mediaType: 'image',
                mediaUrl: 'https://images.unsplash.com/photo-1555421689-d68471e189f2',
                tileSize: 'normal'
              },
              { 
                id: `tile-2`, 
                title: 'Smart Search',
                description: 'AI-powered search with typo correction and predictive results',
                mediaType: 'icon',
                mediaUrl: 'FiSearch',
                tileSize: 'wide'
              },
              { 
                id: `tile-3`, 
                title: 'Mobile Optimized',
                description: 'Perfect shopping experience on any device',
                mediaType: 'image',
                mediaUrl: 'https://images.unsplash.com/photo-1555421689-491a97ff2040',
                tileSize: 'normal'
              }
            ]);
          }

          setIsLoading(false);
        }, 1000);
      } catch (error) {
        setToast({
          show: true,
          message: 'Failed to load project data',
          type: 'error'
        });
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isEditMode]);

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProjectData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle nested testimonial changes
  const handleTestimonialChange = (field, value) => {
    setProjectData(prev => ({
      ...prev,
      testimonial: {
        ...prev.testimonial,
        [field]: value
      }
    }));
  };

  // Handle thumbnail upload
  const handleThumbnailUpload = (url) => {
    setProjectData(prev => ({
      ...prev,
      thumbnail: url
    }));
    setToast({
      show: true,
      message: 'Thumbnail uploaded successfully',
      type: 'success'
    });
  };

  // Handle hero image upload
  const handleHeroImageUpload = (url) => {
    setProjectData(prev => ({
      ...prev,
      heroImage: url
    }));
    setToast({
      show: true,
      message: 'Hero image uploaded successfully',
      type: 'success'
    });
  };

  // Handle project image upload
  const handleImageUpload = (url) => {
    const newImage = {
      id: `img${Date.now()}`,
      url,
      caption: ''
    };
    
    setProjectData(prev => ({
      ...prev,
      images: [...prev.images, newImage]
    }));
    
    setToast({
      show: true,
      message: 'Image uploaded successfully',
      type: 'success'
    });
  };

  // Update image caption
  const updateImageCaption = (id, caption) => {
    setProjectData(prev => ({
      ...prev,
      images: prev.images.map(img => 
        img.id === id ? { ...img, caption } : img
      )
    }));
  };

  // Remove image
  const removeImage = (id) => {
    setProjectData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== id)
    }));
    
    setToast({
      show: true,
      message: 'Image removed',
      type: 'success'
    });
  };

  // Add technology
  const addTechnology = () => {
    if (!newTechnology.trim()) return;
    
    if (projectData.technologies.includes(newTechnology.trim())) {
      setToast({
        show: true,
        message: 'This technology is already added',
        type: 'warning'
      });
      return;
    }
    
    setProjectData(prev => ({
      ...prev,
      technologies: [...prev.technologies, newTechnology.trim()]
    }));
    
    setNewTechnology('');
  };

  // Remove technology
  const removeTechnology = (tech) => {
    setProjectData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };
  
  // Add tool
  const addTool = () => {
    if (!newTool.trim()) return;
    
    if (projectData.tools && projectData.tools.includes(newTool.trim())) {
      setToast({
        show: true,
        message: 'This tool is already added',
        type: 'warning'
      });
      return;
    }
    
    setProjectData(prev => ({
      ...prev,
      tools: [...(prev.tools || []), newTool.trim()]
    }));
    
    setNewTool('');
  };

  // Remove tool
  const removeTool = (tool) => {
    setProjectData(prev => ({
      ...prev,
      tools: (prev.tools || []).filter(t => t !== tool)
    }));
  };

  // Add feature
  const addFeature = () => {
    if (!newFeature.trim()) return;
    
    if (projectData.features.includes(newFeature.trim())) {
      setToast({
        show: true,
        message: 'This feature is already added',
        type: 'warning'
      });
      return;
    }
    
    setProjectData(prev => ({
      ...prev,
      features: [...prev.features, newFeature.trim()]
    }));
    
    setNewFeature('');
  };

  // Remove feature
  const removeFeature = (feature) => {
    setProjectData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
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
    
    if (!projectData.category) {
      setToast({
        show: true,
        message: 'Please select a category',
        type: 'error'
      });
      return;
    }
    
    if (!projectData.description.trim()) {
      setToast({
        show: true,
        message: 'Project description is required',
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
        
        // Navigate back to detail view after short delay
        setTimeout(() => {
          navigate(isEditMode ? `/admin/projects/${projectId}` : '/admin/projects/gallery');
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
    navigate(isEditMode ? `/admin/projects/${projectId}` : '/admin/projects/gallery');
  };

  // Handle section toggle
  const handleSectionToggle = (section) => {
    // Don't allow toggling mandatory sections
    if (section === 'heroSection' || section === 'quickInfo') {
      return;
    }
    
    setSectionToggles(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Toggle auto-save
  const toggleAutoSave = () => {
    setAutoSave(prev => !prev);
    
    setToast({
      show: true,
      message: !autoSave ? 'Auto-save enabled' : 'Auto-save disabled',
      type: 'success'
    });
  };
  
  // Toggle live preview
  const toggleLivePreview = () => {
    setLivePreview(prev => !prev);
  };
  
  // Add a new feature tile
  const addFeatureTile = () => {
    const newTile = {
      id: `tile-${Date.now()}`,
      title: '',
      description: '',
      mediaType: 'icon',
      mediaUrl: '',
      tileSize: 'normal'
    };
    
    setFeatureTiles(prev => [...prev, newTile]);
  };
  
  // Update feature tile
  const updateFeatureTile = (id, field, value) => {
    setFeatureTiles(prev => 
      prev.map(tile => 
        tile.id === id ? { ...tile, [field]: value } : tile
      )
    );
  };
  
  // Move feature tile up or down
  const moveFeatureTile = (id, direction) => {
    const tileIndex = featureTiles.findIndex(tile => tile.id === id);
    if (
      (direction === 'up' && tileIndex === 0) || 
      (direction === 'down' && tileIndex === featureTiles.length - 1)
    ) {
      return;
    }
    
    const newIndex = direction === 'up' ? tileIndex - 1 : tileIndex + 1;
    const tiles = [...featureTiles];
    const tile = tiles[tileIndex];
    
    // Remove tile from current position
    tiles.splice(tileIndex, 1);
    // Insert at new position
    tiles.splice(newIndex, 0, tile);
    
    setFeatureTiles(tiles);
  };
  
  // Remove feature tile
  const removeFeatureTile = (id) => {
    // Always keep at least 3 tiles
    if (featureTiles.length <= 3) {
      setToast({
        show: true,
        message: 'Must have at least 3 feature tiles',
        type: 'warning'
      });
      return;
    }
    
    setFeatureTiles(prev => prev.filter(tile => tile.id !== id));
  };
  
  // Handle feature tile media upload
  const handleTileMediaUpload = (id, url) => {
    setFeatureTiles(prev => 
      prev.map(tile => 
        tile.id === id ? { ...tile, mediaUrl: url } : tile
      )
    );
    
    setToast({
      show: true,
      message: 'Media uploaded successfully',
      type: 'success'
    });
  };
  
  // Add a result
  const addResult = () => {
    if (!newResult.trim()) return;
    
    if (projectData.results.includes(newResult.trim())) {
      setToast({
        show: true,
        message: 'This result is already added',
        type: 'warning'
      });
      return;
    }
    
    setProjectData(prev => ({
      ...prev,
      results: [...prev.results, newResult.trim()]
    }));
    
    setNewResult('');
  };
  
  // Remove result
  const removeResult = (result) => {
    setProjectData(prev => ({
      ...prev,
      results: prev.results.filter(r => r !== result)
    }));
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCancel}
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
            >
              <FiX className="mr-1" size={16} />
              Back to Gallery
            </button>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              {isEditMode ? 'Edit Project Details' : 'Create New Project'}
            </h1>
          </div>
          <div className="flex space-x-3">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleAutoSave}
                className={`flex items-center px-3 py-1.5 text-sm rounded-md border ${
                  autoSave 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400' 
                    : 'bg-gray-50 border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'
                }`}
              >
                {autoSave ? (
                  <FiToggleRight className="mr-1.5" size={16} />
                ) : (
                  <FiToggleLeft className="mr-1.5" size={16} />
                )}
                Auto-Save
              </button>
              
              <button
                onClick={toggleLivePreview}
                className={`flex items-center px-3 py-1.5 text-sm rounded-md border ${
                  livePreview 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400' 
                    : 'bg-gray-50 border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'
                }`}
              >
                {livePreview ? <FiEye className="mr-1.5" size={16} /> : <FiEye className="mr-1.5" size={16} />}
                Preview
              </button>
            </div>
            
            <button
              onClick={saveProject}
              disabled={isLoading}
              className={`flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md shadow-sm ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <FiSave className="mr-2" size={16} />
              Save Project
            </button>
          </div>
        </div>
        
        {/* Category selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Project Category *
          </label>
          <select
            name="category"
            value={projectData.category}
            onChange={handleInputChange}
            className="w-full md:w-64 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Category tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex overflow-x-auto space-x-4">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`py-2 px-4 text-sm font-medium border-b-2 ${
                  activeTab === cat.id
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Section Toggles */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="mb-2 flex justify-between items-center">
            <h3 className="font-medium text-gray-700 dark:text-gray-300">Section Toggles</h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Toggle sections to show/hide in the project detail page
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {Object.entries(sectionToggles).map(([section, isEnabled]) => {
              // Get formatted name from section key
              let name;
              switch(section) {
                case 'heroSection': name = 'Hero Section'; break;
                case 'quickInfo': name = 'Quick Info'; break;
                case 'summary': name = 'Summary'; break;
                case 'problemSolution': name = 'Problem → Solution'; break;
                case 'features': name = 'Features'; break;
                case 'visualShowcase': name = 'Visual Showcase'; break;
                case 'designProcess': name = 'Design Process'; break;
                case 'learnings': name = 'Results & Learnings'; break;
                case 'resourceLinks': name = 'Resource Links'; break;
                default: name = section;
              }
              
              const isMandatory = section === 'heroSection' || section === 'quickInfo';
              
              return (
                <div 
                  key={section} 
                  onClick={() => handleSectionToggle(section)} 
                  className={`flex items-center ${!isMandatory && 'cursor-pointer'} p-2 rounded-md ${isEnabled ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-gray-100 dark:bg-gray-700'}`}
                >
                  {isEnabled ? (
                    <FiToggleRight className={`mr-2 ${isMandatory ? 'text-gray-400' : 'text-emerald-500'}`} size={20} />
                  ) : (
                    <FiToggleLeft className="mr-2 text-gray-400" size={20} />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {name}
                      {isMandatory && (
                        <span className="ml-2 text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-1 py-0.5 rounded">
                          Required
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* The form sections are already implemented */}
          </div>
        )}
      </div>
      
      {/* Toast Notification */}
      <Toaster 
        show={toast.show} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({...toast, show: false})} 
      />
      
      {/* Live preview panel */}
      {livePreview && (
        <div className="fixed top-16 right-6 w-1/3 h-[calc(100vh-8rem)] bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Live Preview</h2>
            <button 
              onClick={toggleLivePreview}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <FiX size={20} />
            </button>
          </div>
          <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg h-full flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Preview will be shown here</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CMSProjectDetailForm; 