import React from 'react';
import { Link } from 'react-router-dom';
import { FiEdit2, FiEye, FiUser, FiCode, FiGrid, FiBriefcase, FiMessageSquare, FiInstagram, FiMail } from 'react-icons/fi';
import { motion } from 'framer-motion';

const sectionCards = [
  {
    id: 'hero',
    title: 'Hero Section',
    description: 'Edit your main headline, job title, and contact information',
    icon: <FiEye size={24} />,
    color: 'from-emerald-500/20 to-emerald-600/20',
    iconBg: 'bg-emerald-500',
    path: '/admin/sections/hero'
  },
  {
    id: 'about',
    title: 'About Me',
    description: 'Edit your personal bio, introduction and background',
    icon: <FiUser size={24} />,
    color: 'from-blue-500/20 to-blue-600/20',
    iconBg: 'bg-blue-500',
    path: '/admin/sections/about'
  },
  {
    id: 'skills',
    title: 'Skills & Expertise',
    description: 'Manage your technical skills, tools and technologies',
    icon: <FiCode size={24} />,
    color: 'from-purple-500/20 to-purple-600/20',
    iconBg: 'bg-purple-500',
    path: '/admin/sections/skills'
  },
  {
    id: 'projects',
    title: 'Project Showcase',
    description: 'Edit featured projects on the homepage',
    icon: <FiGrid size={24} />,
    color: 'from-amber-500/20 to-amber-600/20',
    iconBg: 'bg-amber-500',
    path: '/admin/sections/project-showcase'
  },
  {
    id: 'experience',
    title: 'Experience',
    description: 'Edit your work history and professional experience',
    icon: <FiBriefcase size={24} />,
    color: 'from-red-500/20 to-red-600/20',
    iconBg: 'bg-red-500',
    path: '/admin/sections/experience'
  },
  {
    id: 'testimonials',
    title: 'Testimonials',
    description: 'Manage client and colleague testimonials',
    icon: <FiMessageSquare size={24} />,
    color: 'from-cyan-500/20 to-cyan-600/20',
    iconBg: 'bg-cyan-500',
    path: '/admin/sections/testimonials'
  },
  {
    id: 'social',
    title: 'Social Glimpse',
    description: 'Edit your social media feed and integration',
    icon: <FiInstagram size={24} />,
    color: 'from-pink-500/20 to-pink-600/20',
    iconBg: 'bg-pink-500',
    path: '/admin/sections/social'
  },
  {
    id: 'contact',
    title: 'Contact Section',
    description: 'Edit your contact form and information',
    icon: <FiMail size={24} />,
    color: 'from-green-500/20 to-green-600/20',
    iconBg: 'bg-green-500',
    path: '/admin/sections/contacts'
  },
];

const CMSSectionsIndex = () => {
  return (
    <div className="container px-4 py-8 mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-white">Portfolio Sections</h1>
        <p className="text-gray-400 mt-2">Edit individual sections of your portfolio homepage</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sectionCards.map((section, index) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link 
              to={section.path}
              className={`flex flex-col h-full rounded-lg border border-gray-800 bg-gradient-to-br ${section.color} hover:border-gray-700 transition-all duration-300 overflow-hidden`}
            >
              <div className="p-6 flex-grow">
                <div className={`w-12 h-12 rounded-lg ${section.iconBg} flex items-center justify-center text-white mb-4`}>
                  {section.icon}
                </div>
                <h3 className="font-bold text-lg text-white mb-2">{section.title}</h3>
                <p className="text-gray-400 mb-4">{section.description}</p>
              </div>
              <div className="border-t border-gray-800 p-4 bg-black/40 flex justify-between items-center">
                <span className="text-sm text-gray-400">Edit Section</span>
                <FiEdit2 size={16} className="text-emerald-500" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CMSSectionsIndex; 