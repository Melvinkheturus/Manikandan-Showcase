import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FiLock, FiCheck } from 'react-icons/fi';
import Toaster from '../../components/Toaster';

const CMSResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [token, setToken] = useState('');
  const [isValidToken, setIsValidToken] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Extract token from URL params on component mount
  useEffect(() => {
    // In a real app, we'd get the token from the URL query parameter
    const params = new URLSearchParams(location.search);
    const resetToken = params.get('token');
    
    if (resetToken) {
      setToken(resetToken);
      // In a real app, we'd validate the token with the backend here
      validateToken(resetToken);
    } else {
      setIsValidToken(false);
      setToast({
        show: true,
        message: 'Invalid or expired password reset link',
        type: 'error'
      });
    }
  }, [location.search]);

  // Validate token (mock implementation)
  const validateToken = (resetToken) => {
    // In a real app, we'd make an API call to validate the token
    // For demo, we'll use a simple mock validation
    setIsValidToken(resetToken && resetToken.length > 8);
    
    if (!resetToken || resetToken.length <= 8) {
      setToast({
        show: true,
        message: 'Invalid or expired password reset link',
        type: 'error'
      });
    }
  };

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
    
    // Validation
    if (!formData.password || !formData.confirmPassword) {
      setToast({
        show: true,
        message: 'Please fill in all fields',
        type: 'error'
      });
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setToast({
        show: true,
        message: 'Passwords do not match',
        type: 'error'
      });
      return;
    }
    
    if (formData.password.length < 8) {
      setToast({
        show: true,
        message: 'Password must be at least 8 characters',
        type: 'error'
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, make a fetch call to your reset password API
      // For demo, we'll use a timeout to simulate API call
      setTimeout(() => {
        setIsLoading(false);
        setIsReset(true);
        
        // Show success toast
        setToast({
          show: true,
          message: 'Password reset successful!',
          type: 'success'
        });
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/admin/login');
        }, 3000);
      }, 1500);
    } catch (error) {
      console.error('Password reset error:', error);
      setToast({
        show: true,
        message: 'An error occurred while resetting your password',
        type: 'error'
      });
      setIsLoading(false);
    }
  };

  // If token is invalid, show error message
  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <h1 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
              Invalid Reset Link
            </h1>
          </div>
          
          <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-md border border-red-200 dark:border-red-800">
            <h3 className="text-lg font-medium text-red-800 dark:text-red-200">
              Link is invalid or expired
            </h3>
            <p className="mt-2 text-sm text-red-700 dark:text-red-300">
              The password reset link is invalid or has expired. Please request a new password reset link.
            </p>
          </div>
          
          <div>
            <Link
              to="/admin/forgot-password"
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Request New Reset Link
            </Link>
          </div>
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
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
            Reset Your Password
          </h1>
          <h2 className="mt-3 text-center text-xl font-medium text-gray-600 dark:text-gray-300">
            Create a new password for your account
          </h2>
        </div>
        
        {!isReset ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="password" className="sr-only">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-white"
                    placeholder="New password (8+ characters)"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-white"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-emerald-400 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : 'Reset Password'}
              </button>
            </div>
            
            <div>
              <p className="text-center text-xs text-gray-500 dark:text-gray-500">
                Your new password must be different from previously used passwords.
              </p>
            </div>
          </form>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-md border border-emerald-200 dark:border-emerald-800">
              <div className="flex justify-center mb-3">
                <div className="bg-emerald-100 dark:bg-emerald-800 rounded-full p-2">
                  <FiCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-300" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-emerald-800 dark:text-emerald-200 text-center">
                Password Reset Successful!
              </h3>
              <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-300 text-center">
                Your password has been reset successfully. You will be redirected to the login page in a few seconds.
              </p>
            </div>
            
            <div className="text-center">
              <Link 
                to="/admin/login" 
                className="font-medium text-emerald-600 hover:text-emerald-500"
              >
                Back to Login
              </Link>
            </div>
          </div>
        )}
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

export default CMSResetPassword; 