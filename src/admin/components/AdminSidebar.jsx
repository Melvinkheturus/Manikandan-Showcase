import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, FiGrid, FiBox, FiLayers, FiImage, FiBookOpen, 
  FiUser, FiBriefcase, FiMessageSquare, FiLink, FiPhone, 
  FiChevronDown, FiChevronRight, FiMenu, FiX
} from 'react-icons/fi';

const AdminSidebar = () => {
  const location = useLocation();
  const [mainPageExpanded, setMainPageExpanded] = useState(true);
  const [projectSectionExpanded, setProjectSectionExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Close mobile sidebar when navigating
  useEffect(() => {
    if (windowWidth < 768) {
      setIsMobileOpen(false);
    }
  }, [location.pathname, windowWidth]);
  
  // Function to check if a link is active
  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };
  
  // Menu items for Main Page section
  const mainPageMenuItems = [
    { 
      label: 'Hero Section', 
      path: '/admin/sections/hero', 
      icon: <FiHome size={18} /> 
    },
    { 
      label: 'About Me', 
      path: '/admin/sections/about', 
      icon: <FiUser size={18} /> 
    },
    { 
      label: 'Skills', 
      path: '/admin/sections/skills', 
      icon: <FiBox size={18} /> 
    },
    { 
      label: 'Project Showcase', 
      path: '/admin/sections/project-showcase', 
      icon: <FiGrid size={18} /> 
    },
    { 
      label: 'Experience', 
      path: '/admin/sections/experience', 
      icon: <FiBriefcase size={18} /> 
    },
    { 
      label: 'Testimonial', 
      path: '/admin/sections/testimonials', 
      icon: <FiMessageSquare size={18} /> 
    },
    { 
      label: 'Social Carousel', 
      path: '/admin/sections/social', 
      icon: <FiLink size={18} /> 
    },
    { 
      label: 'Contact', 
      path: '/admin/sections/contacts', 
      icon: <FiPhone size={18} /> 
    }
  ];
  
  // Menu items for Project Section
  const projectSectionMenuItems = [
    { 
      label: 'Project Gallery', 
      path: '/admin/sections/project-gallery', 
      icon: <FiGrid size={18} /> 
    },
    { 
      label: 'Project Details', 
      path: '/admin/sections/project-detail', 
      icon: <FiLayers size={18} /> 
    }
  ];

  // Mobile menu toggle
  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };
  
  const isMobile = windowWidth < 768;
  
  return (
    <>
      {/* Mobile hamburger button */}
      {isMobile && (
        <div className="fixed top-4 left-4 z-20">
          <button
            onClick={toggleMobileMenu}
            className="bg-black rounded-md p-2 text-gray-400 hover:text-emerald-400 transition-colors"
            aria-label={isMobileOpen ? "Close menu" : "Open menu"}
          >
            {isMobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      )}

      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-screen bg-black text-white flex flex-col border-r border-gray-800 shadow-lg z-30 transition-all duration-300 md:w-64
        ${isMobile 
          ? (isMobileOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full') 
          : 'w-64 translate-x-0'
        }`}
      >
        {/* Logo Area */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <span className="font-bold text-xl">PORTFOLIO CMS</span>
          {isMobile && (
            <button 
              onClick={toggleMobileMenu} 
              className="text-gray-400 hover:text-emerald-400"
            >
              <FiX size={20} />
            </button>
          )}
        </div>
        
        {/* Navigation Links */}
        <div className="flex-grow overflow-y-auto p-4 custom-scrollbar">
          <nav className="space-y-1">
            {/* Dashboard Link */}
            <Link
              to="/admin"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                location.pathname === '/admin' 
                  ? 'bg-emerald-900/60 text-emerald-400' 
                  : 'text-gray-300 hover:bg-emerald-900/30 hover:text-emerald-300'
              }`}
            >
              <FiHome className="mr-3" size={20} />
              <span>Dashboard</span>
            </Link>
            
            {/* Main Page Section (Collapsible) */}
            <div>
              <button
                onClick={() => setMainPageExpanded(!mainPageExpanded)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                  isActive('/admin/sections') && !isActive('/admin/sections/project') 
                    ? 'bg-emerald-900/60 text-emerald-400' 
                    : 'text-gray-300 hover:bg-emerald-900/30 hover:text-emerald-300'
                }`}
              >
                <div className="flex items-center">
                  <FiLayers className="mr-3" size={20} />
                  <span>Main Page</span>
                </div>
                {mainPageExpanded ? <FiChevronDown /> : <FiChevronRight />}
              </button>
              
              {/* Main Page Submenu */}
              <div className={`ml-4 mt-1 space-y-1 ${mainPageExpanded ? 'block' : 'hidden'}`}>
                {mainPageMenuItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                      isActive(item.path) 
                        ? 'bg-emerald-900/30 text-emerald-300' 
                        : 'text-gray-400 hover:bg-emerald-900/20 hover:text-emerald-200'
                    }`}
                  >
                    {item.icon}
                    <span className="ml-3 text-sm">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Project Section (Collapsible) */}
            <div>
              <button
                onClick={() => setProjectSectionExpanded(!projectSectionExpanded)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                  isActive('/admin/sections/project') 
                    ? 'bg-emerald-900/60 text-emerald-400' 
                    : 'text-gray-300 hover:bg-emerald-900/30 hover:text-emerald-300'
                }`}
              >
                <div className="flex items-center">
                  <FiGrid className="mr-3" size={20} />
                  <span>Project Section</span>
                </div>
                {projectSectionExpanded ? <FiChevronDown /> : <FiChevronRight />}
              </button>
              
              {/* Project Section Submenu */}
              <div className={`ml-4 mt-1 space-y-1 ${projectSectionExpanded ? 'block' : 'hidden'}`}>
                {projectSectionMenuItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                      isActive(item.path) 
                        ? 'bg-emerald-900/30 text-emerald-300' 
                        : 'text-gray-400 hover:bg-emerald-900/20 hover:text-emerald-200'
                    }`}
                  >
                    {item.icon}
                    <span className="ml-3 text-sm">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Assets Link */}
            <Link
              to="/admin/assets"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive('/admin/assets') 
                  ? 'bg-emerald-900/60 text-emerald-400' 
                  : 'text-gray-300 hover:bg-emerald-900/30 hover:text-emerald-300'
              }`}
            >
              <FiImage className="mr-3" size={20} />
              <span>Assets</span>
            </Link>
            
            {/* Media Guide Link */}
            <Link
              to="/admin/media-guide"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive('/admin/media-guide') 
                  ? 'bg-emerald-900/60 text-emerald-400' 
                  : 'text-gray-300 hover:bg-emerald-900/30 hover:text-emerald-300'
              }`}
            >
              <FiBookOpen className="mr-3" size={20} />
              <span>Media Guide</span>
            </Link>
          </nav>
        </div>
        
        {/* Version info */}
        <div className="p-4 border-t border-gray-800 text-xs text-gray-500">
          <p>PortfolioCMS v1.0.0</p>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobile && isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default AdminSidebar; 