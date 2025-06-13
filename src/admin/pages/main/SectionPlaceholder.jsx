import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiEdit, FiEyeOff, FiTrash2 } from 'react-icons/fi';

export default function SectionPlaceholder({ sectionName }) {
  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link
            to="/admin"
            className="p-2 rounded-full bg-gray-800/60 hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <FiArrowLeft size={18} />
          </Link>
          <h1 className="text-2xl font-bold text-white">{sectionName}</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-lg bg-gray-800/70 hover:bg-gray-800 text-gray-400 hover:text-white transition-colors flex items-center">
            <FiEyeOff className="mr-2" />
            <span>Disable Section</span>
          </button>
          <button className="p-2 rounded-lg bg-emerald-600/90 hover:bg-emerald-600 text-white transition-colors">
            Save Changes
          </button>
        </div>
      </div>
      
      {/* Content placeholder */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/30 overflow-hidden">
        <div className="p-8 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mb-4 text-2xl">
            {getSectionIcon(sectionName)}
          </div>
          <h2 className="text-xl font-medium text-white mb-2">{sectionName} Editor</h2>
          <p className="text-gray-400 mb-6 max-w-lg">
            This section editor is being developed. Soon you'll be able to customize your {sectionName.toLowerCase()} section here.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
            <div className="bg-gray-800/70 p-5 rounded-lg border border-gray-700/50">
              <h3 className="text-lg font-medium text-white mb-2">Preview</h3>
              <p className="text-gray-400 text-sm">
                View how this section appears on your site.
              </p>
              <Link 
                to="/" 
                target="_blank"
                className="mt-4 inline-flex items-center text-emerald-400 hover:text-emerald-300 text-sm"
              >
                View Section
              </Link>
            </div>
            
            <div className="bg-gray-800/70 p-5 rounded-lg border border-gray-700/50">
              <h3 className="text-lg font-medium text-white mb-2">Settings</h3>
              <p className="text-gray-400 text-sm">
                Configure visibility and display options.
              </p>
              <button 
                className="mt-4 inline-flex items-center text-emerald-400 hover:text-emerald-300 text-sm"
              >
                <FiEdit className="mr-1" /> Edit Settings
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Help text */}
      <div className="bg-gray-800/30 rounded-lg p-4 text-gray-400 text-sm border border-gray-700/20">
        <div className="flex items-start">
          <div className="text-amber-400 mr-3 mt-0.5">ℹ️</div>
          <div>
            <p className="text-gray-300 font-medium mb-1">About {sectionName} Section</p>
            <p>
              The {sectionName.toLowerCase()} section is an important part of your portfolio. 
              Customize it to highlight your {getHelpText(sectionName)}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions for section-specific content
function getSectionIcon(sectionName) {
  const icons = {
    'Hero': '🚀',
    'Hero Section': '🚀',
    'About Me': '👤',
    'Skills': '🎯',
    'Projects': '⭐',
    'Featured Projects': '⭐',
    'Experience': '💼',
    'Contact': '☎️'
  };
  
  return icons[sectionName] || '📄';
}

function getHelpText(sectionName) {
  const sectionLower = sectionName.toLowerCase();
  
  if (sectionLower.includes('hero')) {
    return 'personal brand and make a strong first impression';
  } else if (sectionLower.includes('about')) {
    return 'background, personality, and professional journey';
  } else if (sectionLower.includes('skill')) {
    return 'technical abilities and expertise';
  } else if (sectionLower.includes('project')) {
    return 'best work and professional achievements';
  } else if (sectionLower.includes('experience')) {
    return 'professional history and career milestones';
  } else if (sectionLower.includes('contact')) {
    return 'contact information and availability';
  }
  
  return 'unique qualities and professional information';
} 