/**
 * Sample project data for development purposes
 * This will be replaced by real data from Supabase CMS in production
 */

export const getSampleProject = (slug) => {
  const projects = {
    "examinerpro": {
      id: 1,
      title: "EXAMINERPRO – CONTROLLER OF EXAMINATIONS AUTOMATION TOOL",
      slug: "examinerpro",
      thumbnail: "https://via.placeholder.com/600x400/1a2e35/00ff88?text=ExaminerPro",
      hero_image: "https://via.placeholder.com/1920x1080/1a2e35/00ff88?text=ExaminerPro+Hero",
      short_description: "Developed a full-stack salary automation app in 15 days using AI tools—60% faster than usual.",
      full_description: "ExaminerPro is a comprehensive automation tool designed specifically for Controllers of Examinations (COE) in educational institutions. It streamlines the entire examination process from planning to result publication, significantly reducing manual work and potential errors.",
      client: "Educational Technology Division",
      completed_date: "2023-08-15",
      tags: ["Flutter", "React", "Supabase", "SQLite"],
      categories: ["Web Application", "Desktop Application"],
      tools_used: ["Flutter", "React", "Supabase", "SQLite", "AI Assistance"],
      website_url: "https://examinerpro.example.com",
      github_url: "https://github.com/example/examinerpro",
      problem_statement: "Educational institutions face significant challenges in managing examination processes, from scheduling to result processing. The existing manual systems are time-consuming, error-prone, and difficult to scale, leading to delays, inconsistencies, and administrative burden.",
      solution: "ExaminerPro automates the entire examination workflow through a comprehensive platform that includes salary automation, document generation, and secure data management. The solution was developed in just 15 days using AI-assisted development techniques, significantly faster than traditional approaches.",
      features: [
        {
          title: "PDF Export",
          description: "Generate professional examination documents, certificates, and reports with a single click.",
          icon: "document"
        },
        {
          title: "Archive Filters",
          description: "Easily access historical examination data with powerful search and filter capabilities.",
          icon: "filter"
        },
        {
          title: "Security",
          description: "Enterprise-grade security with Supabase Row Level Security (RLS) protecting sensitive examination data.",
          icon: "shield"
        },
        {
          title: "Multi-platform",
          description: "Web version for administrative access and desktop application for offline capabilities.",
          icon: "devices"
        }
      ],
      showcase_images: [
        {
          url: "https://via.placeholder.com/800x600/1a2e35/00ff88?text=Dashboard",
          caption: "Main dashboard showing examination schedule"
        },
        {
          url: "https://via.placeholder.com/800x600/1a2e35/00ff88?text=PDF+Export",
          caption: "PDF export functionality with customizable templates"
        },
        {
          url: "https://via.placeholder.com/800x600/1a2e35/00ff88?text=Data+Management",
          caption: "Comprehensive data management interface"
        }
      ],
      design_process: [
        {
          title: "Research",
          description: "Conducted interviews with 12 COEs to understand pain points and requirements"
        },
        {
          title: "Prototyping",
          description: "Developed rapid prototypes using AI tools for quick iteration and feedback"
        },
        {
          title: "Development",
          description: "Implemented core functionality with AI assistance, reducing development time by 60%"
        },
        {
          title: "Testing",
          description: "Rigorous testing with actual examination data from partner institutions"
        }
      ],
      results: [
        "60% faster development cycle using AI-assisted development",
        "95% reduction in manual data processing time",
        "Zero errors in examination processing during initial pilot",
        "Desktop application delivered in just 2 days using Flutter"
      ],
      learnings: [
        "AI-assisted development can significantly accelerate complex applications",
        "Cross-platform development requires careful planning of shared logic",
        "Designing for offline-first usage improves reliability in varied network conditions"
      ],
      resource_links: [
        {
          title: "Product Website",
          url: "https://examinerpro.example.com",
          icon: "web"
        },
        {
          title: "GitHub Repository",
          url: "https://github.com/example/examinerpro",
          icon: "github"
        },
        {
          title: "Technical Documentation",
          url: "https://docs.examinerpro.example.com",
          icon: "document"
        }
      ],
      showFeatures: true,
      showDesignProcess: true,
      showResults: true,
      is_published: true
    },
    "event-management": {
      id: 2,
      title: "EVENT MANAGEMENT WEBSITE WITH CMS",
      slug: "event-management",
      thumbnail: "https://via.placeholder.com/600x400/1a2e35/00ff88?text=EventManagement",
      hero_image: "https://via.placeholder.com/1920x1080/1a2e35/00ff88?text=EventManagement+Hero",
      short_description: "Built a full event management site with real-time editing in 15 hours using AI-enhanced workflows.",
      full_description: "A comprehensive event management platform with integrated CMS capabilities that allows organizers to create, manage, and promote events efficiently. The entire solution was built in just 15 hours by leveraging AI-enhanced development workflows.",
      client: "Event Organizers Association",
      completed_date: "2023-06-22",
      tags: ["React", "Tailwind CSS", "Supabase"],
      categories: ["Web Application", "Content Management System"],
      tools_used: ["React", "Tailwind CSS", "Supabase", "AI Workflow"],
      website_url: "https://events-platform.example.com",
      github_url: "https://github.com/example/event-platform",
      problem_statement: "Event organizers struggle with managing events through disconnected tools, leading to inefficiencies, communication gaps, and difficulties in handling registrations, updates, and content management. Existing solutions are either too complex or too limited in functionality.",
      solution: "A streamlined event management platform with an intuitive CMS built specifically for event organizers. The solution enables real-time editing, attendee management, and media organization in a fully responsive, accessible interface. The entire project was completed in 15 hours using AI-enhanced development workflows.",
      features: [
        {
          title: "Real-time Editing",
          description: "Edit event details and see changes instantly reflected on the public-facing site.",
          icon: "edit"
        },
        {
          title: "Attendee Management",
          description: "Comprehensive tools for registration, check-in, and communication with attendees.",
          icon: "people"
        },
        {
          title: "Media Library",
          description: "Centralized storage for event images, videos, and documents with easy organization.",
          icon: "image"
        },
        {
          title: "Accessibility",
          description: "Fully responsive design with WCAG 2.1 AA compliance for all users.",
          icon: "accessibility"
        }
      ],
      showcase_images: [
        {
          url: "https://via.placeholder.com/800x600/1a2e35/00ff88?text=Events+Dashboard",
          caption: "Main dashboard showing upcoming and past events"
        },
        {
          url: "https://via.placeholder.com/800x600/1a2e35/00ff88?text=CMS+Interface",
          caption: "Intuitive CMS interface for managing event content"
        },
        {
          url: "https://via.placeholder.com/800x600/1a2e35/00ff88?text=Attendee+Management",
          caption: "Comprehensive attendee management system"
        }
      ],
      design_process: [
        {
          title: "Requirements Gathering",
          description: "Collaborated with event organizers to identify key pain points and must-have features"
        },
        {
          title: "Rapid Prototyping",
          description: "Used AI tools to quickly generate UI mockups and interaction flows"
        },
        {
          title: "Iterative Development",
          description: "Built core functionality in sprints with continuous feedback"
        },
        {
          title: "Performance Optimization",
          description: "Ensured fast loading times and smooth performance even with large event datasets"
        }
      ],
      results: [
        "15-hour development time from concept to deployment",
        "98% reduction in event setup time for organizers",
        "200% increase in attendee engagement through platform features",
        "Fully responsive design working across all devices"
      ],
      learnings: [
        "AI-enhanced workflows dramatically reduce development time for complex applications",
        "Real-time database capabilities improve user experience for collaborative editing",
        "Designing with accessibility in mind from the start ensures inclusivity"
      ],
      resource_links: [
        {
          title: "Live Demo",
          url: "https://events-platform.example.com/demo",
          icon: "web"
        },
        {
          title: "GitHub Repository",
          url: "https://github.com/example/event-platform",
          icon: "github"
        },
        {
          title: "User Documentation",
          url: "https://docs.events-platform.example.com",
          icon: "document"
        }
      ],
      showFeatures: true,
      showDesignProcess: true,
      showResults: true,
      is_published: true
    },
    "examinerpro-uiux": {
      id: 3,
      title: "UI/UX DESIGN FOR EXAMINERPRO",
      slug: "examinerpro-uiux",
      thumbnail: "https://via.placeholder.com/600x400/1a2e35/00ff88?text=UIUX+Design",
      hero_image: "https://via.placeholder.com/1920x1080/1a2e35/00ff88?text=UIUX+Design+Hero",
      short_description: "Designed the complete UI/UX flow from research to prototypes using AI-assisted tools.",
      full_description: "A comprehensive UI/UX design project for ExaminerPro, focusing on creating an intuitive, accessible interface for examination controllers. The design process leveraged AI tools for rapid wireframing and ideation while maintaining a focus on hierarchy, accessibility, and simplifying complex workflows.",
      client: "Educational Technology Division",
      completed_date: "2023-07-10",
      tags: ["Figma", "Canva", "Galileo AI", "Uizard"],
      categories: ["UI Design", "UX Design"],
      tools_used: ["Figma", "Canva", "Galileo AI", "Uizard"],
      website_url: "https://examinerprouiux.example.com",
      github_url: null,
      problem_statement: "The examination management process involves complex workflows that are difficult to translate into intuitive user interfaces. Previous attempts at digitization resulted in cluttered, confusing interfaces that required extensive training and reduced adoption rates among staff.",
      solution: "A human-centered design approach that simplifies complex workflows through thoughtful information architecture, clear visual hierarchy, and accessibility considerations. AI tools were used to rapidly generate design alternatives and test different approaches, allowing for more iterations in less time.",
      features: [
        {
          title: "Visual Hierarchy",
          description: "Carefully structured information design that guides users through complex processes.",
          icon: "layout"
        },
        {
          title: "Accessibility",
          description: "Design that follows WCAG 2.1 guidelines, ensuring usability for all users.",
          icon: "accessibility"
        },
        {
          title: "Consistent Components",
          description: "Comprehensive component library ensuring consistency across the application.",
          icon: "components"
        },
        {
          title: "Responsive Design",
          description: "Adaptable layouts that work across desktop and mobile interfaces.",
          icon: "responsive"
        }
      ],
      showcase_images: [
        {
          url: "https://via.placeholder.com/800x600/1a2e35/00ff88?text=User+Research",
          caption: "User research insights and persona development"
        },
        {
          url: "https://via.placeholder.com/800x600/1a2e35/00ff88?text=Wireframes",
          caption: "AI-assisted wireframing process showing rapid iteration"
        },
        {
          url: "https://via.placeholder.com/800x600/1a2e35/00ff88?text=Final+Designs",
          caption: "Final high-fidelity designs for key workflows"
        }
      ],
      design_process: [
        {
          title: "User Research",
          description: "Conducted interviews and contextual inquiry with examination controllers"
        },
        {
          title: "Information Architecture",
          description: "Mapped complex examination workflows into logical system structures"
        },
        {
          title: "AI Wireframing",
          description: "Used Galileo AI and Uizard to rapidly generate wireframe alternatives"
        },
        {
          title: "High-fidelity Prototyping",
          description: "Created detailed interactive prototypes in Figma for user testing"
        },
        {
          title: "Usability Testing",
          description: "Conducted usability tests with actual users and iterated on feedback"
        }
      ],
      results: [
        "90% reduction in training time for new system users",
        "85% of users rated the interface as 'highly intuitive'",
        "Accessibility score of 98/100 on automated testing tools",
        "Design system with 45+ reusable components"
      ],
      learnings: [
        "AI tools can dramatically accelerate the ideation and wireframing process",
        "Complex workflows need to be broken down into digestible steps for users",
        "Involving actual users throughout the design process leads to better outcomes"
      ],
      resource_links: [
        {
          title: "Design Portfolio",
          url: "https://examinerprouiux.example.com",
          icon: "web"
        },
        {
          title: "Figma Prototype",
          url: "https://figma.com/proto/examplepro",
          icon: "figma"
        },
        {
          title: "Case Study",
          url: "https://examinerprouiux.example.com/case-study",
          icon: "document"
        }
      ],
      showFeatures: true,
      showDesignProcess: true,
      showResults: true,
      is_published: true
    }
  };

  return projects[slug] || null;
};

export default getSampleProject; 