import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  FiSearch, FiPlus, FiEdit2, FiTrash2, FiEye, FiToggleLeft, FiToggleRight, 
  FiStar, FiGrid, FiList, FiSettings, FiSave, FiImage, FiInfo, FiLayers, FiBox,
  FiArrowLeft, FiCheck, FiX
} from 'react-icons/fi';
import { 
  IoGridOutline, IoLayersOutline, IoCodeSlash, IoColorPaletteOutline, 
  IoFlaskOutline, IoClose, IoAddCircleOutline
} from 'react-icons/io5';
import supabase from '../../utils/supabaseClient';
import CategoryProjectForm from '../components/CategoryProjectForm';
import ContentPageLayout, { ContentSection } from '../CMSHelper/ContentPageLayout';
import { TextInput, Button, Toggle } from '../CMSHelper/FormComponents';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';

const ProjectGalleryCMS = () => {
  // State
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [isSelectingCategory, setIsSelectingCategory] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formCategory, setFormCategory] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [isCategorySettingsOpen, setIsCategorySettingsOpen] = useState(false);
  const categoryScrollRef = useRef(null);

  // Category definitions with icons and fields
  const categories = [
    { 
      key: 'all', 
      label: 'All Projects', 
      icon: <FiGrid className="text-xl" />,
    },
    { 
      key: 'ui-ux', 
      label: 'UI/UX Design', 
      icon: <IoLayersOutline className="text-xl" />,
      fields: ['thumbnail', 'title', 'category_badge', 'short_description']
    },
    { 
      key: 'development', 
      label: 'Development', 
      icon: <IoCodeSlash className="text-xl" />,
      fields: ['thumbnail', 'title', 'stack_tags', 'terminal_preview']
    },
    { 
      key: 'ai-projects', 
      label: 'AI Projects', 
      icon: <IoColorPaletteOutline className="text-xl" />,
      fields: ['thumbnail', 'title', 'tech_used_tags']
    },
    { 
      key: 'visual-identity', 
      label: 'Visual Identity', 
      icon: <IoGridOutline className="text-xl" />,
      fields: ['thumbnail', 'title', 'subtext', 'description', 'tags']
    },
    { 
      key: 'creative-lab', 
      label: 'Creative Lab', 
      icon: <IoFlaskOutline className="text-xl" />,
      fields: ['thumbnail', 'title', 'one_line_description', 'experiment_tag', 'badge']
    }
  ];

  // Tab visibility state
  const [tabVisibility, setTabVisibility] = useState({
    'all': true,
    'ui-ux': true,
    'development': true,
    'ai-projects': true,
    'visual-identity': true,
    'creative-lab': true
  });

  // Load projects when category changes
  useEffect(() => {
    if (!showForm) {
      fetchProjects();
    }
  }, [activeCategory, showForm]);
  
  // Fetch projects from database with proper joins
  const fetchProjects = async () => {
    setLoading(true);
    
    try {
      // Build the query
      let query = supabase
        .from('projects')
        .select(`
          id, 
          title, 
          slug, 
          short_description, 
          hero_asset,
          published,
          category_id,
          project_categories(key, label),
          tags
        `);
      
      // Apply category filter
      if (activeCategory !== 'all') {
        // Get the category ID first
        const { data: categoryData } = await supabase
          .from('project_categories')
          .select('id')
          .eq('key', activeCategory)
          .single();
          
        if (categoryData) {
          query = query.eq('category_id', categoryData.id);
        }
      }
      
      // Execute query with ordering
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Get hero image URLs by joining with assets table
      const projectsWithImages = await Promise.all(
        data.map(async (project) => {
          if (project.hero_asset) {
            const { data: assetData } = await supabase
              .from('assets')
              .select('url')
              .eq('id', project.hero_asset)
              .single();
            
            return {
              ...project,
              image_url: assetData?.url || null,
              category: project.project_categories?.label || 'Uncategorized',
              is_published: project.published
            };
          }
          return {
            ...project,
            image_url: null,
            category: project.project_categories?.label || 'Uncategorized',
            is_published: project.published
          };
        })
      );
      
      setProjects(projectsWithImages);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };
  
  // Filter projects by search query
  const filteredProjects = projects.filter(project => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      (project.title && project.title.toLowerCase().includes(query)) ||
      (project.short_description && project.short_description.toLowerCase().includes(query)) ||
      (project.category && project.category.toLowerCase().includes(query)) ||
      (project.tags && project.tags.some(tag => tag.toLowerCase().includes(query)))
    );
  });

  // Handle drag-n-drop reordering
  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    
    const items = Array.from(projects);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update local state immediately
    setProjects(items);
    
    // Update display orders in database
    try {
      // If you have a display_order field in projects table:
      const updates = items.map((item, index) => ({
        id: item.id,
        display_order: index
      }));
      
      const { error } = await supabase
        .from('projects')
        .upsert(updates, { onConflict: 'id' });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating project order:', error);
      fetchProjects(); // Refetch on error to restore correct order
      toast.error('Failed to update project order');
    }
  };

  // Toggle project published status
  const togglePublished = async (project) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ published: !project.is_published })
        .eq('id', project.id);
      
      if (error) throw error;
      
      // Update local state
      setProjects(projects.map(p => 
        p.id === project.id ? { ...p, is_published: !p.is_published } : p
      ));
      
      toast.success(`Project ${project.is_published ? 'unpublished' : 'published'} successfully`);
    } catch (error) {
      console.error('Error toggling published status:', error);
      toast.error('Failed to update project status');
    }
  };
  
  // Delete project
  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }
    
    try {
      // First delete related records in child tables
      await supabase
        .from('project_features')
        .delete()
        .eq('project_id', projectId);

      await supabase
        .from('project_images')
        .delete()
        .eq('project_id', projectId);
        
      // Then delete the project itself
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);
      
      if (error) throw error;
      
      // Update local state
      setProjects(projects.filter(p => p.id !== projectId));
      toast.success('Project deleted successfully');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };
  
  // Start adding a project by showing category selection
  const handleAddProject = () => {
    setIsSelectingCategory(true);
    setEditingProject(null);
  };
  
  // Select a category and show the form
  const handleCategorySelection = (categoryKey) => {
    setFormCategory(categoryKey);
    setIsSelectingCategory(false);
    setShowForm(true);
  };
  
  // Open form to edit project
  const handleEditProject = (project) => {
    setFormCategory(getCategoryKeyForProject(project));
    setEditingProject(project);
    setShowForm(true);
    setIsSelectingCategory(false);
  };
  
  // Helper to get category key for a project
  const getCategoryKeyForProject = (project) => {
    // Logic to determine appropriate category key
    if (!project.project_categories?.key) return 'all';
    return project.project_categories.key;
  };
  
  // Toggle tab visibility
  const toggleTabVisibility = (tabKey) => {
    setTabVisibility({
      ...tabVisibility,
      [tabKey]: !tabVisibility[tabKey]
    });
  };
  
  // Close form and refresh projects
  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingProject(null);
    setFormCategory(null);
    fetchProjects();
  };
  
  // Cancel form and return to listing
  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProject(null);
    setFormCategory(null);
    setIsSelectingCategory(false);
  };
  
  // Header with search and view toggles
  const renderControls = () => (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="relative flex-grow md:flex-grow-0 max-w-full md:max-w-xs">
        <TextInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search projects..."
          className="w-full"
        />
        <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
      </div>
      
      <div className="flex items-center gap-3 ml-auto">
        <div className="flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-emerald-700/30 text-emerald-400' : 'bg-black/30 text-gray-400'}`}
            title="Grid view"
          >
            <FiGrid size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-emerald-700/30 text-emerald-400' : 'bg-black/30 text-gray-400'}`}
            title="List view"
          >
            <FiList size={18} />
          </motion.button>
        </div>
        
        <Button 
          onClick={handleAddProject}
          icon={<FiPlus size={16} />}
        >
          Add Project
        </Button>
      </div>
    </div>
  );

  // Render category selection interface
  const renderCategorySelection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="mb-4 flex items-center">
        <Button 
          onClick={handleFormCancel} 
          icon={<FiArrowLeft size={16} />}
          variant="secondary"
          className="mr-2"
        >
          Back
        </Button>
        <h2 className="text-xl font-bold text-white">Choose Project Type</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categories.filter(cat => cat.key !== 'all').map((category) => (
          <motion.div
            key={category.key}
            whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)' }}
            whileTap={{ y: 0 }}
            onClick={() => handleCategorySelection(category.key)}
            className="bg-black/40 border border-gray-800/50 rounded-xl p-6 cursor-pointer hover:border-emerald-500/30 transition-colors"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-900/20 rounded-full flex items-center justify-center text-emerald-400 mb-4">
                <span className="text-3xl">{category.icon}</span>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">{category.label}</h3>
              <p className="text-sm text-gray-400">
                {category.key === 'ui-ux' && "For UX/UI design work and interfaces"}
                {category.key === 'development' && "Programming projects and code repositories"}
                {category.key === 'ai-projects' && "AI, ML, and generative art projects"}
                {category.key === 'visual-identity' && "Branding, logos, and visual design"}
                {category.key === 'creative-lab' && "Experimental projects and concepts"}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'dark-toast',
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            style: {
              background: 'rgba(16, 185, 129, 0.9)',
            },
            iconTheme: {
              primary: 'white',
              secondary: 'rgba(16, 185, 129, 0.9)',
            },
          },
          error: {
            style: {
              background: 'rgba(239, 68, 68, 0.9)',
            },
            iconTheme: {
              primary: 'white',
              secondary: 'rgba(239, 68, 68, 0.9)',
            },
          },
        }}
      />
      <ContentPageLayout
        title="Project Gallery"
        icon={<FiLayers size={24} />}
      >
        {showForm ? (
          <div>
            <div className="mb-4 flex items-center">
              <Button 
                onClick={handleFormCancel} 
                icon={<FiArrowLeft size={16} />}
                variant="secondary"
                className="mr-2"
              >
                Back to Projects
              </Button>
              <h2 className="text-xl font-bold text-white">
                {editingProject ? 'Edit Project' : `Add ${categories.find(c => c.key === formCategory)?.label || 'New'} Project`}
              </h2>
            </div>
            
            <CategoryProjectForm 
              categoryKey={formCategory} 
              project={editingProject}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </div>
        ) : isSelectingCategory ? (
          renderCategorySelection()
        ) : (
          <>
            {/* Categories Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-white flex items-center">
                  <FiBox size={20} className="mr-2 text-emerald-400" />
                  Categories
                </h3>
                
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-sm flex items-center gap-1 text-gray-400 hover:text-emerald-400 py-1 px-2 rounded hover:bg-black/30"
                  onClick={() => setIsCategorySettingsOpen(!isCategorySettingsOpen)}
                >
                  <FiSettings size={12} />
                  <span>Category Settings</span>
                </motion.button>
              </div>
              
              {/* Horizontal scrollable categories */}
              <div className="relative">
                <div 
                  ref={categoryScrollRef}
                  className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent"
                >
                  {categories.map((category) => (
                    tabVisibility[category.key] && (
                      <motion.button
                        key={category.key}
                        whileHover={{ y: -2, boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.15)' }}
                        whileTap={{ y: 0 }}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap transition-all flex-shrink-0 ${
                          activeCategory === category.key 
                            ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/50 shadow-inner shadow-emerald-900/30' 
                            : 'bg-black/30 text-gray-300 border border-gray-800/50 hover:bg-black/50'
                        }`}
                        onClick={() => setActiveCategory(category.key)}
                      >
                        <span className="text-xl">{category.icon}</span>
                        <span>{category.label}</span>
                      </motion.button>
                    )
                  ))}
                </div>
              
                {/* Category Settings Popup */}
                <AnimatePresence>
                  {isCategorySettingsOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full right-0 z-10 mt-1 p-4 bg-black/80 backdrop-blur-md rounded-lg border border-gray-800 shadow-lg min-w-[240px]"
                    >
                      <h4 className="font-medium mb-3 text-sm text-emerald-400">Show/Hide Categories</h4>
                
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <div key={category.key} className="flex items-center justify-between gap-4 py-1">
                            <span className="text-sm text-gray-300 flex items-center gap-1.5">
                              <span className="text-base opacity-80">{category.icon}</span>
                              {category.label}
                            </span>
                            
                            <Toggle
                              checked={tabVisibility[category.key]}
                              onChange={() => toggleTabVisibility(category.key)}
                              size="small"
                            />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            {/* Search and Controls */}
            <div className="mb-4">
              {renderControls()}
            </div>

            {/* Project Grid/List */}
            <AnimatePresence>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
                </div>
              ) : filteredProjects.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-black/30 border border-gray-800/50 rounded-xl p-8 text-center"
                >
                  <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 rounded-full bg-black/40 border border-gray-800/50 flex items-center justify-center text-emerald-500/60">
                      <IoAddCircleOutline size={50} />
                    </div>
                  </div>
                  <h3 className="text-xl font-medium mb-3 text-white">No projects found</h3>
                  <p className="text-gray-400 mb-6 max-w-md mx-auto">
                    {searchQuery 
                      ? "Try adjusting your search query or adding a new project to get started." 
                      : `Your ${categories.find(c => c.key === activeCategory)?.label || ''} collection is empty. Add your first project to get started.`}
                  </p>
                  <Button
                    onClick={handleAddProject}
                    icon={<FiPlus size={16} />}
                    size="large"
                  >
                    Add Your First Project
                  </Button>
                </motion.div>
              ) : (
                <div>
                  {viewMode === 'grid' ? (
                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable droppableId="projects" direction="horizontal">
                        {(provided) => (
                          <div 
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
                          >
                            {filteredProjects.map((project, index) => (
                              <Draggable key={project.id} draggableId={project.id.toString()} index={index}>
                                {(provided, snapshot) => (
                                  <motion.div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    whileHover={{ y: -3, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 10px 1px rgba(16, 185, 129, 0.2)' }}
                                    className={`bg-black/40 backdrop-blur-sm rounded-xl overflow-hidden border ${
                                      snapshot.isDragging ? 'border-emerald-700/50 shadow-xl shadow-emerald-900/20' : 'border-gray-800/50'
                                    } h-full flex flex-col transition-all duration-300`}
                                  >
                                    {/* Card header with image */}
                                    <div className="relative h-48 bg-gray-900/50">
                                      {project.image_url ? (
                                        <img 
                                          src={project.image_url} 
                                          alt={project.title}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                                          <FiImage size={32} />
                                        </div>
                                      )}
                                      
                                      {/* Category badge */}
                                      <div className="absolute top-3 left-3 px-2 py-1 bg-black/80 backdrop-blur-sm text-xs rounded-md text-gray-200 border border-gray-800/30 shadow-sm">
                                        {project.category}
                                      </div>
                                      
                                      {/* Published status */}
                                      <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          togglePublished(project);
                                        }}
                                        className="absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-md transition-colors"
                                        style={{
                                          backgroundColor: project.is_published ? 'rgba(16, 185, 129, 0.3)' : 'rgba(0, 0, 0, 0.5)',
                                          color: project.is_published ? 'rgb(52, 211, 153)' : 'rgb(156, 163, 175)',
                                          border: project.is_published ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(75, 85, 99, 0.3)'
                                        }}
                                        title={project.is_published ? 'Published' : 'Draft'}
                                      >
                                        {project.is_published ? (
                                          <FiToggleRight size={20} />
                                        ) : (
                                          <FiToggleLeft size={20} />
                                        )}
                                      </motion.button>
                                    </div>
                                    
                                    {/* Card content */}
                                    <div className="p-4 flex-1 flex flex-col">
                                      <h3 className="text-lg font-medium line-clamp-2 mb-2 text-white">{project.title}</h3>
                                      
                                      {project.short_description && (
                                        <p className="text-gray-400 text-sm line-clamp-3 mb-3">
                                          {project.short_description}
                                        </p>
                                      )}
                                      
                                      {/* Tags */}
                                      {project.tags && project.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-auto mb-3">
                                          {project.tags.slice(0, 3).map((tag, index) => (
                                            <span key={index} className="text-xs px-2 py-0.5 bg-black/50 border border-gray-800/30 rounded-full text-gray-300">
                                              {tag}
                                            </span>
                                          ))}
                                          {project.tags.length > 3 && (
                                            <span className="text-xs px-2 py-0.5 bg-black/50 border border-gray-800/30 rounded-full text-gray-300">
                                              +{project.tags.length - 3}
                                            </span>
                                          )}
                                        </div>
                                      )}
                                      
                                      {/* Actions */}
                                      <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-800/30">
                                        <Link
                                          to={`/admin/project-details/${project.id}`}
                                          className="text-xs px-3 py-1.5 bg-black/30 hover:bg-emerald-900/10 border border-gray-800/30 rounded-md text-gray-300 hover:text-emerald-400 transition-colors"
                                        >
                                          <FiInfo size={12} className="inline mr-1" />
                                          Details
                                        </Link>
                                        
                                        <div className="flex gap-1">
                                          <motion.button 
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleEditProject(project)}
                                            className="p-1.5 rounded-md hover:bg-emerald-900/10 text-gray-400 hover:text-emerald-400 transition-colors"
                                            title="Edit project"
                                          >
                                            <FiEdit2 size={16} />
                                          </motion.button>
                                          <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}  
                                            onClick={() => handleDeleteProject(project.id)}
                                            className="p-1.5 rounded-md hover:bg-red-900/10 text-gray-400 hover:text-red-400 transition-colors"
                                            title="Delete project"
                                          >
                                            <FiTrash2 size={16} />
                                          </motion.button>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  ) : (
                    // List view
                    <div className="bg-black/20 border border-gray-800/50 rounded-xl overflow-hidden">
                      <div className="grid grid-cols-12 gap-3 p-3 bg-black/20 text-emerald-400 text-sm font-medium border-b border-gray-800/30">
                        <div className="col-span-5 sm:col-span-6">Project</div>
                        <div className="col-span-4 sm:col-span-3 md:col-span-2">Category</div>
                        <div className="col-span-3 sm:col-span-3 md:col-span-2">Status</div>
                        <div className="hidden md:block md:col-span-2 text-right pr-2">Actions</div>
                      </div>
                      <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="projects" direction="vertical">
                          {(provided) => (
                            <div 
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                            >
                              {filteredProjects.map((project, index) => (
                                <Draggable key={project.id} draggableId={project.id.toString()} index={index}>
                                  {(provided, snapshot) => (
                                    <motion.div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      whileHover={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
                                      className={`grid grid-cols-12 gap-3 p-3 border-b border-gray-800/20 items-center ${
                                        snapshot.isDragging ? 'bg-emerald-900/5 shadow-lg' : ''
                                      }`}
                                    >
                                      <div className="col-span-5 sm:col-span-6 flex items-center gap-3">
                                        <div className="w-12 h-12 bg-black/40 rounded-lg overflow-hidden flex-shrink-0">
                                          {project.image_url ? (
                                            <img 
                                              src={project.image_url}
                                              alt={project.title}
                                              className="w-full h-full object-cover"
                                            />
                                          ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-700">
                                              <FiImage size={20} />
                                            </div>
                                          )}
                                        </div>
                                        <div className="min-w-0">
                                          <h3 className="font-medium text-white truncate">{project.title}</h3>
                                          <p className="text-xs text-gray-400 truncate">{project.short_description || 'No description'}</p>
                                        </div>
                                      </div>
                                      <div className="col-span-4 sm:col-span-3 md:col-span-2">
                                        <span className="text-xs px-2 py-1 bg-black/40 border border-gray-800/30 rounded-md text-gray-300 whitespace-nowrap overflow-hidden text-ellipsis block max-w-full">
                                          {project.category}
                                        </span>
                                      </div>
                                      <div className="col-span-3 sm:col-span-3 md:col-span-2">
                                        <Toggle
                                          checked={project.is_published}
                                          onChange={() => togglePublished(project)}
                                          size="small"
                                          label={project.is_published ? "Live" : "Draft"}
                                        />
                                      </div>
                                      <div className="hidden md:flex md:col-span-2 justify-end items-center gap-1">
                                        <Link
                                          to={`/admin/project-details/${project.id}`}
                                          className="p-1.5 rounded-md hover:bg-black/40 text-gray-400 hover:text-white transition-colors"
                                          title="View details"
                                        >
                                          <FiInfo size={16} />
                                        </Link>
                                        <motion.button
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                          onClick={() => handleEditProject(project)}
                                          className="p-1.5 rounded-md hover:bg-emerald-900/10 text-gray-400 hover:text-emerald-400 transition-colors"
                                          title="Edit project"
                                        >
                                          <FiEdit2 size={16} />
                                        </motion.button>
                                        <motion.button
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                          onClick={() => handleDeleteProject(project.id)}
                                          className="p-1.5 rounded-md hover:bg-red-900/10 text-gray-400 hover:text-red-400 transition-colors"
                                          title="Delete project"
                                        >
                                          <FiTrash2 size={16} />
                                        </motion.button>
                                      </div>
                                    </motion.div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                    </div>
                  )}
                </div>
              )}
            </AnimatePresence>
          </>
        )}
      </ContentPageLayout>
    </>
  );
};

export default ProjectGalleryCMS; 