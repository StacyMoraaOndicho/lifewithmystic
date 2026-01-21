'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import sanityFetch from '@/lib/sanity';

type Post = {
  title: string;
  slug: { current: string };
  excerpt?: string;
  publishedAt?: string;
};

export default function RecentPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await sanityFetch<Post[]>(
          `*[_type == "post"] | order(publishedAt desc) [0..2] { title, slug, excerpt, publishedAt }`,
          {}
        );
        setPosts(data || []);
      } catch (err) {
        console.error('Failed to fetch recent posts:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const formatDate = (date?: string) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getRelativeTime = (date?: string) => {
    if (!date) return '';
    const now = new Date();
    const postDate = new Date(date);
    const diffMs = now.getTime() - postDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
          Loading recent essays...
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <h2 className="text-3xl font-semibold bg-gradient-to-r from-amber-400 via-rose-300 to-purple-300 bg-clip-text text-transparent">
        Recent Essays
      </h2>

      <div className="grid gap-4 md:grid-cols-3">
        {posts.map((post, i) => (
          <motion.div
            key={post.slug.current}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Link href={`/blog/${post.slug.current}`}>
              <motion.div
                whileHover={{ translateY: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
                className="p-6 rounded-lg border border-amber-300/20 bg-gradient-to-br from-amber-50/5 to-purple-50/5 dark:from-amber-950/10 dark:to-purple-950/10 hover:border-amber-300/40 transition-colors cursor-pointer group"
              >
                {/* Date Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-wider text-amber-600/60 dark:text-amber-300/60 font-semibold">
                    {formatDate(post.publishedAt)}
                  </span>
                  <span className="text-xs text-purple-500/60 dark:text-purple-300/60">
                    {getRelativeTime(post.publishedAt)}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold mb-2 group-hover:text-amber-400 transition-colors line-clamp-2">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                  {post.excerpt || 'Click to read more...'}
                </p>

                {/* Read More Link */}
                <motion.div
                  className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 font-semibold"
                  whileHover={{ gap: 8 }}
                >
                  <span>Read</span>
                  <motion.span transition={{ type: 'spring' }}>→</motion.span>
                </motion.div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>

      {posts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-gray-500"
        >
          <p>No essays published yet. Check back soon.</p>
        </motion.div>
      )}

      {posts.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center pt-4"
        >
          <Link href="/blog">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-rose-500 text-white font-semibold hover:shadow-lg transition-shadow"
            >
              View All Essays
            </motion.button>
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
}
