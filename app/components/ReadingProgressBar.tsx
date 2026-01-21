'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const scrolled = (window.scrollY / scrollHeight) * 100;
        setProgress(scrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 h-1 bg-gradient-to-r from-amber-300 via-rose-300 to-purple-300 origin-left z-40"
      style={{ width: `${progress}%` }}
      transition={{ duration: 0.1 }}
    />
  );
}
