'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import sanityFetch from '@/lib/sanity';
import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/ProtectedRoute';

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt?: string;
  _createdAt?: string;
};

function AdminContent() {
  const { user, signOut } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await sanityFetch<Post[]>(
          `*[_type == "post"] | order(publishedAt desc) { _id, title, slug, publishedAt, _createdAt }`
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
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <main className="min-h-screen p-12 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        {/* Top bar with user info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass p-4 rounded-xl mb-8 flex justify-between items-center"
        >
          <div>
            <p className="text-white/60 text-sm">Logged in as</p>
            <p className="text-white font-semibold">{user?.email}</p>
          </div>
          <button
            onClick={signOut}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-200 rounded-lg transition-all"
          >
            Sign Out
          </button>
        </motion.div>

        {/* Header */}
        <div className="mb-12">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl mb-4 font-light tracking-wide text-white"
          >
            Admin Dashboard
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-1 w-32 bg-gradient-to-r from-amber-400 to-rose-400"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/60 mt-4"
          >
            Manage your sacred writings and essays
          </motion.p>
        </div>

        {/* Quick Actions */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12"
        >
          <motion.div variants={itemVariants}>
            <Link href="/admin/create">
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass p-6 rounded-xl cursor-pointer group text-center"
              >
                <h2 className="text-3xl mb-2">✍️</h2>
                <h3 className="font-semibold text-white group-hover:text-amber-300 transition-colors">
                  Create Post
                </h3>
                <p className="text-xs text-white/60 mt-1">New essay</p>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link href="/admin/edit">
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass p-6 rounded-xl cursor-pointer group text-center"
              >
                <h2 className="text-3xl mb-2">✏️</h2>
                <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                  Edit Posts
                </h3>
                <p className="text-xs text-white/60 mt-1">Manage content</p>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link href="/admin/analytics">
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass p-6 rounded-xl cursor-pointer group text-center"
              >
                <h2 className="text-3xl mb-2">📊</h2>
                <h3 className="font-semibold text-white group-hover:text-green-300 transition-colors">
                  Analytics
                </h3>
                <p className="text-xs text-white/60 mt-1">Track stats</p>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <a href="https://sanity.io/manage" target="_blank" rel="noopener noreferrer">
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass-light p-6 rounded-xl cursor-pointer group text-center"
              >
                <h2 className="text-3xl mb-2">🎛️</h2>
                <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                  Sanity CMS
                </h3>
                <p className="text-xs text-white/60 mt-1">Advanced features</p>
              </motion.div>
            </a>
          </motion.div>
        </motion.div>

        {/* Statistics */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="glass-light p-8 rounded-xl mb-12"
        >
          <h3 className="font-semibold mb-6 text-white text-lg">📊 Quick Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center glass p-4 rounded-lg">
              <div className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">
                {posts.length}
              </div>
              <p className="text-sm text-white/60 mt-2">Total Posts</p>
            </div>
            <div className="text-center glass p-4 rounded-lg">
              <div className="text-3xl font-bold bg-gradient-to-r from-rose-400 to-rose-300 bg-clip-text text-transparent">
                {posts.filter(p => new Date(p.publishedAt || p._createdAt || '') > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
              </div>
              <p className="text-sm text-white/60 mt-2">This Week</p>
            </div>
            <div className="text-center glass p-4 rounded-lg">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
                {posts.filter(p => new Date(p.publishedAt || p._createdAt || '') > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
              </div>
              <p className="text-sm text-white/60 mt-2">This Month</p>
            </div>
            <div className="text-center glass p-4 rounded-lg">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                1.2K
              </div>
              <p className="text-sm text-white/60 mt-2">Total Views</p>
            </div>
          </div>
        </motion.div>

        {/* Recent Posts */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-2xl font-semibold mb-6 text-white">Recent Posts</h3>

          {loading && (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-center py-8 text-white/60"
            >
              Loading posts...
            </motion.div>
          )}

          {!loading && posts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass p-8 rounded-xl text-center text-white/70"
            >
              <p>No posts yet. Create your first one!</p>
            </motion.div>
          )}

          {!loading && posts.length > 0 && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {posts.slice(0, 10).map((post) => (
                <motion.div
                  key={post._id}
                  variants={itemVariants}
                  whileHover={{ x: 8 }}
                  className="glass p-4 rounded-lg transition-all group cursor-pointer hover:glass-light"
                >
                  <Link href={`/blog/${post.slug.current}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold group-hover:text-amber-300 transition-colors text-white">
                          {post.title}
                        </h4>
                        <p className="text-sm text-white/50">
                          Published: {formatDate(post.publishedAt || post._createdAt)}
                        </p>
                      </div>
                      <span className="text-2xl opacity-0 group-hover:opacity-100 transition-opacity text-white/60">→</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Help Section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
          className="glass-strong p-8 rounded-xl mt-12"
        >
          <h3 className="font-semibold mb-4 text-white text-lg">❓ Getting Started</h3>
          <ul className="space-y-3 text-sm text-white/80">
            <li>
              <strong className="text-white">✍️ Create Posts Quickly:</strong> Use the form on the Create page to add new essays instantly
            </li>
            <li>
              <strong className="text-white">🎛️ Advanced Management:</strong> Visit Sanity Studio for full CMS features (media, rich content, etc.)
            </li>
            <li>
              <strong className="text-white">⚙️ Environment Setup:</strong> Make sure <code className="bg-white/10 px-2 py-1 text-xs rounded">SANITY_API_TOKEN</code> is set in your .env.local
            </li>
            <li>
              <strong className="text-white">📅 Dates Matter:</strong> Posts appear in listings based on their published date
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </main>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <AdminContent />
    </ProtectedRoute>
  );
}