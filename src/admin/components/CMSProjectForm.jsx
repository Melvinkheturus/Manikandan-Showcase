import { useState, useEffect } from "react";
import supabase from "../../utils/supabaseClient";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import CloudinaryUploader from "./CloudinaryUploader";

export default function ProjectForm({ project, onSubmit, onCancel }) {
  const initialFormState = {
    title: "",
    description: "",
    image_url: "",
    gallery_urls: [],
    project_url: "",
    github_url: "",
    tags: [],
    external_file_url: ""
  };

  const [form, setForm] = useState(initialFormState);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project) {
      setForm({
        title: project.title || "",
        description: project.description || "",
        image_url: project.image_url || "",
        gallery_urls: project.gallery_urls || [],
        project_url: project.project_url || "",
        github_url: project.github_url || "",
        tags: project.tags || [],
        external_file_url: project.external_file_url || ""
      });
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleThumbnailUpload = (url) => {
    setForm({ ...form, image_url: url });
  };

  const handleGalleryUpload = (urls) => {
    setForm({ ...form, gallery_urls: urls });
  };

  const addTag = () => {
    if (tagInput.trim() === "") return;
    if (form.tags.includes(tagInput.trim())) return;
    
    setForm({ ...form, tags: [...form.tags, tagInput.trim()] });
    setTagInput("");
  };

  const removeTag = (tagToRemove) => {
    setForm({
      ...form,
      tags: form.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const saveToast = toast.loading(project ? "Updating project..." : "Creating project...");
    
    try {
      // No need to handle image upload manually - Cloudinary does it for us
      // We just use the URLs directly from CloudinaryUpload
      
      const projectData = {
        ...form
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
      
      toast.success(project ? "Project updated successfully" : "Project created successfully", { id: saveToast });
      onSubmit();
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Failed to save project", { id: saveToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-800 p-6 rounded-xl shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-6">
        {project ? "Edit Project" : "Add New Project"}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Project Title*
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Description*
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Project Thumbnail
          </label>
          <CloudinaryUploader 
            onUpload={handleThumbnailUpload} 
            value={form.image_url}
            accept="image/*"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Project Gallery
          </label>
          <CloudinaryUploader 
            onUpload={handleGalleryUpload} 
            multiple={true}
            value={form.gallery_urls}
            accept="image/*,video/*"
          />
          <p className="text-xs text-gray-400 mt-1">
            Upload multiple images for the project gallery
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Live Project URL
          </label>
          <input
            type="url"
            name="project_url"
            value={form.project_url}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            GitHub URL
          </label>
          <input
            type="url"
            name="github_url"
            value={form.github_url}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            External File URL (e.g., download link)
          </label>
          <input
            type="url"
            name="external_file_url"
            value={form.external_file_url}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Tags
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="Add tag"
              className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
            >
              Add
            </button>
          </div>
          
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {form.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-700 text-sm rounded-full flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-gray-400 hover:text-red-400"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-end space-x-3 mt-8 pt-4 border-t border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors flex items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>Save</>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
} 