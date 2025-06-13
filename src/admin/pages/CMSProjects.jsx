import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../../utils/supabaseClient';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('display_order');
  const [filterPublished, setFilterPublished] = useState('all');

  useEffect(() => {
    fetchProjects();
  }, [sortBy, filterPublished]);

  const fetchProjects = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('projects')
        .select('*');

      // Apply filters
      if (filterPublished === 'published') {
        query = query.eq('is_published', true);
      } else if (filterPublished === 'draft') {
        query = query.eq('is_published', false);
      }

      // Apply sorting
      if (sortBy === 'title') {
        query = query.order('title');
      } else if (sortBy === 'date_asc') {
        query = query.order('created_at');
      } else if (sortBy === 'date_desc') {
        query = query.order('created_at', { ascending: false });
      } else {
        query = query.order('display_order');
      }

      const { data, error } = await query;
        
      if (error) throw error;

      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const togglePublished = async (id, currentValue) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ is_published: !currentValue })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setProjects(projects.map(project => 
        project.id === id 
          ? { ...project, is_published: !currentValue } 
          : project
      ));
    } catch (error) {
      console.error('Error toggling publish status:', error);
    }
  };
    
  const deleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setProjects(projects.filter(project => project.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Link 
          to="/admin/projects/new" 
          className="px-4 py-2 bg-primary text-black rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Add New Project
        </Link>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label htmlFor="sort" className="block text-sm font-medium mb-1 text-gray-400">
              Sort By
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-gray-700 rounded-lg px-4 py-2 focus:ring-primary focus:border-primary"
            >
              <option value="display_order">Display Order</option>
              <option value="title">Title (A-Z)</option>
              <option value="date_desc">Date Added (Newest)</option>
              <option value="date_asc">Date Added (Oldest)</option>
            </select>
          </div>

          <div>
            <label htmlFor="filter" className="block text-sm font-medium mb-1 text-gray-400">
              Status
            </label>
            <select
              id="filter"
              value={filterPublished}
              onChange={e => setFilterPublished(e.target.value)}
              className="bg-gray-700 rounded-lg px-4 py-2 focus:ring-primary focus:border-primary"
            >
              <option value="all">All Projects</option>
              <option value="published">Published Only</option>
              <option value="draft">Drafts Only</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
      ) : projects.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="mb-4">No projects found.</p>
            <Link 
              to="/admin/projects/new" 
              className="px-4 py-2 bg-primary text-black rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Create Your First Project
            </Link>
        </div>
      ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Featured</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Order</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {projects.map(project => (
                  <tr key={project.id} className="hover:bg-gray-700/30">
                    <td className="px-4 py-4">
                      <div className="font-medium">{project.title}</div>
                      <div className="text-sm text-gray-400">{project.subtitle}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-3 py-1 bg-gray-700 rounded-full text-xs">
                        {project.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span 
                        className={`px-3 py-1 rounded-full text-xs ${
                          project.is_published 
                            ? 'bg-green-900/30 text-green-500' 
                            : 'bg-yellow-900/30 text-yellow-500'
                        }`}
                      >
                        {project.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {project.is_featured ? (
                        <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs">
                          Featured
                        </span>
                      ) : (
                        <span className="text-gray-500">—</span>
                    )}
                    </td>
                    <td className="px-4 py-4 text-gray-400">
                      {project.display_order}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => togglePublished(project.id, project.is_published)}
                          className={`p-2 rounded-lg ${
                            project.is_published
                              ? 'hover:bg-yellow-500/20 text-yellow-500'
                              : 'hover:bg-green-500/20 text-green-500'
                          }`}
                          title={project.is_published ? "Unpublish" : "Publish"}
                        >
                          {project.is_published ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>

                        <Link
                          to={`/admin/projects/${project.id}`}
                          className="p-2 rounded-lg hover:bg-blue-500/20 text-blue-500"
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                          </svg>
                        </Link>

                  <button
                          onClick={() => deleteProject(project.id)}
                          className="p-2 rounded-lg hover:bg-red-500/20 text-red-500"
                          title="Delete"
                  >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
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
    </div>
  );
} 