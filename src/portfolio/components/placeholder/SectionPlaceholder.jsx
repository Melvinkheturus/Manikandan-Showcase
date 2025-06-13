import React from 'react';
import { motion } from 'framer-motion';

const SectionPlaceholder = ({ title, description, content }) => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-5xl">
        <motion.div 
          className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 border border-gray-700"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-primary">
            {title || 'Section'}
          </h2>
          
          <div className="p-8 border border-dashed border-gray-600 rounded-lg">
            <div className="text-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-xl font-medium mb-2">Content Coming Soon</h3>
              <p className="text-gray-500">
                {description || 'This section will be available soon.'}
              </p>
              {content && (
                <pre className="mt-4 text-left text-xs p-4 bg-gray-900 rounded overflow-auto max-h-60">
                  {typeof content === 'object' ? JSON.stringify(content, null, 2) : content}
                </pre>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SectionPlaceholder; 