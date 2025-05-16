import { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Always use dark mode
  const isDarkMode = true;

  // Apply dark mode on component mount
  useEffect(() => {
    // Set dark mode in localStorage
    localStorage.setItem('theme', 'dark');
    
    // Ensure dark mode class is applied for Tailwind
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <ThemeContext.Provider value={{ isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext; 