import { useState, useEffect, useRef, Fragment } from "react";
import supabase from "../../utils/supabaseClient";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiSave, FiEye, FiChevronDown, FiChevronUp, FiLoader } from "react-icons/fi";
import { useDebounce } from "../../hooks/useDebounce";
import CloudinaryUploader from "./CloudinaryUploader";

// Category form field definitions
const categoryFormFields = {
  // Common fields for all project types
  common: [
    { name: 'title', label: 'Project Title', type: 'text', required: true, maxLength: 80 },
    { name: 'thumbnail', label: 'Thumbnail', type: 'image', required: true },
    { name: 'published', label: 'Published', type: 'toggle', default: false },
  ],
  
  // UI/UX specific fields
  'ui-ux': [
    { name: 'category_badge', label: 'Category Badge', type: 'select', 
      options: ['Mobile App', 'Website', 'Dashboard', 'UI Kit', 'Web App', 'Design System'] },
    { name: 'short_description', label: 'Short Description', type: 'textarea', maxLength: 200 }
  ],
  
  // Development specific fields
  'development': [
    { name: 'stack_tags', label: 'Stack Tags', type: 'tags', 
      suggestions: ['React', 'Next.js', 'Node.js', 'Express', 'MongoDB', 'Tailwind', 'TypeScript'] },
    { name: 'terminal_preview', label: 'Terminal Preview', type: 'code', language: 'bash', maxLength: 150 }
  ],
  
  // AI Projects specific fields
  'ai-projects': [
    { name: 'tech_used_tags', label: 'Technology Used', type: 'tags', 
      suggestions: ['GPT-4', 'DALL·E', 'Stable Diffusion', 'RunwayML', 'Midjourney', 'TensorFlow', 'PyTorch'] }
  ],
  
  // Visual Identity specific fields
  'visual-identity': [
    { name: 'subtext', label: 'Subtext/Label', type: 'text', maxLength: 30 },
    { name: 'description', label: 'Description', type: 'richtext' },
    { name: 'tags', label: 'Tags', type: 'tags' }
  ],
  
  // Creative Lab specific fields
  'creative-lab': [
    { name: 'one_line_description', label: 'One-line Description', type: 'text', maxLength: 100 },
    { name: 'experiment_tag', label: 'Experiment Tag', type: 'select', 
      options: ['Microinteraction', 'Concept', 'AI Experiment', 'Animation', 'Generative', 'Hardware', 'Other'] },
    { name: 'badge', label: 'Badge', type: 'select', 
      options: ['Future Project', 'In Development', 'Prototype', 'Concept', 'Experimental', 'Beta'] }
  ]
};

