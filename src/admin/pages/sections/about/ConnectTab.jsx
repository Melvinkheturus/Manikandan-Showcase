import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiTrash, FiLink, FiFile, FiExternalLink, FiX } from 'react-icons/fi';
import { ContentSection } from '../../../CMSHelper/ContentPageLayout';
import CloudinaryUploader from '../../../components/CloudinaryUploader';

const URL_MAX_LENGTH = 200;

// Available social platforms with validation patterns
const SOCIAL_PLATFORMS = [
  { 
    id: 'linkedin', 
    name: 'LinkedIn', 
    icon: '👔',
    placeholder: 'https://linkedin.com/in/username',
    pattern: /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/
  },
  { 
    id: 'github', 
    name: 'GitHub', 
    icon: '💻',
    placeholder: 'https://github.com/username',
    pattern: /^https?:\/\/(www\.)?github\.com\/[\w-]+\/?$/
  },
  { 
    id: 'twitter', 
    name: 'Twitter', 
    icon: '🐦',
    placeholder: 'https://twitter.com/username',
    pattern: /^https?:\/\/(www\.)?(twitter|x)\.com\/[\w-]+\/?$/
  },
  { 
    id: 'dribbble', 
    name: 'Dribbble', 
    icon: '🏀',
    placeholder: 'https://dribbble.com/username',
    pattern: /^https?:\/\/(www\.)?dribbble\.com\/[\w-]+\/?$/
  },
  { 
    id: 'behance', 
    name: 'Behance', 
    icon: '🎨',
    placeholder: 'https://behance.net/username',
    pattern: /^https?:\/\/(www\.)?behance\.net\/[\w-]+\/?$/
  },
  { 
    id: 'medium', 
    name: 'Medium', 
    icon: '📝',
    placeholder: 'https://medium.com/@username',
    pattern: /^https?:\/\/(www\.)?medium\.com\/@?[\w-]+\/?$/
  },
  { 
    id: 'instagram', 
    name: 'Instagram', 
    icon: '📸',
    placeholder: 'https://instagram.com/username',
    pattern: /^https?:\/\/(www\.)?instagram\.com\/[\w-]+\/?$/
  },
  { 
    id: 'youtube', 
    name: 'YouTube', 
    icon: '🎬',
    placeholder: 'https://youtube.com/@username',
    pattern: /^https?:\/\/(www\.)?youtube\.com\/@?[\w-]+\/?$/
  },
  { 
    id: 'other', 
    name: 'Other', 
    icon: '🔗',
    placeholder: 'https://example.com',
    pattern: /^https?:\/\/.+\..+/
  }
];

// Cloudinary configuration
const CLOUDINARY_CONFIG = {
  cloudName: 'portfolio-cms', // Replace with your cloud name
  uploadPreset: 'portfolio_resumes', // Replace with your upload preset
  folder: 'resumes'
};

