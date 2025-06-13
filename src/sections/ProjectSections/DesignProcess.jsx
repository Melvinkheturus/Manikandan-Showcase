import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const DesignProcess = ({ project }) => {
  // Parse design process steps from project data
  const processSteps = Array.isArray(project.designProcess) 
    ? project.designProcess 
    : typeof project.designProcess === 'string' 
      ? project.designProcess.split('\n\n').map(item => {
          const lines = item.split('\n');
          return {
            title: lines[0],
            description: lines.slice(1).join('\n'),
            image: '' // Will need to be added separately
          };
        })
      : [];
  
  // Combine process steps with images if they exist separately
  const designImages = Array.isArray(project.designImages) 
    ? project.designImages 
    : project.designImages?.split(',').map(url => url.trim()).filter(Boolean) || [];
    
  // Attach images to process steps
  if (designImages.length > 0) {
    processSteps.forEach((step, index) => {
      if (index < designImages.length) {
        step.image = designImages[index];
      }
    });
  }
  
  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Design Process
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            From concept to completion, here's how this project was designed
          </p>
        </div>
        
        {/* Color palette & typography if available */}
        {project.designSystem && (
          <DesignSystem design={project.designSystem} />
        )}
        
        {/* Process steps */}
        <div className="mt-20 space-y-32">
          {processSteps.map((step, index) => (
            <ProcessStep 
              key={index} 
              step={step} 
              index={index} 
              isEven={index % 2 === 0} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Design system component for colors and typography
const DesignSystem = ({ design }) => {
  // Parse colors if they exist
  const colors = Array.isArray(design.colors) 
    ? design.colors 
    : typeof design.colors === 'string'
      ? design.colors.split(',').map(color => color.trim())
      : [];
      
  // Parse fonts if they exist
  const fonts = Array.isArray(design.fonts)
    ? design.fonts
    : typeof design.fonts === 'string'
      ? design.fonts.split(',').map(font => font.trim())
      : [];
  
  return (
    <motion.div
      className="max-w-4xl mx-auto py-8 px-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <h3 className="text-2xl font-semibold text-white mb-6">Design System</h3>
      
      {/* Color palette */}
      {colors.length > 0 && (
        <div className="mb-8">
          <h4 className="text-lg text-emerald-400 mb-4">Color Palette</h4>
          <div className="flex flex-wrap gap-4">
            {colors.map((color, index) => (
              <motion.div 
                key={index}
                className="flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div 
                  className="w-16 h-16 rounded-lg shadow-lg"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs text-gray-400 mt-2">{color}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      
      {/* Typography */}
      {fonts.length > 0 && (
        <div>
          <h4 className="text-lg text-emerald-400 mb-4">Typography</h4>
          <div className="space-y-4">
            {fonts.map((font, index) => (
              <motion.div 
                key={index}
                className="p-4 bg-white/5 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <p className="text-white" style={{ fontFamily: font.split(':')[0] }}>
                  {font}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Individual process step with alternating layout
const ProcessStep = ({ step, index, isEven }) => {
  const [imageRef, imageInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const [contentRef, contentInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  return (
    <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-16 items-center`}>
      {/* Image */}
      <motion.div 
        ref={imageRef}
        className="w-full md:w-1/2"
        initial={{ opacity: 0, x: isEven ? -50 : 50 }}
        animate={imageInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.19, 1.0, 0.22, 1.0] }}
      >
        {step.image ? (
          <div className="rounded-xl overflow-hidden">
            <img 
              src={step.image} 
              alt={step.title} 
              className="w-full h-auto"
            />
          </div>
        ) : (
          <div className="h-64 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
      </motion.div>
      
      {/* Content */}
      <motion.div 
        ref={contentRef}
        className="w-full md:w-1/2"
        initial={{ opacity: 0, y: 30 }}
        animate={contentInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-full bg-emerald-900/50 flex items-center justify-center mr-3">
            <span className="text-emerald-400 font-bold">{index + 1}</span>
          </div>
          <h3 className="text-2xl font-bold text-white">{step.title}</h3>
        </div>
        
        <div className="text-gray-300 space-y-4">
          {step.description.split('\n').map((paragraph, i) => (
            <p key={i} className="leading-relaxed">{paragraph}</p>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DesignProcess; 