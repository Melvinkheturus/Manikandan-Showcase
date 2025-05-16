import { useState, useEffect } from "react";
import supabase from "../../utils/supabaseClient";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function ProjectForm({ project, onSubmit, onCancel }) {
  const initialFormState = {
    title: "",
    description: "",
    image_url: "",
    project_url: "",
    github_url: "",
    tags: [],
    external_file_url: ""
  };

  const [form, setForm] = useState(initialFormState);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (project) {
      setForm({
        title: project.title || "",
        description: project.description || "",
        image_url: project.image_url || "",
        project_url: project.project_url || "",
        github_url: project.github_url || "",
        tags: project.tags || [],
        external_file_url: project.external_file_url || ""
      });
      
      if (project.image_url) {
        setImagePreview(project.image_url);
      }
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setImageFile(file);
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
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
      let image_url = form.image_url;
      
      // Upload image if a new file is selected
      if (imageFile) {
        const fileName = `project-${Date.now()}-${imageFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("project-images")
          .upload(fileName, imageFile);
          
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: urlData } = await supabase.storage
          .from("project-images")
          .getPublicUrl(fileName);
          
        image_url = urlData.publicUrl;
      }
      
      const projectData = {
        ...form,
        image_url
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
            Project Image
          </label>
          <div className="flex items-center space-x-4">
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="h-20 w-20 object-cover rounded-lg"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Or provide an image URL below
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Image URL
          </label>
          <input
            type="text"
            name="image_url"
            value={form.image_url}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
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
          <div className="flex">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., React, Tailwind"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-gray-600 border border-gray-600 rounded-r-lg hover:bg-gray-500"
            >
              Add
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {form.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-700 rounded-full flex items-center text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-gray-400 hover:text-gray-200"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-primary text-background rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin mr-2"></span>
            )}
            {project ? "Update Project" : "Add Project"}
          </button>
        </div>
      </form>
    </motion.div>
  );
} 