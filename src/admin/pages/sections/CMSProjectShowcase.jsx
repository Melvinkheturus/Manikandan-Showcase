import React, { useState, useEffect } from 'react';
import { FiSave, FiPlus, FiTrash, FiEdit, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Toaster from '../../components/Toaster';
import { motion } from 'framer-motion';

const CMSProjectShowcase = () => {
  // State for project showcase data
  const [showcaseData, setShowcaseData] = useState({
    intro: '',
    categories: [
      { id: 'design', name: 'UI/UX Design', order: 1, isActive: true },
      { id: 'web', name: 'Web Development', order: 2, isActive: true },
      { id: 'mobile', name: 'Mobile Apps', order: 3, isActive: false },
    ],
    featuredProjects: [
      { id: 'proj1', title: 'E-commerce Redesign', category: 'design', order: 1, isFeatured: true },
      { id: 'proj2', title: 'Portfolio Website', category: 'web', order: 2, isFeatured: true },
    ],
    displayMode: 'grid', // 'grid', 'masonry', or 'carousel'
  });
  
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: '', isActive: true });

  // Load showcase data
  useEffect(() => {
    const fetchShowcaseData = async () => {
      setIsLoading(true);
      try {
        // In a real app, fetch from API
        // Mock data for demo purposes
        setTimeout(() => {
          setShowcaseData({
            intro: 'Explore my latest projects across various design disciplines.',
            categories: [
              { id: 'design', name: 'UI/UX Design', order: 1, isActive: true },
              { id: 'web', name: 'Web Development', order: 2, isActive: true },
              { id: 'mobile', name: 'Mobile Apps', order: 3, isActive: false },
              { id: 'branding', name: 'Branding', order: 4, isActive: true },
            ],
            featuredProjects: [
              { id: 'proj1', title: 'E-commerce Redesign', category: 'design', order: 1, isFeatured: true },
              { id: 'proj2', title: 'Portfolio Website', category: 'web', order: 2, isFeatured: true },
              { id: 'proj3', title: 'Fitness App UI', category: 'mobile', order: 3, isFeatured: true },
              { id: 'proj4', title: 'Brand Identity', category: 'branding', order: 4, isFeatured: false },
            ],
            displayMode: 'grid',
          });
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching showcase data:', error);
        setToast({
          show: true,
          message: 'Failed to load project showcase data',
          type: 'error'
        });
        setIsLoading(false);
      }
    };

    fetchShowcaseData();
  }, []);

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShowcaseData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle category changes
  const handleCategoryChange = (id, field, value) => {
    const updatedCategories = showcaseData.categories.map(cat => 
      cat.id === id ? { ...cat, [field]: value } : cat
    );
    
    setShowcaseData(prev => ({
      ...prev,
      categories: updatedCategories
    }));
  };

  // Add a new category
  const addCategory = () => {
    if (!newCategory.name.trim()) {
      setToast({
        show: true,
        message: 'Category name cannot be empty',
        type: 'warning'
      });
      return;
    }
    
    const id = newCategory.name.toLowerCase().replace(/\s+/g, '-');
    const newOrder = showcaseData.categories.length > 0 
      ? Math.max(...showcaseData.categories.map(c => c.order)) + 1 
      : 1;
      
    const category = {
      id,
      name: newCategory.name,
      isActive: newCategory.isActive,
      order: newOrder
    };
    
    setShowcaseData(prev => ({
      ...prev,
      categories: [...prev.categories, category]
    }));
    
    setNewCategory({ name: '', isActive: true });
    
    setToast({
      show: true,
      message: 'Category added successfully',
      type: 'success'
    });
  };

  // Remove a category
  const removeCategory = (id) => {
    // Check if any projects use this category
    const projectsWithCategory = showcaseData.featuredProjects.filter(p => p.category === id);
    
    if (projectsWithCategory.length > 0) {
      setToast({
        show: true,
        message: `Cannot remove category: ${projectsWithCategory.length} projects are using it`,
        type: 'warning'
      });
      return;
    }
    
    const updatedCategories = showcaseData.categories.filter(cat => cat.id !== id);
    
    // Re-order remaining categories
    const reorderedCategories = updatedCategories.map((cat, idx) => ({
      ...cat,
      order: idx + 1
    }));
    
    setShowcaseData(prev => ({
      ...prev,
      categories: reorderedCategories
    }));
    
    setToast({
      show: true,
      message: 'Category removed successfully',
      type: 'success'
    });
  };

  // Move category up in order
  const moveCategoryUp = (id) => {
    const index = showcaseData.categories.findIndex(cat => cat.id === id);
    if (index <= 0) return;
    
    const updatedCategories = [...showcaseData.categories];
    const temp = updatedCategories[index];
    updatedCategories[index] = updatedCategories[index - 1];
    updatedCategories[index - 1] = temp;
    
    // Update order values
    const reorderedCategories = updatedCategories.map((cat, idx) => ({
      ...cat,
      order: idx + 1
    }));
    
    setShowcaseData(prev => ({
      ...prev,
      categories: reorderedCategories
    }));
  };

  // Move category down in order
  const moveCategoryDown = (id) => {
    const index = showcaseData.categories.findIndex(cat => cat.id === id);
    if (index === -1 || index >= showcaseData.categories.length - 1) return;
    
    const updatedCategories = [...showcaseData.categories];
    const temp = updatedCategories[index];
    updatedCategories[index] = updatedCategories[index + 1];
    updatedCategories[index + 1] = temp;
    
    // Update order values
    const reorderedCategories = updatedCategories.map((cat, idx) => ({
      ...cat,
      order: idx + 1
    }));
    
    setShowcaseData(prev => ({
      ...prev,
      categories: reorderedCategories
    }));
  };

  // Toggle project featured status
  const toggleProjectFeatured = (id) => {
    const updatedProjects = showcaseData.featuredProjects.map(proj => 
      proj.id === id ? { ...proj, isFeatured: !proj.isFeatured } : proj
    );
    
    setShowcaseData(prev => ({
      ...prev,
      featuredProjects: updatedProjects
    }));
  };

  // Save showcase section data
  const saveShowcaseSection = async () => {
    setIsLoading(true);
    try {
      // In a real app, save to API
      // Mock successful update for demo
      setTimeout(() => {
        setIsLoading(false);
        setToast({
          show: true,
          message: 'Project showcase updated successfully!',
          type: 'success'
        });
      }, 800);
    } catch (error) {
      console.error('Error saving showcase section:', error);
      setToast({
        show: true,
        message: 'Failed to save project showcase',
        type: 'error'
      });
      setIsLoading(false);
    }
  };

  const displayModeOptions = [
    { value: 'grid', label: 'Grid Layout' },
    { value: 'masonry', label: 'Masonry Layout' },
    { value: 'carousel', label: 'Carousel' }
  ];

  // Component to render the project showcase editor
  const ShowcaseEditor = () => (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Project Showcase Editor</h1>
          <button
            onClick={saveShowcaseSection}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:bg-gray-400"
          >
            {isLoading ? 'Saving...' : (
              <>
                <FiSave className="mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>

        {/* Main content */}
        <div className="space-y-8">
          {/* Basic Info Section */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Basic Info</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Introduction Text
                </label>
                <textarea
                  name="intro"
                  value={showcaseData.intro}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Brief introduction to your projects section"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Display Mode
                </label>
                <select
                  name="displayMode"
                  value={showcaseData.displayMode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                >
                  {displayModeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Choose how your projects will be displayed on the frontend.
                </p>
              </div>
            </div>
          </section>
          
          {/* Categories Section */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Project Categories</h2>
            </div>
            
            {/* Add New Category */}
            <div className="mb-6 p-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-md">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Add New Category</h3>
              <div className="flex flex-wrap gap-3">
                <div className="flex-grow">
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Category name"
                  />
                </div>
                <div className="flex items-center">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={newCategory.isActive}
                      onChange={(e) => setNewCategory({...newCategory, isActive: e.target.checked})}
                      className="rounded border-gray-300 text-emerald-600 shadow-sm focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Active</span>
                  </label>
                </div>
                <div>
                  <button
                    onClick={addCategory}
                    className="flex items-center px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 text-sm"
                  >
                    <FiPlus className="mr-1" size={14} />
                    Add Category
                  </button>
                </div>
              </div>
            </div>
            
            {/* Categories Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Order
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {showcaseData.categories.map((category) => (
                    <tr key={category.id}>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          <span className="text-gray-700 dark:text-gray-300">{category.order}</span>
                          <div className="flex flex-col">
                            <button
                              onClick={() => moveCategoryUp(category.id)}
                              disabled={category.order === 1}
                              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-30"
                            >
                              <FiArrowUp size={14} />
                            </button>
                            <button
                              onClick={() => moveCategoryDown(category.id)}
                              disabled={category.order === showcaseData.categories.length}
                              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-30"
                            >
                              <FiArrowDown size={14} />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        {editingCategory === category.id ? (
                          <input
                            type="text"
                            value={category.name}
                            onChange={(e) => handleCategoryChange(category.id, 'name', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                            autoFocus
                            onBlur={() => setEditingCategory(null)}
                            onKeyDown={(e) => e.key === 'Enter' && setEditingCategory(null)}
                          />
                        ) : (
                          <div 
                            className="text-gray-700 dark:text-gray-300 cursor-pointer"
                            onClick={() => setEditingCategory(category.id)}
                          >
                            {category.name}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                          {category.id}
                        </span>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            checked={category.isActive}
                            onChange={(e) => handleCategoryChange(category.id, 'isActive', e.target.checked)}
                            className="rounded border-gray-300 text-emerald-600 shadow-sm focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            {category.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </label>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <button
                          onClick={() => removeCategory(category.id)}
                          className="p-2 text-red-500 hover:text-red-700 focus:outline-none"
                          title="Remove category"
                        >
                          <FiTrash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {showcaseData.categories.length === 0 && (
                <p className="py-4 text-center text-gray-500 dark:text-gray-400">
                  No categories added yet. Add a category to get started.
                </p>
              )}
            </div>
          </section>
          
          {/* Featured Projects Section */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Featured Projects</h2>
              <Link
                to="/admin/projects/gallery"
                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 text-sm"
              >
                Manage Projects
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Order
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Featured
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {showcaseData.featuredProjects.map((project) => (
                    <tr key={project.id}>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <span className="text-gray-700 dark:text-gray-300">{project.order}</span>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="text-gray-700 dark:text-gray-300">{project.title}</div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                          {showcaseData.categories.find(c => c.id === project.category)?.name || project.category}
                        </span>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            checked={project.isFeatured}
                            onChange={() => toggleProjectFeatured(project.id)}
                            className="rounded border-gray-300 text-emerald-600 shadow-sm focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            {project.isFeatured ? 'Yes' : 'No'}
                          </span>
                        </label>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <Link
                          to={`/admin/projects/${project.id}/edit`}
                          className="p-2 text-blue-500 hover:text-blue-700 focus:outline-none"
                          title="Edit project"
                        >
                          <FiEdit size={18} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {showcaseData.featuredProjects.length === 0 && (
                <p className="py-4 text-center text-gray-500 dark:text-gray-400">
                  No projects added yet. Go to "Manage Projects" to add projects.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
      
      {/* Toast Notification */}
      <Toaster 
        show={toast.show} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({...toast, show: false})} 
      />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-4">
          {/* Breadcrumbs */}
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            <span className="hover:text-emerald-500 dark:hover:text-emerald-400">
              Dashboard
            </span>
            <span className="mx-2">/</span>
            <span className="hover:text-emerald-500 dark:hover:text-emerald-400">
              Sections
            </span>
            <span className="mx-2">/</span>
            <span className="text-emerald-600 dark:text-emerald-400">
              Project Showcase
            </span>
          </div>
          
          {/* Page header */}
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Project Showcase Section
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Configure how your projects are displayed on the homepage
            </p>
          </div>
          
          {/* Main content */}
          <ShowcaseEditor />
        </div>
      </div>
    </motion.div>
  );
};

// Renamed export to match the import in AdminApp.jsx
export default CMSProjectShowcase; 