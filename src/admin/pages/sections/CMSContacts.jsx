import React, { useState, useEffect } from 'react';
import { FiSave, FiPlus, FiTrash, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import Toaster from '../../components/Toaster';

const CMSContacts = () => {
  // State for contact section data
  const [contactData, setContactData] = useState({
    intro: '',
    title: '',
    email: '',
    phone: '',
    address: '',
    mapLocation: {
      lat: 0,
      lng: 0,
      zoom: 13
    },
    formEnabled: true,
    contactMethods: [
      { id: 'email', icon: 'mail', label: 'Email', value: '', isActive: true },
      { id: 'phone', icon: 'phone', label: 'Phone', value: '', isActive: true },
      { id: 'address', icon: 'map-pin', label: 'Address', value: '', isActive: true }
    ],
    socialLinks: []
  });
  
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [newContactMethod, setNewContactMethod] = useState({
    icon: 'mail',
    label: '',
    value: '',
    isActive: true
  });

  // Load contact data
  useEffect(() => {
    const fetchContactData = async () => {
      setIsLoading(true);
      try {
        // In a real app, fetch from API
        // Mock data for demo purposes
        setTimeout(() => {
          setContactData({
            intro: 'Get in touch with me for project inquiries or collaborations.',
            title: 'Contact Me',
            email: 'manikandan@example.com',
            phone: '+1 234 567 8900',
            address: '123 Design Street, Creative City, 12345',
            mapLocation: {
              lat: 40.7128,
              lng: -74.0060,
              zoom: 13
            },
            formEnabled: true,
            contactMethods: [
              { id: 'email', icon: 'mail', label: 'Email', value: 'manikandan@example.com', isActive: true },
              { id: 'phone', icon: 'phone', label: 'Phone', value: '+1 234 567 8900', isActive: true },
              { id: 'address', icon: 'map-pin', label: 'Address', value: '123 Design Street, Creative City, 12345', isActive: true }
            ],
            socialLinks: [
              { id: 'linkedin', platform: 'LinkedIn', url: 'https://linkedin.com/in/username' },
              { id: 'github', platform: 'GitHub', url: 'https://github.com/username' }
            ]
          });
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching contact data:', error);
        setToast({
          show: true,
          message: 'Failed to load contact data',
          type: 'error'
        });
        setIsLoading(false);
      }
    };

    fetchContactData();
  }, []);

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setContactData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle nested map location changes
  const handleMapLocationChange = (e) => {
    const { name, value } = e.target;
    setContactData(prev => ({
      ...prev,
      mapLocation: {
        ...prev.mapLocation,
        [name]: name === 'zoom' ? parseInt(value) : parseFloat(value)
      }
    }));
  };

  // Handle new contact method form changes
  const handleNewContactMethodChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewContactMethod(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle contact method changes
  const handleContactMethodChange = (id, field, value) => {
    setContactData(prev => ({
      ...prev,
      contactMethods: prev.contactMethods.map(method => 
        method.id === id ? { ...method, [field]: field === 'isActive' ? value : value } : method
      )
    }));
  };

  // Add a new contact method
  const addContactMethod = () => {
    // Validate required fields
    if (!newContactMethod.label || !newContactMethod.value) {
      setToast({
        show: true,
        message: 'Label and value are required',
        type: 'warning'
      });
      return;
    }
    
    const id = `contact-${Date.now()}`;
    
    const contactMethod = {
      ...newContactMethod,
      id
    };
    
    setContactData(prev => ({
      ...prev,
      contactMethods: [...prev.contactMethods, contactMethod]
    }));
    
    // Reset form
    setNewContactMethod({
      icon: 'mail',
      label: '',
      value: '',
      isActive: true
    });
    
    setToast({
      show: true,
      message: 'Contact method added successfully',
      type: 'success'
    });
  };

  // Remove a contact method
  const removeContactMethod = (id) => {
    // Don't allow removing the default methods
    if (['email', 'phone', 'address'].includes(id)) {
      setToast({
        show: true,
        message: 'Cannot remove default contact methods',
        type: 'warning'
      });
      return;
    }
    
    setContactData(prev => ({
      ...prev,
      contactMethods: prev.contactMethods.filter(method => method.id !== id)
    }));
    
    setToast({
      show: true,
      message: 'Contact method removed successfully',
      type: 'success'
    });
  };

  // Save contact section data
  const saveContactSection = async () => {
    setIsLoading(true);
    try {
      // In a real app, save to API
      // Mock successful update for demo
      setTimeout(() => {
        setIsLoading(false);
        setToast({
          show: true,
          message: 'Contact section updated successfully!',
          type: 'success'
        });
      }, 800);
    } catch (error) {
      console.error('Error saving contact section:', error);
      setToast({
        show: true,
        message: 'Failed to save contact section',
        type: 'error'
      });
      setIsLoading(false);
    }
  };

  // Get icon component based on icon name
  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'mail':
        return <FiMail />;
      case 'phone':
        return <FiPhone />;
      case 'map-pin':
        return <FiMapPin />;
      default:
        return <FiMail />;
    }
  };

  const iconOptions = [
    { value: 'mail', label: 'Email', component: <FiMail /> },
    { value: 'phone', label: 'Phone', component: <FiPhone /> },
    { value: 'map-pin', label: 'Location', component: <FiMapPin /> }
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Contact Section Editor</h1>
          <button
            onClick={saveContactSection}
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
                  value={contactData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Contact Me, Get In Touch, etc."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Introduction Text
                </label>
                <textarea
                  name="intro"
                  value={contactData.intro}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Brief introduction to your contact section"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="formEnabled"
                  name="formEnabled"
                  checked={contactData.formEnabled}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-emerald-600 shadow-sm focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50"
                />
                <label htmlFor="formEnabled" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Enable contact form
                </label>
              </div>
            </div>
          </section>
          
          {/* Contact Methods Section */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Contact Methods</h2>
            
            {/* Existing Contact Methods */}
            <div className="space-y-4 mb-8">
              {contactData.contactMethods.map((method) => (
                <div 
                  key={method.id} 
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300 mr-3">
                        {getIconComponent(method.icon)}
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                        {method.label}
                      </h3>
                    </div>
                    
                    <button
                      onClick={() => removeContactMethod(method.id)}
                      className="p-2 text-red-500 hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed"
                      disabled={['email', 'phone', 'address'].includes(method.id)}
                      title={['email', 'phone', 'address'].includes(method.id) ? 'Cannot remove default contact methods' : 'Remove contact method'}
                    >
                      <FiTrash size={18} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Label
                      </label>
                      <input
                        type="text"
                        value={method.label}
                        onChange={(e) => handleContactMethodChange(method.id, 'label', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Value
                      </label>
                      <input
                        type="text"
                        value={method.value}
                        onChange={(e) => handleContactMethodChange(method.id, 'value', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`active-${method.id}`}
                      checked={method.isActive}
                      onChange={(e) => handleContactMethodChange(method.id, 'isActive', e.target.checked)}
                      className="rounded border-gray-300 text-emerald-600 shadow-sm focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50"
                    />
                    <label htmlFor={`active-${method.id}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Show this contact method
                    </label>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Add New Contact Method */}
            <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
              <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Add New Contact Method</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Label *
                    </label>
                    <input
                      type="text"
                      name="label"
                      value={newContactMethod.label}
                      onChange={handleNewContactMethodChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                      placeholder="e.g., WhatsApp, Skype, etc."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Value *
                    </label>
                    <input
                      type="text"
                      name="value"
                      value={newContactMethod.value}
                      onChange={handleNewContactMethodChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Contact information"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Icon
                  </label>
                  <div className="flex space-x-4">
                    {iconOptions.map(option => (
                      <label 
                        key={option.value} 
                        className={`flex items-center p-3 border rounded-md cursor-pointer ${
                          newContactMethod.icon === option.value 
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' 
                            : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
                        }`}
                      >
                        <input
                          type="radio"
                          name="icon"
                          value={option.value}
                          checked={newContactMethod.icon === option.value}
                          onChange={handleNewContactMethodChange}
                          className="sr-only"
                        />
                        <div className="flex flex-col items-center">
                          <div className="text-xl mb-1">{option.component}</div>
                          <span className="text-xs">{option.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={addContactMethod}
                    className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                  >
                    <FiPlus className="mr-2" />
                    Add Contact Method
                  </button>
                </div>
              </div>
            </div>
          </section>
          
          {/* Map Location Section */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Map Location</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    name="lat"
                    value={contactData.mapLocation.lat}
                    onChange={handleMapLocationChange}
                    step="0.000001"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    name="lng"
                    value={contactData.mapLocation.lng}
                    onChange={handleMapLocationChange}
                    step="0.000001"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Zoom Level
                  </label>
                  <input
                    type="number"
                    name="zoom"
                    value={contactData.mapLocation.zoom}
                    onChange={handleMapLocationChange}
                    min="1"
                    max="20"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              
              <p className="text-sm text-gray-500 dark:text-gray-400">
                You can get map coordinates by right-clicking on Google Maps and selecting "What's here?"
              </p>
              
              <div className="mt-4 bg-gray-200 dark:bg-gray-700 rounded-lg h-60 flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">
                  Map Preview (integration with Google Maps API required)
                </p>
              </div>
            </div>
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
};

export default CMSContacts; 