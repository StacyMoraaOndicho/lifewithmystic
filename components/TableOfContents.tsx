'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({ content }: { content: string }) {
  const [items, setItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    // Parse markdown headings from content
    const headings: TOCItem[] = [];
    const regex = /^(#{1,6})\s+(.+)$/gm;
    let match;

    while ((match = regex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2];
      const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      headings.push({ id, text, level });
    }

    setItems(headings);

    // Intersection Observer for active heading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId((entry.target as HTMLElement).id);
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [content]);

  if (items.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="hidden lg:block fixed left-8 top-32 w-64 max-h-96 overflow-y-auto"
    >
      <div className="text-sm font-semibold mb-4">Table of Contents</div>
      <nav className="space-y-2">
        {items.map((item) => (
          <motion.a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => {
              e.preventDefault();
              const element = document.getElementById(item.id);
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`block px-3 py-1 rounded transition-colors text-xs ${
              activeId === item.id
                ? 'bg-blue-500/30 text-blue-300'
                : 'text-opacity-70 hover:text-opacity-100'
            }`}
            style={{ marginLeft: `${(item.level - 1) * 12}px` }}
            whileHover={{ x: 4 }}
          >
            {item.text}
          </motion.a>
        ))}
      </nav>
    </motion.div>
  );
}
