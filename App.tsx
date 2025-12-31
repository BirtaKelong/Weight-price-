
import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { Calculator } from './components/Calculator';
import { History } from './components/History';
import { ThemeContextType } from './types';

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Sync with system preference if user hasn't set a manual override
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <div className="min-h-screen pb-12 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <header className="sticky top-0 z-20 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none">
                <i className="fas fa-balance-scale text-white text-sm"></i>
              </div>
              <h1 className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 truncate">
                Weight & Price Pro
              </h1>
            </div>
            
            {/* Upgraded Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="relative flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-full border border-slate-200 dark:border-slate-700 w-14 h-8 transition-all hover:ring-2 hover:ring-indigo-500/20 active:scale-95"
              aria-label="Toggle Theme"
            >
              <div className={`absolute top-1 left-1 w-6 h-6 rounded-full shadow-sm transform transition-transform duration-300 flex items-center justify-center ${isDarkMode ? 'translate-x-6 bg-indigo-500' : 'translate-x-0 bg-white'}`}>
                {isDarkMode ? (
                  <i className="fas fa-moon text-[10px] text-white"></i>
                ) : (
                  <i className="fas fa-sun text-[10px] text-yellow-500"></i>
                )}
              </div>
              <div className="w-full flex justify-between px-2 pointer-events-none">
                <i className="fas fa-sun text-[10px] text-slate-400 opacity-50"></i>
                <i className="fas fa-moon text-[10px] text-slate-400 opacity-50"></i>
              </div>
            </button>
          </div>
        </header>

        <main className="max-w-xl mx-auto px-4 mt-6 sm:mt-8 space-y-6 sm:space-y-8">
          <Calculator />
          <History />
        </main>
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

export default App;
