import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash, FiArrowUp, FiArrowDown, FiLink, FiSmartphone, FiTablet, FiMonitor } from 'react-icons/fi';
import CloudinaryUpload from '../../components/CloudinaryUpload';
import ContentPageLayout, { ContentSection } from '../../CMSHelper/ContentPageLayout';
import { TextInput, TextArea, Button, Toggle, Select } from '../../CMSHelper/FormComponents';

const CMSSocialCarousel = () => {
  // State for social carousel data
  const [carouselData, setCarouselData] = useState({
    intro: '',
    title: '',
    socialLinks: [],
    autoplay: true,
    autoplaySpeed: 3000,
    visible: true
  });
  
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [newSocialLink, setNewSocialLink] = useState({
    platform: '',
    url: '',
    icon: ''
  });

  // Load carousel data
  useEffect(() => {
    const fetchCarouselData = async () => {
      try {
        // In a real app, fetch from API
        // Mock data for demo purposes
        setTimeout(() => {
          setCarouselData({
            intro: 'Connect with me on social media.',
            title: 'Social Media',
            visible: true,
            socialLinks: [
              {
                id: 'social1',
                platform: 'LinkedIn',
                url: 'https://linkedin.com/in/username',
                icon: 'https://example.com/linkedin-icon.svg',
                order: 1
              },
              {
                id: 'social2',
                platform: 'GitHub',
                url: 'https://github.com/username',
                icon: 'https://example.com/github-icon.svg',
                order: 2
              },
              {
                id: 'social3',
                platform: 'Dribbble',
                url: 'https://dribbble.com/username',
                icon: 'https://example.com/dribbble-icon.svg',
                order: 3
              },
              {
                id: 'social4',
                platform: 'Behance',
                url: 'https://behance.net/username',
                icon: 'https://example.com/behance-icon.svg',
                order: 4
              }
            ],
            autoplay: true,
            autoplaySpeed: 3000
          });
        }, 800);
      } catch (error) {
        console.error('Error fetching carousel data:', error);
      }
    };

    fetchCarouselData();
  }, []);

  // Toggle section visibility
  const toggleSectionVisibility = () => {
    setCarouselData(prev => ({
      ...prev,
      visible: !prev.visible
    }));
    setHasUnsavedChanges(true);
    
    if (autoSaveEnabled) {
      debouncedSave();
    }
  };

  // Debounced save function
  const debouncedSave = () => {
    setTimeout(() => {
      saveCarouselSection();
    }, 1000);
  };

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCarouselData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setHasUnsavedChanges(true);
    
    if (autoSaveEnabled) {
      debouncedSave();
    }
  };

  // Handle new social link form changes
  const handleNewSocialLinkChange = (e) => {
    const { name, value } = e.target;
    setNewSocialLink(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle social link changes
  const handleSocialLinkChange = (id, field, value) => {
    setCarouselData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map(link => 
        link.id === id ? { ...link, [field]: value } : link
      )
    }));
    setHasUnsavedChanges(true);
    
    if (autoSaveEnabled) {
      debouncedSave();
    }
  };

  // Handle icon upload for new social link
  const handleNewIconUpload = (url) => {
    setNewSocialLink(prev => ({
      ...prev,
      icon: url
    }));
  };

  // Handle icon upload for existing social link
  const handleIconUpload = (id, url) => {
    handleSocialLinkChange(id, 'icon', url);
  };

  // Add a new social link
  const addSocialLink = () => {
    // Validate required fields
    if (!newSocialLink.platform || !newSocialLink.url) {
      return;
    }
    
    const id = `social${Date.now()}`;
    const order = carouselData.socialLinks.length > 0 
      ? Math.max(...carouselData.socialLinks.map(link => link.order)) + 1 
      : 1;
      
    const socialLink = {
      ...newSocialLink,
      id,
      order
    };
    
    setCarouselData(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, socialLink]
    }));
    setHasUnsavedChanges(true);
    
    // Reset form
    setNewSocialLink({
      platform: '',
      url: '',
      icon: ''
    });
    
    if (autoSaveEnabled) {
      debouncedSave();
    }
  };

  // Remove a social link
  const removeSocialLink = (id) => {
    setCarouselData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter(link => link.id !== id)
    }));
    setHasUnsavedChanges(true);
    
    if (autoSaveEnabled) {
      debouncedSave();
    }
  };

  // Move social link up in order
  const moveSocialLinkUp = (id) => {
    const index = carouselData.socialLinks.findIndex(link => link.id === id);
    if (index <= 0) return;
    
    const updatedLinks = [...carouselData.socialLinks];
    const temp = updatedLinks[index];
    updatedLinks[index] = updatedLinks[index - 1];
    updatedLinks[index - 1] = temp;
    
    // Update order values
    const reorderedLinks = updatedLinks.map((link, idx) => ({
      ...link,
      order: idx + 1
    }));
    
    setCarouselData(prev => ({
      ...prev,
      socialLinks: reorderedLinks
    }));
    setHasUnsavedChanges(true);
    
    if (autoSaveEnabled) {
      debouncedSave();
    }
  };

  // Move social link down in order
  const moveSocialLinkDown = (id) => {
    const index = carouselData.socialLinks.findIndex(link => link.id === id);
    if (index === -1 || index >= carouselData.socialLinks.length - 1) return;
    
    const updatedLinks = [...carouselData.socialLinks];
    const temp = updatedLinks[index];
    updatedLinks[index] = updatedLinks[index + 1];
    updatedLinks[index + 1] = temp;
    
    // Update order values
    const reorderedLinks = updatedLinks.map((link, idx) => ({
      ...link,
      order: idx + 1
    }));
    
    setCarouselData(prev => ({
      ...prev,
      socialLinks: reorderedLinks
    }));
    setHasUnsavedChanges(true);
    
    if (autoSaveEnabled) {
      debouncedSave();
    }
  };

  // Save carousel section data
  const saveCarouselSection = async () => {
    try {
      // In a real app, save to API
      // Mock successful update for demo
      console.log('Saving social carousel data...', carouselData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setHasUnsavedChanges(false);
      return Promise.resolve();
    } catch (error) {
      console.error('Error saving social carousel:', error);
      return Promise.reject(error);
    }
  };

  // Common social platforms with icons
  const commonPlatforms = [
    { value: 'LinkedIn', label: 'LinkedIn' },
    { value: 'GitHub', label: 'GitHub' },
    { value: 'Dribbble', label: 'Dribbble' },
    { value: 'Behance', label: 'Behance' },
    { value: 'Instagram', label: 'Instagram' },
    { value: 'Twitter', label: 'Twitter' },
    { value: 'Facebook', label: 'Facebook' },
    { value: 'YouTube', label: 'YouTube' },
    { value: 'Medium', label: 'Medium' },
    { value: 'CodePen', label: 'CodePen' }
  ];

  return (
    <ContentPageLayout
      title="Social Media Carousel"
      icon={<FiLink size={24} />}
      breadcrumbs={[
        { label: "Dashboard", path: "/admin" },
        { label: "Main Page", path: "/admin/main" },
        { label: "Social Media" }
      ]}
      onSave={saveCarouselSection}
      hasUnsavedChanges={hasUnsavedChanges}
      autoSaveEnabled={autoSaveEnabled}
      onToggleAutoSave={() => setAutoSaveEnabled(!autoSaveEnabled)}
      previewUrl="/#social"
      previewOptions={{
        device: previewDevice,
        onDeviceChange: setPreviewDevice,
        devices: [
          { id: 'mobile', icon: <FiSmartphone size={16} />, label: 'Mobile' },
          { id: 'tablet', icon: <FiTablet size={16} />, label: 'Tablet' },
          { id: 'desktop', icon: <FiMonitor size={16} />, label: 'Desktop' }
        ]
      }}
      showSectionVisibility={true}
      sectionVisible={carouselData.visible}
      onToggleSectionVisibility={toggleSectionVisibility}
    >
      {/* Basic Info Section */}
      <ContentSection 
        title="Basic Info" 
        icon={<FiLink size={20} />}
        collapsible={true}
        defaultCollapsed={false}
      >
        <div className="space-y-4">
          <TextInput
            label="Section Title"
            id="title"
            name="title"
            value={carouselData.title}
            onChange={handleInputChange}
            placeholder="e.g., Social Media, Connect With Me, etc."
          />
          
          <TextArea
            label="Introduction Text"
            id="intro"
            name="intro"
            value={carouselData.intro}
            onChange={handleInputChange}
            rows={2}
            placeholder="Brief introduction to your social media links"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Toggle
              label="Enable Autoplay"
              id="autoplay"
              name="autoplay"
              checked={carouselData.autoplay}
              onChange={handleInputChange}
            />
            
            {carouselData.autoplay && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Autoplay Speed (ms)
                </label>
                <input
                  type="number"
                  name="autoplaySpeed"
                  value={carouselData.autoplaySpeed}
                  onChange={handleInputChange}
                  min="1000"
                  step="500"
                  className="w-full px-3 py-2.5 bg-black/30 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 hover:border-gray-600"
                />
              </div>
            )}
          </div>
        </div>
      </ContentSection>
      
      {/* Add New Social Link */}
      <ContentSection 
        title="Add New Social Link" 
        icon={<FiPlus size={20} />}
        collapsible={true}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Platform Name *"
              id="platform"
              name="platform"
              value={newSocialLink.platform}
              onChange={handleNewSocialLinkChange}
              placeholder="e.g., LinkedIn, GitHub, etc."
              list="platform-suggestions"
              required
            />
            <datalist id="platform-suggestions">
              {commonPlatforms.map(platform => (
                <option key={platform.value} value={platform.value} />
              ))}
            </datalist>
            
            <TextInput
              label="URL *"
              id="url"
              name="url"
              type="url"
              value={newSocialLink.url}
              onChange={handleNewSocialLinkChange}
              placeholder="https://..."
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Icon
            </label>
            <div className="flex items-start space-x-4">
              {newSocialLink.icon ? (
                <div className="w-12 h-12 overflow-hidden rounded-md bg-black/40 border border-gray-800/50">
                  <img 
                    src={newSocialLink.icon} 
                    alt="Social Icon" 
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 flex items-center justify-center rounded-md bg-black/40 border border-gray-800/50">
                  <span className="text-gray-500">No icon</span>
                </div>
              )}
              
              <div className="flex-grow">
                <CloudinaryUpload
                  onUploadSuccess={handleNewIconUpload}
                  resourceType="image"
                  uploadPreset="social_icons"
                  buttonText="Upload Icon"
                />
                
                <p className="mt-2 text-sm text-gray-400">
                  Recommended: SVG or PNG with transparent background.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button
              onClick={addSocialLink}
              disabled={!newSocialLink.platform || !newSocialLink.url}
              icon={<FiPlus size={16} />}
            >
              Add Social Link
            </Button>
          </div>
        </div>
      </ContentSection>
      
      {/* Social Links List */}
      <ContentSection 
        title="Social Links" 
        icon={<FiLink size={20} />}
        collapsible={true}
      >
        {carouselData.socialLinks.length === 0 ? (
          <p className="text-center py-8 text-gray-500">
            No social links added yet. Use the form above to add your social media profiles.
          </p>
        ) : (
          <div className="space-y-4">
            {carouselData.socialLinks.map((link, index) => (
              <div 
                key={link.id} 
                className="border border-gray-800/50 bg-black/30 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    {link.icon && (
                      <div className="w-8 h-8 mr-3 overflow-hidden rounded-md bg-black/40 border border-gray-800/50">
                        <img 
                          src={link.icon} 
                          alt={link.platform} 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <h3 className="text-lg font-medium text-white">
                      {link.platform}
                    </h3>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => moveSocialLinkUp(link.id)}
                      disabled={index === 0}
                      variant="ghost"
                      icon={<FiArrowUp size={18} />}
                      aria-label="Move up"
                    />
                    <Button
                      onClick={() => moveSocialLinkDown(link.id)}
                      disabled={index === carouselData.socialLinks.length - 1}
                      variant="ghost"
                      icon={<FiArrowDown size={18} />}
                      aria-label="Move down"
                    />
                    <Button
                      onClick={() => removeSocialLink(link.id)}
                      variant="ghost"
                      icon={<FiTrash size={18} />}
                      className="text-red-500 hover:text-red-400"
                      aria-label="Remove social link"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <TextInput
                    label="Platform Name"
                    value={link.platform}
                    onChange={(e) => handleSocialLinkChange(link.id, 'platform', e.target.value)}
                  />
                  
                  <TextInput
                    label="URL"
                    type="url"
                    value={link.url}
                    onChange={(e) => handleSocialLinkChange(link.id, 'url', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Icon
                  </label>
                  <div className="flex items-start space-x-4">
                    {link.icon ? (
                      <div className="w-12 h-12 overflow-hidden rounded-md bg-black/40 border border-gray-800/50">
                        <img 
                          src={link.icon} 
                          alt="Social Icon" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 flex items-center justify-center rounded-md bg-black/40 border border-gray-800/50">
                        <span className="text-gray-500">No icon</span>
                      </div>
                    )}
                    
                    <div className="flex-grow">
                      <CloudinaryUpload
                        onUploadSuccess={(url) => handleIconUpload(link.id, url)}
                        resourceType="image"
                        uploadPreset="social_icons"
                        buttonText={link.icon ? "Change Icon" : "Upload Icon"}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ContentSection>
    </ContentPageLayout>
  );
};

export default CMSSocialCarousel; 