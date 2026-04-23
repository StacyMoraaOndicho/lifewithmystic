'use client';

import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Loader2, X } from 'lucide-react';
import Link from 'next/link';

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
    title: '', slug: '', excerpt: '', content: '',
    publishedAt: new Date().toISOString().split('T')[0],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPost(prev => ({ ...prev, [name]: value }));
    if (name === 'title') {
      setPost(prev => ({ ...prev, slug: value.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-') }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch('/api/posts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...post, body: [{ _type: 'block', style: 'normal', children: [{ _type: 'span', text: post.content }] }] }),
      });
      if (!response.ok) throw new Error('Failed to create post');
      setMessage({ type: 'success', text: 'Reflection Published' });
      setPost({ title: '', slug: '', excerpt: '', content: '', publishedAt: new Date().toISOString().split('T')[0] });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-6 md:p-12 bg-[#0a0a0a]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto pt-16">
        <div className="flex justify-between items-center mb-16 px-4">
          <h1 className="text-4xl font-light text-white uppercase tracking-[0.2em]">New <span className="italic text-[var(--accent)]">Reflection</span></h1>
          <Link href="/admin"><button className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-all text-white/40 hover:text-white"><X className="w-5 h-5" /></button></Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 glass p-10 rounded-[40px] border border-white/5 bg-white/[0.01]">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold ml-2">Title</label>
            <input type="text" name="title" value={post.title} onChange={handleChange} required className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-[var(--accent)]/50 transition-all font-light" />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold ml-2">Slug</label>
              <input type="text" name="slug" value={post.slug} onChange={handleChange} required className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 text-white/40 font-mono text-xs" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold ml-2">Publish Date</label>
              <input type="date" name="publishedAt" value={post.publishedAt} onChange={handleChange} required className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 text-white font-light" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold ml-2">Excerpt</label>
            <textarea name="excerpt" value={post.excerpt} onChange={handleChange} required rows={3} className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 text-white font-light resize-none" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold ml-2">Content</label>
            <textarea name="content" value={post.content} onChange={handleChange} required rows={12} className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 text-white font-light font-serif text-lg leading-relaxed" />
          </div>

          <button type="submit" disabled={loading} className="w-full p-5 rounded-2xl bg-[var(--accent)] text-white font-bold uppercase tracking-[0.3em] text-[10px] shadow-2xl hover:scale-[1.01] transition-all disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Publish to Collective'}
          </button>

          {message && <p className={`text-center text-[10px] font-bold uppercase tracking-widest mt-4 ${message.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>{message.text}</p>}
        </form>
      </motion.div>
    </main>
  );
}

export default function CreatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white font-mono uppercase tracking-[0.5em] text-[10px]">Initializing Studio...</div>}>
      <ProtectedRoute>
        <CreatePostContent />
      </ProtectedRoute>
    </Suspense>
  );
}
