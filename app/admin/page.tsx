'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import sanityFetch from '@/lib/sanity';
import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Lock, AlertCircle, ArrowLeft, PenTool } from 'lucide-react'; // Added PenTool here

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt?: string;
  _createdAt?: string;
};

// MASTER ADMIN EMAIL
const ADMIN_EMAIL = "lifewithmystic@gmail.com";

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
    
    // Only fetch if it's the real admin
    if (user?.email === ADMIN_EMAIL) {
      fetchPosts();
    }
  }, [user]);

  // --- ACCESS DENIED UI ---
  if (user?.email !== ADMIN_EMAIL) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-[#0a0a0a] text-white">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full p-10 rounded-[40px] border border-red-500/20 bg-red-500/5 text-center shadow-2xl"
        >
          <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
            <Lock className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-light mb-4 uppercase tracking-[0.2em]">Access Denied</h1>
          <p className="text-[var(--text)]/60 italic mb-10 leading-relaxed">
            This inner sanctuary is reserved for the primary architect. Your presence has been noted, but entry is restricted.
          </p>
          <div className="flex flex-col gap-4">
            <Link href="/">
              <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] uppercase tracking-widest font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <ArrowLeft className="w-3 h-3" /> Return to Sanctuary
              </button>
            </Link>
            <button 
              onClick={() => signOut()}
              className="w-full py-4 text-red-500/60 text-[10px] uppercase tracking-widest font-bold hover:text-red-500 transition-all"
            >
              Log Out of this Identity
            </button>
          </div>
        </motion.div>
      </main>
    );
  }

  const formatDate = (date?: string) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <main className="min-h-screen p-12 bg-[#0a0a0a] text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto pt-16"
      >
        <header className="flex justify-between items-center mb-16 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-4xl font-light uppercase tracking-[0.3em]">Master <span className="italic text-[var(--accent)] font-serif capitalize">Architect</span></h1>
            <p className="text-white/40 text-[10px] font-mono mt-2 uppercase tracking-widest">Logged in: {user?.email}</p>
          </div>
          <button
            onClick={signOut}
            className="px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl transition-all text-[10px] uppercase font-bold tracking-widest"
          >
            Terminal Access Close
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-sm font-bold uppercase tracking-[0.4em] mb-8 text-white/60 flex items-center gap-3">
                <PenTool className="w-4 h-4" /> Sacred Writings
              </h2>
              <div className="space-y-4">
                {posts.slice(0, 10).map((post) => (
                  <Link key={post._id} href={`/blog/${post.slug.current}`}>
                    <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-[var(--accent)]/30 transition-all group flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-xl font-light group-hover:text-[var(--accent)] transition-colors">{post.title}</h4>
                        <p className="text-[10px] text-white/30 font-mono mt-1 uppercase tracking-widest">{formatDate(post.publishedAt || post._createdAt)}</p>
                      </div>
                      <div className="text-white/20 group-hover:text-white/100 transition-all">→</div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-12">
            <div className="grid grid-cols-1 gap-4">
              <Link href="/admin/create" className="p-8 rounded-[32px] bg-[var(--accent)] text-[var(--bg)] group hover:shadow-2xl hover:scale-[1.02] transition-all relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-2">Initiate</h3>
                  <p className="text-2xl font-light">New Reflection</p>
                </div>
                <PenTool className="absolute -bottom-4 -right-4 w-24 h-24 opacity-10 group-hover:rotate-12 transition-transform" />
              </Link>
              
              <Link href="/studio" className="p-8 rounded-[32px] border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Engine</h3>
                <p className="text-2xl font-light">Sanity Studio</p>
              </Link>
            </div>

            <div className="p-8 rounded-[32px] border border-white/10 bg-white/[0.01]">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-6">Collective Pulse</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-white/60">Total Resonance</span>
                    <span className="text-emerald-400">+12%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[70%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-white/60">Active Seekers</span>
                    <span className="text-amber-400">1.2K</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 w-[45%]" />
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
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