const ConnectTab = ({ socialLinks = [], resumeUrl = '', onSocialLinksChange, onResumeUrlChange }) => {
  // State for new social link form
  const [newLink, setNewLink] = useState({
    platform: '',
    url: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [uploadError, setUploadError] = useState(null);
  
  // Get available platforms that haven't been used yet
  const getAvailablePlatforms = () => {
    const usedPlatforms = socialLinks
      .map(link => link.platform)
      .filter(platform => platform !== 'other'); // Allow multiple "other" platforms
      
    return SOCIAL_PLATFORMS.filter(platform => 
      platform.id === 'other' || !usedPlatforms.includes(platform.id)
    );
  };
  
  // Handle platform selection
  const handlePlatformChange = (e) => {
    const platformId = e.target.value;
    setNewLink({
      ...newLink,
      platform: platformId
    });
    validateLink({ ...newLink, platform: platformId });
  };
  
  // Handle URL input
  const handleUrlChange = (e) => {
    const url = e.target.value.slice(0, URL_MAX_LENGTH);
    setNewLink({
      ...newLink,
      url
    });
    validateLink({ ...newLink, url });
  };
  
  // Validate social link
  const validateLink = (link) => {
    const errors = {};
    
    if (!link.platform) {
      errors.platform = 'Please select a platform';
    }
    
    if (!link.url) {
      errors.url = 'URL is required';
    } else {
      // Find selected platform for validation
      const platform = SOCIAL_PLATFORMS.find(p => p.id === link.platform);
      if (platform && !platform.pattern.test(link.url)) {
        errors.url = `Please enter a valid ${platform.name} URL`;
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Add new social link
  const handleAddLink = () => {
    if (validateLink(newLink)) {
      const updatedLinks = [...socialLinks, newLink];
      onSocialLinksChange(updatedLinks);
      setNewLink({ platform: '', url: '' });
    }
  };
  
  // Remove a social link
  const handleRemoveLink = (indexToRemove) => {
    const updatedLinks = socialLinks.filter((_, index) => index !== indexToRemove);
    onSocialLinksChange(updatedLinks);
  };
  
  // Handle successful resume upload via Cloudinary
  const handleResumeUploadSuccess = (url) => {
    onResumeUrlChange(url);
    setUploadError(null);
  };
  
  // Handle resume upload error
  const handleResumeUploadError = (error) => {
    setUploadError(error);
  };
  
  // Remove resume
  const handleRemoveResume = () => {
    if (confirm('Are you sure you want to remove your resume?')) {
      onResumeUrlChange('');
    }
  };
  
  // Get platform name and icon by ID
  const getPlatformInfo = (platformId) => {
    const platform = SOCIAL_PLATFORMS.find(p => p.id === platformId);
    return platform || { name: 'Unknown', icon: '❓' };
  };
  
  return (
    <div className="space-y-6">
      <ContentSection
        title="Social Links"
        icon="🌐"
        collapsible={true}
        defaultCollapsed={false}
      >
        <div className="space-y-6">
          {/* Current links */}
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-3">Current Links</h3>
            
            {socialLinks.length === 0 ? (
              <p className="text-gray-500 text-sm italic">
                No social links added yet. Add your first link below.
              </p>
            ) : (
              <div className="space-y-3">
                {socialLinks.map((link, index) => {
                  const platform = getPlatformInfo(link.platform);
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-3 bg-gray-800/50 border border-gray-700/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{platform.icon}</span>
                        <div>
                          <h4 className="font-medium text-white">{platform.name}</h4>
                          <a 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center"
                          >
                            {link.url.length > 30 ? `${link.url.substring(0, 30)}...` : link.url}
                            <FiExternalLink size={12} className="ml-1" />
                          </a>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleRemoveLink(index)}
                        className="p-2 text-red-400 hover:text-red-500"
                        title="Remove link"
                      >
                        <FiTrash size={16} />
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Add new link */}
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-3">Add New Link</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-4">
                <label htmlFor="platform" className="block text-xs text-gray-400 mb-1">
                  Platform
                </label>
                <select
                  id="platform"
                  value={newLink.platform}
                  onChange={handlePlatformChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 focus:border-emerald-500 focus:ring focus:ring-emerald-500/20 transition-colors text-white"
                >
                  <option value="">Select Platform</option>
                  {getAvailablePlatforms().map(platform => (
                    <option key={platform.id} value={platform.id}>
                      {platform.icon} {platform.name}
                    </option>
                  ))}
                </select>
                {validationErrors.platform && (
                  <p className="mt-1 text-xs text-red-400">{validationErrors.platform}</p>
                )}
              </div>
              
              <div className="md:col-span-6">
                <label htmlFor="url" className="block text-xs text-gray-400 mb-1">
                  URL
                </label>
                <input
                  id="url"
                  type="text"
                  value={newLink.url}
                  onChange={handleUrlChange}
                  placeholder={newLink.platform ? 
                    SOCIAL_PLATFORMS.find(p => p.id === newLink.platform)?.placeholder : 
                    'https://example.com/profile'
                  }
                  className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 focus:border-emerald-500 focus:ring focus:ring-emerald-500/20 transition-colors text-white"
                />
                {validationErrors.url && (
                  <p className="mt-1 text-xs text-red-400">{validationErrors.url}</p>
                )}
              </div>
              
              <div className="md:col-span-2 flex items-end">
                <button
                  onClick={handleAddLink}
                  disabled={!newLink.platform || !newLink.url}
                  className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-700 disabled:text-gray-500 transition-colors flex items-center justify-center"
                >
                  <FiPlus className="mr-1" size={16} />
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </ContentSection>
      
      <ContentSection
        title="Resume"
        icon="📄"
        collapsible={true}
        defaultCollapsed={false}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-400">
            Upload your resume as a PDF file. This will be available for download on your portfolio.
          </p>
          
          {resumeUrl ? (
            <div className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-xl">📄</span>
                <div>
                  <h4 className="font-medium text-white">Resume PDF</h4>
                  <a 
                    href={resumeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center"
                  >
                    View PDF
                    <FiExternalLink size={12} className="ml-1" />
                  </a>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <CloudinaryUploader
                  onUploadSuccess={handleResumeUploadSuccess}
                  onUploadError={handleResumeUploadError}
                  cloudName={CLOUDINARY_CONFIG.cloudName}
                  uploadPreset={CLOUDINARY_CONFIG.uploadPreset}
                  folder={CLOUDINARY_CONFIG.folder}
                  buttonText="Replace"
                  acceptTypes=".pdf"
                />
                
                <button
                  onClick={handleRemoveResume}
                  className="px-3 py-2 text-xs font-medium rounded-lg bg-red-900/30 text-red-400 hover:bg-red-900/50 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div>
              <CloudinaryUploader
                onUploadSuccess={handleResumeUploadSuccess}
                onUploadError={handleResumeUploadError}
                cloudName={CLOUDINARY_CONFIG.cloudName}
                uploadPreset={CLOUDINARY_CONFIG.uploadPreset}
                folder={CLOUDINARY_CONFIG.folder}
                buttonText="Upload Resume PDF"
                acceptTypes=".pdf"
              />
              
              {uploadError && (
                <p className="mt-2 text-sm text-red-400">
                  {uploadError}
                </p>
              )}
            </div>
          )}
        </div>
      </ContentSection>
    </div>
  );
};

export default ConnectTab; 