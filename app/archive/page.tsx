'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import sanityFetch from '@/lib/sanity';

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt?: string;
  _createdAt?: string;
  excerpt?: string;
};

export default function ArchivePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'recent' | 'older'>('all');

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await sanityFetch<Post[]>(
          `*[_type == "post"] | order(publishedAt desc) { _id, title, slug, publishedAt, _createdAt, excerpt }`
        );
        setPosts(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const formatDate = (date?: string) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getYear = (date?: string) => {
    if (!date) return '';
    return new Date(date).getFullYear().toString();
  };

  const groupedPosts = posts.reduce((acc, post) => {
    const year = getYear(post.publishedAt || post._createdAt);
    if (!acc[year]) acc[year] = [];
    acc[year].push(post);
    return acc;
  }, {} as Record<string, Post[]>);

  const filteredPosts = (() => {
    const now = new Date();
    const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6));
    
    if (filter === 'recent') {
      return posts.filter(p => new Date(p.publishedAt || p._createdAt || '') > sixMonthsAgo);
    }
    if (filter === 'older') {
      return posts.filter(p => new Date(p.publishedAt || p._createdAt || '') <= sixMonthsAgo);
    }
    return posts;
  })();

  const sortedYears = Object.keys(groupedPosts).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <main className="min-h-screen p-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <h1 className="text-5xl mb-2 font-light tracking-wide">Archive</h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-[2px] w-24 bg-gradient-to-r from-purple-400 to-rose-400 mb-8"
        />

        {/* Filter Buttons */}
        <div className="flex gap-3 mb-12">
          {(['all', 'recent', 'older'] as const).map((f) => (
            <motion.button
              key={f}
              onClick={() => setFilter(f)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-all ${
                filter === f
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-lg'
                  : 'border border-amber-300/30 hover:border-amber-300/60'
              }`}
            >
              {f}
            </motion.button>
          ))}
        </div>

        {loading && (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-center py-12"
          >
            Loading archive...
          </motion.div>
        )}

        {!loading && filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-gray-500"
          >
            <p>No posts found in this category.</p>
          </motion.div>
        )}

        {/* Timeline View */}
        {!loading && filteredPosts.length > 0 && (
          <div className="space-y-12">
            {sortedYears.map((year) => {
              const yearPosts = groupedPosts[year].filter(p => 
                filteredPosts.some(fp => fp._id === p._id)
              );
              
              if (yearPosts.length === 0) return null;

              return (
                <motion.div
                  key={year}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Year Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-3xl font-semibold text-amber-600 dark:text-amber-400">
                      {year}
                    </h2>
                    <div className="flex-1 h-[1px] bg-gradient-to-r from-amber-400 to-transparent" />
                    <span className="text-sm text-gray-500">
                      {yearPosts.length} post{yearPosts.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Posts in Year */}
                  <div className="space-y-3 ml-4 border-l-2 border-amber-300/30 pl-6">
                    {yearPosts.map((post, i) => (
                      <motion.div
                        key={post._id}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Link href={`/blog/${post.slug.current}`}>
                          <motion.div
                            whileHover={{ x: 8 }}
                            className="group cursor-pointer py-2"
                          >
                            <div className="flex items-start gap-3">
                              {/* Date bullet */}
                              <div className="mt-1.5 w-2 h-2 rounded-full bg-amber-500 group-hover:bg-rose-500 transition-colors flex-shrink-0" />
                              
                              {/* Post info */}
                              <div className="flex-1">
                                <h3 className="font-semibold group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors mb-1">
                                  {post.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {formatDate(post.publishedAt || post._createdAt)}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </main>
  );
}
