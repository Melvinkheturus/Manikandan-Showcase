import React from 'react';
import { IoRocketOutline } from 'react-icons/io5';
import { CategorySection } from './SharedComponents';
import AllProjectsSection from '../AllProjectsSection';

// Changed to forwardRef to make sure transitions work properly
const CreativeLabSection = React.forwardRef(({ projects, sectionRef }, ref) => {
  const filteredProjects = projects.filter(project => project.category === 'Creative Lab');
  const themeColor = "rgba(255, 92, 240, 0.4)"; // Pink theme for Creative Lab

  // Use the provided sectionRef if available, otherwise use the forwarded ref
  const actualRef = sectionRef || ref;

  return (
    <CategorySection 
      id="creative-lab" 
      title="Creative Lab" 
      icon={<IoRocketOutline />}
      themeColor={themeColor}
      ref={actualRef}
      sectionType="creative-lab"
    >
      <div className="text-center mb-12">
        <p className="text-lg text-gray-300 max-w-3xl mx-auto">
          Where experiments, unfinished visions, and upcoming ideas are born — Experimental Grid with glitch effects and hover interactions.
        </p>
      </div>
      <AllProjectsSection
        projects={filteredProjects}
        sectionTitle=""
        layoutType="glitch"
      />
    </CategorySection>
  );
});

// Add display name for better debugging
CreativeLabSection.displayName = 'CreativeLabSection';

export default CreativeLabSection; 