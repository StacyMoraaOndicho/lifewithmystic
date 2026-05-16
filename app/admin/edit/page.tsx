'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, Trash2, Edit3, Eye, Loader2 } from 'lucide-react';

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: string;
  published_at: string;
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
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('published_at', { ascending: false });
      
      if (error) throw error;
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
      const { error } = await supabase.from('posts').delete().eq('id', postId);
      if (error) throw error;
      setPosts(posts.filter(p => p.id !== postId));
    } catch (err) {
      alert('Deletion failed');
    }
  };

  return (
    <main className="min-h-screen p-6 md:p-12 bg-[#0a0a0a]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto pt-16">
        <div className="flex justify-between items-end mb-16 px-4">
          <div>
            <h1 className="text-4xl font-light text-white uppercase tracking-[0.2em]">Manage <span className="italic text-[var(--accent)]">Library</span></h1>
            <Link href="/admin" className="text-[10px] text-white/20 hover:text-white uppercase tracking-widest mt-4 flex items-center gap-2 transition-all group">
              <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Back to Portal
            </Link>
          </div>
          <button onClick={signOut} className="px-6 py-2 border border-red-500/20 text-red-500/60 rounded-full text-[9px] uppercase tracking-widest font-bold hover:bg-red-500/5 transition-all">Sign Out</button>
        </div>

        <div className="space-y-6">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-white/10" />
                <p className="text-white/20 uppercase tracking-[0.5em] text-[10px]">Syncing Archive...</p>
             </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-[40px]">
              <p className="text-white/20 uppercase tracking-[0.3em] text-[10px]">No reflections found in the collective.</p>
              <Link href="/admin/create" className="text-[var(--accent)] text-[10px] uppercase font-bold mt-4 inline-block hover:underline">Write the first one →</Link>
            </div>
          ) : posts.map((post) => (
            <div key={post.id} className="p-8 rounded-[40px] border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-all flex flex-col md:flex-row justify-between items-center gap-8 shadow-xl">
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                  <span className="px-2 py-0.5 rounded-full text-[8px] uppercase font-bold tracking-widest border border-emerald-500/30 text-emerald-500/60">{post.status}</span>
                  <h3 className="text-xl font-light text-white">{post.title}</h3>
                </div>
                <p className="text-sm text-white/40 italic font-light line-clamp-1">{post.excerpt}</p>
              </div>
              
              <div className="flex items-center gap-3">
                <Link href={`/blog/${post.slug}`}><button className="p-4 rounded-2xl bg-white/5 text-white/40 hover:text-white transition-all"><Eye className="w-5 h-5" /></button></Link>
                <Link href={`/admin/edit/${post.id}`}><button className="p-4 rounded-2xl bg-white/5 text-white/40 hover:text-white transition-all"><Edit3 className="w-5 h-5" /></button></Link>
                <button onClick={() => handleDelete(post.id)} className="p-4 rounded-2xl bg-red-500/5 text-red-500/40 hover:bg-red-500/10 hover:text-red-500 transition-all"><Trash2 className="w-5 h-5" /></button>
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
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white font-mono uppercase tracking-[0.5em] text-[10px]">Accessing Identity Records...</div>}>
      <ProtectedRoute>
        <EditPostsContent />
      </ProtectedRoute>
    </Suspense>
  );
}
