# Manikandan Portfolio

A modern, responsive portfolio website built with Vite, React, Tailwind CSS, and Supabase. Features animated sections, smooth scrolling, and dark mode.

## Features

- **Responsive Design**: Looks great on all devices from mobile to desktop
- **Smooth Scrolling**: GSAP ScrollSmoother for buttery-smooth scrolling
- **Dark/Light Mode**: Toggle between themes with a persistent preference
- **Animated UI**: Beautiful animations with Framer Motion and GSAP
- **3D Effects**: Background particles using React Three Fiber
- **Contact Form**: Functional contact form that saves data to Supabase
- **CMS Integration**: Project data stored in and fetched from Supabase

## Technologies

- **React**: UI library
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **GSAP**: Animation library
- **Framer Motion**: React animation library
- **React Three Fiber**: 3D rendering in React
- **Supabase**: Backend-as-a-Service for data storage and API

## Supabase Setup

This project uses Supabase for data management. The following tables are required:

1. **projects** - To store portfolio projects:
   - `id` (auto-generated)
   - `title` (text)
   - `description` (text)
   - `image` (text, URL to project image)
   - `tags` (array of strings)
   - `githubUrl` (text, optional)
   - `liveUrl` (text, optional)
   - `order` (integer for sorting)
   - `created_at` (timestamp)

2. **contact_messages** - To store contact form submissions:
   - `id` (auto-generated)
   - `name` (text)
   - `email` (text)
   - `subject` (text)
   - `message` (text)
   - `created_at` (timestamp)

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/manikandan_portfolio.git
   cd manikandan_portfolio
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. The Supabase connection is already configured in the project. If you need to use your own instance:
   - Create a Supabase project at https://supabase.com
   - Create the required tables as described above
   - Update the credentials in src/utils/supabaseClient.js

4. Start the development server:
   ```
   npm run dev
   ```

5. Build for production:
   ```
   npm run build
   ```

## Customization

- **Content**: Edit the text in the section components
- **Styling**: Modify the Tailwind config in `tailwind.config.js`
- **Colors**: Change the primary and background colors in the Tailwind config
- **Projects**: Add your projects to Supabase or modify the sample data in `ProjectsSection.jsx`
- **Contact**: The form automatically submits data to your Supabase instance

## License

MIT
