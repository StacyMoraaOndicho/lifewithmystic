'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/lib/auth-context';
import sanityFetch from '@/lib/sanity';

type PostStats = {
  _id: string;
  title: string;
  views: number;
  likes: number;
  bookmarks: number;
  readTime: number;
  slug: { current: string };
};

function AnalyticsDashboard() {
  const { signOut } = useAuth();
  const [posts, setPosts] = useState<PostStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalViews: 0, totalLikes: 0, totalBookmarks: 0, avgReadTime: 0 });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const data = await sanityFetch<PostStats[]>(
        `*[_type == "post" && status == "published"] | order(views desc) { _id, title, slug, views, likes, bookmarks, readTime }`
      );

      setPosts(data || []);

      if (data && data.length > 0) {
        const totalViews = data.reduce((sum, p) => sum + (p.views || 0), 0);
        const totalLikes = data.reduce((sum, p) => sum + (p.likes || 0), 0);
        const totalBookmarks = data.reduce((sum, p) => sum + (p.bookmarks || 0), 0);
        const avgReadTime = Math.round(
          data.reduce((sum, p) => sum + (p.readTime || 0), 0) / data.length
        );

        setStats({ totalViews, totalLikes, totalBookmarks, avgReadTime });
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-12 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-light text-white mb-2">Analytics Dashboard</h1>
            <p className="text-white/60">Track your content performance</p>
          </div>
          <button
            onClick={signOut}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-200 rounded-lg transition-all"
          >
            Sign Out
          </button>
        </div>

        {/* Overall Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Total Views', value: stats.totalViews, icon: '👁️' },
            { label: 'Total Likes', value: stats.totalLikes, icon: '❤️' },
            { label: 'Bookmarks', value: stats.totalBookmarks, icon: '⭐' },
            { label: 'Avg Read Time', value: `${stats.avgReadTime}m`, icon: '⏱️' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-6 rounded-lg"
            >
              <p className="text-3xl mb-2">{stat.icon}</p>
              <p className="text-white/70 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Top Performing Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-light text-white mb-6">Top Performing Posts</h2>

          {loading ? (
            <p className="text-white/60">Loading analytics...</p>
          ) : posts.length === 0 ? (
            <p className="text-white/60">No published posts yet</p>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <motion.div
                  key={post._id}
                  whileHover={{ x: 4 }}
                  className="glass p-6 rounded-lg"
                >
                  <div className="grid md:grid-cols-5 gap-4 items-center">
                    <div className="md:col-span-2">
                      <h3 className="font-semibold text-white mb-1">{post.title}</h3>
                      <p className="text-xs text-white/50">{post.slug.current}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white/70 text-sm">Views</p>
                      <p className="text-xl font-bold text-blue-400">{post.views || 0}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white/70 text-sm">Likes</p>
                      <p className="text-xl font-bold text-red-400">{post.likes || 0}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white/70 text-sm">Bookmarks</p>
                      <p className="text-xl font-bold text-amber-400">{post.bookmarks || 0}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </main>
  );
}

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <AnalyticsDashboard />
    </ProtectedRoute>
  );
}
