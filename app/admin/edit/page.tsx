'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import sanityFetch from '@/lib/sanity';

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  status: 'draft' | 'published' | 'scheduled';
  publishedAt?: string;
  views?: number;
  likes?: number;
};

function EditPostsContent() {
  const { signOut } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'scheduled'>('all');

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    try {
      const query =
        filter === 'all'
          ? `*[_type == "post"] | order(_updatedAt desc)`
          : `*[_type == "post" && status == "${filter}"] | order(_updatedAt desc)`;

      const data = await sanityFetch<Post[]>(
        `${query} { _id, title, slug, excerpt, status, publishedAt, views, likes }`
      );
      setPosts(data || []);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure? This cannot be undone.')) return;

    try {
      const response = await fetch('/api/posts/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      });

      if (response.ok) {
        setPosts(posts.filter(p => p._id !== postId));
      } else {
        alert('Failed to delete post');
      }
    } catch (err) {
      alert('Error deleting post');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-500/20 text-green-300 border-green-500/50';
      case 'draft':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
      case 'scheduled':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      default:
        return 'bg-gray-500/20 text-gray-300';
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
            <h1 className="text-4xl font-light text-white mb-2">Edit Posts</h1>
            <p className="text-white/60">Manage your published content</p>
          </div>
          <button
            onClick={signOut}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-200 rounded-lg"
          >
            Sign Out
          </button>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-2 mb-8">
          {(['all', 'published', 'draft', 'scheduled'] as const).map((f) => (
            <motion.button
              key={f}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === f
                  ? 'glass-strong text-white'
                  : 'glass hover:glass-light'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </motion.button>
          ))}
        </div>

        {/* Posts List */}
        {loading ? (
          <p className="text-white/60">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-white/60">No posts found</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ x: 4 }}
                className="glass p-6 rounded-lg"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{post.title}</h3>
                    <p className="text-sm text-white/70 mb-3">{post.excerpt}</p>
                    <div className="flex gap-3 items-center text-xs text-white/50">
                      <span className={`px-2 py-1 rounded border ${getStatusColor(post.status)}`}>
                        {post.status}
                      </span>
                      {post.views !== undefined && (
                        <span>👁️ {post.views} views</span>
                      )}
                      {post.likes !== undefined && (
                        <span>❤️ {post.likes} likes</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/blog/${post.slug.current}`}>
                      <button className="px-3 py-1 glass rounded hover:glass-light transition-all text-sm">
                        View
                      </button>
                    </Link>
                    <Link href={`/admin/edit/${post._id}`}>
                      <button className="px-3 py-1 bg-blue-500/20 border border-blue-500/50 rounded hover:bg-blue-500/30 transition-all text-sm">
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="px-3 py-1 bg-red-500/20 border border-red-500/50 rounded hover:bg-red-500/30 transition-all text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </main>
  );
}

export default function EditPostsPage() {
  return (
    <ProtectedRoute>
      <EditPostsContent />
    </ProtectedRoute>
  );
}
