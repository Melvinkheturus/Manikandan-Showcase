# Manikandan Portfolio

A modern, responsive portfolio website built with Vite, React, Tailwind CSS, and Supabase. Features animated sections, smooth scrolling, and dark mode.

## Features

- **Responsive Design**: Looks great on all devices from mobile to desktop
- **Smooth Scrolling**: GSAP ScrollSmoother for buttery-smooth scrolling
- **Dark/Light Mode**: Toggle between themes with a persistent preference
- **Animated UI**: Beautiful animations with Framer Motion and GSAP
- **3D Effects**: Background particles using React Three Fiber
- **Contact Form**: Functional contact form that saves data to Supabase
- **CMS Integration**: Complete content management system with Supabase
- **Dynamic Hero Section**: Responsive mobile and desktop layouts
- **Interactive About Section**: Scroll-based animations
- **Skills Marquee**: Showcasing technical skills
- **Project Gallery**: Various display styles
- **Social Glimpse Carousel**: Cinematic social media showcase
- **Smooth Transitions**: Scroll-based animations

## New Addition: Social Glimpse Carousel

The Social Glimpse Carousel is a cinematic social media showcase that presents your content from various platforms in an engaging, auto-scrolling reel. Key features include:

- Auto-scrolling carousel with smooth transitions
- Three-post display with focus on center post
- Platform-specific styling and icons
- Responsive design for mobile and desktop
- Fallback gradients when images are unavailable
- Hover interactions that pause autoplay

## Enhanced CMS Features

The portfolio now includes an enhanced Content Management System with flexible editing capabilities for all aspects of your portfolio:

### Main Page Editor

- **Visual component-based editing** with live previews
- **Section visibility toggles** to show/hide sections
- **Character restrictions** with visual warnings
- **Drag-and-drop reordering** for skills, experience, and more
- **Mobile/desktop preview toggle** for responsive design testing

### Project Gallery Editor

- **Category-based project management** with different display styles:
  - Visual Identity (Pinterest style masonry grid)
  - UI/UX Design (Snap Scroll cards)
  - Development (Terminal-styled project cards)
  - AI Projects (Zoom Grid with interactions)
  - Creative Lab (Freeform experiments)
- **Drag-and-drop reordering** of projects within categories
- **Featured project selection** for homepage display
- **Image upload with preview** for project thumbnails
- **Tagging system** for project filtering and categorization

### Project Detail Editor

- **Modular section-based editing** for project pages
- **10 section types** for comprehensive project presentation:
  - Project Hero (title, subtitle, banner)
  - Quick Info Strip (tools, duration, role)
  - Project Summary (overview text)
  - Problem-Solution (challenge and approach)
  - Design Process (step-by-step visuals)
  - Features (key capabilities)
  - Resource Links (GitHub, live demo, etc.)
  - Results & Learnings (outcomes)
  - Visual Showcase (gallery)
  - Project Navigation (auto-generated)
- **Section visibility controls** and **drag-and-drop reordering**
- **Character limits** and **media validation**

## Enhanced CMS Setup

To use the enhanced CMS:

1. Update your Supabase database schema:
   ```
   node src/utils/setupEnhancedCMS.js
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Navigate to `/admin` and login

4. Use the "CMS" section in the sidebar to access:
   - Main Page Editor
   - Project Gallery
   - Project Details (via the Project Gallery)

## CMS Usage Tips

- **Main Page Editor**: Organize your portfolio's main sections with live previews
- **Project Gallery**: Manage projects by category with visual editing tools
- **Project Detail**: Create rich, modular project pages with consistent structure
- **Mobile Preview**: Test how your edits look on mobile devices
- **Character Limits**: Stay within recommended text lengths for optimal design

## Technologies

- **React**: UI library
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **GSAP**: Animation library
- **Framer Motion**: React animation library
- **React Three Fiber**: 3D rendering in React
- **Supabase**: Backend-as-a-Service for data storage and API

## CMS & Database Structure

This project includes a full CMS and database setup using Supabase. The database structure includes:

1. **page_sections** - Homepage content sections (hero, about, skills, etc.)
   - Each section has a `content` JSONB field for flexible content modeling
   - Content is managed through the Supabase dashboard

2. **projects** - Portfolio projects information
   - Complete project metadata including tags, thumbnail, live/source URLs
   - Flexible content structure using JSONB

3. **project_sections** - Content sections for individual project pages
   - Modular sections like intro, meta, problem-solution, showcase
   - Ordered by position for flexible layout

4. **global_settings** - Site-wide settings and configurations
   - Theme settings, SEO metadata, contact information

See `src/database/` directory for SQL schema, seed data, and setup instructions.

## Database Setup

1. Create a Supabase project at https://supabase.com
2. Navigate to the database setup directory:
   ```
   cd src/database
   ```
3. Copy the example environment file:
   ```
   cp env-example .env
   ```
4. Update `.env` with your Supabase credentials from the dashboard
5. Install dependencies and run the setup script:
   ```
   npm install
   npm run setup
   ```

## Development Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/manikandan_portfolio.git
   cd manikandan_portfolio
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Build for production:
   ```
   npm run build
   ```

## Customization

- **Content**: Edit the content directly in Supabase using the dashboard
- **Styling**: Modify the Tailwind config in `tailwind.config.js`
- **Colors**: Change the primary and background colors in the Tailwind config
- **Projects**: Add and edit projects through the Supabase dashboard
- **Sections**: Enable/disable and reorder sections through the dashboard

## License

MIT
