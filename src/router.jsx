import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Home from './portfolio/pages/Home';
import ProjectDetail from './portfolio/pages/ProjectDetail';
import ProjectGallery from './portfolio/pages/ProjectGallery';
import AdminApp from './admin/CMSHelper/AdminApp';
import NotFound from './portfolio/pages/NotFound';

// Create a router with routes
const router = createBrowserRouter([
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

// Provide the router to your app
const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
