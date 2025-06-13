import React from 'react';
import { IoCodeSlash } from 'react-icons/io5';
import { CategorySection } from './SharedComponents';
import AllProjectsSection from '../AllProjectsSection';

// Changed to forwardRef to make sure transitions work properly
const DevelopmentSection = React.forwardRef(({ projects, sectionRef }, ref) => {
  const filteredProjects = projects.filter(project => project.category === 'Development');
  const themeColor = "rgba(87, 255, 172, 0.4)"; // Green theme for Development

  // Use the provided sectionRef if available, otherwise use the forwarded ref
  const actualRef = sectionRef || ref;

  return (
    <CategorySection 
      id="development" 
      title="Development" 
      icon={<IoCodeSlash />}
      themeColor={themeColor}
      ref={actualRef}
      sectionType="development"
    >
      <div className="text-center mb-12">
        <p className="text-lg text-gray-300 max-w-3xl mx-auto">
          Bringing ideas to life through code and technology — Terminal-style cards with typewriter reveal, blinking cursor and command line aesthetic.
        </p>
      </div>
      <AllProjectsSection
        projects={filteredProjects}
        sectionTitle=""
        layoutType="terminal"
      />
    </CategorySection>
  );
});

// Add display name for better debugging
DevelopmentSection.displayName = 'DevelopmentSection';

export default DevelopmentSection; 