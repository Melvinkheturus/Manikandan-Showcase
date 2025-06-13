import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider } from '../components/AuthProvider';
import CMSAdminLayout from './CMSAdminLayout';
import CMSLogin from '../pages/auth/CMSLogin';
import CMSDashboard from '../pages/CMSDashboard';

// Lazy load components
const CMSProfile = lazy(() => import('../pages/CMSProfile'));
const CMSSettings = lazy(() => import('../pages/CMSSettings'));
const CMSProjects = lazy(() => import('../pages/CMSProjects'));
const CMSProjectForm = lazy(() => import('../pages/CMSProjectForm'));
const ProjectGalleryCMS = lazy(() => import('../pages/ProjectGalleryCMS'));
const ProjectDetails = lazy(() => import('../pages/sections/CMSProjectDetail'));
const Assets = lazy(() => import('../pages/Assets'));
const MediaUploadGuide = lazy(() => import('../pages/MediaUploadGuide'));

// Section pages
const CMSHeroPage = lazy(() => import('../pages/sections/CMSHeroPage'));
const CMSAboutPage = lazy(() => import('../pages/sections/CMSAboutPage'));
const CMSSkillsPage = lazy(() => import('../pages/sections/CMSSkillsPage'));
const CMSProjectShowcasePage = lazy(() => import('../pages/sections/CMSProjectShowcase'));
const CMSExperiencePage = lazy(() => import('../pages/sections/CMSExperiencePage'));
const CMSTestimonialsPage = lazy(() => import('../pages/sections/CMSTestimonials'));
const CMSSocialPage = lazy(() => import('../pages/sections/CMSSocialCarousel'));
const CMSContactsPage = lazy(() => import('../pages/sections/CMSContacts'));
const CMSSectionsIndex = lazy(() => import('../pages/sections/CMSSectionsIndex'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="w-full h-screen flex items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-12 h-12 border-4 border-gray-700 border-t-emerald-500 rounded-full animate-spin"></div>
      <p className="text-lg text-gray-300">Loading...</p>
    </div>
  </div>
);

function AdminApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<CMSLogin />} />
        <Route path="/" element={<CMSAdminLayout />}>
          <Route index element={<CMSDashboard />} />
          
          {/* User Profile */}
          <Route path="profile" element={
            <Suspense fallback={<LoadingFallback />}>
              <CMSProfile />
            </Suspense>
          } />
          
          {/* Settings */}
          <Route path="settings" element={
            <Suspense fallback={<LoadingFallback />}>
              <CMSSettings />
            </Suspense>
          } />
          
          {/* Section Pages */}
          <Route path="sections" element={
            <Suspense fallback={<LoadingFallback />}>
              <CMSSectionsIndex />
            </Suspense>
          } />
          
          <Route path="sections/hero" element={
            <Suspense fallback={<LoadingFallback />}>
              <CMSHeroPage />
            </Suspense>
          } />
          
          <Route path="sections/about" element={
            <Suspense fallback={<LoadingFallback />}>
              <CMSAboutPage />
            </Suspense>
          } />
          
          <Route path="sections/skills" element={
            <Suspense fallback={<LoadingFallback />}>
              <CMSSkillsPage />
            </Suspense>
          } />
          
          <Route path="sections/project-showcase" element={
            <Suspense fallback={<LoadingFallback />}>
              <CMSProjectShowcasePage />
            </Suspense>
          } />
          
          <Route path="sections/experience" element={
            <Suspense fallback={<LoadingFallback />}>
              <CMSExperiencePage />
            </Suspense>
          } />
          
          <Route path="sections/testimonials" element={
            <Suspense fallback={<LoadingFallback />}>
              <CMSTestimonialsPage />
            </Suspense>
          } />
          
          <Route path="sections/social" element={
            <Suspense fallback={<LoadingFallback />}>
              <CMSSocialPage />
            </Suspense>
          } />
          
          <Route path="sections/contacts" element={
            <Suspense fallback={<LoadingFallback />}>
              <CMSContactsPage />
            </Suspense>
          } />
          
          {/* Project management */}
          <Route path="sections/project-gallery" element={
            <Suspense fallback={<LoadingFallback />}>
              <ProjectGalleryCMS />
            </Suspense>
          } />
          
          <Route path="project-details/:projectId" element={
            <Suspense fallback={<LoadingFallback />}>
              <ProjectDetails />
            </Suspense>
          } />
          
          <Route path="sections/project-detail" element={
            <Suspense fallback={<LoadingFallback />}>
              <Navigate to="/admin/project-details/new" replace />
            </Suspense>
          } />
          
          {/* Assets */}
          <Route path="assets" element={
            <Suspense fallback={<LoadingFallback />}>
              <Assets />
            </Suspense>
          } />
          
          {/* Media Upload Guide */}
          <Route path="media-guide" element={
            <Suspense fallback={<LoadingFallback />}>
              <MediaUploadGuide />
            </Suspense>
          } />
          
          {/* Classic Projects Management (legacy) */}
          <Route path="projects" element={
            <Suspense fallback={<LoadingFallback />}>
              <CMSProjects />
            </Suspense>
          } />
          
          <Route path="projects/new" element={
            <Suspense fallback={<LoadingFallback />}>
              <CMSProjectForm />
            </Suspense>
          } />
          
          <Route path="projects/edit/:id" element={
            <Suspense fallback={<LoadingFallback />}>
              <CMSProjectForm />
            </Suspense>
          } />
          
          {/* Redirect any unmatched routes to /admin */}
          <Route path="*" element={<Navigate to="." replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

// Helper component to redirect old section paths to new ones
const RedirectToSection = () => {
  const { sectionId } = useParams();
  
  // Map old section IDs to new paths
  const sectionMap = {
    'hero': '/admin/sections/hero',
    'about': '/admin/sections/about',
    'skills': '/admin/sections/skills', 
    'projects': '/admin/sections/project-showcase',
    'experience': '/admin/sections/experience',
    'testimonials': '/admin/sections/testimonials',
    'socialGlimpse': '/admin/sections/social',
    'contact': '/admin/sections/contacts'
  };
  
  // Redirect to the appropriate section, or to sections index if not found
  const redirectTo = sectionMap[sectionId] || '/admin/sections';
  
  return <Navigate to={redirectTo} replace />;
};

export default AdminApp; 