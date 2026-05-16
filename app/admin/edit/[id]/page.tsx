'use client';

import { useState, useEffect, Suspense, use } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { supabase } from '@/lib/supabase';
import { Loader2, X, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function EditPostContent({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [post, setPost] = useState({ title: '', slug: '', excerpt: '', content: '' });

  useEffect(() => {
    fetchPost();
  }, [id]);

  async function fetchPost() {
    const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();
    if (data) setPost(data);
    setLoading(false);
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from('posts').update(post).eq('id', id);
    if (!error) {
      router.push('/admin/edit');
    } else {
      alert("Failed to update reflection.");
    }
    setSaving(false);
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Syncing...</div>;

  return (
    <main className="min-h-screen p-6 md:p-12 bg-[#0a0a0a]">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto pt-16">
        <header className="mb-12 flex justify-between items-center px-4">
          <Link href="/admin/edit" className="text-[10px] uppercase tracking-widest text-white/20 hover:text-white flex items-center gap-2 transition-all">
            <ArrowLeft className="w-3 h-3" /> Back to Library
          </Link>
          <h1 className="text-2xl font-light text-white uppercase tracking-widest">Edit <span className="italic text-[var(--accent)]">Reflection</span></h1>
        </header>

        <form onSubmit={handleUpdate} className="space-y-8 glass p-10 rounded-[40px] border border-white/5 bg-white/[0.01]">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold ml-2">Title</label>
            <input type="text" value={post.title} onChange={(e) => setPost({...post, title: e.target.value})} className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-[var(--accent)]/50 transition-all font-light" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold ml-2">Content</label>
            <textarea value={post.content} onChange={(e) => setPost({...post, content: e.target.value})} rows={12} className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 text-white font-light font-serif text-lg leading-relaxed" />
          </div>

          <button type="submit" disabled={saving} className="w-full p-5 rounded-2xl bg-[var(--accent)] text-white font-bold uppercase tracking-[0.3em] text-[10px] shadow-2xl flex items-center justify-center gap-3">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
        </form>
      </motion.div>
    </main>
  );
}

export default function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProtectedRoute>
        <EditPostContent id={id} />
      </ProtectedRoute>
    </Suspense>
  );
}
