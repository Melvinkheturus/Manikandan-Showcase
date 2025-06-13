import React from 'react';
import { IoLayersOutline } from 'react-icons/io5';
import { CategorySection } from './SharedComponents';
import AllProjectsSection from '../AllProjectsSection';

// Changed to forwardRef to make sure transitions work properly
const VisualIdentitySection = React.forwardRef(({ projects, sectionRef }, ref) => {
  const filteredProjects = projects.filter(project => project.category === 'Visual Identity');
  const themeColor = "rgba(255, 147, 92, 0.4)"; // Orange theme for Visual Identity

  // Use the provided sectionRef if available, otherwise use the forwarded ref
  const actualRef = sectionRef || ref;

  return (
    <CategorySection 
      id="visual-identity" 
      title="Visual Identity" 
      icon={<IoLayersOutline />}
      themeColor={themeColor}
      ref={actualRef}
      sectionType="visual-identity"
    >
      <div className="text-center mb-12">
        <p className="text-lg text-gray-300 max-w-3xl mx-auto">
          The foundations of brand presence and visual communication — Pinterest-style masonry layout with fade-in animations and hover effects.
        </p>
      </div>
      <AllProjectsSection
        projects={filteredProjects}
        sectionTitle=""
        layoutType="pinterest"
      />
    </CategorySection>
  );
});

// Add display name for better debugging
VisualIdentitySection.displayName = 'VisualIdentitySection';

export default VisualIdentitySection; 