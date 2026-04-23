'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import sanityFetch from '@/lib/sanity';
import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PenTool, Edit3, Sparkles, LogOut, ChevronRight } from 'lucide-react';

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt?: string;
  _createdAt?: string;
};

function AdminContent() {
  const { signOut } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await sanityFetch<Post[]>(
          `*[_type == "post"] | order(publishedAt desc) [0...5] { _id, title, slug, publishedAt, _createdAt }`
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
    <main className="min-h-screen p-6 md:p-12 bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto pt-16">
        <header className="flex justify-between items-end mb-16 px-4">
          <div>
            <h1 className="text-4xl font-light text-white uppercase tracking-[0.2em]">Master <span className="italic text-[var(--accent)]">Portal</span></h1>
            <p className="text-white/40 text-[10px] uppercase tracking-widest font-mono mt-2">Architect Controls</p>
          </div>
          <button 
            onClick={signOut} 
            className="flex items-center gap-2 px-6 py-2 border border-red-500/20 text-red-500/60 rounded-full text-[9px] uppercase tracking-widest font-bold hover:bg-red-500/5 transition-all"
          >
            <LogOut className="w-3 h-3" /> Terminate Session
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Link href="/admin/create" className="group">
            <div className="p-10 rounded-[40px] border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all text-center flex flex-col items-center gap-4 group-hover:border-[var(--accent)]/30 shadow-xl">
              <div className="p-4 rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)] group-hover:scale-110 transition-transform"><PenTool className="w-6 h-6" /></div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">Create Reflection</span>
            </div>
          </Link>
          <Link href="/admin/edit" className="group">
            <div className="p-10 rounded-[40px] border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all text-center flex flex-col items-center gap-4 group-hover:border-[var(--accent)]/30 shadow-xl">
              <div className="p-4 rounded-2xl bg-white/5 text-white/40 group-hover:scale-110 transition-transform"><Edit3 className="w-6 h-6" /></div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">Edit Library</span>
            </div>
          </Link>
          <Link href="/studio" className="group">
            <div className="p-10 rounded-[40px] border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all text-center flex flex-col items-center gap-4 group-hover:border-[var(--accent)]/30 shadow-xl">
              <div className="p-4 rounded-2xl bg-white/5 text-white/40 group-hover:scale-110 transition-transform"><Sparkles className="w-6 h-6" /></div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">Visual Studio</span>
            </div>
          </Link>
        </div>

        <section className="px-4">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 mb-8 font-mono">Recent Transmissions</h2>
          <div className="space-y-4">
            {posts.map((post) => (
              <Link key={post._id} href={`/blog/${post.slug.current}`} className="group block">
                <div className="p-6 rounded-[32px] border border-white/5 bg-white/[0.01] group-hover:border-white/20 group-hover:bg-white/[0.02] transition-all flex justify-between items-center px-8 shadow-sm">
                  <span className="text-white font-light group-hover:text-[var(--accent)] transition-colors">{post.title}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-mono text-white/20 uppercase tracking-tighter">{formatDate(post.publishedAt || post._createdAt)}</span>
                    <ChevronRight className="w-4 h-4 text-white/5 group-hover:text-white/20" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white font-mono uppercase tracking-[0.5em] text-[10px]">Accessing Master Portal...</div>}>
      <ProtectedRoute>
        <AdminContent />
      </ProtectedRoute>
    </Suspense>
  );
}
