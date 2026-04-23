'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import sanityFetch from '@/lib/sanity';
import { ChevronLeft, Trash2, Edit3, Eye } from 'lucide-react';

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  status: 'draft' | 'published' | 'scheduled';
  views?: number;
};

function EditPostsContent() {
  const { signOut } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await sanityFetch<Post[]>(`*[_type == "post"] | order(_updatedAt desc) { _id, title, slug, excerpt, status, views }`);
      setPosts(data || []);
    } catch (err) {
      console.error('Fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this reflection?')) return;
    try {
      const response = await fetch('/api/posts/delete', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ postId }) });
      if (response.ok) setPosts(posts.filter(p => p._id !== postId));
    } catch (err) {
      alert('Deletion failed');
    }
  };

  return (
    <main className="min-h-screen p-6 md:p-12 bg-[#0a0a0a]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto pt-16">
        <div className="flex justify-between items-end mb-16 px-4">
          <div>
            <h1 className="text-4xl font-light text-white uppercase tracking-[0.2em]">Manage <span className="italic text-[var(--accent)]">Reflections</span></h1>
            <Link href="/admin" className="text-[10px] text-white/20 hover:text-white uppercase tracking-widest mt-4 flex items-center gap-2">
              <ChevronLeft className="w-3 h-3" /> Back to Portal
            </Link>
          </div>
          <button onClick={signOut} className="px-6 py-2 border border-red-500/20 text-red-500/60 rounded-full text-[9px] uppercase tracking-widest font-bold hover:bg-red-500/5 transition-all">Sign Out</button>
        </div>

        <div className="space-y-6">
          {loading ? (
             <p className="text-white/20 text-center animate-pulse uppercase tracking-[0.5em] text-[10px]">Syncing Library...</p>
          ) : posts.map((post) => (
            <div key={post._id} className="p-8 rounded-[40px] border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-all flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-[8px] uppercase font-bold tracking-widest border ${post.status === 'published' ? 'border-emerald-500/30 text-emerald-500/60' : 'border-amber-500/30 text-amber-500/60'}`}>{post.status}</span>
                  <h3 className="text-xl font-light text-white">{post.title}</h3>
                </div>
                <p className="text-sm text-white/40 italic font-light">{post.excerpt}</p>
              </div>
              
              <div className="flex items-center gap-3">
                <Link href={`/blog/${post.slug.current}`}><button className="p-4 rounded-2xl bg-white/5 text-white/40 hover:text-white transition-all"><Eye className="w-5 h-5" /></button></Link>
                <Link href={`/admin/edit/${post._id}`}><button className="p-4 rounded-2xl bg-white/5 text-white/40 hover:text-white transition-all"><Edit3 className="w-5 h-5" /></button></Link>
                <button onClick={() => handleDelete(post._id)} className="p-4 rounded-2xl bg-red-500/5 text-red-500/40 hover:bg-red-500/10 hover:text-red-500 transition-all"><Trash2 className="w-5 h-5" /></button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </main>
  );
}

export default function EditPostsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white font-mono uppercase tracking-[0.5em] text-[10px]">Syncing Archive...</div>}>
      <ProtectedRoute>
        <EditPostsContent />
      </ProtectedRoute>
    </Suspense>
  );
}
