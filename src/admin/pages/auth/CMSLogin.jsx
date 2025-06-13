import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import Toaster from '../../components/Toaster';

const CMSLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.email || !formData.password) {
      setToast({
        show: true,
        message: 'Please enter both email and password',
        type: 'error'
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, make a fetch call to your authentication API
      // For demo, we'll use a timeout to simulate API call
      setTimeout(() => {
        // Mock successful login - hardcoded credentials for demo only
        if (formData.email === 'admin@example.com' && formData.password === 'password123') {
          // Store token or user data in localStorage or context
          localStorage.setItem('cms_auth', JSON.stringify({
            user: {
              name: 'Admin User',
              email: formData.email,
              role: 'admin'
            },
            token: 'mock-token-xyz-123',
            expiry: new Date().getTime() + (24 * 60 * 60 * 1000) // 24 hours from now
          }));
          
          // Redirect to dashboard
          navigate('/admin/dashboard');
        } else {
          // Show error message
          setToast({
            show: true,
            message: 'Invalid email or password',
            type: 'error'
          });
          setIsLoading(false);
        }
      }, 1000);
    } catch (error) {
      console.error('Login error:', error);
      setToast({
        show: true,
        message: 'An error occurred during login',
        type: 'error'
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
            Portfolio CMS
          </h1>
          <h2 className="mt-3 text-center text-xl font-medium text-gray-600 dark:text-gray-300">
            Sign in to your account
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Email address"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Password"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link to="/admin/forgot-password" className="font-medium text-emerald-600 hover:text-emerald-500">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-emerald-400 disabled:cursor-not-allowed"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <FiLogIn className="h-5 w-5 text-emerald-500 group-hover:text-emerald-400" />
              </span>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>Demo credentials for testing:</p>
            <p className="font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1">
              Email: admin@example.com<br />
              Password: password123
            </p>
          </div>
        </form>
      </div>
      
      {/* Toast Notification */}
      <Toaster 
        show={toast.show} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({...toast, show: false})} 
      />
    </div>
  );
};

export default CMSLogin; 