import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSettings, FiUser, FiLogOut, FiExternalLink } from 'react-icons/fi';

const AdminTopbar = ({ userName = 'Admin' }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  
  return (
    <div className="bg-black border-b border-gray-800 py-3 px-6 flex justify-between items-center shadow-md z-10">
      {/* Welcome Text - moved to left */}
      <div className="flex items-center">
        <span className="text-gray-300">
          Welcome, {userName}
        </span>
      </div>

      <div className="flex items-center">
        {/* View Site Link - new */}
        <a 
          href="/"
          target="_blank"
          rel="noopener noreferrer" 
          className="text-gray-400 hover:text-emerald-400 flex items-center mr-6"
          title="View Site"
        >
          <FiExternalLink className="mr-2" size={16} />
          <span>View Site</span>
        </a>
        
        {/* Settings Link */}
        <Link 
          to="/admin/settings" 
          className="text-gray-400 hover:text-emerald-400 p-2 rounded-full hover:bg-black/40 transition-colors mr-4"
          title="Settings"
        >
          <FiSettings size={20} />
        </Link>
        
        {/* User Profile Dropdown - removed arrow, circle is now clickable */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center text-gray-300 hover:text-emerald-400 rounded-full transition-colors focus:outline-none"
            title="Profile Menu"
          >
            <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white">
              {userName.charAt(0).toUpperCase()}
            </div>
          </button>
          
          {/* Dropdown Menu */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-black border border-gray-800 rounded-md shadow-lg z-10">
              <div className="py-1">
                <Link
                  to="/admin/profile"
                  className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-900 hover:text-emerald-400"
                  onClick={() => setProfileOpen(false)}
                >
                  <FiUser className="mr-3" size={16} />
                  View Profile
                </Link>
                <a
                  href="/admin/logout"
                  className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-900 hover:text-emerald-400"
                  onClick={(e) => {
                    e.preventDefault();
                    // Add logout logic here
                    setProfileOpen(false);
                  }}
                >
                  <FiLogOut className="mr-3" size={16} />
                  Logout
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTopbar; 