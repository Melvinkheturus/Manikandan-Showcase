import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Home from './portfolio/pages/Home';
import ProjectDetail from './portfolio/pages/ProjectDetail';
import ProjectGallery from './portfolio/pages/ProjectGallery';
import AdminApp from './admin/CMSHelper/AdminApp';
import NotFound from './portfolio/pages/NotFound';
import FramerMotionProvider from './context/FramerMotionProvider';

// Ensure browser environment for router
const createRouter = () => {
  // In SSR environments without browser APIs, return empty routes
  if (typeof window === 'undefined') {
    return {
      routes: []
    };
  }
  
  // Only create browser router in browser environment
  return createBrowserRouter([
    {
      path: '/*',
      element: <App />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: 'projects/:slug',
          element: <ProjectDetail />,
        },
        {
          path: 'projects',
          element: <ProjectGallery />,
        },
        {
          path: '*',
          element: <NotFound />,
        },
      ],
    },
    {
      path: '/admin/*',
      element: <AdminApp />,
    },
  ]);
};

// Create router instance
const router = createRouter();

// Provide the router to your app
const Router = () => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return null; // Return null during SSR
  }
  
  // Wrap RouterProvider with our FramerMotionProvider for SSR compatibility
  return (
    <FramerMotionProvider>
      <RouterProvider router={router} />
    </FramerMotionProvider>
  );
};

export default Router;
