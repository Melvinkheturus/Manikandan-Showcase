import React from 'react';
import { IoFlaskOutline } from 'react-icons/io5';
import { CategorySection } from './SharedComponents';
import AllProjectsSection from '../AllProjectsSection';

// Changed to forwardRef to make sure transitions work properly
const AIProjectsSection = React.forwardRef(({ projects, sectionRef }, ref) => {
  const filteredProjects = projects.filter(project => project.category === 'AI Projects');
  const themeColor = "rgba(162, 89, 255, 0.4)"; // Purple theme for AI Projects

  // Use the provided sectionRef if available, otherwise use the forwarded ref
  const actualRef = sectionRef || ref;

  return (
    <CategorySection 
      id="ai-projects" 
      title="AI Projects" 
      icon={<IoFlaskOutline />}
      themeColor={themeColor}
      ref={actualRef}
      sectionType="ai-projects"
    >
      <div className="text-center mb-12">
        <p className="text-lg text-gray-300 max-w-3xl mx-auto">
          Explorations at the intersection of creativity and artificial intelligence — Interactive Zoom Grid with lens effects and metadata reveal.
        </p>
      </div>
      <AllProjectsSection
        projects={filteredProjects}
        sectionTitle=""
        layoutType="lens"
      />
    </CategorySection>
  );
});

// Add display name for better debugging
AIProjectsSection.displayName = 'AIProjectsSection';

export default AIProjectsSection; 