import React, { createContext, useState, useEffect } from 'react';
import { getUserProfile, updateUserSettings } from '../services/api/userApi';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeTheme = async () => {
      try {
        const response = await getUserProfile();
        const userTheme = response.user?.settings?.theme || 'dark';
        setTheme(userTheme);
        applyTheme(userTheme);
      } catch {
        // If not authenticated, use localStorage or default
        const savedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(savedTheme);
        applyTheme(savedTheme);
      } finally {
        setIsLoading(false);
      }
    };

    initializeTheme();
  }, []);

  const applyTheme = (newTheme) => {
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    applyTheme(newTheme);

    try {
      await updateUserSettings({ theme: newTheme });
    } catch (error) {
      console.error('Failed to update theme in backend:', error);
      // Optionally revert on failure
      // setTheme(theme);
      // applyTheme(theme);
    }
  };

  const setThemeValue = async (newTheme) => {
    if (newTheme !== theme) {
      setTheme(newTheme);
      applyTheme(newTheme);

      try {
        await updateUserSettings({ theme: newTheme });
      } catch (error) {
        console.error('Failed to update theme in backend:', error);
      }
    }
  };

  const value = {
    theme,
    toggleTheme,
    setTheme: setThemeValue,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
