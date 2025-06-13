import React, { useState, useEffect, useCallback } from 'react';
import { FiSave, FiPlus, FiTrash, FiMove } from 'react-icons/fi';
import Toaster from '../../components/Toaster';
import { Tab } from '@headlessui/react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { motion } from 'framer-motion';
import ContentPageLayout, { ContentSection } from '../../CMSHelper/ContentPageLayout';

const CMSSkillsPage = () => {
  // State for skills section data
  const [skillsData, setSkillsData] = useState({
    categories: []
  });
  
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Load skills data
  useEffect(() => {
    const fetchSkillsData = async () => {
      setIsLoading(true);
      try {
        // In a real app, fetch from API
        // Mock data for demo purposes
        setTimeout(() => {
          setSkillsData({
            categories: [
              {
                id: "1",
                name: "Design",
                iconUrl: "https://example.com/design.svg",
                color: "#FF5757",
                sortOrder: 0,
                skills: [
                  { id: "101", name: "Figma", iconUrl: "https://example.com/figma.svg", color: "#FFC75F", badge: "Advanced", side: "left", sortOrder: 0 },
                  { id: "102", name: "Canva", iconUrl: "https://example.com/canva.svg", color: "#5FBDFF", badge: "Advanced", side: "right", sortOrder: 1 },
                  { id: "103", name: "Illustrator", iconUrl: "https://example.com/illustrator.svg", color: "#FF5757", badge: "Intermediate", side: "left", sortOrder: 2 }
                ]
              },
              {
                id: "2",
                name: "AI & No-Code Tools",
                iconUrl: "https://example.com/ai.svg",
                color: "#5FBDFF",
                sortOrder: 1,
                skills: [
                  { id: "201", name: "Cursor AI", iconUrl: "https://example.com/cursor.svg", color: "#90EE90", badge: "Expert", side: "left", sortOrder: 0 },
                  { id: "202", name: "FlutterFlow", iconUrl: "https://example.com/flutterflow.svg", color: "#F875AA", badge: "Intermediate", side: "right", sortOrder: 1 }
                ]
              },
              {
                id: "3",
                name: "Development",
                iconUrl: "https://example.com/dev.svg",
                color: "#90EE90",
                sortOrder: 2,
            skills: [
                  { id: "301", name: "React", iconUrl: "https://example.com/react.svg", color: "#5FBDFF", badge: "Learning", side: "left", sortOrder: 0 },
                  { id: "302", name: "HTML/CSS", iconUrl: "https://example.com/html.svg", color: "#FF5757", badge: "Intermediate", side: "right", sortOrder: 1 }
                ]
              }
            ]
          });
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching skills data:', error);
        setToast({
          show: true,
          message: 'Failed to load skills section data',
          type: 'error'
        });
        setIsLoading(false);
      }
    };

    fetchSkillsData();
  }, []);

  // Save skills section data
  const saveSkillsSection = async () => {
    setIsLoading(true);
    try {
      // In a real app, save to API
      // Mock successful update for demo
      setTimeout(() => {
        setIsLoading(false);
        setToast({
          show: true,
          message: 'Skills section updated successfully!',
          type: 'success'
        });
      }, 800);
    } catch (error) {
      console.error('Error saving skills section:', error);
      setToast({
        show: true,
        message: 'Failed to save skills section',
        type: 'error'
      });
      setIsLoading(false);
    }
  };

  const badgeOptions = [
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' },
    { value: 'Expert', label: 'Expert' },
    { value: 'Learning', label: 'Learning' },
    { value: 'AI', label: 'AI' }
  ];

  const sideOptions = [
    { value: 'left', label: 'Left' },
    { value: 'right', label: 'Right' }
  ];

  // Handler for category input changes
  const handleCategoryChange = (categoryId, field, value) => {
    setSkillsData(prev => ({
      ...prev,
      categories: prev.categories.map(category => 
        category.id === categoryId 
          ? { ...category, [field]: value }
          : category
      )
    }));
  };

  // Handler for skill input changes
  const handleSkillChange = (categoryId, skillId, field, value) => {
    setSkillsData(prev => ({
      ...prev,
      categories: prev.categories.map(category => 
        category.id === categoryId 
          ? {
              ...category,
              skills: category.skills.map(skill => 
                skill.id === skillId 
                  ? { ...skill, [field]: value }
                  : skill
              )
            }
          : category
      )
    }));
  };

  // Add a new category
  const addCategory = () => {
    const newOrder = skillsData.categories.length > 0 
      ? Math.max(...skillsData.categories.map(c => c.sortOrder)) + 1 
      : 0;
      
    const newCategory = {
      id: `new-category-${Date.now()}`,
      name: "New Category",
      iconUrl: "",
      color: "#FFFFFF",
      sortOrder: newOrder,
      skills: []
    };
    
    setSkillsData(prev => ({
      ...prev,
      categories: [...prev.categories, newCategory]
    }));
    
    // Switch to the new category's tab
    setActiveTab(skillsData.categories.length);
  };

  // Remove a category
  const removeCategory = (categoryId) => {
    if (!confirm('Are you sure you want to delete this category? All skills within it will also be deleted.')) {
      return;
    }
    
    setSkillsData(prev => ({
      ...prev,
      categories: prev.categories.filter(category => category.id !== categoryId)
    }));
    
    // Adjust the active tab if necessary
    if (activeTab >= skillsData.categories.length - 1) {
      setActiveTab(Math.max(0, skillsData.categories.length - 2));
    }
  };

  // Add a new skill to a category
  const addSkill = (categoryId) => {
    const category = skillsData.categories.find(c => c.id === categoryId);
    if (!category) return;
    
    const newOrder = category.skills.length > 0
      ? Math.max(...category.skills.map(s => s.sortOrder)) + 1
      : 0;
    
    const newSkill = {
      id: `new-skill-${Date.now()}`,
      name: "New Skill",
      iconUrl: "",
      color: category.color || "#FFFFFF",
      badge: "Intermediate",
      side: "left",
      sortOrder: newOrder
    };
    
    setSkillsData(prev => ({
      ...prev,
      categories: prev.categories.map(c => 
        c.id === categoryId
          ? { ...c, skills: [...c.skills, newSkill] }
          : c
      )
    }));
  };

  // Remove a skill from a category
  const removeSkill = (categoryId, skillId) => {
    setSkillsData(prev => ({
      ...prev,
      categories: prev.categories.map(category => 
        category.id === categoryId
          ? {
              ...category,
              skills: category.skills.filter(skill => skill.id !== skillId)
            }
          : category
      )
    }));
  };

  // Handle file upload for icons
  const handleIconUpload = async (categoryId, skillId = null, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real app, you would upload the file to a storage service like Supabase or Cloudinary
    // For demo, we'll create a fake URL
    const fakeUrl = URL.createObjectURL(file);
    
    if (skillId) {
      // Update skill icon
      handleSkillChange(categoryId, skillId, 'iconUrl', fakeUrl);
    } else {
      // Update category icon
      handleCategoryChange(categoryId, 'iconUrl', fakeUrl);
    }
    
    // Showing a success toast
    setToast({
      show: true,
      message: 'Icon uploaded successfully!',
      type: 'success'
    });
  };

  // DnD sensors configuration
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle category reordering
  const handleCategoryDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setSkillsData(prev => {
        const oldIndex = prev.categories.findIndex(c => c.id === active.id);
        const newIndex = prev.categories.findIndex(c => c.id === over.id);
        
        const newCategories = arrayMove(prev.categories, oldIndex, newIndex);
        
        // Update sortOrder values
        return {
          ...prev,
          categories: newCategories.map((category, index) => ({
            ...category,
            sortOrder: index
          }))
        };
      });
    }
  };

  // Handle skill reordering within a category
  const handleSkillDragEnd = (categoryId) => (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setSkillsData(prev => {
        const category = prev.categories.find(c => c.id === categoryId);
        if (!category) return prev;
        
        const oldIndex = category.skills.findIndex(s => s.id === active.id);
        const newIndex = category.skills.findIndex(s => s.id === over.id);
        
        const newSkills = arrayMove(category.skills, oldIndex, newIndex);
        
        // Update sortOrder values
        return {
          ...prev,
          categories: prev.categories.map(c => 
            c.id === categoryId
              ? {
                  ...c,
                  skills: newSkills.map((skill, index) => ({
                    ...skill,
                    sortOrder: index
                  }))
                }
              : c
          )
        };
      });
    }
  };

  // Sortable Category component
  const SortableCategory = ({ category }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition
    } = useSortable({ id: category.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition
    };

  return (
      <div 
        ref={setNodeRef} 
        style={style}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6"
      >
        <div className="flex flex-wrap justify-between items-start gap-4 border-b dark:border-gray-700 pb-4 mb-4">
          <div className="flex-grow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  value={category.name}
                  onChange={(e) => handleCategoryChange(category.id, 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category Color
                </label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={category.color}
                    onChange={(e) => handleCategoryChange(category.id, 'color', e.target.value)}
                    className="h-10 w-10 rounded border border-gray-300 dark:border-gray-600"
                  />
                  <input
                    type="text"
                    value={category.color}
                    onChange={(e) => handleCategoryChange(category.id, 'color', e.target.value)}
                    className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white font-mono"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category Icon
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 h-12 w-12 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden border border-gray-300 dark:border-gray-600">
                  {category.iconUrl ? (
                    <img 
                      src={category.iconUrl} 
                      alt={category.name} 
                      className="h-10 w-10 object-contain"
                    />
                  ) : (
                    <span className="text-gray-400 text-xs text-center">No Icon</span>
                  )}
                </div>
                
                <label className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-sm font-medium cursor-pointer">
                  Upload Icon
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/png,image/svg+xml"
                    onChange={(e) => handleIconUpload(category.id, null, e)}
                  />
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              {...attributes}
              {...listeners}
              className="flex items-center justify-center p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 cursor-move"
              title="Drag to reorder"
            >
              <FiMove size={18} />
            </button>
            
            <button
              onClick={() => removeCategory(category.id)}
              className="flex items-center justify-center p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50"
              title="Delete category"
            >
              <FiTrash size={18} />
            </button>
          </div>
        </div>
        
        {/* Skills for this category */}
        <div>
            <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white">Skills</h3>
              <button
              onClick={() => addSkill(category.id)}
                className="flex items-center px-3 py-1 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 text-sm"
              >
                <FiPlus className="mr-1" size={14} />
                Add Skill
              </button>
            </div>
            
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleSkillDragEnd(category.id)}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={category.skills.map(skill => skill.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {category.skills.length === 0 ? (
                  <p className="py-4 text-center text-gray-500 dark:text-gray-400">
                    No skills added yet. Click "Add Skill" to get started.
                  </p>
                ) : (
                  category.skills.map((skill) => (
                    <SortableSkill 
                      key={skill.id}
                      skill={skill}
                      categoryId={category.id}
                      badgeOptions={badgeOptions}
                      sideOptions={sideOptions}
                      handleSkillChange={handleSkillChange}
                      handleIconUpload={handleIconUpload}
                      removeSkill={removeSkill}
                    />
                  ))
                )}
              </div>
            </SortableContext>
          </DndContext>
                          </div>
                        </div>
    );
  };

  // Sortable Skill component
  const SortableSkill = ({ skill, categoryId, badgeOptions, sideOptions, handleSkillChange, handleIconUpload, removeSkill }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition
    } = useSortable({ id: skill.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition
    };

    // Generate badge style based on the selected badge
    const getBadgeStyle = (badgeValue) => {
      switch (badgeValue) {
        case 'Beginner':
          return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
        case 'Intermediate':
          return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
        case 'Advanced':
          return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
        case 'Expert':
          return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
        case 'Learning':
          return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
        case 'AI':
          return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
        default:
          return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      }
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
      >
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div className="w-full md:w-auto flex-grow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">
                  Skill Name
                </label>
                        <input
                          type="text"
                          value={skill.name}
                  onChange={(e) => handleSkillChange(categoryId, skill.id, 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">
                  Badge
                </label>
                <div className="flex">
                        <select
                    value={skill.badge}
                    onChange={(e) => handleSkillChange(categoryId, skill.id, 'badge', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  >
                    {badgeOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                  
                  <div className="ml-2 flex items-center">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getBadgeStyle(skill.badge)}`}>
                      {skill.badge}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">
                  Color
                </label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={skill.color}
                    onChange={(e) => handleSkillChange(categoryId, skill.id, 'color', e.target.value)}
                    className="h-9 w-9 rounded border border-gray-300 dark:border-gray-600"
                  />
                  <input
                    type="text"
                    value={skill.color}
                    onChange={(e) => handleSkillChange(categoryId, skill.id, 'color', e.target.value)}
                    className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">
                  Position
                </label>
                        <select
                  value={skill.side}
                  onChange={(e) => handleSkillChange(categoryId, skill.id, 'side', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                >
                  {sideOptions.map(option => (
                            <option key={option.value} value={option.value}>
                      {option.label} Column
                            </option>
                          ))}
                        </select>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">
                Skill Icon
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 h-10 w-10 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden border border-gray-300 dark:border-gray-600">
                  {skill.iconUrl ? (
                    <img 
                      src={skill.iconUrl} 
                      alt={skill.name} 
                      className="h-8 w-8 object-contain"
                    />
                  ) : (
                    <span className="text-gray-400 text-xs text-center">No Icon</span>
                  )}
                </div>
                
                <label className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-xs cursor-pointer">
                  Upload Icon
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/png,image/svg+xml"
                    onChange={(e) => handleIconUpload(categoryId, skill.id, e)}
                  />
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              {...attributes}
              {...listeners}
              className="flex items-center justify-center p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 cursor-move"
              title="Drag to reorder"
            >
              <FiMove size={16} />
            </button>
            
            <button
              onClick={() => removeSkill(categoryId, skill.id)}
              className="flex items-center justify-center p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50"
              title="Delete skill"
            >
              <FiTrash size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ContentPageLayout title="Skills Section">
      <div className="space-y-6">
        {/* Add Category Button */}
        <div className="flex justify-end">
                        <button
            onClick={addCategory}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
            <FiPlus className="mr-2" />
            Add Category
                        </button>
        </div>

        {isLoading ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="mt-2 text-gray-700 dark:text-gray-300">Loading skills data...</p>
          </div>
        ) : skillsData.categories.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <p className="text-lg text-gray-700 dark:text-gray-300">No skill categories yet.</p>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Click "Add Category" to create your first skill category.
            </p>
          </div>
        ) : (
          <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
            <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 dark:bg-gray-800 p-1 overflow-x-auto">
              {skillsData.categories.map((category) => (
                <Tab
                  key={category.id}
                  className={({ selected }) =>
                    `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-colors whitespace-nowrap
                     ${
                       selected
                         ? 'bg-white dark:bg-gray-700 shadow text-emerald-600 dark:text-emerald-400'
                         : 'text-gray-700 dark:text-gray-400 hover:bg-white/[0.12] dark:hover:bg-gray-700/[0.5]'
                     }
                    `
                  }
                >
                  {category.name}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className="mt-4">
              {skillsData.categories.map((category) => (
                <Tab.Panel key={category.id}>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleCategoryDragEnd}
                    modifiers={[restrictToVerticalAxis]}
                  >
                    <SortableContext
                      items={skillsData.categories.map(c => c.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <SortableCategory category={category} />
                    </SortableContext>
                  </DndContext>
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={saveSkillsSection}
            disabled={isLoading}
            className="flex items-center px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:bg-gray-400 font-medium"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <FiSave className="mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Toast Notification */}
      <Toaster 
        show={toast.show} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({...toast, show: false})} 
      />
    </ContentPageLayout>
  );
};

export default CMSSkillsPage; 