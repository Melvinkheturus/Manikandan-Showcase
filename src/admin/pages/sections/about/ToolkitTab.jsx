import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash, FiX, FiMove, FiImage, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { ContentSection } from '../../../CMSHelper/ContentPageLayout';
import { supabase } from '../../../../database/supabaseClient';

const NAME_MAX_LENGTH = 30;
const CAPABILITY_MAX_LENGTH = 50;

const ToolkitTab = ({ toolkit = [], onToolkitChange }) => {
  const [selectedTool, setSelectedTool] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  // Handle adding a new tool
  const handleAddTool = () => {
    const newTool = {
      name: 'New Tool',
      icon_url: '',
      capabilities: [''],
      display_order: toolkit.length
    };
    
    const updatedToolkit = [...toolkit, newTool];
    onToolkitChange(updatedToolkit);
    setSelectedTool(updatedToolkit.length - 1);
  };
  
  // Handle removing a tool
  const handleRemoveTool = (indexToRemove) => {
    const updatedToolkit = toolkit.filter((_, index) => index !== indexToRemove);
    onToolkitChange(updatedToolkit);
    if (selectedTool === indexToRemove) {
      setSelectedTool(null);
    } else if (selectedTool > indexToRemove) {
      setSelectedTool(selectedTool - 1);
    }
  };
  
  // Handle tool name change
  const handleNameChange = (e, index) => {
    const value = e.target.value.slice(0, NAME_MAX_LENGTH);
    const updatedToolkit = [...toolkit];
    updatedToolkit[index] = {
      ...updatedToolkit[index],
      name: value
    };
    onToolkitChange(updatedToolkit);
  };
  
  // Handle capability text change
  const handleCapabilityChange = (capabilityIndex, value, toolIndex) => {
    const trimmedValue = value.slice(0, CAPABILITY_MAX_LENGTH);
    const updatedToolkit = [...toolkit];
    updatedToolkit[toolIndex].capabilities[capabilityIndex] = trimmedValue;
    onToolkitChange(updatedToolkit);
  };
  
  // Add new capability
  const handleAddCapability = (toolIndex) => {
    const updatedToolkit = [...toolkit];
    updatedToolkit[toolIndex].capabilities.push('');
    onToolkitChange(updatedToolkit);
  };
  
  // Remove capability
  const handleRemoveCapability = (capabilityIndex, toolIndex) => {
    const updatedToolkit = [...toolkit];
    updatedToolkit[toolIndex].capabilities.splice(capabilityIndex, 1);
    onToolkitChange(updatedToolkit);
  };
  
  // Move tool up in order
  const handleMoveUp = (index) => {
    if (index === 0) return;
    const updatedToolkit = [...toolkit];
    [updatedToolkit[index - 1], updatedToolkit[index]] = [updatedToolkit[index], updatedToolkit[index - 1]];
    
    // Update display orders
    updatedToolkit[index - 1].display_order = index - 1;
    updatedToolkit[index].display_order = index;
    
    onToolkitChange(updatedToolkit);
    setSelectedTool(index - 1);
  };
  
  // Move tool down in order
  const handleMoveDown = (index) => {
    if (index === toolkit.length - 1) return;
    const updatedToolkit = [...toolkit];
    [updatedToolkit[index], updatedToolkit[index + 1]] = [updatedToolkit[index + 1], updatedToolkit[index]];
    
    // Update display orders
    updatedToolkit[index].display_order = index;
    updatedToolkit[index + 1].display_order = index + 1;
    
    onToolkitChange(updatedToolkit);
    setSelectedTool(index + 1);
  };
  
  // Handle file upload
  const handleFileUpload = async (e, toolIndex) => {
    try {
      setUploading(true);
      
      const file = e.target.files[0];
      if (!file) return;
      
      // Validate file type
      const fileExt = file.name.split('.').pop();
      const allowedTypes = ['png', 'svg'];
      
      if (!allowedTypes.includes(fileExt.toLowerCase())) {
        alert('Only PNG and SVG files are allowed');
        return;
      }
      
      // Create a unique file name
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('toolkit-icons')
        .upload(fileName, file);
      
      if (error) throw error;
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('toolkit-icons')
        .getPublicUrl(fileName);
      
      // Update tool with new icon URL
      const updatedToolkit = [...toolkit];
      updatedToolkit[toolIndex] = {
        ...updatedToolkit[toolIndex],
        icon_url: publicUrlData.publicUrl
      };
      
      onToolkitChange(updatedToolkit);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Left panel - Tool list */}
      <div className="col-span-12 lg:col-span-4">
        <ContentSection
          title="Your Tools"
          icon="🧰"
          collapsible={false}
        >
          <div className="space-y-4">
            <button
              onClick={handleAddTool}
              className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center justify-center"
            >
              <FiPlus className="mr-2" />
              Add New Tool
            </button>
            
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {toolkit.length === 0 ? (
                <p className="text-gray-500 text-sm italic text-center py-6">
                  No tools added yet. Add your first tool above.
                </p>
              ) : (
                <AnimatePresence>
                  {toolkit.map((tool, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedTool === index 
                          ? 'bg-emerald-900/40 border border-emerald-700/50' 
                          : 'bg-gray-800/50 hover:bg-gray-800/80 border border-gray-700/20'
                      }`}
                      onClick={() => setSelectedTool(index)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 flex items-center justify-center bg-gray-900/50 rounded-md">
                          {tool.icon_url ? (
                            <img 
                              src={tool.icon_url} 
                              alt={tool.name}
                              className="w-6 h-6 object-contain" 
                            />
                          ) : (
                            <FiImage className="text-gray-500" />
                          )}
                        </div>
                        <span className={`font-medium ${selectedTool === index ? 'text-emerald-400' : 'text-white'}`}>
                          {tool.name || 'Unnamed Tool'}
                        </span>
                      </div>
                      
                      <div className="flex space-x-1">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveUp(index);
                          }}
                          disabled={index === 0}
                          className="p-1.5 text-gray-400 hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed"
                        >
                          <FiArrowUp size={14} />
                        </button>
                        
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveDown(index);
                          }}
                          disabled={index === toolkit.length - 1}
                          className="p-1.5 text-gray-400 hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed"
                        >
                          <FiArrowDown size={14} />
                        </button>
                        
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveTool(index);
                          }}
                          className="p-1.5 text-red-400 hover:text-red-500"
                        >
                          <FiTrash size={14} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </ContentSection>
      </div>
      
      {/* Right panel - Tool details */}
      <div className="col-span-12 lg:col-span-8">
        {selectedTool !== null && toolkit[selectedTool] && (
          <ContentSection
            title="Tool Details"
            icon="⚙️"
            collapsible={false}
          >
            <div className="space-y-6">
              {/* Tool name and icon */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-8">
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Tool Name
                  </label>
                  <input
                    type="text"
                    value={toolkit[selectedTool].name || ''}
                    onChange={(e) => handleNameChange(e, selectedTool)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 focus:border-emerald-500 focus:ring focus:ring-emerald-500/20 transition-colors text-white"
                    placeholder="e.g. Figma, React, Photoshop"
                  />
                  <div className="text-xs text-gray-400 mt-1">
                    {NAME_MAX_LENGTH - (toolkit[selectedTool].name?.length || 0)} characters left
                  </div>
                </div>
                
                <div className="md:col-span-4">
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Icon
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-md bg-gray-900/70 flex items-center justify-center overflow-hidden border border-gray-700">
                      {toolkit[selectedTool].icon_url ? (
                        <img 
                          src={toolkit[selectedTool].icon_url}
                          alt={toolkit[selectedTool].name}
                          className="w-8 h-8 object-contain"
                        />
                      ) : (
                        <FiImage size={20} className="text-gray-500" />
                      )}
                    </div>
                    
                    <div>
                      <input
                        type="file"
                        id="icon-upload"
                        accept=".png,.svg"
                        onChange={(e) => handleFileUpload(e, selectedTool)}
                        className="hidden"
                        disabled={uploading}
                      />
                      <label
                        htmlFor="icon-upload"
                        className={`inline-block px-3 py-2 text-sm font-medium rounded-lg cursor-pointer
                          ${uploading
                            ? 'bg-gray-700 text-gray-400'
                            : 'bg-emerald-700/50 text-emerald-300 hover:bg-emerald-700/70'
                          } transition-colors`}
                      >
                        {uploading ? 'Uploading...' : 'Upload Icon'}
                      </label>
                      <div className="text-xs text-gray-400 mt-1">
                        PNG or SVG only
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Capabilities */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-200">
                    Capabilities
                  </label>
                  <button
                    onClick={() => handleAddCapability(selectedTool)}
                    className="flex items-center text-xs font-medium px-2 py-1 bg-emerald-900/30 text-emerald-400 rounded hover:bg-emerald-900/50"
                  >
                    <FiPlus size={12} className="mr-1" />
                    Add Capability
                  </button>
                </div>
                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                  {toolkit[selectedTool].capabilities?.length > 0 ? (
                    toolkit[selectedTool].capabilities.map((capability, capIndex) => (
                      <div key={capIndex} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={capability}
                          onChange={(e) => handleCapabilityChange(capIndex, e.target.value, selectedTool)}
                          className="flex-grow px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 focus:border-emerald-500 focus:ring focus:ring-emerald-500/20 transition-colors text-white"
                          placeholder="e.g. Rapid Prototyping, Wireframing"
                        />
                        <button
                          onClick={() => handleRemoveCapability(capIndex, selectedTool)}
                          className="p-2 text-red-400 hover:text-red-500 bg-gray-900/50 rounded-lg"
                        >
                          <FiX size={16} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm italic py-2">
                      No capabilities added. Add your first capability using the button above.
                    </p>
                  )}
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  Each capability can be up to {CAPABILITY_MAX_LENGTH} characters.
                </div>
              </div>
            </div>
          </ContentSection>
        )}
        
        {selectedTool === null && (
          <div className="flex flex-col items-center justify-center h-full bg-black/20 rounded-xl border border-gray-800/40 p-10">
            <FiMove size={40} className="text-gray-600 mb-4" />
            <h3 className="text-xl font-medium text-gray-400 mb-2">No Tool Selected</h3>
            <p className="text-gray-500 text-center">
              Select a tool from the left panel or add a new one to edit its details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolkitTab; 