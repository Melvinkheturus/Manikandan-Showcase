import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Create Auth Context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing auth on component mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const authData = localStorage.getItem('cms_auth');
        if (authData) {
          const parsedAuth = JSON.parse(authData);
          // Check if token has expired
          if (parsedAuth.expiry && parsedAuth.expiry > new Date().getTime()) {
            setUser(parsedAuth.user);
          } else {
            // Token expired, remove from storage
            localStorage.removeItem('cms_auth');
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = (userData, token) => {
    const authData = {
      user: userData,
      token,
      expiry: new Date().getTime() + (24 * 60 * 60 * 1000) // 24 hours from now
    };
    localStorage.setItem('cms_auth', JSON.stringify(authData));
    setUser(userData);
    navigate('/admin/dashboard');
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('cms_auth');
    setUser(null);
    navigate('/admin/login');
  };

  // Get token for API requests
  const getToken = () => {
    try {
      const authData = localStorage.getItem('cms_auth');
      if (authData) {
        const parsedAuth = JSON.parse(authData);
        if (parsedAuth.expiry && parsedAuth.expiry > new Date().getTime()) {
          return parsedAuth.token;
        }
      }
      return null;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user;
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user && user.role === role;
  };

  // Auth context value
  const value = {
    user,
    loading,
    login,
    logout,
    getToken,
    isAuthenticated,
    hasRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider; 