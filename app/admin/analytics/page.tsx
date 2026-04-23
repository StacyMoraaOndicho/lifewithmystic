'use client';

import { useEffect, useState, Suspense } from 'react';
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
    <main className="min-h-screen p-12 bg-[#0a0a0a]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex justify-between items-center mb-12 px-4">
          <div>
            <h1 className="text-4xl font-light text-white mb-2 uppercase tracking-widest">Analytics</h1>
            <p className="text-white/40 italic text-sm">Resonance of the Sanctuary</p>
          </div>
          <button
            onClick={signOut}
            className="px-6 py-2 border border-red-500/30 text-red-400 rounded-full text-xs uppercase tracking-widest hover:bg-red-500/10 transition-all"
          >
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
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
              className="p-8 rounded-[32px] border border-white/5 bg-white/[0.01]"
            >
              <p className="text-2xl mb-4">{stat.icon}</p>
              <p className="text-white/30 text-[10px] uppercase tracking-widest font-bold mb-1">{stat.label}</p>
              <p className="text-3xl font-light text-white">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <h2 className="text-2xl font-light text-white mb-8 px-4 uppercase tracking-widest">Top Performing Reflections</h2>
          {loading ? (
            <p className="text-white/20 px-4 animate-pulse">Syncing data...</p>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post._id} className="p-8 rounded-[32px] border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-all">
                  <div className="grid md:grid-cols-5 gap-6 items-center">
                    <div className="md:col-span-2">
                      <h3 className="text-lg font-light text-white mb-1">{post.title}</h3>
                      <p className="text-[10px] text-white/20 font-mono uppercase tracking-tighter">{post.slug.current}</p>
                    </div>
                    <div className="text-center"><p className="text-white/20 text-[9px] uppercase font-bold mb-1">Views</p><p className="text-xl font-light text-blue-400">{post.views || 0}</p></div>
                    <div className="text-center"><p className="text-white/20 text-[9px] uppercase font-bold mb-1">Likes</p><p className="text-xl font-light text-red-400">{post.likes || 0}</p></div>
                    <div className="text-center"><p className="text-white/20 text-[9px] uppercase font-bold mb-1">Bookmarks</p><p className="text-xl font-light text-amber-400">{post.bookmarks || 0}</p></div>
                  </div>
                </div>
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
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white font-mono uppercase tracking-[0.5em] text-[10px]">Loading Analytics...</div>}>
      <ProtectedRoute>
        <AnalyticsDashboard />
      </ProtectedRoute>
    </Suspense>
  );
}
