import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiPlus, FiTrash2, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import supabase from '../../../utils/supabaseClient';

export default function HeroEditor() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [section, setSection] = useState(null);
  const [formData, setFormData] = useState({
    headline: '',
    tagline: '',
    hooks: [],
    ctas: [
      { type: 'resume', label: 'Download Resume' },
      { type: 'scroll', label: 'View Projects' }
    ],
    badge: ''
  });
  const [newHook, setNewHook] = useState('');
  
  useEffect(() => {
    fetchHeroSection();
  }, []);
  
  const fetchHeroSection = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get the hero section from page_sections
      const { data: sectionData, error: sectionError } = await supabase
        .from('page_sections')
        .select('*')
        .eq('slug', 'hero')
        .single();
      
      if (sectionError && sectionError.code !== 'PGRST116') throw sectionError;
      
      if (sectionData) {
        // Section exists, set state
        setSection(sectionData);
        
        // Parse content JSON
        const content = sectionData.content || {};
        
        // Populate form data from content
        setFormData({
          headline: content.headline || '',
          tagline: content.tagline || '',
          hooks: content.hooks || [],
          ctas: content.ctas || [
            { type: 'resume', label: 'Download Resume' },
            { type: 'scroll', label: 'View Projects' }
          ],
          badge: content.badge || ''
        });
      } else {
        // Section doesn't exist (shouldn't happen with current setup)
        setError('Hero section not found. Please check your database setup.');
      }
    } catch (error) {
      console.error('Error fetching hero section:', error);
      setError('Failed to load hero section. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const addHook = () => {
    if (newHook.trim()) {
      setFormData({
        ...formData,
        hooks: [...formData.hooks, newHook.trim()],
      });
      setNewHook('');
    }
  };
  
  const removeHook = (index) => {
    const updatedHooks = [...formData.hooks];
    updatedHooks.splice(index, 1);
    setFormData({
      ...formData,
      hooks: updatedHooks,
    });
  };
  
  const moveHook = (index, direction) => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === formData.hooks.length - 1)
    ) {
      return;
    }
    
    const updatedHooks = [...formData.hooks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    [updatedHooks[index], updatedHooks[targetIndex]] = 
    [updatedHooks[targetIndex], updatedHooks[index]];
    
    setFormData({
      ...formData,
      hooks: updatedHooks,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!section) return;
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      
      // Update the content field in page_sections
      const { error: updateError } = await supabase
        .from('page_sections')
        .update({ 
          content: formData,
          updated_at: new Date().toISOString()
        })
        .eq('id', section.id);
      
      if (updateError) throw updateError;
      
      setSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error saving hero section:', error);
      setError('Failed to save hero section. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Hero Section</h1>
          <p className="text-gray-400 mt-1">The first section visitors see when they land on your site.</p>
        </div>
        
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={section?.enabled}
            onChange={async () => {
              try {
                const { error } = await supabase
                  .from('page_sections')
                  .update({ enabled: !section.enabled })
                  .eq('id', section.id);
                
                if (error) throw error;
                
                setSection({
                  ...section,
                  enabled: !section.enabled
                });
              } catch (error) {
                console.error('Error toggling section visibility:', error);
                setError('Failed to update section visibility.');
              }
            }}
            className="form-checkbox h-5 w-5 text-primary rounded border-gray-600 bg-gray-700 focus:ring-primary"
          />
          <span className="text-gray-300">{section?.enabled ? 'Visible' : 'Hidden'}</span>
        </label>
      </div>
      
      {error && (
        <div className="bg-red-900/50 border border-red-500/50 text-red-300 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-900/50 border border-green-500/50 text-green-300 px-4 py-3 rounded mb-6">
          Hero section updated successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/30 p-6">
        <div className="space-y-6">
          {/* Headline */}
          <div>
            <label htmlFor="headline" className="block text-sm font-medium text-gray-300 mb-1">
              Headline
            </label>
            <input
              type="text"
              name="headline"
              id="headline"
              value={formData.headline}
              onChange={handleInputChange}
              placeholder="Your Name or Brand"
              className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          {/* Tagline */}
          <div>
            <label htmlFor="tagline" className="block text-sm font-medium text-gray-300 mb-1">
              Tagline
            </label>
            <input
              type="text"
              name="tagline"
              id="tagline"
              value={formData.tagline}
              onChange={handleInputChange}
              placeholder="Your profession or specialty"
              className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          {/* Hooks (Keywords) */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Hooks / Keywords
            </label>
            <div className="flex items-center space-x-2 mb-3">
              <input
                type="text"
                value={newHook}
                onChange={(e) => setNewHook(e.target.value)}
                placeholder="Add a keyword"
                className="flex-1 px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addHook();
                  }
                }}
              />
              <button
                type="button"
                onClick={addHook}
                className="px-3 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors flex items-center"
              >
                <FiPlus className="mr-1" />
                Add
              </button>
            </div>
            
            {formData.hooks.length > 0 ? (
              <div className="space-y-2">
                {formData.hooks.map((hook, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-900/30 px-3 py-2 rounded-lg">
                    <span className="text-gray-300">{hook}</span>
                    <div className="flex space-x-1">
                      <button
                        type="button"
                        onClick={() => moveHook(index, 'up')}
                        disabled={index === 0}
                        className={`p-1.5 rounded ${index === 0 ? 'text-gray-600' : 'text-gray-400 hover:text-white hover:bg-gray-700'} transition-colors`}
                      >
                        <FiArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveHook(index, 'down')}
                        disabled={index === formData.hooks.length - 1}
                        className={`p-1.5 rounded ${index === formData.hooks.length - 1 ? 'text-gray-600' : 'text-gray-400 hover:text-white hover:bg-gray-700'} transition-colors`}
                      >
                        <FiArrowDown size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeHook(index)}
                        className="p-1.5 rounded text-red-400 hover:text-red-300 hover:bg-red-900/40 transition-colors"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500 bg-gray-900/20 rounded-lg border border-dashed border-gray-700">
                No hooks added yet. These will appear as animated keywords in your hero section.
              </div>
            )}
          </div>
          
          {/* Badge Text */}
          <div>
            <label htmlFor="badge" className="block text-sm font-medium text-gray-300 mb-1">
              Badge Text
            </label>
            <input
              type="text"
              name="badge"
              id="badge"
              value={formData.badge}
              onChange={handleInputChange}
              placeholder="Built with..."
              className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Small badge that appears in the corner of your hero section.
            </p>
          </div>
          
          {/* Submit */}
          <div className="flex justify-end space-x-3 pt-4">
            <Link
              to="/admin"
              className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
            >
              <FiArrowLeft className="mr-1.5" />
              Back
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="mr-1.5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 