export default function CategoryProjectForm({ category = 'all', project, onSubmit, onCancel, autoSave = true }) {
  const initialFormState = {
    title: "",
    slug: "",
    short_description: "",
    thumbnail: "",
    gallery: [],
    category_badge: "",
    stack_tags: [],
    tech_used_tags: [],
    terminal_preview: "",
    subtext: "",
    description: "",
    tags: [],
    one_line_description: "",
    experiment_tag: "",
    badge: "",
    published: false
  };

  const [form, setForm] = useState(initialFormState);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // null, "saving", "saved", "error"
  const [expandedSections, setExpandedSections] = useState({
    thumbnail: true,
    content: true,
    tags: true,
    settings: true
  });
  
  // Get relevant fields based on category
  const getFieldsForCategory = () => {
    const fields = [...categoryFormFields.common];
    
    if (category !== 'all' && categoryFormFields[category]) {
      fields.push(...categoryFormFields[category]);
    }
    
    return fields;
  };
  
  // Initialize form with project data or defaults
  useEffect(() => {
    if (project) {
      // Map project data to form fields
      const formData = { ...initialFormState };
      
      // Fill in all available fields from project
      Object.keys(formData).forEach(key => {
        if (project[key] !== undefined) {
          formData[key] = project[key];
        }
      });
      
      setForm(formData);
    }
  }, [project]);
  
  // Create debounced form value for auto-save
  const debouncedForm = useDebounce(form, 2000);
  
  // Handle auto-save when form changes
  useEffect(() => {
    if (autoSave && project?.id && Object.keys(form).some(key => form[key] !== initialFormState[key])) {
      handleSave();
    }
  }, [debouncedForm]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ 
      ...form, 
      [name]: type === 'checkbox' ? checked : value 
    });
    
    // Auto-generate slug from title if title field is being changed
    if (name === 'title') {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setForm(prev => ({ ...prev, slug }));
    }
    
    // Set save status to "saving" after user input
    if (autoSave) {
      setSaveStatus("saving");
    }
  };

  const handleThumbnailUpload = (url) => {
    setForm({ ...form, thumbnail: url });
  };

  const handleGalleryUpload = (urls) => {
    setForm({ ...form, gallery: urls });
  };

  const addTag = (fieldName) => {
    if (tagInput.trim() === "") return;
    if (form[fieldName]?.includes(tagInput.trim())) return;
    
    setForm({ 
      ...form, 
      [fieldName]: [...(form[fieldName] || []), tagInput.trim()] 
    });
    setTagInput("");
  };

  const removeTag = (fieldName, tagToRemove) => {
    setForm({
      ...form,
      [fieldName]: form[fieldName].filter(tag => tag !== tagToRemove)
    });
  };
  
  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setSaveStatus("saving");
    
    try {
      // Map form data to project data structure
      const projectData = {
        title: form.title,
        slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        short_description: form.short_description,
        thumbnail: form.thumbnail,
        gallery: form.gallery,
        category_badge: form.category_badge,
        tech_used_tags: form.tech_used_tags,
        stack_tags: form.stack_tags,
        terminal_preview: form.terminal_preview,
        subtext: form.subtext,
        description: form.description,
        tags: form.tags,
        one_line_description: form.one_line_description,
        experiment_tag: form.experiment_tag,
        badge: form.badge,
        published: form.published,
        // Get category ID from category key
        category_id: category !== 'all' ? category : null
      };
      
      let error;
      
      if (project?.id) {
        // Update existing project
        const { error: updateError } = await supabase
          .from("projects")
          .update(projectData)
          .eq("id", project.id);
          
        error = updateError;
      } else {
        // Insert new project
        const { error: insertError } = await supabase
          .from("projects")
          .insert([projectData]);
          
        error = insertError;
      }
      
      if (error) throw error;
      
      setSaveStatus("saved");
      
      // Only show toast and call onSubmit for manual saves
      if (!autoSave || e) {
        toast.success(project ? "Project updated successfully" : "Project created successfully");
        onSubmit();
      }
    } catch (error) {
      console.error("Error saving project:", error);
      setSaveStatus("error");
      toast.error("Failed to save project");
    } finally {
      setLoading(false);
    }
  };

  // Render form fields based on type
  const renderField = (field) => {
    const { name, label, type, required, maxLength, options, suggestions } = field;
    
    switch (type) {
      case 'text':
        return (
          <div key={name} className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              {label} {required && <span className="text-red-400">*</span>}
            </label>
            <input
              type="text"
              name={name}
              value={form[name] || ''}
              onChange={handleChange}
              required={required}
              maxLength={maxLength}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {maxLength && (
              <div className="flex justify-end mt-1">
                <span className="text-xs text-gray-400">
                  {(form[name] || '').length}/{maxLength} characters
                </span>
              </div>
            )}
          </div>
        );
        
      case 'textarea':
        return (
          <div key={name} className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              {label} {required && <span className="text-red-400">*</span>}
            </label>
            <textarea
              name={name}
              value={form[name] || ''}
              onChange={handleChange}
              required={required}
              maxLength={maxLength}
              rows={3}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {maxLength && (
              <div className="flex justify-end mt-1">
                <span className="text-xs text-gray-400">
                  {(form[name] || '').length}/{maxLength} characters
                </span>
              </div>
            )}
          </div>
        );
        
      case 'select':
        return (
          <div key={name} className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              {label} {required && <span className="text-red-400">*</span>}
            </label>
            <select
              name={name}
              value={form[name] || ''}
              onChange={handleChange}
              required={required}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Select {label}</option>
              {options.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        );
        
      case 'tags':
        return (
          <div key={name} className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              {label} {required && <span className="text-red-400">*</span>}
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag(name))}
                placeholder={`Add ${label.toLowerCase()}`}
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => addTag(name)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
              >
                Add
              </button>
            </div>
            
            {suggestions && (
              <div className="flex flex-wrap gap-1 mt-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setTagInput(suggestion);
                      setTimeout(() => addTag(name), 0);
                    }}
                    className="text-xs px-2 py-1 bg-gray-700 border border-gray-600 hover:bg-gray-600 transition-colors rounded-full text-gray-300"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
            
            {form[name] && form[name].length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {form[name].map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-700 text-sm rounded-full flex items-center gap-1 border border-gray-600"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(name, tag)}
                      className="ml-1 text-gray-400 hover:text-red-400 focus:outline-none"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        );
        
      case 'image':
        return (
          <div key={name} className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              {label} {required && <span className="text-red-400">*</span>}
            </label>
            <CloudinaryUploader 
              onUpload={handleThumbnailUpload} 
              value={form.thumbnail}
              accept="image/*"
            />
          </div>
        );
        
      case 'gallery':
        return (
          <div key={name} className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              {label} {required && <span className="text-red-400">*</span>}
            </label>
            <CloudinaryUploader 
              onUpload={handleGalleryUpload} 
              multiple={true}
              value={form.gallery}
              accept="image/*,video/*"
            />
          </div>
        );
        
      case 'code':
        return (
          <div key={name} className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              {label} {required && <span className="text-red-400">*</span>}
            </label>
            <div className="font-mono text-sm bg-gray-800 border border-gray-600 rounded-lg overflow-hidden">
              <div className="flex items-center space-x-2 px-3 py-1 bg-gray-900 border-b border-gray-700">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="text-xs text-gray-400 ml-2">terminal</div>
              </div>
              <textarea
                name={name}
                value={form[name] || ''}
                onChange={handleChange}
                required={required}
                maxLength={maxLength}
                rows={4}
                className="w-full px-4 py-2 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-green-400"
                placeholder="$ npm install react-awesome"
              />
            </div>
            {maxLength && (
              <div className="flex justify-end mt-1">
                <span className="text-xs text-gray-400">
                  {(form[name] || '').length}/{maxLength} characters
                </span>
              </div>
            )}
          </div>
        );
        
      case 'toggle':
        return (
          <div key={name} className="mb-4 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">
              {label} {required && <span className="text-red-400">*</span>}
            </label>
            <button
              type="button"
              onClick={() => setForm({ ...form, [name]: !form[name] })}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                form[name] ? 'bg-emerald-600' : 'bg-gray-600'
              }`}
            >
              <span className={`w-4 h-4 rounded-full bg-white transition-transform ${
                form[name] ? 'translate-x-6' : ''
              }`} />
            </button>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Form sections */}
      <div>
        {/* Form fields */}
        <div className="space-y-6">
          {/* Form fields grouped by sections */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">Content</h3>
              <button 
                type="button"
                onClick={() => toggleSection("content")}
                className="text-gray-400 hover:text-white"
              >
                {expandedSections.content ? <FiChevronUp /> : <FiChevronDown />}
              </button>
            </div>
            
            {expandedSections.content && (
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 space-y-4">
                {getFieldsForCategory()
                  .filter(field => 
                    ['text', 'textarea', 'select', 'richtext'].includes(field.type) &&
                    field.name !== 'published'
                  )
                  .map(field => renderField(field))}
              </div>
            )}
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">Thumbnail & Media</h3>
              <button 
                type="button"
                onClick={() => toggleSection("thumbnail")}
                className="text-gray-400 hover:text-white"
              >
                {expandedSections.thumbnail ? <FiChevronUp /> : <FiChevronDown />}
              </button>
            </div>
            
            {expandedSections.thumbnail && (
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 space-y-4">
                {getFieldsForCategory()
                  .filter(field => 
                    ['image', 'gallery'].includes(field.type)
                  )
                  .map(field => renderField(field))}
              </div>
            )}
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">Tags & Metadata</h3>
              <button 
                type="button"
                onClick={() => toggleSection("tags")}
                className="text-gray-400 hover:text-white"
              >
                {expandedSections.tags ? <FiChevronUp /> : <FiChevronDown />}
              </button>
            </div>
            
            {expandedSections.tags && (
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 space-y-4">
                {getFieldsForCategory()
                  .filter(field => 
                    ['tags', 'code'].includes(field.type)
                  )
                  .map(field => renderField(field))}
              </div>
            )}
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">Settings</h3>
              <button 
                type="button"
                onClick={() => toggleSection("settings")}
                className="text-gray-400 hover:text-white"
              >
                {expandedSections.settings ? <FiChevronUp /> : <FiChevronDown />}
              </button>
            </div>
            
            {expandedSections.settings && (
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 space-y-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={form.slug || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    URL-friendly identifier. Auto-generated from title if left empty.
                  </p>
                </div>
                
                {getFieldsForCategory()
                  .filter(field => field.name === 'published')
                  .map(field => renderField(field))}
              </div>
            )}
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-700">
          {/* Show save status */}
          <div className="mr-auto text-sm">
            {saveStatus === "saving" && (
              <div className="flex items-center text-gray-400">
                <FiLoader className="animate-spin mr-1" size={14} />
                <span>Saving...</span>
              </div>
            )}
            
            {saveStatus === "saved" && (
              <div className="text-green-400">Saved</div>
            )}
            
            {saveStatus === "error" && (
              <div className="text-red-400">Save failed</div>
            )}
          </div>

          <button
            type="button"
            onClick={() => onCancel()}
            className="py-2 px-4 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="py-2 px-4 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <FiSave />
                <span>Save</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 