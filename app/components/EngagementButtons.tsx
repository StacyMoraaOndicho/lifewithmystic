'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface EngagementProps {
  postId: string;
  initialLikes?: number;
  initialBookmarks?: number;
}

export function EngagementButtons({ postId, initialLikes = 0, initialBookmarks = 0 }: EngagementProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [bookmarks, setBookmarks] = useState(initialBookmarks);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const trackAction = async (action: string) => {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, action }),
      });
    } catch (err) {
      console.error('Failed to track action:', err);
    }
  };

  const handleLike = async () => {
    if (!liked) {
      setLikes(likes + 1);
      setLiked(true);
      await trackAction('like');
    }
  };

  const handleBookmark = async () => {
    if (!bookmarked) {
      setBookmarks(bookmarks + 1);
      setBookmarked(true);
      await trackAction('bookmark');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="flex gap-4 my-8"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleLike}
        className={`glass px-6 py-3 rounded-lg font-semibold transition-all ${
          liked
            ? 'bg-red-500/20 text-red-300 border-red-500/50'
            : 'hover:bg-red-500/10'
        }`}
      >
        {liked ? '❤️' : '🤍'} {likes}
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleBookmark}
        className={`glass px-6 py-3 rounded-lg font-semibold transition-all ${
          bookmarked
            ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
            : 'hover:bg-amber-500/10'
        }`}
      >
        {bookmarked ? '⭐' : '☆'} {bookmarks}
      </motion.button>
    </motion.div>
  );
}
