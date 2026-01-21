'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Footnote {
  id: string;
  text: string;
  citation: string;
}

interface FloatingFootnoteProps {
  children: React.ReactNode;
  footnote: Footnote;
}

export function FloatingFootnote({ children, footnote }: FloatingFootnoteProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="inline-block relative cursor-help"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="border-b border-amber-300/50 hover:border-amber-300 transition-colors">
        {children}
      </span>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-black/90 text-white/90 text-xs rounded-lg whitespace-nowrap pointer-events-none z-50"
          >
            {footnote.citation}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
