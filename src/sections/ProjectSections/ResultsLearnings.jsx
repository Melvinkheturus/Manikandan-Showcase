import React from 'react';
import { motion } from 'framer-motion';

const ResultsLearnings = ({ project }) => {
  // Parse results and learnings from project data
  const results = Array.isArray(project.results) 
    ? project.results 
    : (project.results || '').split('\n').filter(Boolean);
    
  const learnings = Array.isArray(project.learnings) 
    ? project.learnings 
    : (project.learnings || '').split('\n').filter(Boolean);
  
  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">
          Results & Learnings
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Results */}
          <ResultsSection results={results} />
          
          {/* Learnings */}
          <LearningsSection learnings={learnings} />
        </div>
        
        {/* Metrics or success stats if available */}
        {project.metrics && (
          <MetricsSection metrics={project.metrics} />
        )}
      </div>
    </section>
  );
};

const ResultsSection = ({ results }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center mr-4">
          <svg className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white">Results</h3>
      </div>
      
      <ul className="space-y-4">
        {results.map((result, index) => (
          <motion.li 
            key={index}
            className="flex gap-3 items-start"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.5,
              delay: index * 0.1 
            }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <div className="text-emerald-500 mt-1">
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-gray-300">{result}</p>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

const LearningsSection = ({ learnings }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center mr-4">
          <svg className="w-6 h-6 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white">Key Learnings</h3>
      </div>
      
      <ul className="space-y-4">
        {learnings.map((learning, index) => (
          <motion.li 
            key={index}
            className="flex gap-3 items-start"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.5,
              delay: 0.2 + (index * 0.1) 
            }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <div className="text-purple-500 mt-1">
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-gray-300">{learning}</p>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

const MetricsSection = ({ metrics }) => {
  // Parse metrics data
  const metricsArray = Array.isArray(metrics) 
    ? metrics 
    : typeof metrics === 'object'
      ? Object.entries(metrics).map(([label, value]) => ({ label, value }))
      : [];
  
  return (
    <motion.div
      className="mt-16 py-8 px-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <h3 className="text-xl font-bold text-white mb-6 text-center">Key Metrics & Impact</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metricsArray.map((metric, index) => (
          <motion.div
            key={index}
            className="text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 0.5,
              delay: index * 0.1
            }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <div className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2">
              {metric.value}
            </div>
            <div className="text-gray-300 text-sm">
              {metric.label}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ResultsLearnings; 