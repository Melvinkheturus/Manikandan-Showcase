-- Enhanced CMS Schema for Portfolio Website

-- SECTION 1: ENUMS AND TYPES

-- Create Content Section Types enum
CREATE TYPE section_type AS ENUM (
  -- Main Page Sections
  'hero', 
  'about', 
  'skills', 
  'projects_showcase', 
  'experience', 
  'testimonials',
  'social_glimpse',
  'contact',
  
  -- Project Page Sections
  'project_hero',
  'quick_info_strip',
  'project_summary',
  'problem_solution',
  'design_process',
  'features',
  'resource_links',
  'results_learnings',
  'visual_showcase',
  'project_navigation'
);

-- Create Skill Level Type enum
CREATE TYPE skill_level AS ENUM (
  'AI',
  'Learning',
  'Beginner',
  'Intermediate',
  'Advanced',
  'Expert'
);

-- Create Skill Category Type enum
CREATE TYPE skill_category AS ENUM (
  'Design',
  'AI & No-Code Tools',
  'Frontend',
  'Soft Skills',
  'Additional'
);

-- Create Project Category Type enum
CREATE TYPE project_category AS ENUM (
  'Visual Identity',
  'UI/UX Design',
  'Development',
  'AI Projects',
  'Creative Lab'
);

-- Section visibility toggle
CREATE TABLE cms_section_visibility (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_type section_type NOT NULL,
  is_visible BOOLEAN DEFAULT true,
  display_order INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (section_type)
);

-- SECTION 2: MAIN PAGE SECTIONS

-- Hero Section (Mandatory)
CREATE TABLE hero_section (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  designation_title TEXT NOT NULL CHECK (length(designation_title) <= 30),
  quote TEXT CHECK (length(quote) <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- About Section (Mandatory)
CREATE TABLE about_section (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL CHECK (length(content) <= 600),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills Section (Mandatory)
CREATE TABLE skills_section (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Individual Skills
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (length(name) <= 20),
  category skill_category NOT NULL,
  level skill_level NOT NULL,
  icon_url TEXT,
  is_visible BOOLEAN DEFAULT true,
  display_order INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Experience Section (Optional)
CREATE TABLE experience_section (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Experience Entries
CREATE TABLE experience_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL CHECK (length(title) <= 50),
  role TEXT CHECK (length(role) <= 30),
  date_start DATE NOT NULL,
  date_end DATE,
  is_current BOOLEAN DEFAULT false,
  description TEXT NOT NULL CHECK (length(description) <= 250),
  display_order INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Testimonials Section (Optional)
CREATE TABLE testimonials_section (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Individual Testimonials
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (length(name) <= 30),
  review_text TEXT NOT NULL CHECK (length(review_text) <= 300),
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  avatar_url TEXT,
  is_visible BOOLEAN DEFAULT true,
  display_order INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social Glimpse Carousel (Optional)
CREATE TABLE social_glimpse_section (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social Media Posts
CREATE TABLE social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL CHECK (length(title) <= 30),
  platform TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  post_link TEXT NOT NULL,
  is_visible BOOLEAN DEFAULT true,
  display_order INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact Section (Mandatory)
CREATE TABLE contact_section (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  resume_url TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social Media Links for Contact
CREATE TABLE social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  display_order INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CTA Buttons for Contact
CREATE TABLE cta_buttons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  url TEXT NOT NULL,
  style TEXT DEFAULT 'primary',
  display_order INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SECTION 3: PROJECT GALLERY PAGE

-- Projects Table (Main Projects Repository)
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  short_description TEXT NOT NULL CHECK (length(short_description) <= 200),
  category project_category NOT NULL,
  type TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  display_order INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tags for Projects
CREATE TABLE project_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  tag TEXT NOT NULL CHECK (length(tag) <= 50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Featured Projects (for Homepage)
CREATE TABLE featured_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  custom_title TEXT,
  custom_description TEXT,
  custom_thumbnail_url TEXT,
  display_order INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (project_id)
);

-- SECTION 4: PROJECT DETAIL PAGE

-- Project Section Visibility
CREATE TABLE project_section_visibility (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  section_type section_type NOT NULL,
  is_visible BOOLEAN DEFAULT true,
  display_order INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (project_id, section_type)
);

-- Project Hero Section (Mandatory)
CREATE TABLE project_hero_section (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  banner_url TEXT NOT NULL,
  is_video BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (project_id)
);

-- Quick Info Strip
CREATE TABLE quick_info_strip (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  tools JSONB DEFAULT '[]',
  duration TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (project_id)
);

-- Project Summary
CREATE TABLE project_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (length(content) <= 500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (project_id)
);

-- Problem Solution Section
CREATE TABLE problem_solution (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  problem TEXT NOT NULL CHECK (length(problem) <= 1000),
  solution TEXT NOT NULL CHECK (length(solution) <= 1000),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (project_id)
);

-- Design Process Section
CREATE TABLE design_process (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (project_id)
);

-- Design Process Steps
CREATE TABLE design_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  process_id UUID REFERENCES design_process(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  media_url TEXT,
  display_order INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Features Section
CREATE TABLE features_section (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (project_id)
);

-- Individual Features
CREATE TABLE features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID REFERENCES features_section(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (length(title) <= 50),
  description TEXT NOT NULL CHECK (length(description) <= 150),
  icon TEXT,
  display_order INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resource Links Section
CREATE TABLE resource_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  github_url TEXT,
  live_url TEXT,
  blog_url TEXT,
  download_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (project_id)
);

-- Results & Learnings Section
CREATE TABLE results_learnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (length(content) <= 500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (project_id)
);

-- Visual Showcase Section
CREATE TABLE visual_showcase (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (project_id)
);

-- Gallery Images/Videos
CREATE TABLE gallery_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  showcase_id UUID REFERENCES visual_showcase(id) ON DELETE CASCADE,
  title TEXT,
  description TEXT,
  media_url TEXT NOT NULL,
  is_video BOOLEAN DEFAULT false,
  display_order INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings for CMS
CREATE TABLE cms_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  autosave_enabled BOOLEAN DEFAULT true,
  theme TEXT DEFAULT 'dark',
  mobile_preview_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Initialize default settings
INSERT INTO cms_settings (autosave_enabled, theme, mobile_preview_default) 
VALUES (true, 'dark', false)
ON CONFLICT DO NOTHING; 