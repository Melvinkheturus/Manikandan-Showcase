import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { FiLayers, FiHome, FiUser, FiBriefcase, FiBox, FiGrid, FiLink, FiMessageSquare, FiPhone } from 'react-icons/fi';

// Import section components
import CMSHeroPage from './sections/CMSHeroPage';
import CMSAboutPage from './sections/CMSAboutPage';
import CMSExperiencePage from './sections/CMSExperiencePage';
import CMSSkillsPage from './sections/CMSSkillsPage';
import CMSProjectShowcase from './sections/CMSProjectShowcase';
import CMSProjectGallery from './sections/CMSProjectGallery';
import CMSProjectDetail from './sections/CMSProjectDetail';
import CMSProjectGalleryForm from './sections/CMSProjectGalleryForm';
import CMSSocialCarousel from './sections/CMSSocialCarousel';
import CMSTestimonials from './sections/CMSTestimonials';
import CMSContacts from './sections/CMSContacts';

// Section data for the dashboard
const sections = [
  { 
    id: 'hero', 
    title: 'Hero Section', 
    description: 'Configure the main hero/landing section',
    icon: <FiHome size={24} />,
    component: CMSHeroPage,
    path: '/admin/sections/hero'
  },
  { 
    id: 'about', 
    title: 'About Section', 
    description: 'Edit your personal information and bio',
    icon: <FiUser size={24} />,
    component: CMSAboutPage,
    path: '/admin/sections/about'
  },
  { 
    id: 'experience', 
    title: 'Experience Section', 
    description: 'Manage your work experience entries',
    icon: <FiBriefcase size={24} />,
    component: CMSExperiencePage,
    path: '/admin/sections/experience'
  },
  { 
    id: 'skills', 
    title: 'Skills Section', 
    description: 'Update your skills and technologies',
    icon: <FiBox size={24} />,
    component: CMSSkillsPage,
    path: '/admin/sections/skills'
  },
  { 
    id: 'project-showcase', 
    title: 'Project Showcase', 
    description: 'Configure the featured projects section',
    icon: <FiGrid size={24} />,
    component: CMSProjectShowcase,
    path: '/admin/sections/project-showcase'
  },
  { 
    id: 'project-gallery', 
    title: 'Project Gallery', 
    description: 'Manage the projects gallery layout',
    icon: <FiGrid size={24} />,
    component: CMSProjectGallery,
    path: '/admin/sections/project-gallery'
  },
  { 
    id: 'project-detail', 
    title: 'Project Detail Template', 
    description: 'Configure the project detail template',
    icon: <FiBox size={24} />,
    component: CMSProjectDetail,
    path: '/admin/sections/project-detail'
  },
  { 
    id: 'social', 
    title: 'Social Carousel', 
    description: 'Edit your social media links',
    icon: <FiLink size={24} />,
    component: CMSSocialCarousel,
    path: '/admin/sections/social'
  },
  { 
    id: 'testimonials', 
    title: 'Testimonials', 
    description: 'Manage testimonials and reviews',
    icon: <FiMessageSquare size={24} />,
    component: CMSTestimonials,
    path: '/admin/sections/testimonials'
  },
  { 
    id: 'contacts', 
    title: 'Contacts Section', 
    description: 'Edit your contact information',
    icon: <FiPhone size={24} />,
    component: CMSContacts,
    path: '/admin/sections/contacts'
  }
];

const PageSections = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route index element={
        <SectionsList sections={sections} />
      } />
      
      {/* Create routes for each section */}
      {sections.map(section => (
        <Route 
          key={section.id}
          path={section.id}
          element={<section.component />}
        />
      ))}
      
      {/* Additional project routes */}
      <Route path="project-detail/:projectId" element={<CMSProjectDetail />} />
      <Route path="project-gallery/new" element={<CMSProjectGalleryForm />} />
      <Route path="project-gallery/edit/:projectId" element={<CMSProjectGalleryForm />} />
    </Routes>
  );
};

const SectionsList = ({ sections }) => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center mb-8">
        <FiLayers className="text-emerald-500 mr-3" size={28} />
        <h1 className="text-3xl font-bold text-white">Page Sections</h1>
      </div>
      
      <p className="text-gray-300 mb-8">
        Select a section below to edit its content and configuration.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sections.map(section => (
          <div
            key={section.id}
            onClick={() => navigate(section.id)}
            className="bg-black/40 backdrop-blur-sm border border-emerald-900/20 rounded-xl p-6 cursor-pointer hover:bg-black/60 transition-all duration-200 group"
          >
            <div className="flex items-center mb-4">
              <div className="bg-emerald-900/20 text-emerald-400 p-3 rounded-lg mr-4">
                {section.icon}
              </div>
              <h3 className="text-xl font-semibold text-white group-hover:text-emerald-400 transition-colors">
                {section.title}
              </h3>
            </div>
            <p className="text-gray-400">
              {section.description}
            </p>
            <div className="mt-5 flex justify-end">
              <Link 
                to={section.id}
                className="text-emerald-400 hover:text-emerald-300 flex items-center text-sm font-medium"
              >
                Edit Section
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageSections; 