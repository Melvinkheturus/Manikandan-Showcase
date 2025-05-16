import React from 'react';
import { motion } from 'framer-motion';

export default function GradientShowcase() {
  const gradients = [
    { 
      name: 'Emerald Veil', 
      className: 'bg-emerald-veil', 
      description: 'Radial gradient with emerald center fading to black' 
    },
    { 
      name: 'Emerald Deep', 
      className: 'bg-emerald-deep', 
      description: 'Dark linear gradient with deep emerald tones' 
    },
    { 
      name: 'Midnight Green', 
      className: 'bg-midnight-green', 
      description: 'Diagonal gradient with emerald highlights' 
    },
    { 
      name: 'Emerald Fade', 
      className: 'bg-emerald-fade', 
      description: 'Subtle vertical emerald fade to transparent' 
    },
    { 
      name: 'Emerald Glow', 
      className: 'bg-emerald-glow', 
      description: 'Soft emerald glow in the center' 
    }
  ];
  
  return (
    <div className="container mx-auto py-16 px-4">
      <h2 className="text-3xl font-bold mb-8 text-center">Emerald Gradient Showcase</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gradients.map((gradient, index) => (
          <motion.div
            key={gradient.name}
            className="rounded-xl overflow-hidden h-64 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.03 }}
          >
            {/* Gradient Background */}
            <div className={`absolute inset-0 ${gradient.className}`} />
            
            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
              <h3 className="text-xl font-bold mb-2 text-white">{gradient.name}</h3>
              <p className="text-sm text-gray-200">{gradient.description}</p>
              
              <code className="mt-4 bg-black/30 px-3 py-1 rounded-full text-xs text-emerald-300 font-mono">
                {gradient.className}
              </code>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Usage Instructions */}
      <div className="mt-12 bg-gray-900 rounded-xl p-6 max-w-2xl mx-auto">
        <h3 className="text-xl font-bold mb-4 text-white">How to Use These Gradients</h3>
        
        <div className="space-y-4">
          <div>
            <p className="text-gray-300 mb-2">With Tailwind classes:</p>
            <pre className="bg-black/30 p-3 rounded-lg text-sm text-emerald-300 font-mono overflow-x-auto">
              &lt;div className="bg-emerald-veil h-64 w-full rounded-lg"&gt;&lt;/div&gt;
            </pre>
          </div>
          
          <div>
            <p className="text-gray-300 mb-2">With SectionWrapper component:</p>
            <pre className="bg-black/30 p-3 rounded-lg text-sm text-emerald-300 font-mono overflow-x-auto">
              &lt;SectionWrapper bgStyle=&#123;&#123; background: "radial-gradient(circle at 50% 50%, rgba(16,185,129,0.3) 0%, rgba(0,0,0,0.9) 80%, #000000 100%)" &#125;&#125;&gt;
                &#123;/* Your content */&#125;
              &lt;/SectionWrapper&gt;
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
} 