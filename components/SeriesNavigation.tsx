'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface SeriesPost {
  title: string;
  slug: string;
  position: number;
  total: number;
}

export default function SeriesNavigation({
  seriesTitle,
  currentPost,
  posts,
}: {
  seriesTitle: string;
  currentPost: SeriesPost;
  posts: SeriesPost[];
}) {
  const hasPrev = currentPost.position > 1;
  const hasNext = currentPost.position < currentPost.total;
  const prevPost = posts.find((p) => p.position === currentPost.position - 1);
  const nextPost = posts.find((p) => p.position === currentPost.position + 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="my-8 p-4 border border-blue-500/30 rounded-lg bg-blue-500/5"
    >
      <div className="text-xs font-semibold text-blue-400 mb-3 uppercase tracking-wider">
        📚 {seriesTitle} · Part {currentPost.position} of {currentPost.total}
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-blue-500/20 rounded-full mb-4 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(currentPost.position / currentPost.total) * 100}%` }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-full bg-blue-500"
        />
      </div>

      {/* All posts in series */}
      <div className="mb-4 space-y-2">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <motion.div
              className={`py-2 px-3 rounded text-sm transition-colors ${
                post.slug === currentPost.slug
                  ? 'bg-blue-500/20 text-blue-300 font-semibold'
                  : 'text-opacity-60 hover:text-opacity-100 hover:bg-blue-500/10'
              }`}
              whileHover={{ x: 4 }}
            >
              <span className="text-blue-400">Part {post.position}:</span> {post.title}
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between gap-4 pt-4 border-t border-blue-500/20">
        {hasPrev && prevPost ? (
          <Link href={`/blog/${prevPost.slug}`}>
            <motion.button
              whileHover={{ x: -4 }}
              className="text-sm px-3 py-2 rounded bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors"
            >
              ← Previous
            </motion.button>
          </Link>
        ) : (
          <div />
        )}

        {hasNext && nextPost ? (
          <Link href={`/blog/${nextPost.slug}`}>
            <motion.button
              whileHover={{ x: 4 }}
              className="text-sm px-3 py-2 rounded bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors"
            >
              Next →
            </motion.button>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </motion.div>
  );
}
