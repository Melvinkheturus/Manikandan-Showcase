import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiPlus } from 'react-icons/fi';
import { ContentSection } from '../../../CMSHelper/ContentPageLayout';

const BIO_MAX_LENGTH = 500;
const ROLE_MAX_LENGTH = 30;

const CreatorTab = ({ bio, roles = [], onBioChange, onRolesChange }) => {
  const [newRole, setNewRole] = useState('');
  const [bioCharsLeft, setBioCharsLeft] = useState(BIO_MAX_LENGTH - (bio?.length || 0));
  
  // Handle bio text change
  const handleBioChange = (e) => {
    const text = e.target.value;
    if (text.length <= BIO_MAX_LENGTH) {
      onBioChange(text);
      setBioCharsLeft(BIO_MAX_LENGTH - text.length);
    }
  };
  
  // Add a new role tag
  const handleAddRole = () => {
    if (newRole && newRole.trim().length > 0 && newRole.length <= ROLE_MAX_LENGTH) {
      const updatedRoles = [...roles, newRole.trim()];
      onRolesChange(updatedRoles);
      setNewRole('');
    }
  };
  
  // Remove a role tag
  const handleRemoveRole = (indexToRemove) => {
    const updatedRoles = roles.filter((_, index) => index !== indexToRemove);
    onRolesChange(updatedRoles);
  };
  
  // Handle enter key press to add a role
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddRole();
    }
  };
  
  return (
    <div className="space-y-6">
      <ContentSection 
        title="Who Am I"
        icon="👤"
        collapsible={true}
        defaultCollapsed={false}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-200 mb-1">
              Your "Who am I" paragraph
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={handleBioChange}
              rows={6}
              className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 focus:border-emerald-500 focus:ring focus:ring-emerald-500/20 transition-colors text-white"
              placeholder="Tell your story and what makes you unique as a creator..."
            />
            <div className={`flex justify-end mt-1 text-xs ${bioCharsLeft < 50 ? 'text-amber-400' : 'text-gray-400'}`}>
              {bioCharsLeft} characters left
            </div>
          </div>
        </div>
      </ContentSection>
      
      <ContentSection
        title="Your Roles & Titles"
        icon="🎭"
        collapsible={true}
        defaultCollapsed={false}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="roles" className="block text-sm font-medium text-gray-200 mb-1">
              Add your professional roles and titles
            </label>
            <p className="text-xs text-gray-400 mb-3">
              These will appear in a scrolling animation on your about page. Each tag should be concise.
            </p>
            
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value.slice(0, ROLE_MAX_LENGTH))}
                onKeyPress={handleKeyPress}
                className="flex-grow px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 focus:border-emerald-500 focus:ring focus:ring-emerald-500/20 transition-colors text-white"
                placeholder="e.g. UI/UX Designer"
              />
              <button
                onClick={handleAddRole}
                disabled={!newRole.trim()}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-700 disabled:text-gray-500 transition-colors flex items-center"
              >
                <FiPlus className="mr-1" />
                Add
              </button>
            </div>
            
            <div className="text-xs text-gray-400 mt-1">
              {ROLE_MAX_LENGTH - newRole.length} characters left
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-3">
            {roles.map((role, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="group flex items-center bg-emerald-900/30 border border-emerald-700/30 text-emerald-400 px-3 py-1.5 rounded-full text-sm font-medium"
              >
                <span>{role}</span>
                <button
                  onClick={() => handleRemoveRole(index)}
                  className="ml-2 text-emerald-400/70 hover:text-emerald-300 transition-colors"
                >
                  <FiX size={16} />
                </button>
              </motion.div>
            ))}
            {roles.length === 0 && (
              <p className="text-gray-500 text-sm italic">No roles added yet. Add your first role above.</p>
            )}
          </div>
        </div>
      </ContentSection>
    </div>
  );
};

export default CreatorTab; 