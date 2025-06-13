import React from 'react';
import { motion } from 'framer-motion';

const QuickInfoStrip = ({ project }) => {
  // Tech Stack Pill Component
  const TechPill = ({ tech, index }) => (
    <motion.div 
      className="px-4 py-2 bg-gray-800/60 backdrop-blur-sm rounded-full text-sm text-white border border-emerald-500/30"
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ 
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.19, 1.0, 0.22, 1.0] 
      }}
      viewport={{ once: true, margin: "-50px" }}
    >
      {tech}
    </motion.div>
  );
  
  // Tool Icon Component
  const ToolIcon = ({ tool, index }) => (
    <motion.div
      className="p-3 bg-gray-800/60 backdrop-blur-sm rounded-full border border-emerald-500/30"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        delay: 0.2 + (index * 0.08),
        ease: [0.19, 1.0, 0.22, 1.0]
      }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ scale: 1.05, borderColor: 'rgba(16, 185, 129, 0.6)' }}
    >
      {getToolIcon(tool)}
    </motion.div>
  );
  
  // Function to get icon based on tool name
  const getToolIcon = (toolName) => {
    const toolLower = toolName.toLowerCase();
    
    // This would ideally be replaced with actual SVG icons or an icon library
    if (toolLower.includes('figma')) {
      return (
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.5 9.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
          <path d="M8.5 6.5a3 3 0 0 1 6 0 3 3 0 0 1-6 0zM8.5 12.5a3 3 0 0 1 3-3h3a3 3 0 0 1 0 6h-3a3 3 0 0 1-3-3z"/>
          <path d="M8.5 18.5a3 3 0 1 0 6 0 3 3 0 0 0-6 0z"/>
        </svg>
      );
    }
    
    if (toolLower.includes('photoshop')) {
      return (
        <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 14h1v-4h1a2 2 0 1 0 0-4h-2v8z"/>
          <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-9 8h-1V7h1a1 1 0 0 1 0 2V9a2 2 0 0 1-2 2H6V7h4a2 2 0 0 1 0 4zm7 5h-1v1h-1v-1h-1v-1h1v-1h1v1h1v1z"/>
        </svg>
      );
    }
    
    // Default icon for other tools
    return (
      <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2 2m0 0l2 2m-2-2l-2 2m0 0l-2 2m2-2l2 2m0 0l2 2m-2-2l-2 2" />
      </svg>
    );
  };
  
  // Get project type badge color
  const getProjectTypeColor = (type) => {
    const typeLower = (type || '').toLowerCase();
    
    if (typeLower.includes('client')) return 'bg-blue-500/20 text-blue-300 border-blue-400/40';
    if (typeLower.includes('personal')) return 'bg-purple-500/20 text-purple-300 border-purple-400/40';
    if (typeLower.includes('internship')) return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/40';
    if (typeLower.includes('mobile')) return 'bg-red-500/20 text-red-300 border-red-400/40';
    if (typeLower.includes('web')) return 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40';
    
    // Default
    return 'bg-gray-500/20 text-gray-300 border-gray-400/40';
  };
  
  // Parse arrays from project data
  const techStack = Array.isArray(project.techStack) 
    ? project.techStack 
    : (project.techStack || '').split(',').map(item => item.trim()).filter(Boolean);
    
  const tools = Array.isArray(project.tools) 
    ? project.tools 
    : (project.tools || '').split(',').map(item => item.trim()).filter(Boolean);
  
  return (
    <motion.div 
      className="bg-black border-y border-gray-800 py-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        {/* Tech Stack */}
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-400 mb-3">TECH STACK</h3>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech, index) => (
              <TechPill key={index} tech={tech} index={index} />
            ))}
          </div>
        </div>
        
        {/* Tools */}
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-400 mb-3">TOOLS USED</h3>
          <div className="flex flex-wrap gap-3">
            {tools.map((tool, index) => (
              <ToolIcon key={index} tool={tool} index={index} />
            ))}
          </div>
        </div>
        
        {/* Project Type */}
        <div className="min-w-[200px]">
          <h3 className="text-sm font-medium text-gray-400 mb-3">PROJECT TYPE</h3>
          <motion.div
            className={`inline-flex px-4 py-2 rounded-full text-sm font-medium border ${getProjectTypeColor(project.projectType)}`}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            {project.projectType || 'Web App'}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuickInfoStrip; 