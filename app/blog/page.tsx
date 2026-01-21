'use client';

import sanityFetch from "../../lib/sanity";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type PostPreview = {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt?: string;
  _createdAt?: string;
  excerpt?: string;
};

export default function BlogPage() {
  const [posts, setPosts] = useState<PostPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await sanityFetch<PostPreview[]>(
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

  const estimateReadTime = (excerpt?: string) => {
    const words = excerpt?.split(/\s+/).length || 0;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  return (
    <main className="min-h-screen p-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-5xl mb-2 font-light tracking-wide">Essays & Writings</h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-[2px] w-24 bg-gradient-to-r from-amber-400 to-rose-400 mb-8"
        />
        <p className="text-gray-600 dark:text-gray-400 mb-12">
          {posts.length === 0 ? 'No essays yet.' : `${posts.length} essay${posts.length !== 1 ? 's' : ''} published`}
        </p>

        {loading && (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-center py-12"
          >
            Loading essays...
          </motion.div>
        )}

        {!loading && posts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-gray-500"
          >
            <p>No posts found. Check back soon!</p>
          </motion.div>
        )}

        <div className="space-y-6">
          {posts.map((post, index) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/blog/${post.slug.current}`}>
                <motion.div
                  whileHover={{ translateX: 8 }}
                  className="group p-6 rounded-lg border border-amber-300/20 dark:border-amber-700/20 hover:border-amber-300/50 dark:hover:border-amber-500/50 bg-gradient-to-r from-amber-50/5 to-transparent dark:from-amber-950/5 dark:to-transparent transition-all duration-300 cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      {/* Title */}
                      <motion.h2
                        className="text-2xl font-semibold mb-3 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors"
                        whileHover={{ x: 4 }}
                      >
                        {post.title}
                      </motion.h2>

                      {/* Excerpt */}
                      <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                        {post.excerpt || 'Click to read this essay...'}
                      </p>

                      {/* Metadata */}
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span className="text-amber-600 dark:text-amber-400 font-semibold">
                          {formatDate(post.publishedAt || post._createdAt)}
                        </span>
                        <span className="text-purple-600/60 dark:text-purple-400/60">
                          {getRelativeTime(post.publishedAt || post._createdAt)}
                        </span>
                        <span className="text-gray-500 dark:text-gray-500 border-l border-gray-300 dark:border-gray-700 pl-4">
                          {estimateReadTime(post.excerpt)}
                        </span>
                      </div>
                    </div>

                    {/* Arrow indicator */}
                    <motion.div
                      className="text-2xl opacity-0 group-hover:opacity-100 transition-opacity text-amber-500"
                      animate={{ x: [0, 6, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </main>
  );
}
