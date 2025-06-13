import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import supabase from '../../utils/supabaseClient';

// Section Types
const sectionTypes = [
  { value: 'project_hero', label: 'Hero' },
  { value: 'project_meta', label: 'Meta Strip' },
  { value: 'project_summary', label: 'Summary' },
  { value: 'project_problem_solution', label: 'Problem & Solution' },
  { value: 'project_features', label: 'Features' },
  { value: 'project_showcase', label: 'Visual Showcase' },
  { value: 'project_design_process', label: 'Design Process' },
  { value: 'project_results', label: 'Results & Learnings' }
];

export default function ProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  // Project basic info
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    subtitle: '',
    role: '',
    date: '',
    category: '',
    is_featured: false,
    display_order: 0,
    is_published: false
  });
  
  // Project sections & state
  const [sections, setSections] = useState([]);
  const [activeSection, setActiveSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Fetch project data if editing
  useEffect(() => {
    if (isEditing) {
      fetchProject();
    } else {
      // Set hero section as default for new projects
      setSections([
        { type: 'project_hero', enabled: true, display_order: 0 }
      ]);
    }
  }, [id]);
  
  const fetchProject = async () => {
    try {
      setLoading(true);
      
      // Fetch project basic info
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      
      if (projectError) throw projectError;
      
      setFormData(project);
      
      // Fetch project sections
      const { data: projectSections, error: sectionsError } = await supabase
        .from('project_sections')
        .select('*')
        .eq('project_id', id)
        .order('display_order');
      
      if (sectionsError) throw sectionsError;
      
      setSections(projectSections || []);
      
    } catch (error) {
      console.error('Error fetching project:', error);
      setError('Failed to load project. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const addSection = (type) => {
    setSections([
      ...sections,
      {
        type,
        enabled: true,
        display_order: sections.length
      }
    ]);
  };
  
  const removeSection = (index) => {
    setSections(sections.filter((_, i) => i !== index));
  };
  
  const toggleSectionEnabled = (index) => {
    const updatedSections = [...sections];
    updatedSections[index].enabled = !updatedSections[index].enabled;
    setSections(updatedSections);
  };
  
  const moveSection = (index, direction) => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === sections.length - 1)
    ) {
      return;
    }
    
    const updatedSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    [updatedSections[index], updatedSections[targetIndex]] = 
    [updatedSections[targetIndex], updatedSections[index]];
    
    // Update display order
    updatedSections.forEach((section, i) => {
      section.display_order = i;
    });
    
    setSections(updatedSections);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Make sure slug is URL-friendly
      const slug = formData.slug.trim().toLowerCase().replace(/\s+/g, '-');
      
      // Create or update project
      const projectData = {
        ...formData,
        slug
      };
      
      let projectId = id;
      
      if (isEditing) {
        // Update existing project
        const { error: updateError } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', id);
        
        if (updateError) throw updateError;
      } else {
        // Create new project
        const { data: newProject, error: insertError } = await supabase
          .from('projects')
          .insert(projectData)
          .select('id')
          .single();
        
        if (insertError) throw insertError;
        projectId = newProject.id;
      }
      
      // Handle sections - first remove all existing ones if editing
      if (isEditing) {
        const { error: deleteError } = await supabase
          .from('project_sections')
          .delete()
          .eq('project_id', projectId);
        
        if (deleteError) throw deleteError;
      }
      
      // Insert all sections
      const sectionsWithProjectId = sections.map(section => ({
        ...section,
        project_id: projectId
      }));
      
      const { error: sectionError } = await supabase
        .from('project_sections')
        .insert(sectionsWithProjectId);
      
      if (sectionError) throw sectionError;
      
      setSuccess(true);
      
      // Redirect to project list after successful save
      setTimeout(() => {
        navigate('/admin/projects');
      }, 1500);
      
    } catch (error) {
      console.error('Error saving project:', error);
      setError('Failed to save project. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && !sections.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {isEditing ? 'Edit Project' : 'Add New Project'}
        </h1>
        <button
          onClick={() => navigate('/admin/projects')}
          className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
      </div>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-500/20 border border-green-500 text-green-500 px-4 py-3 rounded-lg mb-6">
          Project saved successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Project Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Project Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-primary focus:border-primary"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                URL Slug *
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-primary focus:border-primary"
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                Used in URL: yourdomain.com/projects/{formData.slug || 'project-slug'}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Subtitle (e.g. Your Role)
              </label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-primary focus:border-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Role
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-primary focus:border-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Date
              </label>
              <input
                type="text"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="e.g. May 2024"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="e.g. Web App, Mobile App"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Display Order
              </label>
              <input
                type="number"
                name="display_order"
                value={formData.display_order}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-primary focus:border-primary"
                min="0"
              />
            </div>
            
            <div className="md:col-span-2 flex space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary rounded focus:ring-primary"
                />
                <span>Feature on Home Page</span>
              </label>
              
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_published"
                  checked={formData.is_published}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary rounded focus:ring-primary"
                />
                <span>Published</span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Project Sections</h2>
            
            <div className="relative">
              <button
                type="button"
                className="px-4 py-2 bg-primary text-black rounded-lg font-medium flex items-center"
                onClick={() => document.getElementById('section-dropdown').classList.toggle('hidden')}
              >
                <span className="mr-2">Add Section</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              <div id="section-dropdown" className="absolute right-0 mt-2 w-56 bg-gray-900 rounded-lg shadow-lg overflow-hidden z-10 hidden">
                <div className="py-1">
                  {sectionTypes.map(section => (
                    <button
                      key={section.value}
                      type="button"
                      className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors"
                      onClick={() => {
                        addSection(section.value);
                        document.getElementById('section-dropdown').classList.add('hidden');
                      }}
                    >
                      {section.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {sections.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No sections added yet. Click "Add Section" to add your first section.
            </div>
          ) : (
            <div className="space-y-4">
              {sections.map((section, index) => {
                const sectionType = sectionTypes.find(type => type.value === section.type);
                
                return (
                  <div 
                    key={index}
                    className={`border ${section.enabled ? 'border-gray-600' : 'border-red-800/30 bg-red-900/10'} rounded-lg p-4 flex items-center justify-between`}
                  >
                    <div className="flex items-center">
                      <span className="mr-3 text-lg font-mono">
                        {index + 1}.
                      </span>
                      <h3 className={`font-medium ${!section.enabled ? 'text-gray-500' : ''}`}>
                        {sectionType?.label || section.type}
                      </h3>
                      {!section.enabled && (
                        <span className="ml-3 text-xs font-medium text-red-500 bg-red-500/20 px-2 py-1 rounded">
                          Disabled
                        </span>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => moveSection(index, 'up')}
                        disabled={index === 0}
                        className={`p-1 rounded-lg ${index === 0 ? 'text-gray-600' : 'hover:bg-gray-700'}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => moveSection(index, 'down')}
                        disabled={index === sections.length - 1}
                        className={`p-1 rounded-lg ${index === sections.length - 1 ? 'text-gray-600' : 'hover:bg-gray-700'}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => toggleSectionEnabled(index)}
                        className="p-1 rounded-lg hover:bg-gray-700"
                      >
                        {section.enabled ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setActiveSection(index)}
                        className="p-1 rounded-lg hover:bg-gray-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => removeSection(index)}
                        className="p-1 rounded-lg hover:bg-red-500/20 text-red-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/projects')}
            className="px-6 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-primary text-black rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save Project'
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 