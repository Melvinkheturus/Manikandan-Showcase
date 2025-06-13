import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <motion.div 
        className="flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Loading spinner */}
        <motion.div
          className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ 
            repeat: Infinity, 
            duration: 1.5, 
            ease: "linear" 
          }}
        />
        
        <p className="mt-6 text-gray-400 text-lg">Loading...</p>
      </motion.div>
    </div>
  );
};

export default LoadingScreen; 