import React from 'react';
import { IoColorPaletteOutline } from 'react-icons/io5';
import { CategorySection } from './SharedComponents';
import VerticalStackReveal from '../VerticalStackReveal';

// Changed to forwardRef to make sure transitions work properly
const UIUXDesignSection = React.forwardRef(({ projects, sectionRef, onSectionEnd, sectionIndex }, ref) => {
  // Filter UI/UX projects 
  const uiuxProjects = projects.filter(project => 
    project.category === 'UI/UX Design' || 
    project.tags.some(tag => tag.toLowerCase().includes('ui') || tag.toLowerCase().includes('ux'))
  );
  
  const themeColor = "rgba(0, 0, 0, 0.6)"; // Black theme for UI/UX Design

  // Use the provided sectionRef if available, otherwise use the forwarded ref
  const actualRef = sectionRef || ref;

  // Handle scroll to next section
  const handleSectionEnd = () => {
    if (onSectionEnd) {
      onSectionEnd(sectionIndex);
    }
  };

  return (
    <CategorySection 
      id="ui-ux-design" 
      title="UI/UX Design" 
      icon={<IoColorPaletteOutline />}
      themeColor={themeColor}
      ref={actualRef}
      sectionType="ui-ux-design"
    >
      <div className="text-center mb-8">
        <p className="text-lg text-gray-300 max-w-3xl mx-auto">
          Digital experiences crafted for human interaction — Vertical stack reveal with smooth animations and detailed case studies.
        </p>
      </div>
      <VerticalStackReveal 
        projects={uiuxProjects} 
        sectionTitle=""
        onSectionEnd={handleSectionEnd}
        sectionIndex={sectionIndex}
      />
    </CategorySection>
  );
});

// Add display name for better debugging
UIUXDesignSection.displayName = 'UIUXDesignSection';

export default UIUXDesignSection; 