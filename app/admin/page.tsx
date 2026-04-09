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

  return (
    <main className="min-h-screen p-12 bg-black text-white">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-light">Admin Dashboard</h1>
          <button onClick={signOut} className="text-xs uppercase tracking-widest opacity-50 hover:opacity-100 transition-all">Sign Out</button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link href="/admin/create" className="p-8 rounded-2xl border border-white/10 hover:bg-white/5 transition-all text-center">
            <span className="text-2xl block mb-2">✍️</span>
            <span className="text-sm uppercase tracking-widest">Create Post</span>
          </Link>
          <Link href="/admin/edit" className="p-8 rounded-2xl border border-white/10 hover:bg-white/5 transition-all text-center">
            <span className="text-2xl block mb-2">✏️</span>
            <span className="text-sm uppercase tracking-widest">Edit Posts</span>
          </Link>
          <Link href="/studio" className="p-8 rounded-2xl border border-white/10 hover:bg-white/5 transition-all text-center">
            <span className="text-2xl block mb-2">✨</span>
            <span className="text-sm uppercase tracking-widest">Visual Editor</span>
          </Link>
        </div>

        <section>
          <h2 className="text-xl mb-6 opacity-50 uppercase tracking-widest">Recent Posts</h2>
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post._id} className="p-4 rounded-xl border border-white/5 flex justify-between items-center">
                <span>{post.title}</span>
                <span className="text-xs opacity-30">{formatDate(post.publishedAt || post._createdAt)}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
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
