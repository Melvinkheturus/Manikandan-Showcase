import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash, FiArrowUp, FiArrowDown, FiBriefcase, FiSmartphone, FiTablet, FiMonitor } from 'react-icons/fi';
import ContentPageLayout, { ContentSection } from '../../CMSHelper/ContentPageLayout';
import { TextInput, TextArea, Button, Toggle } from '../../CMSHelper/FormComponents';

const CMSExperiencePage = () => {
  // State for experience section data
  const [experienceData, setExperienceData] = useState({
    intro: '',
    experiences: [],
    visible: true
  });
  
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [newExperience, setNewExperience] = useState({
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    technologies: ''
  });

  // Load experience data
  useEffect(() => {
    const fetchExperienceData = async () => {
      try {
        // In a real app, fetch from API
        // Mock data for demo purposes
        setTimeout(() => {
          setExperienceData({
            intro: 'My professional journey as a designer and developer.',
            visible: true,
            experiences: [
              {
                id: 'exp1',
                title: 'UI/UX Designer',
                company: 'Tech Solutions Inc.',
                location: 'New York, NY',
                startDate: '2021-06',
                endDate: '',
                current: true,
                description: 'Leading design initiatives for web and mobile applications. Collaborating with cross-functional teams to deliver user-centered design solutions.',
                technologies: 'Figma, Adobe XD, Sketch, Photoshop',
                order: 1
              },
              {
                id: 'exp2',
                title: 'Junior Designer',
                company: 'Creative Agency',
                location: 'Boston, MA',
                startDate: '2019-03',
                endDate: '2021-05',
                current: false,
                description: 'Assisted in creating wireframes, prototypes, and visual designs for various client projects.',
                technologies: 'Sketch, Illustrator, InVision',
                order: 2
              }
            ]
          });
        }, 800);
      } catch (error) {
        console.error('Error fetching experience data:', error);
      }
    };

    fetchExperienceData();
  }, []);

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExperienceData(prev => ({
      ...prev,
      [name]: value
    }));
    setHasUnsavedChanges(true);
    
    if (autoSaveEnabled) {
      debouncedSave();
    }
  };
  
  // Toggle section visibility
  const toggleSectionVisibility = () => {
    setExperienceData(prev => ({
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
      saveExperienceSection();
    }, 1000);
  };

  // Handle new experience form changes
  const handleNewExperienceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewExperience(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // If "current" is checked, clear the end date
    if (name === 'current' && checked) {
      setNewExperience(prev => ({
        ...prev,
        endDate: ''
      }));
    }
  };

  // Handle experience changes
  const handleExperienceChange = (id, field, value) => {
    setExperienceData(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
    setHasUnsavedChanges(true);
    
    // If "current" is checked, clear the end date
    if (field === 'current' && value === true) {
      setExperienceData(prev => ({
        ...prev,
        experiences: prev.experiences.map(exp => 
          exp.id === id ? { ...exp, endDate: '' } : exp
        )
      }));
    }
    
    if (autoSaveEnabled) {
      debouncedSave();
    }
  };

  // Add a new experience
  const addExperience = () => {
    // Validate required fields
    if (!newExperience.title || !newExperience.company || !newExperience.startDate) {
      return;
    }
    
    const id = `exp${Date.now()}`;
    const order = experienceData.experiences.length > 0 
      ? Math.min(...experienceData.experiences.map(exp => exp.order)) - 1 
      : 1;
      
    const experience = {
      ...newExperience,
      id,
      order
    };
    
    setExperienceData(prev => ({
      ...prev,
      experiences: [experience, ...prev.experiences]
    }));
    setHasUnsavedChanges(true);
    
    // Reset form
    setNewExperience({
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      technologies: ''
    });
    
    if (autoSaveEnabled) {
      debouncedSave();
    }
  };

  // Remove an experience
  const removeExperience = (id) => {
    setExperienceData(prev => ({
      ...prev,
      experiences: prev.experiences.filter(exp => exp.id !== id)
    }));
    setHasUnsavedChanges(true);
    
    if (autoSaveEnabled) {
      debouncedSave();
    }
  };

  // Move experience up in order (more recent)
  const moveExperienceUp = (id) => {
    const index = experienceData.experiences.findIndex(exp => exp.id === id);
    if (index <= 0) return;
    
    const updatedExperiences = [...experienceData.experiences];
    const temp = updatedExperiences[index].order;
    updatedExperiences[index].order = updatedExperiences[index - 1].order;
    updatedExperiences[index - 1].order = temp;
    
    // Sort by order
    const sortedExperiences = updatedExperiences.sort((a, b) => a.order - b.order);
    
    setExperienceData(prev => ({
      ...prev,
      experiences: sortedExperiences
    }));
    setHasUnsavedChanges(true);
    
    if (autoSaveEnabled) {
      debouncedSave();
    }
  };

  // Move experience down in order (less recent)
  const moveExperienceDown = (id) => {
    const index = experienceData.experiences.findIndex(exp => exp.id === id);
    if (index === -1 || index >= experienceData.experiences.length - 1) return;
    
    const updatedExperiences = [...experienceData.experiences];
    const temp = updatedExperiences[index].order;
    updatedExperiences[index].order = updatedExperiences[index + 1].order;
    updatedExperiences[index + 1].order = temp;
    
    // Sort by order
    const sortedExperiences = updatedExperiences.sort((a, b) => a.order - b.order);
    
    setExperienceData(prev => ({
      ...prev,
      experiences: sortedExperiences
    }));
    setHasUnsavedChanges(true);
    
    if (autoSaveEnabled) {
      debouncedSave();
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const [year, month] = dateString.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  // Save experience section data
  const saveExperienceSection = async () => {
    try {
      // In a real app, save to API
      // Mock successful update for demo
      console.log('Saving experience section data...', experienceData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setHasUnsavedChanges(false);
      return Promise.resolve();
    } catch (error) {
      console.error('Error saving experience section:', error);
      return Promise.reject(error);
    }
  };

  return (
    <ContentPageLayout
      title="Experience Section"
      icon={<FiBriefcase size={24} />}
      breadcrumbs={[
        { label: "Dashboard", path: "/admin" },
        { label: "Main Page", path: "/admin/main" },
        { label: "Experience" }
      ]}
      onSave={saveExperienceSection}
      hasUnsavedChanges={hasUnsavedChanges}
      autoSaveEnabled={autoSaveEnabled}
      onToggleAutoSave={() => setAutoSaveEnabled(!autoSaveEnabled)}
      previewUrl="/#experience"
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
      sectionVisible={experienceData.visible}
      onToggleSectionVisibility={toggleSectionVisibility}
    >
          {/* Basic Info Section */}
      <ContentSection 
        title="Basic Info" 
        icon={<FiBriefcase size={20} />}
        collapsible={true}
        defaultCollapsed={false}
      >
        <TextArea
          label="Introduction Text"
          id="intro"
                  value={experienceData.intro}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Brief introduction to your experience section"
                />
      </ContentSection>
          
          {/* Add New Experience */}
      <ContentSection 
        title="Add New Experience" 
        icon={<FiPlus size={20} />}
        collapsible={true}
      >
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Job Title *"
              id="title"
                    value={newExperience.title}
                    onChange={handleNewExperienceChange}
                    placeholder="e.g., UI/UX Designer"
              required
            />
            
            <TextInput
              label="Company/Organization *"
              id="company"
                    value={newExperience.company}
                    onChange={handleNewExperienceChange}
                    placeholder="e.g., Tech Solutions Inc."
              required
                  />
              </div>
              
          <TextInput
            label="Location"
            id="location"
                  value={newExperience.location}
                  onChange={handleNewExperienceChange}
                  placeholder="e.g., New York, NY"
                />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="month"
                    name="startDate"
                    value={newExperience.startDate}
                    onChange={handleNewExperienceChange}
                className="w-full px-3 py-2.5 bg-black/30 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 hover:border-gray-600"
                  />
                </div>
                
                <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                    End Date
                  </label>
                  <input
                    type="month"
                    name="endDate"
                    value={newExperience.endDate}
                    onChange={handleNewExperienceChange}
                    disabled={newExperience.current}
                className="w-full px-3 py-2.5 bg-black/30 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 hover:border-gray-600 disabled:bg-gray-900/50 disabled:text-gray-500"
                  />
                </div>
              </div>
              
          <Toggle
            label="I currently work here"
                  id="current"
                  checked={newExperience.current}
            onChange={(e) => handleNewExperienceChange({
              target: { name: 'current', type: 'checkbox', checked: e.target.checked }
            })}
          />
          
          <TextArea
            label="Description"
            id="description"
                  value={newExperience.description}
                  onChange={handleNewExperienceChange}
                  rows={4}
                  placeholder="Describe your responsibilities and achievements"
                />
          
          <TextInput
            label="Technologies/Skills Used"
            id="technologies"
                  value={newExperience.technologies}
                  onChange={handleNewExperienceChange}
                  placeholder="e.g., Figma, Adobe XD, Sketch"
            helperText="Separate technologies with commas"
                />
              
              <div className="flex justify-end">
            <Button
                  onClick={addExperience}
              disabled={!newExperience.title || !newExperience.company || !newExperience.startDate}
              icon={<FiPlus size={16} />}
                >
                  Add Experience
            </Button>
              </div>
            </div>
      </ContentSection>
          
          {/* Experience List */}
      <ContentSection 
        title="Experience List" 
        icon={<FiBriefcase size={20} />}
        collapsible={true}
      >
            {experienceData.experiences.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
                No experiences added yet. Use the form above to add your work experience.
          </div>
            ) : (
              <div className="space-y-6">
                {experienceData.experiences.map((experience, index) => (
                  <div 
                    key={experience.id} 
                className="border border-gray-800/50 bg-black/30 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                    <h3 className="text-lg font-medium text-white">
                          {experience.title} at {experience.company}
                        </h3>
                    <div className="text-sm text-gray-400">
                          {experience.location && (
                            <span className="mr-3">{experience.location}</span>
                          )}
                          <span>
                            {formatDate(experience.startDate)} - {experience.current ? 'Present' : formatDate(experience.endDate)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                    <Button
                          onClick={() => moveExperienceUp(experience.id)}
                          disabled={index === 0}
                      variant="ghost"
                      icon={<FiArrowUp size={18} />}
                      aria-label="Move up (more recent)"
                    />
                    <Button
                          onClick={() => moveExperienceDown(experience.id)}
                          disabled={index === experienceData.experiences.length - 1}
                      variant="ghost"
                      icon={<FiArrowDown size={18} />}
                      aria-label="Move down (less recent)"
                    />
                    <Button
                          onClick={() => removeExperience(experience.id)}
                      variant="ghost"
                      icon={<FiTrash size={18} />}
                      className="text-red-500 hover:text-red-400"
                      aria-label="Remove experience"
                    />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <TextInput
                    label="Job Title"
                          value={experience.title}
                          onChange={(e) => handleExperienceChange(experience.id, 'title', e.target.value)}
                  />
                  
                  <TextInput
                    label="Company/Organization"
                          value={experience.company}
                          onChange={(e) => handleExperienceChange(experience.id, 'company', e.target.value)}
                        />
                    </div>
                    
                <TextInput
                  label="Location"
                        value={experience.location}
                        onChange={(e) => handleExperienceChange(experience.id, 'location', e.target.value)}
                  className="mb-4"
                      />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                          Start Date
                        </label>
                        <input
                          type="month"
                          value={experience.startDate}
                          onChange={(e) => handleExperienceChange(experience.id, 'startDate', e.target.value)}
                      className="w-full px-3 py-2.5 bg-black/30 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 hover:border-gray-600"
                        />
                      </div>
                      
                      <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                          End Date
                        </label>
                        <input
                          type="month"
                          value={experience.endDate}
                          onChange={(e) => handleExperienceChange(experience.id, 'endDate', e.target.value)}
                          disabled={experience.current}
                      className="w-full px-3 py-2.5 bg-black/30 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 hover:border-gray-600 disabled:bg-gray-900/50 disabled:text-gray-500"
                        />
                      </div>
                    </div>
                    
                <Toggle
                  label="I currently work here"
                        checked={experience.current}
                  onChange={(e) => handleExperienceChange(
                    experience.id, 
                    'current', 
                    e.target.checked
                  )}
                  className="mb-4"
                />
                
                <TextArea
                  label="Description"
                        value={experience.description}
                        onChange={(e) => handleExperienceChange(experience.id, 'description', e.target.value)}
                        rows={4}
                  className="mb-4"
                />
                
                <TextInput
                  label="Technologies/Skills Used"
                        value={experience.technologies}
                        onChange={(e) => handleExperienceChange(experience.id, 'technologies', e.target.value)}
                      />
                  </div>
                ))}
              </div>
            )}
      </ContentSection>
    </ContentPageLayout>
  );
};

export default CMSExperiencePage; 