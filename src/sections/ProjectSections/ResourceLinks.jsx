import React from 'react';
import { motion } from 'framer-motion';

const ResourceLinks = ({ project }) => {
  // Get resource links from project data
  const links = project.resourceLinks || {};
  
  // Define available link types with their labels and icons
  const linkTypes = [
    { key: 'github', label: 'GitHub', icon: <GitHubIcon /> },
    { key: 'figma', label: 'Figma', icon: <FigmaIcon /> },
    { key: 'pdf', label: 'PDF Case Study', icon: <PDFIcon /> },
    { key: 'live', label: 'Live Project', icon: <LiveIcon /> },
    { key: 'behance', label: 'Behance', icon: <BehanceIcon /> },
    { key: 'dribbble', label: 'Dribbble', icon: <DribbbleIcon /> },
    { key: 'docs', label: 'Documentation', icon: <DocsIcon /> },
    { key: 'npm', label: 'NPM Package', icon: <NPMIcon /> }
  ];
  
  // Filter out link types that aren't provided
  const availableLinks = linkTypes.filter(type => links[type.key]);
  
  if (availableLinks.length === 0) {
    return null;
  }
  
  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Background gradient blobs for visual interest */}
      <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-emerald-900/10 blur-3xl"></div>
      <div className="absolute -bottom-60 -right-40 w-96 h-96 rounded-full bg-blue-900/10 blur-3xl"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Project Resources
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore more about this project through these resources
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableLinks.map((type, index) => (
            <ResourceButton
              key={type.key}
              label={type.label}
              icon={type.icon}
              url={links[type.key]}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Resource button component with glass effect
const ResourceButton = ({ label, icon, url, index }) => {
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 hover:border-emerald-500/30 transition-all"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        delay: index * 0.1
      }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -5 }}
    >
      <div className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center text-emerald-400 group-hover:text-emerald-300 transition-colors">
        {icon}
      </div>
      
      <div className="flex-1">
        <h3 className="text-white font-medium">{label}</h3>
        <p className="text-gray-400 text-sm truncate">{url}</p>
      </div>
      
      <div className="text-gray-400 group-hover:text-emerald-400 transition-colors">
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </motion.a>
  );
};

// Icon components
const GitHubIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const FigmaIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.5 9.5a3 3 0 100-6 3 3 0 000 6z" />
    <path d="M8.5 6.5a3 3 0 116 0 3 3 0 01-6 0zM8.5 12.5a3 3 0 113-3h3a3 3 0 110 6h-3a3 3 0 01-3-3z" />
    <path d="M8.5 18.5a3 3 0 106 0 3 3 0 00-6 0z" />
  </svg>
);

const PDFIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 9H8m0 4h4m-2-2v4" />
  </svg>
);

const LiveIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);

const BehanceIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.443 5.35c.639 0 1.23.05 1.77.198.513.148.993.347 1.377.644.355.298.639.695.847 1.19.184.496.276 1.04.276 1.735 0 .745-.184 1.439-.527 2.033-.348.596-.905.993-1.634 1.29.99.297 1.731.793 2.226 1.487.491.695.764 1.537.764 2.552 0 .795-.147 1.488-.466 2.132a4.434 4.434 0 01-1.227 1.537c-.52.397-1.144.744-1.858.943-.713.198-1.511.296-2.307.296H0V5.348l7.443.002zm-.67 8.803c.647 0 1.19-.148 1.586-.447.401-.298.602-.795.602-1.438 0-.347-.05-.644-.2-.843-.102-.2-.3-.397-.496-.546a1.872 1.872 0 00-.713-.248c-.259-.05-.557-.05-.856-.05H3.258v3.572h3.516zm.199 6.301c.35 0 .673-.05.979-.1.295-.05.59-.148.856-.297.245-.148.441-.347.647-.645.147-.297.248-.696.248-1.141 0-.893-.248-1.537-.744-1.934-.496-.398-1.141-.548-1.984-.548H3.258v4.665h3.715zm11.889-4.614c.739 0 1.38-.149 1.934-.447.544-.298.982-.695 1.281-1.191h.05v1.438h2.406V5.549h-3.716v1.981c-.147-.545-.496-.942-1.042-1.19-.546-.248-1.091-.397-1.733-.397-.795 0-1.486.148-2.032.447a4.9 4.9 0 00-1.438 1.239 4.67 4.67 0 00-.905 1.833c-.198.744-.296 1.487-.296 2.28 0 .794.098 1.487.296 2.23.199.747.496 1.34.905 1.883a3.89 3.89 0 001.438 1.24c.596.296 1.238.444 2.032.444.692 0 1.337-.148 1.882-.444.546-.298.943-.745 1.191-1.34h.05v1.537c0 .596-.199 1.091-.595 1.537-.397.399-.993.645-1.736.645-.346 0-.672-.05-.968-.148a3.005 3.005 0 01-.745-.347 1.727 1.727 0 01-.496-.546 1.523 1.523 0 01-.199-.745h-2.654c0 .645.147 1.191.397 1.685.247.496.644.893 1.09 1.19.446.297.993.546 1.635.695.62.148 1.288.247 1.983.247.744 0 1.487-.099 2.18-.297a5.399 5.399 0 001.838-.942c.496-.397.942-.943 1.239-1.586.346-.645.445-1.438.445-2.33v-7.161h-2.405v1.040h-.05c-.247-.348-.544-.546-.942-.695a5.17 5.17 0 00-1.041-.446 5.573 5.573 0 00-1.089-.148c-.397 0-.745-.05-1.042-.05-.744 0-1.438.149-2.032.446a4.907 4.907 0 00-1.537 1.19 6.027 6.027 0 00-.942 1.833c-.198.744-.297 1.537-.297 2.38 0 .793.099 1.537.297 2.232.197.696.544 1.29.942 1.833.397.496.933.893 1.537 1.19a5.145 5.145 0 002.032.395zm.05-2.18c-.448 0-.844-.1-1.24-.25-.346-.148-.645-.396-.941-.694-.248-.298-.447-.645-.596-1.091-.148-.448-.198-.944-.198-1.439 0-.546.05-1.041.198-1.488.149-.446.348-.844.596-1.14.296-.299.595-.496.941-.646.396-.148.792-.247 1.24-.247.396 0 .792.049 1.189.247.347.15.645.397.943.645.247.298.495.695.644 1.141.149.447.248.942.248 1.488 0 .495-.05 1.04-.248 1.488-.148.397-.397.744-.644 1.091-.298.299-.596.496-.943.645-.397.15-.793.2-1.189.25zM18.747 5.35h6.32v1.536h-6.32V5.35z" />
  </svg>
);

const DribbbleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.424 25.424 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.814 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.686 8.686 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.309 35.309 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" />
  </svg>
);

const DocsIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const NPMIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M0 0v24h24V0H0zm19.2 19.2H12v-9.6h-4.8v9.6H4.8V4.8h14.4v14.4z" />
  </svg>
);

export default ResourceLinks; 