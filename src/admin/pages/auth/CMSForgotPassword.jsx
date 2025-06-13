import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import Toaster from '../../components/Toaster';

const CMSForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!email) {
      setToast({
        show: true,
        message: 'Please enter your email address',
        type: 'error'
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, make a fetch call to your password reset API
      // For demo, we'll use a timeout to simulate API call
      setTimeout(() => {
        setIsLoading(false);
        setIsSubmitted(true);
        
        // Show success toast
        setToast({
          show: true,
          message: 'Password reset instructions sent to your email',
          type: 'success'
        });
      }, 1500);
    } catch (error) {
      console.error('Password reset error:', error);
      setToast({
        show: true,
        message: 'An error occurred while processing your request',
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
            Reset Password
          </h1>
          <h2 className="mt-3 text-center text-xl font-medium text-gray-600 dark:text-gray-300">
            We'll send you instructions via email
          </h2>
        </div>
        
        {!isSubmitted ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-emerald-400 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : 'Send Reset Instructions'}
              </button>
            </div>
            
            <div className="flex items-center justify-center">
              <Link 
                to="/admin/login" 
                className="flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-500"
              >
                <FiArrowLeft className="mr-1" />
                Back to login
              </Link>
            </div>
          </form>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-md border border-emerald-200 dark:border-emerald-800">
              <h3 className="text-lg font-medium text-emerald-800 dark:text-emerald-200">
                Check your email
              </h3>
              <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-300">
                We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the instructions.
              </p>
              <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">
                The link will expire in 30 minutes.
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Didn't receive the email?
              </p>
              <button 
                onClick={handleSubmit} 
                disabled={isLoading}
                className="text-sm font-medium text-emerald-600 hover:text-emerald-500"
              >
                {isLoading ? 'Sending...' : 'Click here to resend'}
              </button>
              <div className="pt-2">
                <Link 
                  to="/admin/login" 
                  className="flex items-center justify-center text-sm font-medium text-emerald-600 hover:text-emerald-500"
                >
                  <FiArrowLeft className="mr-1" />
                  Return to login
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="text-center text-xs text-gray-500 dark:text-gray-500">
          <p>This is a demo page. No actual emails will be sent.</p>
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
};

export default CMSForgotPassword; 