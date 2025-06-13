import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProjectNavigation = ({ nextProject }) => {
  return (
    <section className="py-12 bg-black">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Back to Projects button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link 
              to="/#projects" 
              className="flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:bg-white/10 hover:border-emerald-500/40 transition-all"
            >
              <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              <span className="text-white font-medium">Back to Projects</span>
            </Link>
          </motion.div>
          
          {/* Next Project preview */}
          {nextProject && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Link 
                to={`/project/${nextProject.slug}`}
                className="flex items-center gap-4 group"
              >
                {/* Text content */}
                <div className="text-right">
                  <span className="text-gray-400 text-sm">Next Project</span>
                  <h3 className="text-white text-lg font-bold group-hover:text-emerald-400 transition-colors">
                    {nextProject.title}
                  </h3>
                </div>
                
                {/* Thumbnail image */}
                <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden">
                  <img
                    src={nextProject.thumbnail}
                    alt={nextProject.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay with icon */}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </Link>
              
              {/* Animated arrow */}
              <motion.div 
                className="absolute -right-4 top-1/2 -translate-y-1/2"
                animate={{ 
                  x: [0, 10, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <svg className="w-6 h-6 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectNavigation; 