'use client';

import { motion } from 'framer-motion';

interface SocialShareProps {
  title: string;
  url: string;
  excerpt?: string;
}

export function SocialShare({ title, url, excerpt }: SocialShareProps) {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const fullUrl = `${baseUrl}${url}`;
  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedExcerpt = encodeURIComponent(excerpt || '');

  const shares = [
    {
      name: 'Twitter',
      icon: '𝕏',
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: 'hover:text-blue-400',
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'hover:text-blue-600',
    },
    {
      name: 'Facebook',
      icon: '📘',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:text-blue-500',
    },
    {
      name: 'Copy Link',
      icon: '🔗',
      url: '#',
      color: 'hover:text-amber-400',
      onClick: () => {
        navigator.clipboard.writeText(fullUrl);
        alert('Link copied!');
      },
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 my-8 p-4 glass rounded-lg"
    >
      <span className="text-white/70 font-medium">Share:</span>
      <div className="flex gap-3">
        {shares.map((share) => (
          <motion.a
            key={share.name}
            href={share.url}
            onClick={(e) => {
              if (share.onClick) {
                e.preventDefault();
                share.onClick();
              } else if (share.url !== '#') {
                window.open(share.url, '_blank', 'width=600,height=400');
                e.preventDefault();
              }
            }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            title={share.name}
            className={`text-xl transition-all ${share.color}`}
          >
            {share.icon}
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
}
