import React, { useState, useEffect } from 'react';
import { FiSave, FiMoon, FiSun, FiGlobe, FiUser, FiBell } from 'react-icons/fi';
import Toaster from '../components/Toaster';

const CMSSettings = () => {
  // State for settings
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'en',
    notifications: {
      email: true,
      browser: true,
      comments: true,
      updates: false
    },
    profile: {
      name: '',
      email: '',
      bio: '',
      avatar: ''
    },
    siteSettings: {
      siteName: '',
      siteDescription: '',
      contactEmail: '',
      socialMedia: {
        twitter: '',
        linkedin: '',
        github: ''
      }
    }
  });

  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('appearance');

  // Load settings
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        // In a real app, fetch from API
        // Mock data for demo purposes
        setTimeout(() => {
          setSettings({
            theme: localStorage.getItem('cms_theme') || 'light',
            language: 'en',
            notifications: {
              email: true,
              browser: true,
              comments: true,
              updates: true
            },
            profile: {
              name: 'Admin User',
              email: 'admin@example.com',
              bio: 'Portfolio CMS Administrator',
              avatar: 'https://example.com/avatar.jpg'
            },
            siteSettings: {
              siteName: 'Manikandan Portfolio',
              siteDescription: 'UI/UX Designer & Creative Technologist',
              contactEmail: 'contact@example.com',
              socialMedia: {
                twitter: 'https://twitter.com/username',
                linkedin: 'https://linkedin.com/in/username',
                github: 'https://github.com/username'
              }
            }
          });
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching settings:', error);
        setToast({
          show: true,
          message: 'Failed to load settings',
          type: 'error'
        });
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Handle theme change
  const handleThemeChange = (theme) => {
    setSettings(prev => ({
      ...prev,
      theme
    }));

    // Apply theme to document
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);

    // Store theme preference
    localStorage.setItem('cms_theme', theme);
  };

  // Handle input changes
  const handleInputChange = (section, field, value) => {
    if (section === 'root') {
      setSettings(prev => ({
        ...prev,
        [field]: value
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    }
  };

  // Handle nested input changes
  const handleNestedInputChange = (section, nestedSection, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [nestedSection]: {
          ...prev[section][nestedSection],
          [field]: value
        }
      }
    }));
  };

  // Handle notification toggle
  const handleNotificationToggle = (field) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: !prev.notifications[field]
      }
    }));
  };

  // Save settings
  const saveSettings = async () => {
    setIsLoading(true);
    try {
      // In a real app, save to API
      // Mock successful update for demo
      setTimeout(() => {
        setIsLoading(false);
        setToast({
          show: true,
          message: 'Settings updated successfully!',
          type: 'success'
        });
      }, 800);
    } catch (error) {
      console.error('Error saving settings:', error);
      setToast({
        show: true,
        message: 'Failed to save settings',
        type: 'error'
      });
      setIsLoading(false);
    }
  };

  // Tab navigation items
  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: <FiSun /> },
    { id: 'notifications', label: 'Notifications', icon: <FiBell /> },
    { id: 'profile', label: 'Profile', icon: <FiUser /> },
    { id: 'site', label: 'Site Settings', icon: <FiGlobe /> }
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Settings</h1>
          <button
            onClick={saveSettings}
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

        {/* Tabs Navigation */}
        <div className="flex overflow-x-auto mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 min-w-max ${
                activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-800 dark:text-white">Theme & Appearance</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Theme
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => handleThemeChange('light')}
                      className={`relative flex flex-col items-center p-4 border rounded-md ${
                        settings.theme === 'light'
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                          : 'border-gray-300 dark:border-gray-700'
                      }`}
                    >
                      <FiSun size={24} className="mb-2" />
                      <span>Light Mode</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleThemeChange('dark')}
                      className={`relative flex flex-col items-center p-4 border rounded-md ${
                        settings.theme === 'dark'
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                          : 'border-gray-300 dark:border-gray-700'
                      }`}
                    >
                      <FiMoon size={24} className="mb-2" />
                      <span>Dark Mode</span>
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Language
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) => handleInputChange('root', 'language', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-800 dark:text-white">Notification Preferences</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.notifications.email}
                      onChange={() => handleNotificationToggle('email')}
                      className="rounded border-gray-300 text-emerald-600 shadow-sm focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Email notifications
                    </span>
                  </label>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 ml-6">
                    Receive important updates via email
                  </p>
                </div>
                
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.notifications.browser}
                      onChange={() => handleNotificationToggle('browser')}
                      className="rounded border-gray-300 text-emerald-600 shadow-sm focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Browser notifications
                    </span>
                  </label>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 ml-6">
                    Get notified in real-time while using the CMS
                  </p>
                </div>
                
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.notifications.comments}
                      onChange={() => handleNotificationToggle('comments')}
                      className="rounded border-gray-300 text-emerald-600 shadow-sm focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Comment notifications
                    </span>
                  </label>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 ml-6">
                    Receive notifications when someone comments on your posts
                  </p>
                </div>
                
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.notifications.updates}
                      onChange={() => handleNotificationToggle('updates')}
                      className="rounded border-gray-300 text-emerald-600 shadow-sm focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Product updates
                    </span>
                  </label>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 ml-6">
                    Get notified about new features and improvements
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-800 dark:text-white">Profile Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={settings.profile.name}
                    onChange={(e) => handleInputChange('profile', 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={settings.profile.email}
                    onChange={(e) => handleInputChange('profile', 'email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={settings.profile.bio}
                    onChange={(e) => handleInputChange('profile', 'bio', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Change Password
                  </label>
                  <button 
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Reset Password
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Site Settings Tab */}
          {activeTab === 'site' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-800 dark:text-white">Site Configuration</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={settings.siteSettings.siteName}
                    onChange={(e) => handleInputChange('siteSettings', 'siteName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Site Description
                  </label>
                  <textarea
                    value={settings.siteSettings.siteDescription}
                    onChange={(e) => handleInputChange('siteSettings', 'siteDescription', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={settings.siteSettings.contactEmail}
                    onChange={(e) => handleInputChange('siteSettings', 'contactEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Social Media
                  </label>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        LinkedIn
                      </label>
                      <input
                        type="text"
                        value={settings.siteSettings.socialMedia.linkedin}
                        onChange={(e) => handleNestedInputChange('siteSettings', 'socialMedia', 'linkedin', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Twitter
                      </label>
                      <input
                        type="text"
                        value={settings.siteSettings.socialMedia.twitter}
                        onChange={(e) => handleNestedInputChange('siteSettings', 'socialMedia', 'twitter', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                        placeholder="https://twitter.com/username"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        GitHub
                      </label>
                      <input
                        type="text"
                        value={settings.siteSettings.socialMedia.github}
                        onChange={(e) => handleNestedInputChange('siteSettings', 'socialMedia', 'github', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                        placeholder="https://github.com/username"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
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
};

export default CMSSettings;