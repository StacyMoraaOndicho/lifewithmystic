'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';

const customThemes = [
  { name: 'burgundy', bg: '#5c1a1a', text: '#f5e6e6', accent: '#c41e3a' },
  { name: 'lightblue', bg: '#e6f2ff', text: '#0a3a5c', accent: '#0066cc' },
  { name: 'emerald', bg: '#0d4d3f', text: '#e0f2f1', accent: '#00b894' },
  { name: 'sunset', bg: '#2d2416', text: '#f5e6d3', accent: '#ff8c42' },
  { name: 'lavender', bg: '#3d2a5c', text: '#f0e6ff', accent: '#b19cd9' },
  { name: 'forest', bg: '#1a3a2a', text: '#d4e8e0', accent: '#2ecc71' },
];

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<string>('dark');

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('app-theme');
    if (saved) {
      setCurrentTheme(saved);
      if (saved === 'light') {
        document.documentElement.style.setProperty('--color-bg', '#f5f1ed');
        document.documentElement.style.setProperty('--color-text', '#2d2d2d');
        document.documentElement.style.setProperty('--color-accent', '#c41e3a');
        document.body.style.backgroundColor = '#f5f1ed';
        document.body.style.color = '#2d2d2d';
      } else if (saved === 'dark') {
        document.documentElement.style.setProperty('--color-bg', '#0a0a0a');
        document.documentElement.style.setProperty('--color-text', '#ededed');
        document.documentElement.style.setProperty('--color-accent', '#ff6b9d');
        document.body.style.backgroundColor = '#0a0a0a';
        document.body.style.color = '#ededed';
      } else {
        // It's a custom theme
        const colors = localStorage.getItem(`theme-${saved}`);
        if (colors) {
          const parsed = JSON.parse(colors);
          applyCustomThemeStyles(parsed);
        }
      }
    } else {
      setCurrentTheme('dark');
      setTheme('dark');
      document.documentElement.style.setProperty('--color-bg', '#0a0a0a');
      document.documentElement.style.setProperty('--color-text', '#ededed');
      document.documentElement.style.setProperty('--color-accent', '#ff6b9d');
      document.body.style.backgroundColor = '#0a0a0a';
      document.body.style.color = '#ededed';
    }
  }, [setTheme]);

  const applyCustomThemeStyles = (colors: any) => {
    // Apply to HTML element
    document.documentElement.style.setProperty('--color-bg', colors.bg);
    document.documentElement.style.setProperty('--color-text', colors.text);
    document.documentElement.style.setProperty('--color-accent', colors.accent);
    
    // Apply to body and main elements
    document.body.style.backgroundColor = colors.bg;
    document.body.style.color = colors.text;
    
    const main = document.querySelector('main');
    if (main) {
      main.style.backgroundColor = colors.bg;
      main.style.color = colors.text;
    }
  };

  const selectLightMode = () => {
    setTheme('light');
    setCurrentTheme('light');
    localStorage.setItem('app-theme', 'light');
    
    // Apply light mode colors
    document.documentElement.style.setProperty('--color-bg', '#f5f1ed');
    document.documentElement.style.setProperty('--color-text', '#2d2d2d');
    document.documentElement.style.setProperty('--color-accent', '#c41e3a');
    document.body.style.backgroundColor = '#f5f1ed';
    document.body.style.color = '#2d2d2d';
    
    const main = document.querySelector('main');
    if (main) {
      main.style.backgroundColor = '#f5f1ed';
      main.style.color = '#2d2d2d';
    }
    
    setIsOpen(false);
  };

  const selectDarkMode = () => {
    setTheme('dark');
    setCurrentTheme('dark');
    localStorage.setItem('app-theme', 'dark');
    
    // Apply dark mode colors
    document.documentElement.style.setProperty('--color-bg', '#0a0a0a');
    document.documentElement.style.setProperty('--color-text', '#ededed');
    document.documentElement.style.setProperty('--color-accent', '#ff6b9d');
    document.body.style.backgroundColor = '#0a0a0a';
    document.body.style.color = '#ededed';
    
    const main = document.querySelector('main');
    if (main) {
      main.style.backgroundColor = '#0a0a0a';
      main.style.color = '#ededed';
    }
    
    setIsOpen(false);
  };

  const applyCustomTheme = (themeName: string, colors: any) => {
    setCurrentTheme(themeName);
    localStorage.setItem('app-theme', themeName);
    localStorage.setItem(`theme-${themeName}`, JSON.stringify(colors));
    applyCustomThemeStyles(colors);
    setTheme('system');
    setIsOpen(false);
  };

  if (!mounted) return null;

  const getIcon = () => {
    if (currentTheme === 'light') return '☀️';
    if (currentTheme === 'dark') return '🌙';
    return '🎨';
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-white/10 transition-colors text-xl"
        title="Theme options"
      >
        {getIcon()}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 bg-white/20 dark:bg-black/20 backdrop-blur-lg border border-white/30 dark:border-white/10 rounded-lg shadow-xl z-50 p-4"
          >
            <div className="space-y-3">
              {/* Light Mode */}
              <button
                onClick={selectLightMode}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  currentTheme === 'light'
                    ? 'bg-yellow-400/30 border border-yellow-400/50'
                    : 'hover:bg-white/10'
                }`}
              >
                <span className="text-xl">☀️</span>
                <span>Light Mode</span>
              </button>

              {/* Dark Mode */}
              <button
                onClick={selectDarkMode}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  currentTheme === 'dark'
                    ? 'bg-blue-400/30 border border-blue-400/50'
                    : 'hover:bg-white/10'
                }`}
              >
                <span className="text-xl">🌙</span>
                <span>Dark Mode</span>
              </button>

              {/* Divider */}
              <div className="h-px bg-white/20" />

              {/* Custom Themes */}
              <div className="text-sm font-semibold opacity-70 px-3">Custom Themes</div>
              <div className="grid grid-cols-2 gap-2">
                {customThemes.map((t) => (
                  <motion.button
                    key={t.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => applyCustomTheme(t.name, t)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      currentTheme === t.name
                        ? 'ring-2 ring-white/50 scale-105'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: t.accent,
                      color: t.text,
                    }}
                    title={t.name}
                  >
                    {t.name === 'lightblue' ? '💙' : ''}
                    {t.name === 'burgundy' ? '🔴' : ''}
                    {t.name === 'emerald' ? '💚' : ''}
                    {t.name === 'sunset' ? '🧡' : ''}
                    {t.name === 'lavender' ? '💜' : ''}
                    {t.name === 'forest' ? '🌲' : ''}
                    {' '}{t.name}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
