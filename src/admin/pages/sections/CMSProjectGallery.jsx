import React, { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiFilter, FiEdit, FiTrash, FiEye, FiExternalLink } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Toaster from '../../components/Toaster';
import ContentPageLayout from '../../CMSHelper/ContentPageLayout';

const CMSProjectGallery = () => {
  // State for projects data
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  
  // Filtering and sorting state
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Load projects data
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        // In a real app, fetch from API
        // Mock data for demo purposes
        setTimeout(() => {
          const mockCategories = [
            { id: 'all', name: 'All Projects' },
            { id: '1', name: 'UI/UX Design', slug: 'ui-ux', layout: 'snap-scroll' },
            { id: '2', name: 'Visual Identity', slug: 'visual-identity', layout: 'pinterest-grid' },
            { id: '3', name: 'Web Development', slug: 'development', layout: 'terminal-cards' },
            { id: '4', name: 'AI Projects', slug: 'ai-projects', layout: 'grid-zoom' },
            { id: '5', name: 'Creative Lab', slug: 'creative-lab', layout: 'hover-card' }
          ];
          
          setCategories(mockCategories);
          
          setProjects([
            {
              id: 'proj1',
              title: 'E-commerce Redesign',
              category_id: '1',
              category_name: 'UI/UX Design',
              thumbnail_url: 'https://example.com/thumbnail1.jpg',
              description: 'A complete redesign of an e-commerce platform',
              tags: ['Figma', 'UI Design', 'E-commerce'],
              created_at: '2023-08-15',
              has_detail: true
            },
            {
              id: 'proj2',
              title: 'Portfolio Website',
              category_id: '3',
              category_name: 'Web Development',
              thumbnail_url: 'https://example.com/thumbnail2.jpg',
              description: 'Personal portfolio website design and development',
              tags: ['React', 'Tailwind CSS', 'Framer Motion'],
              created_at: '2023-09-20',
              has_detail: true
            },
            {
              id: 'proj3',
              title: 'Fitness App UI',
              category_id: '1',
              category_name: 'UI/UX Design',
              thumbnail_url: 'https://example.com/thumbnail3.jpg',
              description: 'UI design for a fitness tracking mobile app',
              tags: ['Figma', 'Mobile App', 'UI Design'],
              created_at: '2023-10-05',
              has_detail: true
            },
            {
              id: 'proj4',
              title: 'Brand Identity',
              category_id: '2',
              category_name: 'Visual Identity',
              thumbnail_url: 'https://example.com/thumbnail4.jpg',
              description: 'Complete brand identity design for a startup',
              tags: ['Branding', 'Logo Design', 'Style Guide'],
              color_palette: ['#FF5757', '#5FBDFF', '#90EE90'],
              created_at: '2023-07-10',
              has_detail: true
            },
            {
              id: 'proj5',
              title: 'AI Experiment',
              category_id: '5',
              category_name: 'Creative Lab',
              thumbnail_url: 'https://example.com/thumbnail5.jpg',
              description: 'Experimental AI-powered interface prototype',
              tags: ['AI', 'Prototype', 'React'],
              experiment_tag: 'Beta',
              created_at: '2023-11-15',
              has_detail: false
            }
          ]);
          
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setToast({
          show: true,
          message: 'Failed to load projects',
          type: 'error'
        });
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filter and sort projects
  const filteredProjects = projects
    .filter(project => {
      // Filter by search term
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (project.tags && project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
      
      // Filter by category
      const matchesCategory = categoryFilter === 'all' || project.category_id === categoryFilter;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // Sort by selected option
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'a-z':
          return a.title.localeCompare(b.title);
        case 'z-a':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

  // Delete project
  const deleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        // In a real app, delete via API
        // Mock successful delete for demo
        setProjects(projects.filter(project => project.id !== id));
        
        setToast({
          show: true,
          message: 'Project deleted successfully',
          type: 'success'
        });
      } catch (error) {
        console.error('Error deleting project:', error);
        setToast({
          show: true,
          message: 'Failed to delete project',
          type: 'error'
        });
      }
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get the badge style for a project category
  const getCategoryBadgeStyle = (categoryId) => {
    const styles = {
      '1': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300', // UI/UX Design
      '2': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300', // Visual Identity
      '3': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', // Web Development
      '4': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300', // AI Projects
      '5': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', // Creative Lab
    };
    
    return styles[categoryId] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  return (
    <ContentPageLayout title="Project Gallery">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap justify-end mb-6">
          <Link
            to="/admin/sections/project-gallery/new"
            className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          >
            <FiPlus className="mr-2" />
            Add New Project
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                placeholder="Search projects..."
              />
            </div>
            
            {/* Category Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="text-gray-400" />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Sort Options */}
            <div className="flex space-x-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="a-z">A to Z</option>
                <option value="z-a">Z to A</option>
              </select>
              
              {/* View Mode Toggle */}
              <div className="flex rounded-md shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md ${
                    viewMode === 'grid' 
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200' 
                      : 'bg-white text-gray-700 dark:bg-gray-700 dark:text-gray-200'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-r-md ${
                    viewMode === 'list' 
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200' 
                      : 'bg-white text-gray-700 dark:bg-gray-700 dark:text-gray-200'
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Display */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <p className="text-xl text-gray-600 dark:text-gray-300">No projects found</p>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Try adjusting your filters or add a new project
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <div 
                key={project.id} 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col"
              >
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-700 relative">
                  {project.thumbnail_url ? (
                    <img 
                      src={project.thumbnail_url} 
                      alt={project.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}
                  
                  <div className="absolute top-2 right-2">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getCategoryBadgeStyle(project.category_id)}`}>
                      {project.category_name}
                    </span>
                  </div>
                  
                  {project.category_id === '5' && project.experiment_tag && (
                    <div className="absolute top-2 left-2">
                      <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                        {project.experiment_tag}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-4 flex-grow flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                    {project.title}
                  </h3>
                  
                  {project.description && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                      {project.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.tags && project.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                      >
                        {tag}
                    </span>
                    ))}
                  </div>
                  
                  {project.category_id === '2' && project.color_palette && (
                    <div className="flex gap-1 mb-3">
                      {project.color_palette.map((color, index) => (
                        <div 
                          key={index}
                          className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-600"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-auto pt-3 text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(project.created_at)}
                  </div>
                </div>
                
                <div className="flex border-t border-gray-200 dark:border-gray-700 divide-x divide-gray-200 dark:divide-gray-700">
                      <Link
                    to={`/admin/sections/project-gallery/edit/${project.id}`}
                    className="flex-1 px-4 py-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 flex items-center justify-center"
                      >
                    <FiEdit className="mr-1" size={14} />
                    Edit
                      </Link>
                  
                      <button
                        onClick={() => deleteProject(project.id)}
                    className="flex-1 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center justify-center"
                      >
                    <FiTrash className="mr-1" size={14} />
                    Delete
                      </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Project
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                    Tags
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredProjects.map(project => (
                  <tr key={project.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                          {project.thumbnail_url ? (
                            <img 
                              src={project.thumbnail_url} 
                              alt={project.title}
                              className="h-10 w-10 object-cover" 
                            />
                          ) : (
                            <div className="h-10 w-10 flex items-center justify-center">
                              <span className="text-gray-400 text-xs">No img</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {project.title}
                          </div>
                          {project.description && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                            {project.description}
                          </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getCategoryBadgeStyle(project.category_id)}`}>
                        {project.category_name}
                      </span>
                      {project.category_id === '5' && project.experiment_tag && (
                        <span className="inline-block ml-2 px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                          {project.experiment_tag}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {project.tags && project.tags.slice(0, 3).map(tag => (
                          <span 
                            key={tag} 
                            className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                        {project.tags && project.tags.length > 3 && (
                          <span className="inline-block px-1 text-gray-500 dark:text-gray-400 text-xs">
                            +{project.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                      {formatDate(project.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <div className="flex justify-center space-x-3">
                        {project.has_detail && (
                          <Link
                            to={`/admin/sections/project-detail/${project.id}`}
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                            title="View Project"
                          >
                            <FiEye size={18} />
                          </Link>
                        )}
                        <Link
                          to={`/admin/sections/project-gallery/edit/${project.id}`}
                          className="text-emerald-600 hover:text-emerald-900 dark:hover:text-emerald-400"
                          title="Edit Project"
                        >
                          <FiEdit size={18} />
                        </Link>
                        <button
                          onClick={() => deleteProject(project.id)}
                          className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                          title="Delete Project"
                        >
                          <FiTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
    </ContentPageLayout>
  );
};

export default CMSProjectGallery; 