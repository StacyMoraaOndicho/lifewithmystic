'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/ProtectedRoute';

type Post = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedAt: string;
};

function CreatePostContent() {
  const { signOut } = useAuth();
  const [post, setPost] = useState<Post>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    publishedAt: new Date().toISOString().split('T')[0],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPost((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Auto-generate slug from title
    if (name === 'title') {
      setPost((prev) => ({
        ...prev,
        slug: value
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-'),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Validate required fields
      if (!post.title || !post.slug || !post.excerpt || !post.content) {
        setMessage({ type: 'error', text: 'Please fill in all fields' });
        setLoading(false);
        return;
      }

      // Create Sanity document
      const response = await fetch('/api/posts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          body: [
            {
              _type: 'block',
              style: 'normal',
              text: post.content,
              children: [
                {
                  _type: 'span',
                  text: post.content,
                },
              ],
              _key: 'block-1',
            },
          ],
          publishedAt: post.publishedAt,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create post');
      }

      const result = await response.json();
      setMessage({ type: 'success', text: `Post created successfully! Published as: ${result.slug}` });

      // Reset form
      setPost({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        publishedAt: new Date().toISOString().split('T')[0],
      });

      // Redirect to post after 2 seconds
      setTimeout(() => {
        window.location.href = `/blog/${result.slug}`;
      }, 2000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to create post' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-12 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto"
      >
        {/* Top bar with sign out */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass p-4 rounded-xl mb-8 flex justify-between items-center"
        >
          <p className="text-white/60 text-sm">Writing Sacred Content</p>
          <button
            onClick={signOut}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-200 rounded-lg transition-all text-sm"
          >
            Sign Out
          </button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-light tracking-wide pb-4 text-white">
            Create New Post
          </h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-1 w-24 bg-gradient-to-r from-amber-400 to-rose-400"
          />
        </motion.div>

        {/* Messages */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-500/20 text-green-700 dark:text-green-400 border border-green-500/30'
                : 'bg-red-500/20 text-red-700 dark:text-red-400 border border-red-500/30'
            }`}
          >
            {message.text}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-sm font-semibold mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={post.title}
              onChange={handleChange}
              placeholder="Enter post title"
              required
              className="w-full px-4 py-3 rounded-lg border border-amber-300/30 bg-amber-50/5 dark:bg-amber-950/5 focus:outline-none focus:border-amber-400 transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1">The title appears on your blog and homepage</p>
          </motion.div>

          {/* Slug */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <label className="block text-sm font-semibold mb-2">Slug *</label>
            <input
              type="text"
              name="slug"
              value={post.slug}
              onChange={handleChange}
              placeholder="auto-generated-from-title"
              required
              className="w-full px-4 py-3 rounded-lg border border-amber-300/30 bg-amber-50/5 dark:bg-amber-950/5 focus:outline-none focus:border-amber-400 transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1">
              URL-friendly version: <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded text-xs">/blog/{post.slug}</code>
            </p>
          </motion.div>

          {/* Excerpt */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-semibold mb-2">Excerpt *</label>
            <textarea
              name="excerpt"
              value={post.excerpt}
              onChange={handleChange}
              placeholder="Brief summary of your post (1-2 sentences)"
              required
              rows={3}
              maxLength={200}
              className="w-full px-4 py-3 rounded-lg border border-amber-300/30 bg-amber-50/5 dark:bg-amber-950/5 focus:outline-none focus:border-amber-400 transition-colors resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              {post.excerpt.length}/200 characters • Appears in blog listing
            </p>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
          >
            <label className="block text-sm font-semibold mb-2">Content *</label>
            <textarea
              name="content"
              value={post.content}
              onChange={handleChange}
              placeholder="Write your full post here. You can use line breaks for paragraphs."
              required
              rows={10}
              className="w-full px-4 py-3 rounded-lg border border-amber-300/30 bg-amber-50/5 dark:bg-amber-950/5 focus:outline-none focus:border-amber-400 transition-colors font-mono text-sm resize-vertical"
            />
            <p className="text-xs text-gray-500 mt-1">Full post content in plain text format</p>
          </motion.div>

          {/* Publish Date */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-semibold mb-2">Publish Date *</label>
            <input
              type="date"
              name="publishedAt"
              value={post.publishedAt}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-amber-300/30 bg-amber-50/5 dark:bg-amber-950/5 focus:outline-none focus:border-amber-400 transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1">When this post will appear on your blog</p>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="pt-4"
          >
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full px-6 py-3 rounded-lg font-semibold transition-all ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 to-rose-500 hover:shadow-lg text-white'
              }`}
            >
              {loading ? 'Publishing...' : 'Publish Post'}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </main>
  );
}

export default function CreatePage() {
  return (
    <ProtectedRoute>
      <CreatePostContent />
    </ProtectedRoute>
  );
}
