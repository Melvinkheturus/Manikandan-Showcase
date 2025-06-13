import React, { useState, useEffect } from 'react';
import { FiSave, FiPlus, FiTrash, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import CloudinaryUpload from '../../components/CloudinaryUpload';
import Toaster from '../../components/Toaster';
import { motion } from 'framer-motion';

const CMSTestimonials = () => {
  // State for testimonials section data
  const [testimonialsData, setTestimonialsData] = useState({
    intro: '',
    title: '',
    testimonials: []
  });
  
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    position: '',
    company: '',
    content: '',
    avatar: '',
    rating: 5
  });

  // Load testimonials data
  useEffect(() => {
    const fetchTestimonialsData = async () => {
      setIsLoading(true);
      try {
        // In a real app, fetch from API
        // Mock data for demo purposes
        setTimeout(() => {
          setTestimonialsData({
            intro: 'What clients say about working with me.',
            title: 'Client Testimonials',
            testimonials: [
              {
                id: 'test1',
                name: 'John Smith',
                position: 'CEO',
                company: 'Tech Innovations',
                content: 'Working with Manikandan was a fantastic experience. His design skills and attention to detail resulted in a beautiful, functional website that exceeded our expectations.',
                avatar: 'https://example.com/avatar1.jpg',
                rating: 5,
                order: 1
              },
              {
                id: 'test2',
                name: 'Sarah Johnson',
                position: 'Marketing Director',
                company: 'Creative Solutions',
                content: 'Manikandan delivered an exceptional UI/UX design for our mobile app. His creative approach and technical knowledge made the project a success.',
                avatar: 'https://example.com/avatar2.jpg',
                rating: 5,
                order: 2
              }
            ]
          });
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching testimonials data:', error);
        setToast({
          show: true,
          message: 'Failed to load testimonials data',
          type: 'error'
        });
        setIsLoading(false);
      }
    };

    fetchTestimonialsData();
  }, []);

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTestimonialsData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle new testimonial form changes
  const handleNewTestimonialChange = (e) => {
    const { name, value, type } = e.target;
    setNewTestimonial(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value
    }));
  };

  // Handle testimonial changes
  const handleTestimonialChange = (id, field, value) => {
    setTestimonialsData(prev => ({
      ...prev,
      testimonials: prev.testimonials.map(test => 
        test.id === id ? { 
          ...test, 
          [field]: field === 'rating' ? parseInt(value) : value 
        } : test
      )
    }));
  };

  // Handle avatar upload for new testimonial
  const handleNewAvatarUpload = (url) => {
    setNewTestimonial(prev => ({
      ...prev,
      avatar: url
    }));
    
    setToast({
      show: true,
      message: 'Avatar uploaded successfully',
      type: 'success'
    });
  };

  // Handle avatar upload for existing testimonial
  const handleAvatarUpload = (id, url) => {
    handleTestimonialChange(id, 'avatar', url);
    
    setToast({
      show: true,
      message: 'Avatar uploaded successfully',
      type: 'success'
    });
  };

  // Add a new testimonial
  const addTestimonial = () => {
    // Validate required fields
    if (!newTestimonial.name || !newTestimonial.content) {
      setToast({
        show: true,
        message: 'Name and testimonial content are required',
        type: 'warning'
      });
      return;
    }
    
    const id = `test${Date.now()}`;
    const order = testimonialsData.testimonials.length > 0 
      ? Math.max(...testimonialsData.testimonials.map(test => test.order)) + 1 
      : 1;
      
    const testimonial = {
      ...newTestimonial,
      id,
      order
    };
    
    setTestimonialsData(prev => ({
      ...prev,
      testimonials: [...prev.testimonials, testimonial]
    }));
    
    // Reset form
    setNewTestimonial({
      name: '',
      position: '',
      company: '',
      content: '',
      avatar: '',
      rating: 5
    });
    
    setToast({
      show: true,
      message: 'Testimonial added successfully',
      type: 'success'
    });
  };

  // Remove a testimonial
  const removeTestimonial = (id) => {
    setTestimonialsData(prev => ({
      ...prev,
      testimonials: prev.testimonials.filter(test => test.id !== id)
    }));
    
    setToast({
      show: true,
      message: 'Testimonial removed successfully',
      type: 'success'
    });
  };

  // Move testimonial up in order
  const moveTestimonialUp = (id) => {
    const index = testimonialsData.testimonials.findIndex(test => test.id === id);
    if (index <= 0) return;
    
    const updatedTestimonials = [...testimonialsData.testimonials];
    const temp = updatedTestimonials[index];
    updatedTestimonials[index] = updatedTestimonials[index - 1];
    updatedTestimonials[index - 1] = temp;
    
    // Update order values
    const reorderedTestimonials = updatedTestimonials.map((test, idx) => ({
      ...test,
      order: idx + 1
    }));
    
    setTestimonialsData(prev => ({
      ...prev,
      testimonials: reorderedTestimonials
    }));
  };

  // Move testimonial down in order
  const moveTestimonialDown = (id) => {
    const index = testimonialsData.testimonials.findIndex(test => test.id === id);
    if (index === -1 || index >= testimonialsData.testimonials.length - 1) return;
    
    const updatedTestimonials = [...testimonialsData.testimonials];
    const temp = updatedTestimonials[index];
    updatedTestimonials[index] = updatedTestimonials[index + 1];
    updatedTestimonials[index + 1] = temp;
    
    // Update order values
    const reorderedTestimonials = updatedTestimonials.map((test, idx) => ({
      ...test,
      order: idx + 1
    }));
    
    setTestimonialsData(prev => ({
      ...prev,
      testimonials: reorderedTestimonials
    }));
  };

  // Save testimonials section data
  const saveTestimonialsSection = async () => {
    setIsLoading(true);
    try {
      // In a real app, save to API
      // Mock successful update for demo
      setTimeout(() => {
        setIsLoading(false);
        setToast({
          show: true,
          message: 'Testimonials section updated successfully!',
          type: 'success'
        });
      }, 800);
    } catch (error) {
      console.error('Error saving testimonials section:', error);
      setToast({
        show: true,
        message: 'Failed to save testimonials section',
        type: 'error'
      });
      setIsLoading(false);
    }
  };

  // Generate star rating display
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <span 
        key={i} 
        className={`text-xl ${i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
      >
        ★
      </span>
    ));
  };

  // Component to render the testimonials editor
  const TestimonialsEditor = () => (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Testimonials Editor</h1>
          <button
            onClick={saveTestimonialsSection}
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
                  Section Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={testimonialsData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Client Testimonials, What People Say, etc."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Introduction Text
                </label>
                <textarea
                  name="intro"
                  value={testimonialsData.intro}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Brief introduction to your testimonials section"
                />
              </div>
            </div>
          </section>
          
          {/* Add New Testimonial */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Add New Testimonial</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newTestimonial.name}
                    onChange={handleNewTestimonialChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., John Smith"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Position/Title
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={newTestimonial.position}
                    onChange={handleNewTestimonialChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., CEO, Marketing Director, etc."
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company/Organization
                </label>
                <input
                  type="text"
                  name="company"
                  value={newTestimonial.company}
                  onChange={handleNewTestimonialChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Tech Innovations Inc."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Testimonial Content *
                </label>
                <textarea
                  name="content"
                  value={newTestimonial.content}
                  onChange={handleNewTestimonialChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  placeholder="What the client said about your work..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Rating
                </label>
                <div className="flex items-center space-x-1">
                  <input
                    type="range"
                    name="rating"
                    min="1"
                    max="5"
                    value={newTestimonial.rating}
                    onChange={handleNewTestimonialChange}
                    className="w-40 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {newTestimonial.rating}/5
                  </span>
                  <div className="ml-2">
                    {renderStars(newTestimonial.rating)}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Client Avatar
                </label>
                <div className="flex items-start space-x-4">
                  {newTestimonial.avatar ? (
                    <div className="w-16 h-16 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <img 
                        src={newTestimonial.avatar} 
                        alt="Client Avatar" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                      <span className="text-gray-400 dark:text-gray-500">No image</span>
                    </div>
                  )}
                  
                  <div className="flex-grow">
                    <CloudinaryUpload
                      onUploadSuccess={handleNewAvatarUpload}
                      resourceType="image"
                      uploadPreset="testimonial_avatars"
                      buttonText="Upload Avatar"
                    />
                    
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Recommended: Square image, at least 200x200px.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={addTestimonial}
                  className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                >
                  <FiPlus className="mr-2" />
                  Add Testimonial
                </button>
              </div>
            </div>
          </section>
          
          {/* Testimonials List */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Testimonials</h2>
            
            {testimonialsData.testimonials.length === 0 ? (
              <p className="text-center py-8 text-gray-500 dark:text-gray-400">
                No testimonials added yet. Use the form above to add client testimonials.
              </p>
            ) : (
              <div className="space-y-6">
                {testimonialsData.testimonials.map((testimonial, index) => (
                  <div 
                    key={testimonial.id} 
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        {testimonial.avatar ? (
                          <div className="w-12 h-12 mr-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                            <img 
                              src={testimonial.avatar} 
                              alt={testimonial.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 mr-3 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                            <span className="text-gray-400 dark:text-gray-500">No img</span>
                          </div>
                        )}
                        <div>
                          <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                            {testimonial.name}
                          </h3>
                          {(testimonial.position || testimonial.company) && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {testimonial.position}
                              {testimonial.position && testimonial.company && ', '}
                              {testimonial.company}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => moveTestimonialUp(testimonial.id)}
                          disabled={index === 0}
                          className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-30"
                          title="Move up"
                        >
                          <FiArrowUp size={18} />
                        </button>
                        <button
                          onClick={() => moveTestimonialDown(testimonial.id)}
                          disabled={index === testimonialsData.testimonials.length - 1}
                          className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-30"
                          title="Move down"
                        >
                          <FiArrowDown size={18} />
                        </button>
                        <button
                          onClick={() => removeTestimonial(testimonial.id)}
                          className="p-1 text-red-500 hover:text-red-700"
                          title="Remove testimonial"
                        >
                          <FiTrash size={18} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex mb-2">
                        {renderStars(testimonial.rating)}
                      </div>
                      
                      <textarea
                        value={testimonial.content}
                        onChange={(e) => handleTestimonialChange(testimonial.id, 'content', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Client Name
                        </label>
                        <input
                          type="text"
                          value={testimonial.name}
                          onChange={(e) => handleTestimonialChange(testimonial.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Position/Title
                        </label>
                        <input
                          type="text"
                          value={testimonial.position}
                          onChange={(e) => handleTestimonialChange(testimonial.id, 'position', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Company
                        </label>
                        <input
                          type="text"
                          value={testimonial.company}
                          onChange={(e) => handleTestimonialChange(testimonial.id, 'company', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Rating
                        </label>
                        <div className="flex items-center">
                          <input
                            type="range"
                            min="1"
                            max="5"
                            value={testimonial.rating}
                            onChange={(e) => handleTestimonialChange(testimonial.id, 'rating', e.target.value)}
                            className="w-40 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            {testimonial.rating}/5
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Avatar
                        </label>
                        <CloudinaryUpload
                          onUploadSuccess={(url) => handleAvatarUpload(testimonial.id, url)}
                          resourceType="image"
                          uploadPreset="testimonial_avatars"
                          buttonText={testimonial.avatar ? "Change Avatar" : "Upload Avatar"}
                          buttonClassName="text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
              Testimonials
            </span>
          </div>
          
          {/* Page header */}
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Testimonials Section
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage client testimonials and feedback displayed on your portfolio
            </p>
          </div>
          
          {/* Main content */}
          <TestimonialsEditor />
        </div>
      </div>
    </motion.div>
  );
};

// Renamed export to match the import in AdminApp.jsx
export default CMSTestimonials; 