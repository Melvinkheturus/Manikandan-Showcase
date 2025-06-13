-- Seed data for Portfolio CMS

-- Seed homepage sections
INSERT INTO page_sections (slug, position, content) VALUES
  ('hero', 0, '{
    "headline": "MANIKANDAN S",
    "tagline": "UI/UX DESIGNER & CREATIVE TECHNOLOGIST",
    "hooks": ["Design", "AI-Enhanced", "Practical"],
    "ctas": [
      {"type": "resume", "label": "Download Resume"},
      {"type": "scroll", "label": "View Projects"}
    ],
    "badge": "Built with design with feel"
  }'),
  ('about', 1, '{
    "intro": "Passionate UI/UX Designer and creative technologist...",
    "mission": "I believe great design is invisible...",
    "highlights": [
      {"icon": "design", "label": "Figma · Canva · Illustrator · Photoshop"},
      {"icon": "ai", "label": "Cursor AI · FlutterFlow · Framer AI · WordPress"},
      {"icon": "dev", "label": "HTML · CSS · React · Flutter"}
    ]
  }'),
  ('skills', 2, '{
    "intro": "From wireframes to production code—here's where I turn ideas into pixel-perfect reality.",
    "mode": "level",
    "items": [
      {"name": "Figma", "level": "Intermediate"},
      {"name": "Canva", "level": "Intermediate"},
      {"name": "Illustrator", "level": "Intermediate"},
      {"name": "Photoshop", "level": "Intermediate"},
      {"name": "Spline", "level": "Beginner"},
      {"name": "Cursor AI", "level": "Proficient"},
      {"name": "Lovable AI", "level": "Beginner"},
      {"name": "Framer AI", "level": "Intermediate"},
      {"name": "FlutterFlow", "level": "Beginner"},
      {"name": "WordPress", "level": "Intermediate"},
      {"name": "React", "level": "Learning"},
      {"name": "HTML/CSS", "level": "Intermediate"}
    ]
  }'),
  ('projects', 3, '{
    "intro": "A selection of my most impactful builds—crafted with speed and precision using AI-driven workflows."
  }'),
  ('experience', 4, '{
    "items": [
      {"title": "Web Dev Intern, SAIC", "date": "May–Jun 2024", "description": "Built WordPress sites, leveraged no-code tools."},
      {"title": "Department General Secretary", "date": "2024–2025", "description": "Led 20-member team, organized campus events."},
      {"title": "Event Head, Juno Fest 2024", "date": "2024", "description": "Coordinated logistics & design for 1K+ attendees."}
    ]
  }'),
  ('contact', 5, '{
    "intro": "Have a project in mind or want to say hi? Drop me a line—I'm always open to new challenges.",
    "info": [
      {"icon": "location", "value": "Chennai, Tamil Nadu 600077"},
      {"icon": "email", "value": "smk.manikandan.dev@gmail.com"},
      {"icon": "phone", "value": "+91 99403 98023"}
    ],
    "social": [
      {"platform": "Portfolio", "url": "https://manikandanshowcase.vercel.app"},
      {"platform": "LinkedIn", "url": ""},
      {"platform": "GitHub", "url": ""},
      {"platform": "Dribbble", "url": ""},
      {"platform": "Medium", "url": ""}
    ],
    "form_enabled": true
  }');

-- Seed sample project
INSERT INTO projects (slug, title, description, thumbnail, tags, featured, live_url, source_url, content) VALUES
  ('portfolio-website', 
   'Portfolio Website', 
   'A modern, responsive portfolio website built with React and Supabase',
   '/images/projects/portfolio-thumbnail.jpg',
   ARRAY['React', 'Supabase', 'Tailwind CSS', 'Framer Motion'],
   true,
   'https://manikandanshowcase.vercel.app',
   'https://github.com/manikandandev/portfolio',
   '{
     "overview": "This portfolio showcases my skills and projects in web design and development.",
     "challenge": "Creating a website that reflects my design aesthetic while providing a smooth user experience.",
     "solution": "Leveraged React for UI components, Supabase for backend, and Framer Motion for animations."
   }'
  );

-- Seed project sections for the sample project
INSERT INTO project_sections (slug, position, content) VALUES
  ('intro', 0, '{
    "headline": "Portfolio Website",
    "tagline": "Modern React Portfolio",
    "image": "/images/projects/portfolio-hero.jpg"
  }'),
  ('meta', 1, '{
    "client": "Personal Project",
    "timeline": "June 2024",
    "role": "UI/UX Designer & Developer",
    "technologies": ["React", "Supabase", "Tailwind CSS", "Framer Motion"]
  }'),
  ('problem-solution', 2, '{
    "problem": "Needed a professional portfolio that stands out from standard templates.",
    "solution": "Built a custom React-based portfolio with interactive elements and smooth animations."
  }'),
  ('features', 3, '{
    "items": [
      {"title": "Responsive Design", "description": "Fully responsive across all device sizes"},
      {"title": "Dynamic Content", "description": "Content managed through Supabase CMS"},
      {"title": "Animations", "description": "Smooth transitions and animations using Framer Motion"}
    ]
  }');

-- Seed global settings
INSERT INTO global_settings (key, value) VALUES
  ('site_info', '{
    "title": "Manikandan S | UI/UX Designer & Creative Technologist",
    "description": "Portfolio of Manikandan S, showcasing UI/UX design and web development projects.",
    "keywords": ["UI/UX Design", "Web Development", "React", "Portfolio"],
    "author": "Manikandan S",
    "email": "smk.manikandan.dev@gmail.com",
    "image": "/images/og-image.jpg"
  }'),
  ('appearance', '{
    "theme": "dark",
    "accent_color": "#FF5F38",
    "secondary_color": "#2563EB",
    "enable_animations": true,
    "font_primary": "Montserrat",
    "font_secondary": "Poppins"
  }'),
  ('audio_settings', '{
    "enable_sound": true,
    "volume": 0.5,
    "sound_effects": ["hover", "click", "scroll"]
  }'); 